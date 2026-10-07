# Google Sheets usage statistics

Private spreadsheet: https://docs.google.com/spreadsheets/d/1--iaymzQ_RsIEvxXuPwvyLOQEraYE-oTiLItm3dEn1A/edit

Apps Script source: `Code.gs`. Paste into a dedicated script project.
Add script properties `SPREADSHEET_ID` (the ID above) and `USAGE_SECRET`
(a cryptographically random secret of at least 32 characters).
Deploy as a web app, executing as the owner, accessible to anyone. Every request
requires an HMAC signature and a timestamp valid for five minutes. The spreadsheet
itself remains private. Google authorization must be completed by the owner.

Set the following Render environment variables without putting secrets in Git:

- `USAGE_SCRIPT_URL`: the deployment URL ending in `/exec`.
- `USAGE_SCRIPT_SECRET`: the same secret as `USAGE_SECRET`.

Statistics are hidden when configuration is absent. They display a dash if storage
cannot be reached. They start at zero when the first authenticated storage request
initializes the sheet. Historical seeded visitor totals are never imported.

Visits are 30-minute first-party cookie sessions, including returning sessions.
Completed jobs are browser-reported successful output generations (hash calculation
or QR download for those tools), not numbers of files or verified unique people.
Sessions and completions may be undercounted if JavaScript, cookies, or the recording
request is blocked. Bot or fabricated browser reports can affect these operational
counts; they must not be presented as audited advertising audience numbers.

`Receipts` is the authoritative append-only event ledger. It stores random event IDs,
receipt time, kind, tool and running totals, never names, IPs or working file content.
Repeated event IDs are ignored under a script lock. Daily and Summary are derived
views. Google Apps Script quotas and sheet performance limit this low-traffic setup;
move to a database if event volume grows substantially.

To pause: remove `USAGE_SCRIPT_URL` from Render and redeploy. The sheet is preserved.
