# Facebook post — ready to paste

---

⚠️ WARNING TO EVERYONE IN AUSTRALIAN DENTISTRY — owners, associates, locums, OHTs, hygienists, practice managers, reception — active email attack spreading clinic-to-clinic ⚠️

TL;DR

🔴 Emails from REAL colleagues' REAL addresses saying they've "shared a file/folder with you" are currently being sent by hackers who have taken over those colleagues' accounts. Subject line is usually "[Practice name] shared a file with you", styled like a Microsoft/OneDrive share notice, and it asks you to open the link on a desktop or laptop — that instruction is the biggest red flag, because the link installs remote-control malware on Windows PCs behind a fake "Windows Update" screen.
🔴 They often land at ridiculous hours — 3am–6am — because the attackers are overseas. No real clinic shares documents with you in the middle of the night.
🔴 The links use made-up names on odd endings like .vu (examples seen: avernix .vu, uvanv .vu, xornavo .vu, lornica .vu, clientesetupdoc .vu, docsecdental .vu — spaces added deliberately; a NEW domain is used every wave).
🔴 Before opening ANY share link — even from someone you trust — phone the sender and ask if they actually sent it. Do not verify by email reply; the hacker controls that mailbox and will say yes.
🔴 If you clicked: unplug the PC from the network NOW, tell the owner/manager, and see the recovery checklist below. An antivirus scan is NOT enough.
🔴 This isn't only an owner problem. If you're an associate or locum and you check your email on a practice computer — or stay logged in / auto-login anywhere you work — YOUR accounts and saved passwords are stolen the moment that machine is compromised, even though it isn't your practice and isn't your computer.

Full details below 👇

━━━━━━━━━━━━━━━

HOW THE ATTACK WORKS

A criminal group hacks one clinic's email account, then sends phishing emails from that genuine account to every practice and clinician it has ever corresponded with. Recipients are hidden (BCC), so you can't see it went to half the state. Because it's a real account, it passes every technical check and sails through spam filters. The only defence is a human recognising the pattern:

• From a dentist, practice or lab you genuinely know
• "…shared a file with you" / "…shared a folder with you" — usually a fake Microsoft/OneDrive-style card with an "Open Document" button
• A line like "For security reasons, please view this document using your Desktop or Windows Laptop"
• No attachment, just a link, to a strange address ending in something like .vu
• Timestamps that make no sense — these frequently arrive in the very early morning (3am–6am AEST), which points to an overseas operator and is a giveaway on its own

If someone clicks and runs it, remote-access software installs behind a fake "Windows Update" screen — we watched the mouse moving on an infected machine while it showed "installing updates". A real human then operates that PC remotely: reading email, harvesting every saved password, and sending the same phishing email onward to everyone in the address book. They come back for repeat visits over the following weeks.

And don't trust link scanners for this one: the attackers show scanning tools a harmless decoy page. "I scanned it and it was clean" means nothing.

WHY THIS MATTERS TO ASSOCIATES, LOCUMS AND EVERY CLINICIAN — NOT JUST OWNERS

Most of us work across multiple practices and use whatever computer is in the surgery. Think about what's on those machines:

• Your personal email logged in and set to stay signed in
• Browser-saved passwords — email, banking, AHPRA, PRODA, indemnity, supplier accounts
• Auto-login to practice management software with patient records under your name

If ONE machine at ONE practice you work at gets infected, the attacker has all of it. You don't have to click anything yourself — a receptionist clicking on the front-desk PC can compromise the account of every clinician who ever logged in on it.

So protect yourself wherever you work:
1. Turn on two-factor authentication (2FA) on your personal email TODAY. It's ten minutes and it's the single best protection you have.
2. Log OUT of your email and never tick "stay signed in" on practice computers that aren't yours.
3. Don't let the browser save your passwords on shared/practice machines — especially banking.
4. If a practice you've worked at announces it's been hit: change your passwords and sign out all sessions on your accounts, even if "your" computer seemed fine.

THE GOLDEN RULE FOR EVERYONE

