# Automatic attendance sync

## Behavior

First online login saves the last employee/server and boolean offline permission.
Only `offline_attendance === true` enables saved attendance access and automatic
sync. No passwords or session cookies are used by public v4 sync. The normal
online attendance endpoint remains unchanged.

Saved employees can reopen the attendance dashboard while offline without
logging in again. Online startup opens Login. When internet returns during an
offline session, the navigation stack resets to Login and the UI session is
locked. Saved sync authorization is retained, so automatic uploads continue
without waiting for another login. Login itself does not trigger or wait for sync
and does not display attendance sync/retry dialogs. The existing online CRM/leave APIs require
their normal authenticated session. Navigation readiness and restored sessions
also trigger connectivity checks so an early network event cannot leave the
offline dashboard visible after reconnect.

Each committed attendance capture immediately triggers auto-sync. Foreground network
recovery and app activation also trigger auto-sync, with a 15-second retry while
the app is active so transient failures do not wait for another network event.
Foreground sync runs before native scheduler configuration so scheduler failures
do not block uploads. Android also
schedules a network-constrained one-shot job after capture and a periodic native
background-fetch job (minimum 15 minutes, OS-controlled) with headless execution,
start-on-boot and stopOnTerminate=false. A task uses at most five records and a
25-second execution budget, leaving the remainder for a later wake. Foreground
sync can drain the queue. Background execution uses the installed JS bundle;
release testing must not rely on a Metro server.

Android swipe-away is supported by the headless scheduler; Settings Force stop
prevents reliable execution until the app is reopened. iOS background fetch is
best effort and does not run after user termination. There is no guarantee that
sync starts at the exact instant internet returns while the app is closed.

Logout removes the saved authorization before notifying listeners, cancels native
jobs and prevents further queued requests. An already received server request
cannot be recalled. Pending data is retained and scoped by server/employee.

## Backend deployment REQUIRED

### Attendance address

Sync reverse-geocodes the saved capture coordinates using Google's Geocoding API
before uploading an event. The formatted address is persisted in SQLite and reused
on retries, keeping the event payload stable. Existing databases automatically gain
an `emp_address` column. Empty queues make no geocoding or sync API requests.
Failed address lookups keep attendance saved for a later retry; the app does not send
`Captured offline` as the address. `src/config/googleMaps.js` uses the existing app
Maps key; enable Geocoding API and billing, and ensure the key permits these requests.
Live Google access has not been verified.

`REQUEST_DENIED` means Google denied the geocoding request, before attendance
upload. The saved error now includes Google's `error_message` with API keys
redacted. Check that the key's project has Geocoding API and billing enabled,
and that its API and application restrictions support the request. A working
Android Maps SDK key does not establish permission for the Geocoding web service.
For a server-restricted key, resolve coordinates through the backend using the
server key instead of embedding that key in the app. Do not delete the saved
attendance or clear app data while diagnosing: sync retries the same saved event
after lookup succeeds.

Google documentation: https://developers.google.com/maps/documentation/geocoding/guides-v3/requests-reverse-geocoding

Deploy `backend/public_offline_sync/offline_controller.py` and
`offline_fields.py` into the existing attendance addon and upgrade that module.
See `backend/public_offline_sync/README.md` for exact integration steps.
The app uses `/attendance/offline/sync/v4`; v3 and normal online routes are unchanged.
V4 accepts `employee_id`, `employee_code`, and events without a session/token.

V4 uses per-employee/event advisory locks, a database uniqueness constraint and
payload fingerprints to safely deduplicate retries. It can recognize old v3 rows
through mobile_event_id. Old pending/review/uploading states are retried only
against v4. Only matching per-record success plus a server record ID becomes synced.
Timeouts/network errors remain retryable. Permanent per-event validation rejection
is retained for correction and blocks later events to preserve ordering.

## Validation

Mocked tests cover saved-only background access, logout/account changes, retry IDs,
acknowledgment matching, execution limits and native callback completion. Android
debug compilation succeeded. Backend Python files are syntax checked, not deployed
or tested in Odoo. Native timing on physical devices and iOS require device tests.

Background scheduler documentation: https://fetch.transistorsoft.com/react-native/setup/

## Offline test APK

`cd android && ./gradlew :app:assembleOfflineTest` creates a bundled APK signed
with the existing debug key. This variant disables development-server loading;
it can launch without Metro and is for testing only, not store distribution.

The current bundled build reached packaging but failed with `No space left on
device`. The bundled APK has not been installed or tested; free disk space and
rerun the command before testing closed-app execution.

The iOS CocoaPods install is currently blocked by the local Hermes toolchain
(missing cmake / Hermes fetch). iOS integration has not been built or device tested.
