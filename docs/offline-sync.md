# Offline sync

The Android client initializes a SQLite pending event table. The scoring screen signs in through the shared API, writes an event locally before submission, then removes it after success. Events remain in SQLite after network or sequence errors. Automatic replay after reconnect and conflict resolution are not yet implemented. The API rejects sequence gaps with HTTP 409 and accepts duplicate UUIDs idempotently.
