# Facebook post — plain text, paste as-is

---

WARNING TO ALL AUSTRALIAN DENTAL PRACTICES - PLEASE READ AND SHARE

Our practice was hacked this year, and the same attack is now working its way through dental clinics Australia-wide - we have confirmed hacked senders in both Victoria and New South Wales. I want to explain exactly what happened to us so it doesn't happen to you, because once you know what to look for it's actually easy to spot.

WHAT THE EMAIL LOOKS LIKE

You get an email from a dental practice you know. Real practice, real email address, someone you've actually corresponded with. The subject is something like "Smith Dental shared a file with you" and it looks exactly like a Microsoft OneDrive share notice, with an Open Document button. No attachment, just a link.

Two things give it away.

First, it asks you to open the link on your "Desktop or Windows Laptop". No real file share cares what device you use. The reason it asks is that the virus only runs on Windows computers.

Second, the timing can be odd. One of ours arrived at 3:41am - no clinic shares referral documents with you at that hour. But do not rely on this: of the five we have collected, three arrived during normal business hours. A sensible-looking timestamp is not reassurance.

The links go to made-up addresses ending in .vu - ones we have seen are avernix .vu, uvanv .vu, xornavo .vu, dytrix .vu, lornica .vu, clientesetupdoc .vu, docsecdental .vu, bzlvaka .vu and dprvirz .vu (I have put spaces in so nobody can click them). They register a brand new address for every round of emails, so don't rely on recognising these. Recognise the pattern.

WHAT HAPPENS IF SOMEONE CLICKS

A staff member at our practice clicked one. What installs is remote control software that hides behind a fake "Windows Update" screen. I watched our infected computer with my own eyes - the mouse was moving around behind that update screen. There was an actual person on the other end controlling our machine. They came back for a second go about a month later.

Once they're in, they read your email, take every password saved in the browser, and send the same scam email to everyone in your address book. That's how it spreads - every clinic that clicks becomes the next sender. The email you get comes from a genuine colleague because that colleague has already been hacked and usually has no idea.

One more thing. We ran one of the links through a scanner and it came back clean. It turns out the scam shows scanners a harmless decoy page. A clean scan means nothing with this one.

THE ONE RULE THAT BEATS IT

Before you open ANY unexpected shared file link, even from someone you trust - pick up the phone and ask them if they sent it. Thirty seconds. If their account is hacked they won't know until you call. Don't ask by replying to the email, because the hacker is the one who'll answer.

IF YOU'RE AN ASSOCIATE, LOCUM, OHT OR HYGIENIST - THIS IS YOUR PROBLEM TOO

Think about the computers at the practices you work at. Is your email signed in and set to stay signed in? Are your passwords saved in the browser? Banking, AHPRA, PRODA? If the receptionist clicks one of these on the front desk computer, everything you've ever logged into on that machine is gone too. It doesn't matter that it's not your practice and not your computer.

So wherever you work: turn on two-factor authentication on your personal email today, log out properly on practice computers, and don't let their browsers save your passwords. If a practice you've worked at gets hit, change your passwords even if nothing seems wrong.

IF SOMEONE HAS ALREADY CLICKED

Speak up straight away, no blame. Then:

1. Unplug that computer from the network immediately and stop using it.
2. Call your indemnity or cyber insurer BEFORE anything is wiped. Many policies require their consent first and will appoint the responder, and wiping destroys the evidence you need for the patient-data assessment. We wiped ours immediately and lost that - learn from our mistake.
3. Then the machine needs to be wiped and Windows reinstalled. An antivirus scan is not enough.
4. From a DIFFERENT computer: reset the email password, sign out all sessions, delete any app passwords, and revoke connected apps. Important - changing the password alone does NOT kick them out. They can stay in through a connected app or a second-factor device they added, so check your registered 2FA methods and delete any phone or authenticator you do not recognise.
5. Check your email settings for forwarding rules or filters you did not create. They add hidden rules to steal your mail. Check at the server level too, not just in Outlook or Gmail.
6. Every password saved on that machine should be treated as stolen. Change them all, banking first. If card details were saved, call the bank.
7. Warn your contacts, because they are getting the scam email from your address next.
8. If patient records may have been accessed, YOU are the one with the reporting obligation - not your IT company. You have 30 days to assess it and may need to notify the OAIC and your patients. Note professional indemnity and cyber cover are different products; check which you actually hold.
9. Report it at cyber.gov.au/report.
10. Keep an eye on the practice bank account and any invoices.

