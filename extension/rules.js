// Detection rules for the dental folder-share phishing campaign.
// Edit these lists as new waves appear — no rebuild needed, just reload the extension.

const PG_RULES = {
  // Known-bad domains seen in this campaign (always flagged, maximum severity).
  blocklist: [
    "avernix.vu",
    "uvanv.vu",
    "xornavo.vu",       // wave 13 Jul 2026 (/file)
    "lornica.vu",       // wave 16 Jul 2026 (/dental)
    "clientesetupdoc.vu", // wave 23 Jul 2026 (/access)
    "docsecdental.vu",    // wave 23 Jul 2026 (/mesh)
    "bzlvaka.vu",         // wave 28 Jul 2026 (/access/)
    "dytrix.vu",          // wave 24 Jul 2026
    "dprvirz.vu",         // wave 31 Jul 2026 (also seen as doc.dprvirz.vu)
    // Related campaign: PRODA/HPOS credential phishing, 7 Aug 2026
    "verifications.es",   // phishing page (/verification/v333/v3)
    "ghaspert.com",       // attacker sender domain, wave A
    "machsselbst.com"     // attacker sender domain, wave B (12 min later)
  ],

  // TLDs the campaign favours: cheap/fresh burner registrations rarely used by
  // legitimate businesses that email dental practices.
  // "zip" and "mov" are deliberately excluded: they collide with everyday
  // filenames and produced false positives on lab and radiology email.
  riskyTlds: [
    "vu", "icu", "top", "cyou", "sbs", "rest", "cam", "bond",
    "click", "cfd", "lat", "mom", "pics", "quest"
  ],

  // Short generic paths the kit uses (e.g. /access/, /file/).
  genericPathRe: /^\/(access|file|files|share|shared|view|open|doc|docs|folder|mesh|dental|secure)\/?$/i,

  // Lure phrases in the email body.
  sharePhrases: [
    "shared a folder", "shared a file", "shared the folder", "shared documents",
    "has shared", "shared with you", "view shared",
    "access the folder", "access the files", "file share",
    "shared a file for you", "invitation to view shared"
  ],

  // The tell-tale "open this on a Windows PC" instruction.
  desktopPhrases: [
    "on a desktop", "on your desktop", "on a laptop", "on your laptop",
    "on a computer", "on your computer", "on a pc", "windows pc",
    "not on mobile", "not on your phone", "desktop or laptop",
    "windows laptop", "using your desktop", "view this document using"
  ],

  // Domains where a genuine "shared a file" link plausibly points. A share-style
  // email whose button links anywhere else is suspicious on ANY TLD.
  // Includes the security gateways common in AU healthcare (Mimecast, Safe Links,
  // Proofpoint) — they rewrite genuine share links and would otherwise look hostile.
  knownShareHosts: [
    "microsoft.com", "live.com", "office.com", "sharepoint.com", "1drv.ms",
    "microsoftonline.com", "outlook.com", "google.com", "dropbox.com",
    "wetransfer.com", "we.tl", "box.com", "hightail.com", "sharefile.com",
    "docusign.net", "docusign.com", "adobe.com", "medical-objects.com.au",
    "healthlink.net", "safelinks.protection.outlook.com", "protect-au.mimecast.com",
    "protect.mimecast.com", "urldefense.proofpoint.com", "clicktime.symantec.com"
  ],

  // Australian government service impersonation (PRODA/HPOS/Medicare/myGov):
  // account-action wording + a link that doesn't go to .gov.au = credential phish.
  // Action phrases only — bare nouns like "proda account" or "hpos services" appear
  // in legitimate vendor mail, ADA newsletters and this advisory itself.
  govPhrases: [
    "re-link your proda", "relink your proda", "reconnect proda",
    "sign in to proda", "verify your mygov", "restore your connection with hpos",
    "services australia. please do not reply"
  ],

  // Anchor words that mark a link as the message's ACTION link (the one a gov
  // impersonation wants clicked), as opposed to a footer or unsubscribe link.
  actionWordsRe: /\b(sign ?in|log ?in|reconnect|re-?link|relink|verify|continue|access|reactivate|update your details)\b/i,

  // Never score a message that is itself warning people about phishing.
  advisoryRe: /\b(phishing|phish ?watch|scam email|do not click|suspicious email|security advisory)\b/i,

  // Anchor text that is a filename, not a hostname — must not trigger the
  // display-text-vs-href mismatch rule.
  fileExtRe: /\.(docx?|pdf|xlsx?|pptx?|zip|rar|7z|jpe?g|png|gif|heic|csv|txt|msg|eml|rtf|mp4|mov|stl|ply|dcm|xml|json)$/i,
  govDomainsRe: /(\.gov\.au|humanservices\.gov\.au|my\.gov\.au)$/i,

  // Brand words that imply the link should go to a matching legitimate domain.
  brandDomains: {
    "onedrive": ["live.com", "microsoft.com", "sharepoint.com", "1drv.ms", "office.com"],
    "sharepoint": ["sharepoint.com", "microsoft.com", "office.com"],
    "office 365": ["microsoft.com", "office.com", "sharepoint.com"],
    "microsoft": ["microsoft.com", "live.com", "office.com", "sharepoint.com", "1drv.ms", "microsoftonline.com"],
    "google drive": ["google.com", "drive.google.com"],
    "dropbox": ["dropbox.com"],
    "wetransfer": ["wetransfer.com", "we.tl"]
  }
};
