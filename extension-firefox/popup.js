function render(clinics) {
  const list = document.getElementById("list");
  const entries = Object.values(clinics).sort((a, b) => (b.lastSeen || "").localeCompare(a.lastSeen || ""));
  if (!entries.length) {
    list.innerHTML = '<div class="empty">No phishing emails detected yet. When one is flagged in Gmail/Outlook, the sender clinic appears here.</div>';
    return;
  }
  const table = document.createElement("table");
  table.innerHTML = "<tr><th>Sender (compromised account)</th><th>Seen</th><th>Attack domains</th><th></th></tr>";
  for (const c of entries) {
    const tr = document.createElement("tr");
    const cells = [
      `${c.name ? c.name + "\n" : ""}${c.email || "unknown"}`,
      `${(c.firstSeen || "").slice(0, 10)}${c.count > 1 ? ` (×${c.count})` : ""}`,
      (c.domains || []).join(", ")
    ];
    cells.forEach((text, i) => {
      const td = document.createElement("td");
      td.textContent = text;
      if (i === 2) td.className = "doms";
      tr.appendChild(td);
    });
    const td = document.createElement("td");
    const btn = document.createElement("button");
    btn.textContent = "Copy warning";
    btn.title = "Copy a ready-to-send warning message for this clinic (send it via a channel you trust — or better, read it to them over the phone)";
    btn.addEventListener("click", () => navigator.clipboard.writeText(warningMessage(c)));
    td.appendChild(btn);
    tr.appendChild(td);
    table.appendChild(tr);
  }
  list.replaceChildren(table);
}

// Ready-to-send notification with evidence and recovery steps. Deliberately NOT
// sent automatically: their mailbox is attacker-controlled, so phone first, and
// use SMS or a personal address rather than the compromised account.
function warningMessage(c) {
  return `URGENT — your email account appears to be HACKED

Hi ${c.name || "there"},

I'm a fellow dental practice. We received ${c.count > 1 ? c.count + " phishing emails" : "a phishing email"} SENT FROM your email account (${c.email}), first on ${(c.firstSeen || "").slice(0, 10)}. It was a fake "shared a file with you" message linking to ${c.domains.join(", ") || "a malicious site"} — part of an attack campaign currently going through Australian dental clinics. You probably can't see it in your Sent folder; the attackers hide their tracks.

This means criminals currently have access to your mailbox and are using it to attack every clinic you've ever emailed. Please act today:

1. From a computer you trust, change the account password, turn on two-factor authentication, and sign out of all sessions.
2. Check mail settings for forwarding rules/filters you didn't create, and that your recovery email/phone haven't been changed.
3. If any practice PC has shown a strange "Windows Update" screen or was used to open a similar link, disconnect it from the network and have it wiped and reinstalled — antivirus alone is not enough.
4. Change any passwords saved in browsers on practice machines (banking first), and warn your own contacts.
5. Report it at cyber.gov.au/report. If patient data may have been accessed, call your indemnity provider about OAIC notification duties.

Happy to talk it through — this happened to us too.`;
}

function load() {
  chrome.storage.local.get({ affectedClinics: {} }, (d) => render(d.affectedClinics));
}

document.getElementById("copy").addEventListener("click", () => {
  chrome.storage.local.get({ affectedClinics: {} }, (d) => {
    const lines = Object.values(d.affectedClinics).map((c) =>
      `${c.name || ""} <${c.email || "unknown"}> — first seen ${(c.firstSeen || "").slice(0, 10)}, ${c.count || 1} email(s), domains: ${(c.domains || []).join(", ")}`
    );
    navigator.clipboard.writeText(
      "Clinics whose email accounts appear compromised (phishing emails received from them):\n" + lines.join("\n")
    );
  });
});

document.getElementById("clear").addEventListener("click", () => {
  chrome.storage.local.set({ affectedClinics: {} }, load);
});

const central = document.getElementById("central");
chrome.storage.local.get({ centralReporting: true }, (d) => { central.checked = d.centralReporting; });
central.addEventListener("change", () => chrome.storage.local.set({ centralReporting: central.checked }));

load();
