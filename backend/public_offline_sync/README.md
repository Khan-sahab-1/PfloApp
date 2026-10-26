# Public offline sync v4 — backend deployment required

This is a drop-in change for the existing Odoo addon that defines
`hr.attendance.online` (same route/API conventions as the supplied v3 code).
It deliberately accepts employee identity without a login session or token,
as requested. Keep the old online attendance/login controllers unchanged.

1. Put `offline_fields.py` in that addon's `models` folder; import it in `models/__init__.py`.
2. Put `offline_controller.py` in its `controllers` folder; import it in `controllers/__init__.py`.
3. Upgrade that addon in the correct database, then restart Odoo. The upgrade
   must create `pflo_event_id`, `pflo_event_hash`, `pflo_synced_at`, and the unique
   constraint. Restart alone does not create these database changes.
4. Existing model fields used by v3 must also have their database columns after
   the module upgrade. Confirm `offline_attendance` exists on `hr.employee`.
5. Test `/attendance/offline/sync/v4` without cookies using the request below.
   Use a real saved event, not the placeholder image. Repeat the same payload:
   the response must return the same server_record_id and duplicate=true.
6. Only then enable rollout of the updated app. Until deployed, its public sync
   attempts remain in SQLite as retry and cannot reach this new endpoint.

```json
{"jsonrpc":"2.0","method":"call","id":1,"params":{"employee_id":144,"employee_code":"IT201","events":[{"local_event_id":"EXISTING_SQLITE_ID","device_id":"IT201","punch_time":"2026-09-11 07:02:55","latitude":30.05358,"longitude":78.2200133,"picture":"ACTUAL_BASE64","emp_address":"Captured offline","gps_accuracy":0}]}}
```

Response: `result.results[]` contains `attendance_id`, `success`,
`server_record_id`, and `duplicate`. Errors contain `retryable`.
Existing v3 records are reconciled by mobile_event_id within the same employee.
ID/payload conflicts are rejected rather than silently changing existing data.
These files have been syntax checked locally; this workspace has no Odoo server
or the original model addon, so module upgrade and server integration tests are
still required. Never issue an SQL manual commit inside these request handlers.
