﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿/* ============================================================
   CPE Trade Pro — Landing site scripts
   ============================================================ */

/* ------------------------------------------------------------
   Public download bundle. Android is v6.3.2 (minSdk 21 so it
   installs on Android 5+/J2, ES2015-transpiled web layer, and a
   parallel scan fetch that is ~4x faster). Desktop / iOS stay 6.3.0.
   ------------------------------------------------------------ */
const DOWNLOADS = {
  windows:  "https://github.com/Anurasiri123/cpe-trade-pro-website/releases/download/v6.3.0/CPE-Trade-Pro-Setup-6.3.0.exe",
  macX64:   "https://github.com/Anurasiri123/cpe-trade-pro-website/releases/download/v6.3.0/CPE-Trade-Pro-6.3.0-x64.dmg",
  macArm:   "https://github.com/Anurasiri123/cpe-trade-pro-website/releases/download/v6.3.0/CPE-Trade-Pro-6.3.0-arm64.dmg",
  android:  "https://github.com/Anurasiri123/cpe-trade-pro-website/releases/download/v6.3.2/CPE-Trade-Pro-6.3.2.apk",
  ios:      "https://github.com/Anurasiri123/cpe-trade-pro-website/releases/download/v6.3.0/CPE-Trade-Pro-6.3.0-unsigned.ipa"
};

/* ------------------------------------------------------------
   Testimonials — add REAL customer quotes only.
   Each item: { quote, name, role, avatar }
   Leave the list empty and the section stays hidden.
   ------------------------------------------------------------ */
const TESTIMONIALS = [
  // { quote: "…", name: "Real Name", role: "Crypto trader", avatar: "" }
];

/* ------------------------------------------------------------
   Apply download URLs to the cards
   ------------------------------------------------------------ */
function setDownloads(){
  document.querySelectorAll("[data-dl]").forEach(el => {
    const url = DOWNLOADS[el.dataset.dl];
    if(!url) return;
    el.href = url;
    el.setAttribute("download","");
  });
}

/* ------------------------------------------------------------
   Detect visitor OS & highlight the matching download card
   ------------------------------------------------------------ */
function detectOS(){
  const ua = navigator.userAgent || "";
  const p  = navigator.platform || "";
  let os = "windows", label = "Windows";
  if(/Mac|iPad|iPhone|iPod/i.test(ua) || /Mac/i.test(p)){
    os = "mac";
    // Apple Silicon vs Intel
    if(/Mac OS X 10_1[5-9]|Mac OS X 1[1-9]/i.test(ua) && /Apple/i.test(ua)){
      os = "macarm";
    }
    label = "macOS";
  } else if(/Android/i.test(ua)){
    os = "android"; label = "Android";
  } else if(/Win/i.test(ua) || /Win/i.test(p)){
    os = "windows"; label = "Windows";
  }
  // hero button now opens the modal with all platforms,
  // but we still show the detected OS as a hint in the sub-label
  const nameEl = document.getElementById("heroOsName");
  if(nameEl) nameEl.textContent = label;

  // highlight the matching card in the Download section
  const targets = {
    windows: "dlWin",
    mac:     "dlMacX64",
    macarm:  "dlMacArm",
    android: "dlAnd"
  };
  const cardId = targets[os];
  if(cardId){
    const card = document.getElementById(cardId);
    if(card) card.classList.add("recommended");
  }
}

/* ------------------------------------------------------------
   Mobile nav toggle
   ------------------------------------------------------------ */
function initNav(){
  const toggle = document.getElementById("navToggle");
  const links  = document.getElementById("navLinks");
  if(!toggle || !links) return;
  toggle.addEventListener("click", () => links.classList.toggle("open"));
  links.querySelectorAll("a").forEach(a =>
    a.addEventListener("click", () => links.classList.remove("open"))
  );
}

/* ------------------------------------------------------------
   Screenshot lightbox
   ------------------------------------------------------------ */
