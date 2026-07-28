const translations = {
  en: {
    langSwitch: "العربية",
    eyebrow: "8:00AM – 2:00AM · Giza, Egypt",
    brand: "Sherif Pharmacy",
    lead: "Call, WhatsApp, pay via InstaPay or Vodafone Cash, or get directions — all in one tap.",
    callTitle: "Call pharmacy",
    waTitle: "WhatsApp",
    waSub: "Chat with the pharmacy",
    instapayTitle: "InstaPay",
    instapaySub: "Open InstaPay",
    vodafoneTitle: "Vodafone Cash",
    mapsTitle: "10 Messaha Sq., in front of Safir Hotel, Dokki",
    mapsSub: "Open in Google Maps",
    discountsTitle: "Discount Program",
    discountA: "2.5% off on purchases of 5,000 EGP or more",
    discountB: "5% off on purchases of 10,000 EGP or more",
    hoursLabel: "Hours",
    hoursValue: "8:00AM – 2:00AM",
    cityLabel: "Location",
    cityValue: "Giza, Egypt",
    footer: "Sherif Pharmacy · Always here for you",
    toastCopied: "Vodafone Cash number copied",
    shortcutTitle: "Add Sherif Pharmacy to your home screen?",
    shortcutBody:
      "Create a shortcut for faster access to call, WhatsApp, and payments.",
    shortcutAdd: "Add shortcut",
    shortcutSkip: "Not now",
    shortcutTop: "Shortcut",
    shortcutIosHint:
      "Tap Share, then “Add to Home Screen”, then Add.",
    shortcutDesktopHint:
      "Use your browser menu → Install app / Add to Home screen.",
    shortcutDone: "Shortcut ready",
  },
  ar: {
    langSwitch: "English",
    eyebrow: "٨:٠٠ ص – ٢:٠٠ ص · الجيزة، مصر",
    brand: "صيدلية شريف",
    lead: "اتصل، راسلنا على واتساب، ادفع عبر إنستاباي أو فودافون كاش، أو احصل على الاتجاهات — بضغطة واحدة.",
    callTitle: "اتصل بالصيدلية",
    waTitle: "واتساب",
    waSub: "راسل الصيدلية",
    instapayTitle: "إنستاباي",
    instapaySub: "افتح إنستاباي",
    vodafoneTitle: "فودافون كاش",
    mapsTitle: "١٠ ميدان المساحة، امام فندق سفير، الدقي",
    mapsSub: "افتح في خرائط جوجل",
    discountsTitle: "برنامج الخصومات",
    discountA: "خصم ٢٫٥٪ على مشتريات بقيمة ٥٬٠٠٠ جنيه أو أكثر",
    discountB: "خصم ٥٪ على مشتريات بقيمة ١٠٬٠٠٠ جنيه أو أكثر",
    hoursLabel: "المواعيد",
    hoursValue: "٨:٠٠ ص – ٢:٠٠ ص",
    cityLabel: "الموقع",
    cityValue: "الجيزة، مصر",
    footer: "صيدلية شريف · دائماً في خدمتك",
    toastCopied: "تم نسخ رقم فودافون كاش",
    shortcutTitle: "إضافة صيدلية شريف إلى الشاشة الرئيسية؟",
    shortcutBody:
      "أنشئ اختصاراً للوصول السريع للاتصال وواتساب والدفع.",
    shortcutAdd: "إضافة اختصار",
    shortcutSkip: "ليس الآن",
    shortcutTop: "حفظ",
    shortcutIosHint:
      "اضغط مشاركة، ثم «إضافة إلى الشاشة الرئيسية»، ثم إضافة.",
    shortcutDesktopHint:
      "من قائمة المتصفح اختر تثبيت التطبيق / إضافة إلى الشاشة الرئيسية.",
    shortcutDone: "تم تجهيز الاختصار",
  },
};

function currentLang() {
  return document.documentElement.lang === "ar" ? "ar" : "en";
}

function applyLanguage(lang) {
  const dict = translations[lang];
  const html = document.documentElement;

  html.lang = lang;
  html.dir = lang === "ar" ? "rtl" : "ltr";

  document.querySelectorAll("[data-i18n]").forEach((el) => {
    const key = el.getAttribute("data-i18n");
    if (dict[key]) el.textContent = dict[key];
  });

  localStorage.setItem("sherif-lang", lang);
}

