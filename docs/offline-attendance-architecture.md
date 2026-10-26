> Superseded flow: see [automatic-offline-sync.md](automatic-offline-sync.md) for the current saved-employee, public v4, and background scheduling implementation. The older login-before-sync notes below are historical.

# PFLO offline login and attendance — proposed structure

Status: permission-gated offline access and SQLite capture are now implemented in `src/offline`.
The structure below is the original proposal, not a list of implemented modules.

## Current implementation (10 September 2026)

- Login reads `result.employee_name`; only boolean `offline_attendance: true` persists offline authorization.
- Saved authorization contains a minimal profile and server URL, never the password/PIN.
- Login while disconnected restores only the last authorized employee on the selected server. Missing/false permission remains online-only.
- Offline attendance uses an isolated attendance dashboard, selfie/GPS capture, permanent private photo copies and a SQLite `pending` queue scoped by server and employee ID.
- Disconnect while logged in switches eligible users to offline attendance; other users return to Login. Reconnect from offline requires a fresh online login.
- Logout clears saved authorization but preserves pending attendance/photos.
- Upload now runs after successful online login using the supplied multipart `/attendance/mark2/v2` API. SQLite rows are uploaded in sequence, scoped to the logged-in server and employee; original `times` and private selfie are preserved.
- Queue lifecycle: `pending -> uploading -> synced`. Uncertain responses become `review_required`; abandoned `uploading` rows also block replay. All unsynced statuses remain visible in the pending count and block new online attendance.
- Acknowledgment requires `attendance_marked === true`, the original `punch_time`, and the endpoint's success message. The supplied endpoint incorrectly leaves `attendance_marked` true on some create failures; those responses are not acknowledged.
- **No automatic retry after an uncertain upload:** this backend ignores `attendance_id` and `action`, and lacks deduplication. Administrator/backend reconciliation is needed for review rows; do not reset them to pending without checking server records. Ordinary records not yet sent remain pending for the next online login.
- Synced rows and selfies remain stored; retention cleanup is not implemented. No real attendance was submitted during automated validation.
- Backend must confirm original timestamps, explicit actions, idempotency IDs, session employee validation and per-record acknowledgments before enabling sync.
- Native dependencies: NetInfo and react-native-sqlite-storage. `npm install` runs the SQLite Android Gradle compatibility script. iOS requires CocoaPods installation and device verification.
- Android debug compilation and mocked JS tests are checked; airplane-mode/device persistence and iOS behavior still need device verification.


## Proposed folders

```text
src/
  offline/
    config/
      offlinePolicy.js          # Offline expiry and location/selfie rules
    database/
      database.js               # SQLite open, transactions, migrations
      migrations.js             # Versioned schema upgrades
      attendanceRepository.js   # Durable, account-scoped queue operations
    auth/
      secureSessionStore.js     # Keychain/Keystore-protected session material
      offlineAccessService.js   # First-login, expiry, biometric/PIN checks
    attendance/
      captureService.js         # Capture time, location quality, persist selfie
      attendanceService.js      # Validate sequence and atomically enqueue event
      attendanceSelectors.js    # Derive local attendance and pending counts
    sync/
      attendanceApi.js          # Proposed backend contract adapter
      syncService.js            # One worker; ordered upload and retry
      syncTriggers.js           # Reconnect, launch, foreground, manual trigger
      backgroundSync.js         # Optional OS-scheduled best-effort execution
    hooks/
      useOfflineStatus.js       # Connectivity, queue counts, last sync state
    components/
      OfflineBanner.jsx         # Offline / syncing / login required
      SyncStatusCard.jsx        # Pending count, failures, Sync now
  Screens/
    Login.js                    # Integrate online login and offline unlock
    Selfie.js                   # Save locally before attempting upload
  screen/deshboard/
    Home.jsx                    # Local attendance state + server sync status
  utils/
    attendanceStorage.js        # Existing punch-time storage; migration adapter
```

These files are proposed modules, not created implementations. Keep existing routes and screen names.

## Flow

```text
First online login -> server verification -> secure session + minimal profile
Offline app open -> saved account + valid offline authorization + device unlock
                 -> limited offline Home access

Selfie + available location -> permanent private photo file
                            -> SQLite transaction: pending attendance event
                            -> local success and updated Home state
                            -> sync worker when server is reachable
                            -> server acknowledgment -> synced
```