function initLightbox(){
  const lb   = document.getElementById("lightbox");
  const img  = document.getElementById("lbImg");
  const cap  = document.getElementById("lbCap");
  const close= document.getElementById("lbClose");
  if(!lb) return;
  document.querySelectorAll(".slide").forEach(s => {
    s.addEventListener("click", () => {
      img.src = s.dataset.img;
      img.alt = s.querySelector("img")?.alt || "";
      cap.textContent = s.dataset.cap || "";
      lb.classList.add("open");
    });
  });
  const hide = () => lb.classList.remove("open");
  close.addEventListener("click", hide);
  lb.addEventListener("click", e => { if(e.target === lb) hide(); });
  document.addEventListener("keydown", e => { if(e.key === "Escape") hide(); });
}

/* ------------------------------------------------------------
   Screenshot slider — slow auto-rotate (5s), fade transition
   ------------------------------------------------------------ */
function initSlider(){
  const slider = document.getElementById("shotSlider");
  if(!slider) return;
  const slides = slider.querySelectorAll(".slide");
  const dots   = slider.querySelectorAll(".dot");
  const prev   = slider.querySelector(".prev");
  const next   = slider.querySelector(".next");
  if(!slides.length) return;

  let cur = 0;
  let timer = null;
  const INTERVAL = 5000; // 5 seconds per slide

  function go(i){
    slides[cur].classList.remove("active");
    dots[cur]?.classList.remove("active");
    cur = (i + slides.length) % slides.length;
    slides[cur].classList.add("active");
    dots[cur]?.classList.add("active");
  }
  function start(){ stop(); timer = setInterval(() => go(cur + 1), INTERVAL); }
  function stop(){ if(timer){ clearInterval(timer); timer = null; } }

  prev?.addEventListener("click", () => { go(cur - 1); start(); });
  next?.addEventListener("click", () => { go(cur + 1); start(); });
  dots.forEach(d => d.addEventListener("click", () => {
    go(parseInt(d.dataset.i, 10)); start();
  }));

  // pause on hover
  slider.addEventListener("mouseenter", stop);
  slider.addEventListener("mouseleave", start);

  // keyboard arrows when slider in view
  document.addEventListener("keydown", e => {
    if(!slider.matches(":hover")) return;
    if(e.key === "ArrowLeft"){ go(cur - 1); start(); }
    if(e.key === "ArrowRight"){ go(cur + 1); start(); }
  });

  start();
}

/* ------------------------------------------------------------
   FAQ: only one open at a time
   ------------------------------------------------------------ */
function initFAQ(){
  const items = document.querySelectorAll(".faq-item");
  items.forEach(it => it.addEventListener("toggle", () => {
    if(it.open) items.forEach(o => { if(o !== it) o.open = false; });
  }));
}

/* ------------------------------------------------------------
   Year in footer
   ------------------------------------------------------------ */
function setYear(){
  const y = document.getElementById("year");
  if(y) y.textContent = new Date().getFullYear();
}

/* ------------------------------------------------------------
   Reveal-on-scroll animation
   ------------------------------------------------------------ */
function initReveal(){
  const els = document.querySelectorAll(".card, .market-card, .price-card, .dl-card, .faq-item");
  const io = new IntersectionObserver(entries => {
    entries.forEach(en => {
      if(en.isIntersecting){
        en.target.style.opacity = 1;
        en.target.style.transform = "translateY(0)";
        io.unobserve(en.target);
      }
    });
  }, { threshold: 0.08 });
  els.forEach(el => {
    el.style.opacity = 0;
    el.style.transform = "translateY(14px)";
    el.style.transition = "opacity .35s ease, transform .35s ease";
    io.observe(el);
  });
}

/* ------------------------------------------------------------
   Download modal — opens on any "Download" button
   ------------------------------------------------------------ */
