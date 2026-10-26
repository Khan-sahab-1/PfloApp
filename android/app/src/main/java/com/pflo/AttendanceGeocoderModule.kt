package com.pflo

import android.location.Address
import android.location.Geocoder
import android.os.Build
import android.os.Handler
import android.os.Looper
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import java.util.Locale
import java.util.concurrent.Executors
import java.util.concurrent.atomic.AtomicBoolean

class AttendanceGeocoderModule(
  reactContext: ReactApplicationContext,
) : ReactContextBaseJavaModule(reactContext) {
  private val handler = Handler(Looper.getMainLooper())
  private val executor = Executors.newSingleThreadExecutor()
  private val legacyBusy = AtomicBoolean(false)

  override fun getName() = "AttendanceGeocoder"

  @ReactMethod
  fun reverseGeocode(latitude: Double, longitude: Double, promise: Promise) {
    if (!latitude.isFinite() || !longitude.isFinite() ||
        latitude !in -90.0..90.0 || longitude !in -180.0..180.0) {
      promise.reject("INVALID_COORDINATES", "Saved attendance coordinates are invalid.")
      return
    }
    if (!Geocoder.isPresent()) {
      promise.reject("GEOCODER_UNAVAILABLE", "Address service is unavailable on this device.")
      return
    }
    val settled = AtomicBoolean(false)
    val timeout = Runnable {
      if (settled.compareAndSet(false, true)) {
        promise.reject("GEOCODER_TIMEOUT", "Address lookup timed out. Attendance remains saved.")
      }
    }
    fun fail(code: String, message: String) {
      if (settled.compareAndSet(false, true)) {
        handler.removeCallbacks(timeout)
        promise.reject(code, message)
      }
    }
    fun complete(addresses: List<Address>) {
      val address = addresses.firstOrNull()?.getAddressLine(0)?.trim().orEmpty()
      if (address.isEmpty()) {
        fail("ADDRESS_NOT_FOUND", "Address not found for saved coordinates. Attendance remains saved.")
      } else if (settled.compareAndSet(false, true)) {
        handler.removeCallbacks(timeout)
        promise.resolve(address)
      }
    }
    handler.postDelayed(timeout, 10000)
    try {
      val geocoder = Geocoder(reactApplicationContext, Locale.ENGLISH)
      if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU) {
        geocoder.getFromLocation(latitude, longitude, 1, object : Geocoder.GeocodeListener {
          override fun onGeocode(addresses: MutableList<Address>) { complete(addresses) }
          override fun onError(errorMessage: String?) {
            fail("GEOCODER_FAILED", "Device address lookup failed. Attendance remains saved for retry.")
          }
        })
      } else {
        // The older API blocks: run off the UI/JS threads and limit stuck jobs.
        if (!legacyBusy.compareAndSet(false, true)) {
          fail("GEOCODER_BUSY", "Device address lookup is still running. Attendance remains saved.")
          return
        }
        try {
          executor.execute {
            try {
              @Suppress("DEPRECATION")
              val addresses = geocoder.getFromLocation(latitude, longitude, 1).orEmpty()
              complete(addresses)
            } catch (error: Exception) {
              fail("GEOCODER_FAILED", "Device address lookup failed. Attendance remains saved for retry.")
            } finally { legacyBusy.set(false) }
          }
        } catch (error: Exception) {
          legacyBusy.set(false)
          throw error
        }
      }
    } catch (error: Exception) {
      fail("GEOCODER_FAILED", "Device address lookup failed. Attendance remains saved for retry.")
    }
  }

  override fun invalidate() {
    executor.shutdownNow()
    super.invalidate()
  }
}
