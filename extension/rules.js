// Detection rules for the dental folder-share phishing campaign.
// Edit these lists as new waves appear — no rebuild needed, just reload the extension.

const PG_RULES = {
  // Known-bad domains seen in this campaign (always flagged, maximum severity).
  blocklist: [
    "avernix.vu",
    "uvanv.vu",
    "xornavo.vu",       // "Lucas Dental Care" wave, 12 Jul 2026 (/file)
    "lornica.vu",       // "Dentology Dental Care" wave, 16 Jul 2026 (/dental)
    "clientesetupdoc.vu", // "V Care Dental" wave, 22 Jul 2026 (/access)
    "docsecdental.vu"     // "V Care Dental" wave, 22 Jul 2026 (/mesh)
  ],

  // TLDs the campaign favours: cheap/fresh burner registrations rarely used by
  // legitimate businesses that email dental practices.
  riskyTlds: [
    "vu", "icu", "top", "cyou", "sbs", "rest", "cam", "bond",
    "click", "cfd", "lat", "mom", "pics", "quest", "zip", "mov"
  ],

  // Short generic paths the kit uses (e.g. /access/, /file/).
  genericPathRe: /^\/(access|file|files|share|shared|view|open|doc|docs|folder|mesh|dental|secure)\/?$/i,

  // Lure phrases in the email body.
  sharePhrases: [
    "shared a folder", "shared a file", "shared the folder", "shared documents",
    "has shared", "shared with you", "review the documents", "view shared",
    "access the folder", "access the files", "secure file", "file share",
    "for security reasons", "open document", "shared a file for you", "acknowledgement doc"
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
  knownShareHosts: [
    "microsoft.com", "live.com", "office.com", "sharepoint.com", "1drv.ms",
    "microsoftonline.com", "google.com", "dropbox.com", "wetransfer.com", "we.tl",
    "box.com", "hightail.com", "medical-objects.com.au", "healthlink.net"
  ],

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
