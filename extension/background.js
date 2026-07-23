// Central reporting: forwards each detection to the private Dental Phish Watch
// drop-box (write-only Supabase table — reports cannot be read back through this
// key; only the project owner can view them). Toggle in the popup; content
// scripts can't fetch cross-origin in MV3, hence this service worker.

const PHISHWATCH_URL = "https://vgtwdkwdtmgjagbtqrcz.supabase.co/rest/v1/phishwatch_reports";
const PHISHWATCH_KEY = "sb_publishable_tQ22oNC5oYZ6r_dhLJhK3Q_XPDnfucA";

chrome.runtime.onMessage.addListener((msg) => {
  if (msg?.type !== "pg-report") return;
  chrome.storage.local.get({ centralReporting: true, reportedKeys: {} }, (d) => {
    if (!d.centralReporting) return;
    // One report per sender+domain-set per day — no spam on re-opened emails.
    const key = `${msg.report.sender_email}|${[...msg.report.domains].sort().join(",")}|${new Date().toISOString().slice(0, 10)}`;
    if (d.reportedKeys[key]) return;
    fetch(PHISHWATCH_URL, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        apikey: PHISHWATCH_KEY,
        prefer: "return=minimal"
      },
      body: JSON.stringify(msg.report)
    }).then((r) => {
      if (r.ok) {
        d.reportedKeys[key] = Date.now();
        // keep the dedupe map small
        const entries = Object.entries(d.reportedKeys);
        if (entries.length > 500) {
          entries.sort((a, b) => a[1] - b[1]).slice(0, entries.length - 500)
            .forEach(([k]) => delete d.reportedKeys[k]);
        }
        chrome.storage.local.set({ reportedKeys: d.reportedKeys });
      }
    }).catch(() => { /* offline — will retry next time the message is seen */ });
  });
});
