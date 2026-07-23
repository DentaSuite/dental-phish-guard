// Dental Phish Guard — scans opened messages in Gmail / Outlook web and
// injects a warning banner when a message matches the folder-share
// phishing campaign pattern (compromised colleague account + burner-domain link).

(() => {
  const MESSAGE_SELECTORS = [
    "div.a3s",                          // Gmail message body
    "div[aria-label='Message body']",   // Outlook web
    "div[role='document']",             // Outlook web (reading pane variants)
    ".pg-test-message"                  // local test harness
  ].join(",");

  const registrableDomain = (hostname) => {
    const parts = hostname.toLowerCase().split(".").filter(Boolean);
    return parts.length <= 2 ? parts.join(".") : parts.slice(-2).join(".");
  };

  const tldOf = (hostname) => hostname.toLowerCase().split(".").pop();

  // Pure detection: returns { score, reasons } for a message container.
  function analyzeMessage(container) {
    const reasons = [];
    const matchedDomains = new Set();
    let score = 0;
    const text = (container.innerText || "").toLowerCase();

    const links = [];
    for (const a of container.querySelectorAll("a[href]")) {
      try {
        const u = new URL(a.href, location.href);
        if (u.protocol === "http:" || u.protocol === "https:") {
          links.push({ url: u, text: (a.innerText || "").toLowerCase() });
        }
      } catch { /* ignore unparseable hrefs */ }
    }

    for (const { url } of links) {
      const dom = registrableDomain(url.hostname);
      if (PG_RULES.blocklist.includes(dom)) {
        score += 100;
        reasons.push(`Link to KNOWN attack domain: ${dom}`);
        matchedDomains.add(dom);
      }
      if (PG_RULES.riskyTlds.includes(tldOf(url.hostname))) {
        score += 40;
        reasons.push(`Link to high-risk domain ending ".${tldOf(url.hostname)}": ${url.hostname}`);
        matchedDomains.add(url.hostname.toLowerCase());
        if (PG_RULES.genericPathRe.test(url.pathname)) {
          score += 20;
          reasons.push(`Generic share-style link path "${url.pathname}" — matches the known attack kit`);
        }
      }
    }

    const hitShare = PG_RULES.sharePhrases.some((p) => text.includes(p));
    if (hitShare) {
      score += 15;
      reasons.push('Message uses "shared folder / shared files" lure wording');
      // TLD-independent: a share email whose links go to no recognised
      // file-sharing service is suspicious even on .com/.net/etc.
      for (const { url } of links) {
        const legit = PG_RULES.knownShareHosts.some((d) => url.hostname === d || url.hostname.endsWith("." + d));
        if (!legit) {
          score += 20;
          reasons.push(`"Shared file" email but the link goes to ${url.hostname}, which is not a recognised file-sharing service`);
          matchedDomains.add(registrableDomain(url.hostname));
          break;
        }
      }
    }

    const hitDesktop = PG_RULES.desktopPhrases.some((p) => text.includes(p));
    if (hitDesktop) {
      score += 30;
      reasons.push('Message instructs you to open the link on a desktop/laptop — the payload targets Windows PCs');
    }

    // Brand word in text/link-label but link points elsewhere (fake OneDrive etc.)
    for (const [brand, okDomains] of Object.entries(PG_RULES.brandDomains)) {
      if (!text.includes(brand)) continue;
      for (const { url } of links) {
        const dom = registrableDomain(url.hostname);
        const legit = okDomains.some((d) => url.hostname.endsWith(d) || dom === d);
        if (!legit && (hitShare || PG_RULES.riskyTlds.includes(tldOf(url.hostname)))) {
          score += 35;
          reasons.push(`Mentions "${brand}" but the link goes to ${url.hostname} instead`);
          break;
        }
      }
    }

    return { score, reasons: [...new Set(reasons)], domains: [...matchedDomains] };
  }

  // Best-effort sender extraction so flagged senders can be recorded.
  function findSender(container) {
    // Gmail: the message block (div.gs) holds a .gD span with email/name attributes.
    const gmailWrap = container.closest("div.gs") || document;
    const gd = gmailWrap.querySelector("span.gD[email]") || document.querySelector("span.gD[email]");
    if (gd) return { email: (gd.getAttribute("email") || "").toLowerCase(), name: gd.getAttribute("name") || gd.textContent.trim() };
    // Outlook web: walk up looking for an element whose title/aria-label contains an address.
    let node = container;
    for (let i = 0; node && i < 8; i++, node = node.parentElement) {
      const el = node.querySelector?.("[title*='@'], [aria-label*='@']");
      if (el) {
        const m = ((el.getAttribute("title") || "") + " " + (el.getAttribute("aria-label") || "")).match(/[\w.+-]+@[\w.-]+\.\w+/);
        if (m) return { email: m[0].toLowerCase(), name: el.textContent.trim().split("\n")[0].slice(0, 80) };
      }
    }
    return null;
  }

  // Keep a local list of clinics whose accounts sent flagged mail (chrome.storage
  // is absent in the test harness — no-op there). Nothing ever leaves this browser.
  function recordAffectedClinic(sender, result) {
    if (!sender?.email || typeof chrome === "undefined" || !chrome.storage?.local) return;
    chrome.storage.local.get({ affectedClinics: {} }, (d) => {
      const clinics = d.affectedClinics;
      const now = new Date().toISOString();
      const c = clinics[sender.email] || { email: sender.email, name: sender.name, firstSeen: now, count: 0, domains: [] };
      c.count += 1;
      c.lastSeen = now;
      c.name = c.name || sender.name;
      c.domains = [...new Set([...c.domains, ...result.domains])];
      clinics[sender.email] = c;
      chrome.storage.local.set({ affectedClinics: clinics });
    });
    // Forward to the central Phish Watch drop-box (owner-only; toggle in popup).
    try {
      chrome.runtime.sendMessage({
        type: "pg-report",
        report: {
          source: "extension",
          sender_email: sender.email,
          sender_name: sender.name || null,
          domains: result.domains,
          notes: result.reasons.slice(0, 6).join(" | ").slice(0, 1900)
        }
      });
    } catch { /* harness / detached context */ }
  }

  // Escape everything we render — parts of the reasons (hostnames, paths) come
  // from the attacker's email, so they must never reach innerHTML unescaped.
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

  function injectBanner(container, result) {
    const banner = document.createElement("div");
    banner.className = "pg-banner";
    banner.setAttribute("role", "alert");
    const level = result.score >= 60 ? "DANGER — this matches an active attack on dental practices" : "CAUTION — this email looks suspicious";
    banner.innerHTML = `
      <div class="pg-banner-title">⚠️ ${level}</div>
      <div class="pg-banner-body">
        <p>Emails like this are being sent from <b>hacked accounts of real colleagues</b>. Do <b>NOT</b> click any link. Phone the sender to verify — their account may be compromised without them knowing.</p>
        <ul>${result.reasons.map((r) => `<li>${esc(r)}</li>`).join("")}</ul>
      </div>
      <div class="pg-banner-note">The sender has been added to your local “affected clinics” list — click the Phish Guard icon in the toolbar to see all clinics detected so far, then phone them to warn them their account is compromised.</div>
      <button class="pg-banner-dismiss" type="button">I understand the risk — dismiss</button>
    `;
    banner.querySelector(".pg-banner-dismiss").addEventListener("click", () => banner.remove());
    container.parentElement.insertBefore(banner, container);
  }

  const THRESHOLD = 40;

  function scan() {
    for (const container of document.querySelectorAll(MESSAGE_SELECTORS)) {
      if (container.dataset.pgScanned) continue;
      container.dataset.pgScanned = "1";
      const result = analyzeMessage(container);
      if (result.score >= THRESHOLD) {
        injectBanner(container, result);
        recordAffectedClinic(findSender(container), result);
      }
    }
  }

  let pending = null;
  const observer = new MutationObserver(() => {
    if (pending) return;
    pending = setTimeout(() => { pending = null; scan(); }, 300);
  });
  observer.observe(document.body, { childList: true, subtree: true });
  scan();

  // Expose for the test harness.
  window.__pgAnalyzeMessage = analyzeMessage;
})();
