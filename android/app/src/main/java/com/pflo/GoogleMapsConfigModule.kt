package com.pflo

import android.content.pm.PackageManager
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule

class GoogleMapsConfigModule(
  reactContext: ReactApplicationContext,
) : ReactContextBaseJavaModule(reactContext) {

  override fun getName() = "GoogleMapsConfig"

  override fun getConstants(): Map<String, Any?> {
    val applicationInfo = reactApplicationContext.packageManager.getApplicationInfo(
      reactApplicationContext.packageName,
      PackageManager.GET_META_DATA,
    )

    return mapOf(
      "apiKey" to applicationInfo.metaData
        ?.getString("com.google.android.geo.API_KEY")
        .orEmpty(),
    )
  }
}