function initModal(){
  const modal = document.getElementById("dlModal");
  if(!modal) return;
  // map modal cards to download URLs
  const mdlMap = {
    mdlWin: DOWNLOADS.windows,
    mdlMacX64: DOWNLOADS.macX64,
    mdlMacArm: DOWNLOADS.macArm,
    mdlAnd: DOWNLOADS.android,
    mdlIos: DOWNLOADS.ios
  };
  for(const id in mdlMap){
    const el = document.getElementById(id);
    if(!el) continue;
    el.href = mdlMap[id];
    el.setAttribute("download","");
    // warn if URL not set
    if(mdlMap[id].indexOf("releases/download/") === -1){
      el.addEventListener("click", function(e){
        e.preventDefault();
        alert("Download link not set yet. Please upload the installer to a GitHub Release first.");
      });
    }
  }
  // open triggers
  document.querySelectorAll(".dl-trigger").forEach(btn => {
    btn.addEventListener("click", e => {
      // if it's a normal download link in the download section, don't hijack
      if(btn.closest("#download")) return;
      e.preventDefault();
      modal.classList.add("open");
    });
  });
  // close
  modal.querySelectorAll("[data-close]").forEach(el =>
    el.addEventListener("click", () => modal.classList.remove("open"))
  );
  document.addEventListener("keydown", e => { if(e.key === "Escape") modal.classList.remove("open"); });
}

/* ------------------------------------------------------------
   Animated counters in hero stats
   ------------------------------------------------------------ */
function initCounters(){
  const nums = document.querySelectorAll(".stat-num[data-count]");
  const io = new IntersectionObserver(entries => {
    entries.forEach(en => {
      if(!en.isIntersecting) return;
      const el = en.target;
      const target = parseInt(el.dataset.count, 10) || 0;
      let cur = 0;
      const step = Math.max(1, Math.ceil(target / 40));
      const t = setInterval(() => {
        cur += step;
        if(cur >= target){ cur = target; clearInterval(t); }
        el.textContent = cur;
      }, 30);
      io.unobserve(el);
    });
  }, { threshold: 0.5 });
  nums.forEach(n => io.observe(n));
}

/* ------------------------------------------------------------
   $10 paper-trade example — mirrors the app's signal-history fee model
   ------------------------------------------------------------ */
function initPaperCalculator(){
  const form = document.getElementById("paperCalc");
  if(!form) return;
  const fields = ["paperSide","paperMarket","paperEntry","paperExit","paperSymbol"]
    .map(id => document.getElementById(id));
  const fees = { SPOT: 0.20, FUTURES: 0.08, FOREX: 0.03 };
  const byId = id => document.getElementById(id);
  const signed = (value, digits, suffix = "") =>
    `${value >= 0 ? "+" : "−"}${Math.abs(value).toFixed(digits)}${suffix}`;

  function calculate(event){
    event?.preventDefault();
    const side = byId("paperSide").value;
    const market = byId("paperMarket").value;
    const entry = Number(byId("paperEntry").value);
    const exit = Number(byId("paperExit").value);
    const error = byId("paperError");
    const result = byId("paperResult");
    if(!(entry > 0) || !(exit > 0) || !Number.isFinite(entry) || !Number.isFinite(exit)){
      error.hidden = false;
      result.hidden = true;
      return;
    }

    error.hidden = true;
    result.hidden = false;
    const direction = side === "SELL" ? -1 : 1;
    const grossPct = direction * ((exit - entry) / entry) * 100;
    const feePct = fees[market] || 0;
    const netPct = grossPct - feePct;
    const stakeUsd = 10;
    const feeUsd = stakeUsd * feePct / 100;
    const pnlUsd = stakeUsd * netPct / 100;
    const symbol = byId("paperSymbol").value.trim().toUpperCase() || "Example";

    byId("paperPnl").textContent = `${pnlUsd >= 0 ? "+" : "−"}$${Math.abs(pnlUsd).toFixed(2)}`;
    byId("paperGross").textContent = signed(grossPct, 2, "%");
    byId("paperFee").textContent = `$${feeUsd.toFixed(3)}`;
    byId("paperNetPct").textContent = signed(netPct, 2, "%");
    const spotShortNote = market === "SPOT" && side === "SELL"
      ? " · Spot is long-only; short math only"
      : "";
    byId("paperResultNote").textContent =
      `${symbol} · ${side} · hypothetical prices · $10 fixed stake${spotShortNote}`;
    result.classList.toggle("is-negative", pnlUsd < 0);
  }

  form.addEventListener("submit", calculate);
  fields.forEach(field => field.addEventListener("input", calculate));
  fields.forEach(field => field.addEventListener("change", calculate));
  calculate();
}

