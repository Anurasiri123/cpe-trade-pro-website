/* ============================================================
   CPE Trade Pro — Landing site scripts
   ============================================================ */

/* ------------------------------------------------------------
   DOWNLOAD LINKS  —  EDIT THESE AFTER YOU UPLOAD THE FILES
   (Upload the 4 installers to a GitHub Release, then paste the
    direct download URLs below. Right now they point to a
    GitHub Release pattern — create the release first.)
   ------------------------------------------------------------ */
const DOWNLOADS = {
  windows:  "https://github.com/Anurasiri123/CPE-Trade-Pro-5.3.0/releases/download/v5.3.0/CPE-Trade-Pro-Setup-5.3.0.exe",
  macX64:   "https://github.com/Anurasiri123/CPE-Trade-Pro-5.3.0/releases/download/v5.3.0/CPE-Trade-Pro-5.3.0-x64.dmg",
  macArm:   "https://github.com/Anurasiri123/CPE-Trade-Pro-5.3.0/releases/download/v5.3.0/CPE-Trade-Pro-5.3.0-arm64.dmg",
  android:  "https://github.com/Anurasiri123/CPE-Trade-Pro-5.3.0/releases/download/v5.3.0/CPE-Trade-Pro-5.3.0.apk",
  ios:      "https://github.com/Anurasiri123/CPE-Trade-Pro-5.3.0/releases/download/v5.3.0/CPETradePro-unsigned.ipa"
};

const IOS_GUIDE_URL = "https://github.com/Anurasiri123/CPE-Trade-Pro-5.3.0/blob/main/CUSTOMER-iOS-Install-Guide.txt";

/* ------------------------------------------------------------
   Apply download URLs to the cards
   ------------------------------------------------------------ */
function setDownloads(){
  const map = {
    dlWin: DOWNLOADS.windows,
    dlMacX64: DOWNLOADS.macX64,
    dlMacArm: DOWNLOADS.macArm,
    dlAnd: DOWNLOADS.android,
    dlIos: DOWNLOADS.ios
  };
  for(const id in map){
    const el = document.getElementById(id);
    if(!el) continue;
    el.href = map[id];
    el.setAttribute("download","");
    // warn if URL still looks like a placeholder pattern (no release yet)
    if(map[id].indexOf("releases/download/") === -1){
      el.addEventListener("click", function(e){
        e.preventDefault();
        alert("Download link not set yet. Please upload the installer to a GitHub Release first.");
      });
    }
  }
  const iosLink = document.getElementById("iosGuideLink");
  if(iosLink) iosLink.href = IOS_GUIDE_URL;
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
  }, { threshold: 0.12 });
  els.forEach(el => {
    el.style.opacity = 0;
    el.style.transform = "translateY(24px)";
    el.style.transition = "opacity .6s ease, transform .6s ease";
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
  const nums = document.querySelectorAll(".stat-num");
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
  initCounters();
  setYear();
  initReveal();
});