PIN/biometric unlock does not authenticate with the server. Never grant offline access to a new account. Explicit server denial must not fall back to offline access. Offline expiry is a company policy, not an implementation default; detect clock rollback and require online verification when validity is uncertain.

## Local records

Queue identity must include server/tenant plus employee ID, since PFLO supports different server URLs.

```text
attendance_events
  attendance_id         UUID generated once; reused on every retry
  account_scope         server/tenant + employee ID
  employee_id
  sequence_number       local ordering within an account
  action                CHECK_IN | CHECK_OUT
  recorded_at           device timestamp with offset
  timezone
  latitude/longitude    nullable
  location_accuracy     nullable
  location_status       captured | unavailable | denied
  selfie_path           permanent private local file
  sync_status           pending | uploading | synced | rejected
  retry_count
  next_retry_at
  last_error_code
  server_record_id      nullable
  server_received_at    nullable
  created_at
```

Persist the photo before committing its database reference. Recover orphan files and interrupted uploads after restart. Protect local sensitive data, limit stored profile fields, and define retention before rollout. Do not delete unsynced photos or records. Secure credentials belong in secure storage, not SQLite or ordinary AsyncStorage.

## Proposed backend contract

An authenticated upload endpoint accepts the event metadata and selfie, either as a multipart request or through a staged upload protocol. Endpoint name and existing authentication mechanism must be confirmed with the backend developer.

Server responsibilities:

- Derive employee and tenant identity from the authenticated session and verify the claimed account.
- Enforce uniqueness of `(tenant, employee, attendance_id)` transactionally.
- Return the same result for a retry of an accepted event; reject changed payloads using an existing ID.
- Preserve device-recorded time separately from server receipt time.
- Validate sequence, delayed attendance policy, selfie, location policy and suspicious timestamps.
- Return a stable accepted result or a structured rejection code/message.
- Define reconciliation for multi-device attendance and conflicting sequences.

## Worker behavior

Process only the currently authenticated account against its matching server. Use one worker and upload in sequence. A connectivity signal triggers an attempt; it does not prove API reachability.

```text
pending -> uploading -> synced
                    -> pending  (network failure / retryable server error)
                    -> rejected (business validation failure)
                    -> pending + account login required (expired session)
```

On restart, recover abandoned `uploading` rows. Use capped exponential backoff with jitter and honor server retry timing. Keep the same event ID after uncertain responses. Pause dependent events when a previous attendance event is rejected or unresolved; do not silently send check-out after a rejected check-in.

App launch, foreground, reconnect, successful login and manual Sync now trigger this worker. OS background execution is best effort; force-closed apps cannot promise immediate upload.

## Existing integration points

| File | Planned change |
| --- | --- |
| `src/Screens/Login.js` | Save secure authorization after successful online verification; support offline unlock. |
| `src/Screens/Selfie.js` | Route submission through local capture/queue, then trigger sync. |
| `src/screen/deshboard/Home.jsx` | Show locally recorded attendance separately from server acceptance, pending count and sync action. |
| `src/utils/attendanceStorage.js` | Migrate legacy local state carefully. Existing punch time alone is not enough to reconstruct an uploadable attendance event. |
| `App.jsx` | Register and clean up global foreground/connectivity sync triggers. |

Pending attendance must survive sign-out and remain isolated from other accounts. Tell users about pending records before logout; never upload them using a different employee's credentials. Online rejection must stay visible and must not silently rewrite local history.

## Suggested implementation sequence

1. Agree company policy and backend idempotent API contract.
2. Choose SQLite, secure storage, connectivity and optional background adapters compatible with the installed React Native version.
3. Implement database, migrations and permanent photo storage.
4. Implement local attendance enqueue and Home status; verify airplane-mode persistence.
5. Implement API adapter and foreground sync, including duplicate and interrupted-upload recovery.
6. Add offline session authorization and device unlock.
7. Add banners, retry/rejection UX, account switching and logout handling.
8. Add optional background scheduling after foreground sync is reliable.

## Acceptance checks

- First-time offline login is refused; authorized saved account can unlock within policy.
- Check-in and check-out survive restart in airplane mode.
- Reconnect uploads in order without duplicates, including when acknowledgment was lost.
- Expired sessions preserve pending data and resume after the matching account logs in.
- Account/server switching never leaks or uploads another account's records.
- Missing GPS, photo persistence failure, storage exhaustion and rejected attendance have clear outcomes.
- Time changes, overnight attendance and multi-device conflicts follow documented rules.
- Force-close leaves data safe, with sync resuming at the next permitted execution.