/* ------------------------------------------------------------
   Per-platform install guide popups.
   Each platform shows its own first-launch security warning steps.
   ------------------------------------------------------------ */
const INSTALL_GUIDES = {
  windows: {
    title: "Install on Windows",
    intro: "Run the installer, then allow the security warning that Windows shows for unsigned apps.",
    warn: "You may see “Windows protected your PC” (SmartScreen). Click More info → Run anyway — the installer is simply not code-signed.",
    steps: [
      "Download and run <strong>CPE-Trade-Pro-Setup-6.3.0.exe</strong>.",
      "On the SmartScreen popup click <strong>More info</strong> → <strong>Run anyway</strong>.",
      "Approve the <strong>User Account Control</strong> prompt (<strong>Yes</strong>).",
      "If antivirus blocks it, choose <strong>Allow / Keep</strong> and run the installer again.",
      "Finish the setup and open CPE Trade Pro from the desktop shortcut."
    ],
    file: "CPE-Trade-Pro-Setup-6.3.0.exe"
  },
  macX64: {
    title: "Install on macOS (Intel)",
    intro: "Drag the app into Applications, then open it past Gatekeeper on first launch.",
    warn: "macOS says the app “cannot be opened because the developer cannot be verified”. This is normal for an unsigned build.",
    steps: [
      "Open the downloaded <strong>.dmg</strong>.",
      "Drag <strong>CPE Trade Pro</strong> into the <strong>Applications</strong> folder.",
      "<strong>Right-click (Control-click)</strong> the app → <strong>Open</strong> → <strong>Open</strong> again.",
      "Or use <strong>System Settings → Privacy &amp; Security → Open Anyway</strong>."
    ],
    file: "CPE-Trade-Pro-6.3.0-x64.dmg"
  },
  macArm: {
    title: "Install on macOS (Apple Silicon)",
    intro: "Drag the app into Applications, then open it past Gatekeeper on first launch.",
    warn: "macOS says the app “cannot be opened because the developer cannot be verified”. This is normal for an unsigned build.",
    steps: [
      "Open the downloaded <strong>.dmg</strong>.",
      "Drag <strong>CPE Trade Pro</strong> into the <strong>Applications</strong> folder.",
      "<strong>Right-click (Control-click)</strong> the app → <strong>Open</strong> → <strong>Open</strong> again.",
      "Or use <strong>System Settings → Privacy &amp; Security → Open Anyway</strong>."
    ],
    file: "CPE-Trade-Pro-6.3.0-arm64.dmg"
  },
  android: {
    title: "Install on Android",
    intro: "The APK is installed outside the Play Store, so Android asks you to allow installs from this source.",
    warn: "Android shows an “unknown apps” or Play Protect warning for any APK installed from a browser. Allow this source, then install.",
    steps: [
      "Download the <strong>.apk</strong>. If Chrome warns it may harm your device, tap <strong>Download anyway</strong>.",
      "Open the file and enable <strong>Allow from this source</strong> for your browser or Files app.",
      "If <strong>Play Protect</strong> says the app is unsafe, tap <strong>More details → Install anyway</strong>.",
      "Tap <strong>Install</strong>, then <strong>Open</strong>."
    ],
    file: "CPE-Trade-Pro-6.3.2.apk"
  },
  ios: {
    title: "Install on iPhone / iOS",
    intro: "iPhone installs of an unsigned IPA require Sideloadly and your Apple ID.",
    warn: "A free Apple ID signature expires after 7 days. Re-sign with Sideloadly to keep using the app.",
    steps: [
      "Install <strong>Sideloadly</strong> on a Windows PC or Mac.",
      "Connect your iPhone by USB and tap <strong>Trust</strong> on the phone.",
      "Drag the <strong>.ipa</strong> into Sideloadly, enter your Apple ID and click <strong>Start</strong>.",
      "On the iPhone open <strong>Settings → General → VPN &amp; Device Management</strong> and trust the developer profile.",
      "Re-sign every <strong>7 days</strong> with a free Apple ID."
    ],
    file: "CPE-Trade-Pro-6.3.0-unsigned.ipa"
  }
};

