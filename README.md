# Dental Phish Guard

Open-source Chrome extension that flags a specific phishing campaign hitting Australian
dental practices: **folder-share emails sent from hacked accounts of real colleagues**,
linking to fresh burner domains (e.g. `avernix.vu/access/`, `uvanv.vu`, `xornavo.vu/file/`)
that install remote-access malware behind a fake Windows Update screen.

Because the emails come from genuine, trusted addresses they pass SPF/DKIM/DMARC and
most spam filters. This extension instead pattern-matches the *content*:

- links to known campaign domains (blocklist in `extension/rules.js`)
- links to high-risk burner TLDs (`.vu`, `.icu`, `.top`, …) with generic share paths (`/access/`, `/file/`)
- "shared a folder / shared files with you" lure wording
- instructions to open the link on a desktop/laptop (the payload targets Windows)
- brand mismatch (email says OneDrive/SharePoint, link goes somewhere else)

When a message scores over the threshold, a red warning banner is injected above it in
Gmail or Outlook on the web telling the reader not to click and to phone the sender.

## What's in this repo

- `extension/` — the Chrome/Edge extension (banner warnings + local affected-clinics list)
- `extension-firefox/` — Firefox build (same code; MV3 event-page background + gecko id)
- `site/it-guide.html` — IT setup guide: M365/Workspace mail rules (covers desktop
  Outlook + phones), router DNS filtering (covers every device), endpoint hardening
- `site/` — "Dental Phish Watch" static reporting website (host anywhere; set `REPORT_EMAIL` in index.html)
- `Staff-Training-Booklet-v2.docx` — printable staff training booklet
- `FACEBOOK-POST.md` — ready-to-paste awareness post
- `email-example.png` — anonymised screenshot of a real campaign email
- `DO-NOT-OPEN-Poster.pdf` (+ `poster.html` source) — A4 front-desk poster
- Central reporting drop-box: `phishwatch_reports` table on the owner's Supabase
  (write-only via RLS; owner-only reads via dashboard)

## Affected-clinics list

When the extension flags an email it records the sender (name, address, dates, attack
domains) in `chrome.storage.local` — click the extension icon to see every clinic whose
account has sent you phishing, copy the list, or copy a ready-made warning message per
clinic (evidence + recovery steps). Nothing leaves the browser; notification is a human
decision, by design: the clinic's own mailbox is attacker-controlled, so warnings should
go by phone or SMS, never just an email to the hacked account.

## Install (Chrome / Edge)

1. Download/clone this folder.
2. Go to `chrome://extensions`, enable **Developer mode**.
3. Click **Load unpacked** and select the `extension/` folder.
4. Open Gmail or Outlook web — suspicious messages now get a banner.

## Updating for new waves

The attacker registers a new domain every wave. Add new domains to `blocklist` in
`extension/rules.js` and hit reload on `chrome://extensions`. Unknown fresh domains are
still usually caught by the TLD + lure-wording heuristics.

## Test

Three levels, safest first:

1. **Harness**: open `extension/test.html` in a browser — the two simulated attack
   messages and the real-email replica get red banners; the legitimate OneDrive share
   and the plain email do not.
2. **In Gmail/Outlook**: after loading the extension, open one of the *actual* phishing
   emails already sitting in the practice inbox. Viewing the email is safe — the malware
   only runs if the link is clicked and the download executed. The banner should appear
   above the message. Press F12 → Console to check for errors.
3. **Fresh-wave drill**: email yourself a message in the campaign's style with an invented
   `.vu` link (e.g. `https://madeupword.vu/access`) — it should be flagged even though
   that domain is in no blocklist.

## Security design — can this be turned against us?

The extension is built to have nothing worth hijacking:

- **One outbound channel, write-only, disclosed.** The extension never fetches rules or
  updates. Its single network action is *sending* detection reports (sender address/name,
  attack domains, detection reasons — never email contents) to the Dental Phish Watch
  drop-box, so the coordinator can phone affected clinics. The endpoint is a Supabase
  table with row-level security allowing INSERT only — the embedded key cannot read,
  modify, or delete anything, so a hijacked copy of the extension can't pull the list.
  Only the project owner (dashboard login, 2FA it!) can read reports. The toggle in the
  popup turns reporting off; everything else stays local.
- **No permissions.** No `storage`, no `tabs`, no background worker — only content
  scripts on the four webmail origins. Even fully compromised, it could not read other
  sites, files, or passwords.
- **Untrusted input is escaped.** Text taken from the email (hostnames, paths) is
  HTML-escaped before being shown in the banner, so a crafted email can't inject
  content through the warning itself.
- **The real supply-chain risk is distribution, not code.** If this is shared on GitHub:
  protect the repo account with 2FA, review every pull request (a malicious "new domain"
  PR could try to sneak code in), and if it's ever published to the Chrome Web Store,
  guard that developer account like a bank login — store extensions auto-update, so a
  hijacked publisher account is the one path to pushing bad code to every installer.
  Sharing the folder as a zip for "Load unpacked" avoids auto-update risk entirely, at
  the cost of manual updates.
- **Attackers reading the rules can evade them.** The rules are public, so a determined
  actor can move off `.vu` and reword the lure. That's inherent to any signature-based
  tool — which is why the layered heuristics (brand mismatch, share-lure wording,
  desktop instruction) matter more than the blocklist, and why the extension is a
  safety net, never a substitute for verify-by-phone and 2FA.

## Honest limitations

- Only protects webmail **in a browser with the extension installed**. Desktop Outlook,
  phones, and unprotected machines see nothing.
- For whole-practice protection, a **server-side mail rule is stronger** (see below) —
  use this extension as a second, visible layer.

## Server-side alternative (protects every device at the practice)

- **Microsoft 365**: Exchange admin → Mail flow → Rules → new rule: *if message body or
  subject contains* `.vu/` (and other risky TLD strings) → prepend warning / redirect to
  quarantine. Also enable Safe Links if licensed.
- **Google Workspace**: Admin → Apps → Gmail → Compliance → Content compliance rule
  matching the same strings → quarantine.
- Either way: **enforce 2FA on every mailbox** — that's what stops your practice becoming
  the next sender.

## Reporting

- Report incidents: https://www.cyber.gov.au/report (ACSC ReportCyber)
- Report the URLs: https://safebrowsing.google.com/safebrowsing/report_phish/ — once
  flagged, Chrome itself shows a red interstitial to anyone who clicks, protecting people
  who never installed anything.

MIT licensed. PRs with new campaign domains welcome.
