// Keep native geolocation guards across dependency reinstalls.
const fs = require('fs');
const path = require('path');
const root = path.dirname(require.resolve('react-native-geolocation-service/package.json'));
const file = path.join(root, 'android/src/main/java/com/agontuk/RNFusedLocation/RNFusedLocationModule.java');
let source = fs.readFileSync(file, 'utf8');
function patch(before, after) {
  if (source.includes(after)) { return; }
  if (!source.includes(before)) { throw new Error('Geolocation source changed; review native guards before building.'); }
  source = source.replace(before, after);
}
patch('    WritableMap locationData = LocationUtils.locationToMap(location);', `    if (location == null) {
      onLocationError(locationProvider, LocationError.POSITION_UNAVAILABLE, "No valid location received.");
      return;
    }
    WritableMap locationData = LocationUtils.locationToMap(location);`);
patch('      request.successCallback.invoke(locationData);\n      pendingRequests.remove(locationProvider);', '      pendingRequests.remove(locationProvider);\n      request.successCallback.invoke(locationData);');
patch('      request.errorCallback.invoke(errorData);\n      pendingRequests.remove(locationProvider);', '      pendingRequests.remove(locationProvider);\n      request.errorCallback.invoke(errorData);');
patch(`    LocationOptions locationOptions = LocationOptions.fromReadableMap(options);
    final LocationProvider locationProvider = createLocationProvider(locationOptions.isForceLocationManager());

    pendingRequests.put(locationProvider, new PendingLocationRequest(success, error));
    locationProvider.getCurrentLocation(locationOptions);`, `    LocationProvider locationProvider = null;
    try {
      LocationOptions locationOptions = LocationOptions.fromReadableMap(options);
      locationProvider = createLocationProvider(locationOptions.isForceLocationManager());
      pendingRequests.put(locationProvider, new PendingLocationRequest(success, error));
      locationProvider.getCurrentLocation(locationOptions);
    } catch (SecurityException exception) {
      if (locationProvider != null) { pendingRequests.remove(locationProvider); }
      error.invoke(LocationUtils.buildError(LocationError.PERMISSION_DENIED, "Location permission was revoked."));
    } catch (RuntimeException exception) {
      if (locationProvider != null) { pendingRequests.remove(locationProvider); }
      error.invoke(LocationUtils.buildError(LocationError.POSITION_UNAVAILABLE, "Location service unavailable. Please try again."));
    }`);
fs.writeFileSync(file, source);