function initInstallGuides(){
  const modal = document.getElementById("guideModal");
  if(!modal) return;
  const titleEl = document.getElementById("guideTitle");
  const introEl = document.getElementById("guideIntro");
  const warnEl  = document.getElementById("guideWarn");
  const stepsEl = document.getElementById("guideSteps");
  const dlEl    = document.getElementById("guideDownload");

  function open(key){
    const g = INSTALL_GUIDES[key];
    if(!g) return;
    titleEl.textContent = g.title;
    introEl.textContent = g.intro;
    warnEl.innerHTML = g.warn;
    warnEl.classList.toggle("show", !!g.warn);
    stepsEl.innerHTML = g.steps.map(s => `<li>${s}</li>`).join("");
    dlEl.href = DOWNLOADS[key] || "#";
    dlEl.textContent = g.file ? `Download ${g.file}` : "Download now";
    modal.classList.add("open");
    modal.setAttribute("aria-hidden","false");
  }
  function close(){
    modal.classList.remove("open");
    modal.setAttribute("aria-hidden","true");
  }

  document.querySelectorAll("[data-guide-open]").forEach(btn =>
    btn.addEventListener("click", () => open(btn.dataset.guideOpen))
  );
  modal.querySelectorAll("[data-guide-close]").forEach(el =>
    el.addEventListener("click", close)
  );
  document.addEventListener("keydown", e => { if(e.key === "Escape") close(); });

  const iosLink = document.getElementById("iosGuideLink");
  if(iosLink){
    iosLink.addEventListener("click", e => { e.preventDefault(); open("ios"); });
  }
}

/* ------------------------------------------------------------
   Testimonials — rendered only from real customer quotes
   ------------------------------------------------------------ */
function initTestimonials(){
  const section = document.getElementById("testimonials");
  const grid = document.getElementById("testimonialGrid");
  if(!section || !grid) return;
  if(!Array.isArray(TESTIMONIALS) || TESTIMONIALS.length === 0) return;

  section.hidden = false;
  grid.innerHTML = TESTIMONIALS.map(t => {
    const name = (t.name || "").trim();
    const initial = name ? name.charAt(0).toUpperCase() : "•";
    const avatar = t.avatar
      ? `<img class="t-avatar" src="${t.avatar}" alt="${name}" loading="lazy" />`
      : `<span class="t-avatar">${initial}</span>`;
    return `<figure class="t-card">${avatar}
      <blockquote>${t.quote || ""}</blockquote>
      <figcaption><strong>${name}</strong><span>${t.role || ""}</span></figcaption>
    </figure>`;
  }).join("");
}

/* ------------------------------------------------------------
   Conversion tracking — pushes events to the GTM / GA4 dataLayer.
   Events: whatsapp_click · email_click · download_click · download_open
   ------------------------------------------------------------ */
function track(event, params){
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push(Object.assign({ event }, params || {}));
}

function initTracking(){
  document.addEventListener("click", (e) => {
    const el = e.target.closest("a, button");
    if(!el) return;
    const href = el.getAttribute("href") || "";
    const text = (el.textContent || "").trim().slice(0, 80);

    if(el.classList.contains("whats-float") || el.classList.contains("btn-whats") || /wa\.me|whatsapp/i.test(href)){
      track("whatsapp_click", { link_text: text, link_url: href || "https://wa.me/94774940944" });
      return;
    }
    if(/^mailto:/i.test(href)){
      track("email_click", { link_text: text, link_url: href });
      return;
    }
    if(el.hasAttribute("data-dl") || el.classList.contains("dl-modal-card")){
      const platform = el.getAttribute("data-dl") || String(el.id || "").replace(/^mdl/, "").toLowerCase() || "unknown";
      track("download_click", { platform, link_url: href });
      return;
    }
    if(el.classList.contains("dl-trigger")){
      track("download_open", { link_text: text });
    }
  }, true);
}