function showToast(message) {
  const toast = document.getElementById("toast");
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(showToast._timer);
  showToast._timer = setTimeout(() => toast.classList.remove("show"), 2200);
}

async function copyText(text) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    const input = document.createElement("input");
    input.value = text;
    document.body.appendChild(input);
    input.select();
    const ok = document.execCommand("copy");
    input.remove();
    return ok;
  }
}

function initVodafoneCopy() {
  const vodafoneBtn = document.getElementById("vodafoneBtn");
  if (!vodafoneBtn) return;

  vodafoneBtn.addEventListener("click", async () => {
    const phone = vodafoneBtn.dataset.phone || "+201000006270";
    const local = phone.replace(/^\+20/, "0");
    const ok = await copyText(local);
    showToast(
      ok
        ? translations[currentLang()].toastCopied
        : translations[currentLang()].toastCopied
    );
  });
}

function initDiscountAccordion() {
  const accordion = document.getElementById("discountAccordion");
  const toggle = document.getElementById("discountToggle");
  const panel = document.getElementById("discountPanel");
  if (!accordion || !toggle || !panel) return;

  toggle.addEventListener("click", () => {
    const open = accordion.classList.toggle("is-open");
    toggle.setAttribute("aria-expanded", String(open));
    panel.setAttribute("aria-hidden", String(!open));
  });
}

const SHORTCUT_KEY = "sherif-shortcut-prompt";

function isIos() {
  return /iPhone|iPad|iPod/i.test(navigator.userAgent);
}

function isStandalone() {
  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    window.navigator.standalone === true
  );
}

function initShortcutPrompt() {
  const overlay = document.getElementById("shortcutOverlay");
  const addBtn = document.getElementById("shortcutAdd");
  const skipBtn = document.getElementById("shortcutSkip");
  const hint = document.getElementById("shortcutHint");
  const topBtn = document.getElementById("shortcutTopBtn");
  if (!overlay || !addBtn || !skipBtn) return;

  let deferredPrompt = null;

  if (isStandalone()) {
    if (topBtn) topBtn.hidden = true;
    return;
  }

  window.addEventListener("beforeinstallprompt", (event) => {
    event.preventDefault();
    deferredPrompt = event;
  });

  window.addEventListener("appinstalled", () => {
    deferredPrompt = null;
    if (topBtn) topBtn.hidden = true;
    localStorage.setItem(SHORTCUT_KEY, "1");
  });

  function closePrompt(remember) {
    overlay.classList.remove("is-visible");
    window.setTimeout(() => overlay.setAttribute("hidden", ""), 280);
    if (remember) localStorage.setItem(SHORTCUT_KEY, "1");
  }

  function openPrompt() {
    if (hint) {
      hint.hidden = true;
      hint.textContent = "";
    }
    overlay.removeAttribute("hidden");
    requestAnimationFrame(() => overlay.classList.add("is-visible"));
  }

  async function handleAddShortcut() {
    const t = translations[currentLang()];

    if (deferredPrompt) {
      deferredPrompt.prompt();
      const choice = await deferredPrompt.userChoice;
      deferredPrompt = null;
      if (choice.outcome === "accepted") {
        showToast(t.shortcutDone);
        if (topBtn) topBtn.hidden = true;
      }
      closePrompt(true);
      return;
    }

    if (hint) {
      hint.hidden = false;
      hint.textContent = isIos() ? t.shortcutIosHint : t.shortcutDesktopHint;
    }
  }

  addBtn.addEventListener("click", handleAddShortcut);
  skipBtn.addEventListener("click", () => closePrompt(true));

  if (topBtn) {
    topBtn.addEventListener("click", openPrompt);
  }

  overlay.addEventListener("click", (event) => {
    if (event.target === overlay) closePrompt(true);
  });

  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("./sw.js").catch(() => {});
  }

  if (!localStorage.getItem(SHORTCUT_KEY)) {
    window.setTimeout(openPrompt, 700);
  }
}

function initLanguage() {
  const saved = localStorage.getItem("sherif-lang");
  const preferred =
    saved ||
    (navigator.language && navigator.language.startsWith("ar") ? "ar" : "en");
  applyLanguage(preferred);

  const toggle = document.getElementById("langToggle");
  if (!toggle) return;

  toggle.addEventListener("click", () => {
    const next = document.documentElement.lang === "ar" ? "en" : "ar";
    applyLanguage(next);
  });
}

initLanguage();
initVodafoneCopy();
initDiscountAccordion();
initShortcutPrompt();
