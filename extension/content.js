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

  // Second-level suffixes that are NOT the registrable name — without these,
  // every *.com.au host collapses to "com.au" and comparisons become meaningless
  // across the entire Australian namespace.
  const SECOND_LEVEL = new Set(["com", "net", "org", "edu", "gov", "asn", "id", "co", "ac", "gen", "ltd", "plc", "sch"]);
  const registrableDomain = (hostname) => {
    const parts = hostname.toLowerCase().split(".").filter(Boolean);
    if (parts.length <= 2) return parts.join(".");
    const take = (parts[parts.length - 1].length === 2 && SECOND_LEVEL.has(parts[parts.length - 2])) ? 3 : 2;
    return parts.slice(-take).join(".");
  };

  const tldOf = (hostname) => hostname.toLowerCase().split(".").pop();

  // Pure detection: returns { score, reasons } for a message container.
  function analyzeMessage(container) {
    const reasons = [];
    const matchedDomains = new Set();
    let score = 0;
    const text = (container.innerText || "").toLowerCase();

    // Never flag a message that is itself warning people about phishing — security
    // advisories, this project's own bulletins, and forwarded warnings quote all the
    // same indicators and would otherwise score as attacks.
    if (PG_RULES.advisoryRe.test(text)) return { score: 0, reasons: [], domains: [] };

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

    // Australian government service impersonation (PRODA/HPOS/myGov/Medicare):
    // official-sounding account action whose action link does NOT go to a .gov.au host.
    // Only suspicious when the message contains NO genuine .gov.au link at all —
    // a real Services Australia notice, or a newsletter that merely discusses PRODA
    // alongside a .gov.au reference, must never be penalised. And only the ACTION
    // link counts; footer, social and unsubscribe links are irrelevant.
    const hitGov = PG_RULES.govPhrases.some((p) => text.includes(p));
    const hasGovLink = links.some(({ url }) => PG_RULES.govDomainsRe.test(url.hostname));
    if (hitGov && !hasGovLink) {
      score += 20;
      reasons.push("Uses Services Australia / PRODA sign-in wording");
      for (const { url, text: linkText } of links) {
        const isAction = PG_RULES.actionWordsRe.test(linkText) || /gov\.au/i.test(linkText);
        if (isAction && !PG_RULES.govDomainsRe.test(url.hostname)) {
          score += 40;
          reasons.push(`Asks you to sign in to a government service, but the button goes to ${url.hostname}, not a .gov.au site`);
          matchedDomains.add(registrableDomain(url.hostname));
          break;
        }
      }
    }

    // Display-text mismatch: anchor text that LOOKS like a web address, but the
    // real destination is a different site (e.g. text "servicesaustralia.gov.au"
    // linking to verifications.es). Strong, lure-independent signal.
    for (const { url, text: linkText } of links) {
      const trimmed = linkText.trim();
      const m = trimmed.match(/\b([a-z0-9][a-z0-9-]*(?:\.[a-z0-9-]+)+)\b/i);
      if (!m || /\s/.test(m[1])) continue;
      // "Perio Referral - J Smith.pdf" is a filename, not a claimed web address.
      if (PG_RULES.fileExtRe.test(m[1])) continue;
      // Only treat it as a claimed address if the anchor is essentially just that
      // address — prose that happens to contain a dotted token doesn't count.
      const looksLikeAddress = trimmed.toLowerCase() === m[1].toLowerCase() || /^(https?:\/\/|www\.)/i.test(trimmed);
      if (!looksLikeAddress) continue;
      const shown = registrableDomain(m[1].toLowerCase());
      const real = registrableDomain(url.hostname);
      if (shown !== real && /\.[a-z]{2,}$/.test(m[1])) {
        score += 25;
        reasons.push(`Link text shows "${m[1]}" but actually goes to ${url.hostname}`);
        matchedDomains.add(real);
        break;
      }
    }

    // Brand word in text/link-label but link points to a non-matching domain.
    for (const [brand, okDomains] of Object.entries(PG_RULES.brandDomains)) {
      if (!text.includes(brand)) continue;
      for (const { url } of links) {
        const dom = registrableDomain(url.hostname);
        const hostMatches = (d) => url.hostname === d || url.hostname.endsWith("." + d);
        // A recognised sharing service or security gateway (Mimecast, Safe Links)
        // is a legitimate destination for any share brand — gateways rewrite links.
        const legit = okDomains.some((d) => hostMatches(d) || dom === d) ||
                      PG_RULES.knownShareHosts.some(hostMatches);
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
    // The message BODY is attacker-controlled HTML: never read the sender from
    // inside it, or a crafted email can name any practice it likes. Only look at
    // the mail client's own chrome outside the body element.
    const clean = (s) => (s || "").replace(/[\r\n\t]+/g, " ").trim().slice(0, 80);
    const outside = (el) => el && !container.contains(el);

    // Gmail: the message block (div.gs) holds a .gD span with email/name attributes.
    const gmailWrap = container.closest("div.gs");
    const gd = gmailWrap && gmailWrap.querySelector("span.gD[email]");
    if (outside(gd)) {
      return { email: (gd.getAttribute("email") || "").toLowerCase(), name: clean(gd.getAttribute("name") || gd.textContent) };
    }
    // Outlook web: walk up from the body's PARENT looking at client chrome only.
    let node = container.parentElement;
    for (let i = 0; node && i < 8; i++, node = node.parentElement) {
      for (const el of node.querySelectorAll?.("[title*='@'], [aria-label*='@']") || []) {
        if (!outside(el)) continue;
        const m = ((el.getAttribute("title") || "") + " " + (el.getAttribute("aria-label") || "")).match(/[\w.+-]+@[\w.-]+\.\w+/);
        if (m) return { email: m[0].toLowerCase(), name: clean(el.textContent.split("\n")[0]) };
      }
    }
    return null; // unknown sender is better than a guessed one
  }

  // Keep a local list of clinics whose accounts sent flagged mail (chrome.storage
  // is absent in the test harness — no-op there). The local list stays in this
  // browser; separately, if central reporting is enabled in the popup, the sender
  // address and matched domains (never message content) are submitted upstream.
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

  const THRESHOLD = 40;         // show the warning banner
  const REPORT_THRESHOLD = 100; // record the sender / submit a detection report

  function scan() {
    for (const container of document.querySelectorAll(MESSAGE_SELECTORS)) {
      if (container.dataset.pgScanned) continue;
      container.dataset.pgScanned = "1";
      const result = analyzeMessage(container);
      if (result.score >= THRESHOLD) {
        injectBanner(container, result);
        // Warn the reader at the low threshold, but only record/report a sender at
        // high confidence (a known attack domain, or several independent signals).
        // Naming an innocent practice as "compromised" is the costlier error.
        if (result.score >= REPORT_THRESHOLD) recordAffectedClinic(findSender(container), result);
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