/* ------------------------------------------------------------
   Custom Google Translate switcher.
   Injected just below the sticky header on every page (root
   pages + blog) so the language switcher is easy to find.
   Google's own language list lives inside an iframe, so it can
   NOT be styled/enlarged with CSS — the visible list here is our
   own large dropdown, and picking a language drives Google's
   hidden engine directly.
   ------------------------------------------------------------ */

/* Every language Google Translate offers (code + English name). */
const GT_LANGS = [
  ["af","Afrikaans"],["sq","Albanian"],["am","Amharic"],["ar","Arabic"],["hy","Armenian"],
  ["as","Assamese"],["ay","Aymara"],["az","Azerbaijani"],["bm","Bambara"],["eu","Basque"],
  ["be","Belarusian"],["bn","Bengali"],["bho","Bhojpuri"],["bs","Bosnian"],["bg","Bulgarian"],
  ["ca","Catalan"],["ceb","Cebuano"],["ny","Chichewa"],["zh-CN","Chinese (Simplified)"],
  ["zh-TW","Chinese (Traditional)"],["co","Corsican"],["hr","Croatian"],["cs","Czech"],
  ["da","Danish"],["dv","Dhivehi"],["doi","Dogri"],["nl","Dutch"],["en","English"],
  ["eo","Esperanto"],["et","Estonian"],["ee","Ewe"],["tl","Filipino"],["fi","Finnish"],
  ["fr","French"],["fy","Frisian"],["gl","Galician"],["ka","Georgian"],["de","German"],
  ["el","Greek"],["gn","Guarani"],["gu","Gujarati"],["ht","Haitian Creole"],["ha","Hausa"],
  ["haw","Hawaiian"],["he","Hebrew"],["hi","Hindi"],["hmn","Hmong"],["hu","Hungarian"],
  ["is","Icelandic"],["ig","Igbo"],["ilo","Ilocano"],["id","Indonesian"],["ga","Irish"],
  ["it","Italian"],["ja","Japanese"],["jw","Javanese"],["kn","Kannada"],["kk","Kazakh"],
  ["km","Khmer"],["rw","Kinyarwanda"],["gom","Konkani"],["ko","Korean"],["kri","Krio"],
  ["ku","Kurdish (Kurmanji)"],["ckb","Kurdish (Sorani)"],["ky","Kyrgyz"],["lo","Lao"],
  ["la","Latin"],["lv","Latvian"],["ln","Lingala"],["lt","Lithuanian"],["lg","Luganda"],
  ["lb","Luxembourgish"],["mk","Macedonian"],["mai","Maithili"],["mg","Malagasy"],["ms","Malay"],
  ["ml","Malayalam"],["mt","Maltese"],["mi","Maori"],["mr","Marathi"],
  ["mni-Mtei","Meiteilon (Manipuri)"],["lus","Mizo"],["mn","Mongolian"],["my","Myanmar (Burmese)"],
  ["ne","Nepali"],["no","Norwegian"],["or","Odia (Oriya)"],["om","Oromo"],["ps","Pashto"],
  ["fa","Persian"],["pl","Polish"],["pt","Portuguese"],["pa","Punjabi"],["qu","Quechua"],
  ["ro","Romanian"],["ru","Russian"],["sm","Samoan"],["sa","Sanskrit"],["gd","Scots Gaelic"],
  ["nso","Sepedi"],["sr","Serbian"],["st","Sesotho"],["sn","Shona"],["sd","Sindhi"],
  ["si","Sinhala"],["sk","Slovak"],["sl","Slovenian"],["so","Somali"],["es","Spanish"],
  ["su","Sundanese"],["sw","Swahili"],["sv","Swedish"],["tg","Tajik"],["ta","Tamil"],
  ["tt","Tatar"],["te","Telugu"],["th","Thai"],["ti","Tigrinya"],["ts","Tsonga"],
  ["tr","Turkish"],["tk","Turkmen"],["ak","Twi"],["uk","Ukrainian"],["ur","Urdu"],
  ["ug","Uyghur"],["uz","Uzbek"],["vi","Vietnamese"],["cy","Welsh"],["xh","Xhosa"],
  ["yi","Yiddish"],["yo","Yoruba"],["zu","Zulu"]
];