📞 VERIFY BY PHONE. Unexpected share link — even from someone you trust? Ring them on their known number: "Did you send me this?" If their account is hacked, they usually have no idea. A 30-second call is the entire defence. Never verify by replying to the email.

And never open a share link on a practice PC "because the email said to use a computer". That instruction IS the attack.

IF SOMEONE ALREADY CLICKED — RECOVERY CHECKLIST

Speak up immediately, no blame — minutes matter, and "nothing seemed to happen" still counts.

1. Unplug that PC from the network / turn off its Wi-Fi immediately. Stop using it.
2. Wipe and reinstall Windows on that machine. With a live human attacker involved, antivirus "cleaning" cannot be trusted — full reinstall only.
3. From a DIFFERENT clean device: change the email password, enable 2FA, sign out all sessions. This goes for EVERY person who was logged into anything on that machine — owner, associates, staff.
4. Audit the mailbox: forwarding rules, filters and auto-replies you didn't create (attackers add hidden rules to steal or hide mail); confirm recovery email/phone unchanged; review connected apps.
5. Assume every password saved in that PC's browsers is stolen. Change them all — banking first, then Medicare/PRODA, HICAPS, practice software, supplier portals. If bank/card details were saved or used on it, call the bank.
6. Warn your contacts that emails from the compromised address may be malicious — they're the next targets.
7. Patient data: practices hold health records, so if records may have been accessed you may have Notifiable Data Breach obligations (OAIC) — call your indemnity provider; most include cyber response support.
8. Report it at cyber.gov.au/report (ACSC ReportCyber) — quick, and it helps get these domains taken down.
9. Check practice bank accounts and recent invoices/payments for tampering — invoice fraud is a common follow-up.

If your IT provider's response is "we remoted in and found nothing", push back and require in writing: machine reimaged, mailbox rules audited, MFA enforced, sign-in logs reviewed. That's the minimum.

A REQUEST TO REFERRERS, LABS AND SPECIALISTS

When you send documents to another practice, ATTACH the file (or use a secure clinical messaging platform like Medical-Objects/HealthLink) instead of a "click here to download" link to an outside site. If attachments become the norm across our referral networks, every "download my document from this website" email instantly stands out as the scam it probably is. (Unexpected attachments that ask you to "enable macros/editing" are their own red flag — but a plain PDF attached to a referral is the normal, expected pattern.)

FOR PRACTICE OWNERS — MAKE A CLICK SURVIVABLE

Ask your IT for these by name: 2FA enforced on all mailboxes; staff on standard (non-admin) Windows accounts so software can't be installed; application control (Smart App Control / AppLocker) and Defender ASR rules on; DNS filtering at the router; a mail rule that quarantines links to risky endings like .vu; tested backups the PCs can't overwrite. Mostly free, one afternoon of work.

EVERYTHING IN ONE PLACE — FREE

We've put up an advisory site for the profession: live statistics on the outbreak, a map of affected areas (no clinic is ever named), the full warning-sign list, a printable DO-NOT-OPEN poster for your front desk, a staff training booklet, a free browser extension that flags these emails in Gmail/Outlook web, and a copy-paste setup guide for your IT provider:

👉 phishwatch.parkrddental.com.au

Everything is open source — the code is on GitHub, linked from the site, so you or your IT provider can verify exactly what it does before installing. If you've received one of these emails, please report it there: the clinic it came from is a victim who usually has no idea, and they get a private phone call, never a public naming.

Please SHARE this with any dental group, colleague or practice you know — every clinic that falls for it becomes a launchpad against dozens more. Stay safe and verify by phone. 🦷

---

# Notes for you (not part of the post)

- Domains are written with spaces deliberately so Facebook doesn't linkify them and nobody fat-fingers a click. It also avoids Facebook suppressing the post for containing live malicious links.
- Consider also posting in the closed Australian dentistry FB groups where associates/OHTs actually are (not just practice-owner groups — the associate angle now makes it relevant to them), and asking the ADA branch newsletter to carry a version.
- Also report the domains at safebrowsing.google.com/safebrowsing/report_phish/ — once Google flags them, Chrome shows a full-page red warning to anyone who clicks, which protects people who never see your post.