And if your IT company remotes in, has a look and says "we didn't find anything" - that is not good enough for this attack. Ask them specifically: has the machine been reimaged, have the mailbox rules been checked, is two-factor turned on, have the sign-in logs been reviewed.

A SECOND SCAM DOING THE ROUNDS - FAKE PRODA / SERVICES AUSTRALIA

Since early August there's a second one hitting dental practices, and a colleague forwarded me two copies of it this week. It pretends to be Services Australia and says your PRODA account needs to be "re-linked" to keep using HPOS, with a Reconnect PRODA button. The giveaway is the same trick as the first scam: the button - and even the text that reads "servicesaustralia.gov.au" - actually goes to a foreign website, not a .gov.au address. The two copies came from ghaspert .com and machsselbst .com and both pointed at verifications .es (spaces added again).

This one does not install anything. It steals your PRODA login, which reaches Medicare, DVA and immunisation records as well as your billing.

The rule is simple: a real Services Australia link always ends in .gov.au. Never reach PRODA through an emailed button - type the address yourself or use your saved bookmark.

If someone at your practice DID enter their PRODA details:

1. Change the PRODA password now, from a different device, going to the site yourself rather than through any link.
2. Do not use any phone number from the email. The scam helpfully supplies its own "Services Australia" number. Look the real one up yourself.
3. Phone Services Australia and report the account as compromised.
4. Check PRODA for changes you didn't make - delegates, linked organisations, changed contact details. Adding themselves as a delegate is how they stay in after you change the password.
5. Check HPOS for claims you didn't submit or changed bank details.
6. Treat it as a patient-data incident too, not just a billing one, and call your indemnity insurer.

Full checklist on the site below.

A REQUEST TO REFERRERS AND LABS

Please just attach documents to your emails, or use Medical-Objects or HealthLink, rather than sending "click here to download" links. If attachments are the normal way we all send things, these scam links stick out immediately.

WE'VE PUT EVERYTHING IN ONE PLACE

I've set up a free site for the profession with the full details of this attack, live numbers on how many clinics have been hit (nobody is named - affected clinics are victims and we call them privately), a printable DO NOT OPEN poster for your front desk, a staff training booklet, a free browser extension that flags these emails in Gmail and Outlook, a step-by-step "what should I do" tool, and a setup guide to hand your IT provider:

phishwatch.parkrddental.com.au

Everything on it is free and open source, so your IT provider can check exactly what it does before installing anything. If you've received one of these emails, please report it through the site - the clinic it came from almost certainly doesn't know they've been hacked, and a quiet phone call is how they find out before more damage is done.

Please share this with any dentist, practice or dental group you know. Every clinic that gets caught becomes a launchpad for attacking dozens more. Stay sharp and verify by phone.

Dr James Lee

---

# Notes for you (not part of the post)

- Formatting is plain text on purpose: Facebook strips bold/markdown, so headings are in capitals and lists use plain numbers. It will paste exactly as it looks here.
- Domains are written with spaces so Facebook doesn't turn them into links and nobody can click them. It also stops Facebook suppressing the post for containing live malicious links.
- Post to your practice page first, then share into the AU dentistry groups (including associate/OHT groups - the associate section makes it relevant to them). Ask ADAVB / ADA to carry a version in their member alerts.
- Also report the domains at safebrowsing.google.com/safebrowsing/report_phish/ so Chrome itself blocks them for anyone who clicks.