function googleTranslateElementInit(){
  if(!(window.google && google.translate && google.translate.TranslateElement)) return;
  new google.translate.TranslateElement({
    pageLanguage: "en",
    layout: google.translate.TranslateElement.InlineLayout.SIMPLE,
    autoDisplay: false
  }, "google_translate_element");
}

/* Language Google is currently applying (from the googtrans cookie). */
function currentLangCode(){
  const m = document.cookie.match(/(?:^|;\s*)googtrans=\/en\/([^;]+)/);
  return m ? decodeURIComponent(m[1]) : "";
}

/* Persist the choice so it survives navigation between pages. */
function writeGoogTrans(code){
  const host = location.hostname;
  const suffixes = ["", "; domain=" + host, "; domain=." + host];
  suffixes.forEach(function(s){
    document.cookie = "googtrans=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/" + s;
  });
  if(code && code !== "en"){
    suffixes.forEach(function(s){
      document.cookie = "googtrans=/en/" + code + "; path=/" + s;
    });
  }
}

function gtLangName(code){
  for(let i = 0; i < GT_LANGS.length; i++){ if(GT_LANGS[i][0] === code) return GT_LANGS[i][1]; }
  return code;
}

/* Reflect the active language on the trigger + highlight the row. */
function updateLangTrigger(code){
  const label = document.querySelector("#langTrigger .lang-label");
  if(label) label.textContent = (code && code !== "en") ? gtLangName(code) : "Read in your language";
  document.querySelectorAll(".lang-item").forEach(function(b){
    b.classList.toggle("active", b.getAttribute("data-code") === code);
  });
}

function setPrefLang(code){ try { localStorage.setItem("cpe_lang_pref", code || "en"); } catch(e){} }

/* Switch language without reloading the page. A reload before Google's
   hidden select exists can loop on mobile browsers where the widget is
   delayed or blocked. The cookie covers Google initialising after a choice. */
function applyLang(code){
  setPrefLang(code || "en");
  writeGoogTrans(code);
  let tries = 0;
  const tick = setInterval(function(){
    const combo = document.querySelector(".goog-te-combo");
    if(combo){
      clearInterval(tick);
      combo.value = (code && code !== "en") ? code : "";
      combo.dispatchEvent(new Event("change"));
      updateLangTrigger(code);
    } else if(++tries > 40){
      clearInterval(tick);
    }
  }, 500);
}

function bindLangSwitcher(){
  const trigger = document.getElementById("langTrigger");
  const menu    = document.getElementById("langMenu");
  const search  = document.getElementById("langSearch");
  const list    = document.getElementById("langList");
  if(!trigger || !menu || !list) return;

  function filterList(q){
    const term = q.trim().toLowerCase();
    list.querySelectorAll(".lang-item").forEach(function(btn){
      btn.style.display = (!term || btn.textContent.toLowerCase().indexOf(term) !== -1) ? "" : "none";
    });
  }

  function setOpen(state){
    menu.hidden = !state;
    trigger.setAttribute("aria-expanded", state ? "true" : "false");
    trigger.classList.toggle("open", state);
    if(state){
      if(search){ search.value = ""; filterList(""); }
      setTimeout(function(){ if(search) search.focus(); }, 30);
    }
  }

  trigger.addEventListener("click", function(e){
    e.preventDefault();
    e.stopPropagation();
    setOpen(menu.hidden);
  });
  if(search) search.addEventListener("input", function(){ filterList(search.value); });
  list.addEventListener("click", function(e){
    const btn = e.target.closest(".lang-item");
    if(!btn) return;
    applyLang(btn.getAttribute("data-code"));
    setOpen(false);
  });
  document.addEventListener("click", function(e){
    if(menu.hidden) return;
    if(!menu.contains(e.target) && !trigger.contains(e.target)) setOpen(false);
  });
  document.addEventListener("keydown", function(e){
    if(e.key === "Escape" && !menu.hidden) setOpen(false);
  });
}

function initTranslate(){
  if(document.getElementById("langTrigger")) return;
  const header = document.getElementById("nav");
  if(!header) return;

  // Rolling crypto + forex coins used on both sides of the switcher
  const coins = [
    ["btc","₿"],["eth","Ξ"],["sol","◎"],["bnb","⬡"],
    ["usd","$"],["eur","€"],["gbp","£"],["jpy","¥"]
  ];
  const coinHtml = coins.map(c => '<span class="coin ' + c[0] + '">' + c[1] + '</span>').join("");
  // Duplicated once so the marquee loops seamlessly
  const strip = '<div class="coin-track">' + coinHtml + coinHtml + '</div>';

  const langItems = GT_LANGS.map(function(l){
    return '<button type="button" class="lang-item" role="option" data-code="' + l[0] + '">' +
             '<span class="lang-name">' + l[1] + '</span>' +
             '<span class="lang-code">' + l[0] + '</span>' +
           '</button>';
  }).join("");

  const bar = document.createElement("div");
  bar.className = "lang-bar";
  bar.innerHTML =
    '<div class="container">' +
      '<div class="coin-strip" aria-hidden="true">' + strip + '</div>' +
      '<div class="custom-translate-wrapper">' +
        '<button class="lang-trigger" id="langTrigger" type="button" aria-haspopup="true" aria-expanded="false">' +
          '<span class="translate-icon" aria-hidden="true">🌐</span>' +
          '<span class="lang-label">Read in your language</span>' +
          '<span class="lang-caret" aria-hidden="true">▾</span>' +
        '</button>' +
        '<div class="lang-menu" id="langMenu" role="listbox" aria-label="Choose a language" hidden>' +
          '<div class="lang-search-wrap">' +
            '<input type="search" id="langSearch" class="lang-search" placeholder="Search language…" aria-label="Search language" autocomplete="off" />' +
          '</div>' +
          '<div class="lang-list" id="langList">' + langItems + '</div>' +
        '</div>' +
        '<div id="google_translate_element" class="gt-hidden" aria-hidden="true"></div>' +
      '</div>' +
      '<div class="coin-strip reverse" aria-hidden="true">' + strip + '</div>' +
    '</div>';
  header.insertAdjacentElement("afterend", bar);

  bindLangSwitcher();
  updateLangTrigger(currentLangCode());

  // Load the Google Translate engine only after the page has finished
  // loading, so it never competes with the first paint.
  const loadEngine = () => {
    if(document.getElementById("google-translate-script")) return;
    const s = document.createElement("script");
    s.id = "google-translate-script";
    s.async = true;
    s.src = "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
    document.head.appendChild(s);
  };
  if(document.readyState === "complete") loadEngine();
  else window.addEventListener("load", loadEngine, { once: true });
}

function clearLegacyAutoTranslation(){
  try {
    if(localStorage.getItem("cpe_auto_lang_rollback_v1") === "1") return;
    writeGoogTrans("");
    localStorage.setItem("cpe_auto_lang_rollback_v1", "1");
  } catch(e){}
}
/* ------------------------------------------------------------
   Boot
   ------------------------------------------------------------ */
document.addEventListener("DOMContentLoaded", () => {
  setDownloads();
  detectOS();
  initNav();
  initLightbox();
  initSlider();
  initFAQ();
  initModal();
  initInstallGuides();
  initCounters();
  initTestimonials();
  initPaperCalculator();
  initTracking();
  clearLegacyAutoTranslation();
  initTranslate();
  setYear();
  initReveal();
});
