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
    vodafoneTitle: "Vodafone Cash",
    mapsTitle: "10 Messaha Sq., in front of Safir Hotel, Dokki",
    mapsSub: "Open in Google Maps",
    hoursLabel: "Hours",
    hoursValue: "8:00AM – 2:00AM",
    cityLabel: "Location",
    cityValue: "Giza, Egypt",
    footer: "Sherif Pharmacy · Always here for you",
    toastCopied: "Number copied — opening app…",
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
    vodafoneTitle: "فودافون كاش",
    mapsTitle: "١٠ ميدان المساحة، امام فندق سفير، الدقي",
    mapsSub: "افتح في خرائط جوجل",
    hoursLabel: "المواعيد",
    hoursValue: "٨:٠٠ ص – ٢:٠٠ ص",
    cityLabel: "الموقع",
    cityValue: "الجيزة، مصر",
    footer: "صيدلية شريف · دائماً في خدمتك",
    toastCopied: "تم نسخ الرقم — جاري فتح التطبيق…",
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

function openAppOrStore({ androidIntent, iosScheme, storeUrl }) {
  const isAndroid = /Android/i.test(navigator.userAgent);
  const isIOS = /iPhone|iPad|iPod/i.test(navigator.userAgent);
  const started = Date.now();

  if (isAndroid && androidIntent) {
    window.location.href = androidIntent;
    setTimeout(() => {
      if (Date.now() - started < 1600) window.open(storeUrl, "_blank");
    }, 1200);
    return;
  }

  if (isIOS && iosScheme) {
    window.location.href = iosScheme;
    setTimeout(() => {
      if (Date.now() - started < 1600) window.open(storeUrl, "_blank");
    }, 1200);
    return;
  }

  window.open(storeUrl, "_blank");
}

function initPayButtons() {
  const instapayBtn = document.getElementById("instapayBtn");
  const vodafoneBtn = document.getElementById("vodafoneBtn");

  async function handlePay(btn, config) {
    const phone = btn.dataset.phone || "+201000006270";
    const local = phone.replace(/^\+20/, "0");
    await copyText(local);
    showToast(translations[currentLang()].toastCopied);
    openAppOrStore(config);
  }

  if (instapayBtn) {
    instapayBtn.addEventListener("click", () =>
      handlePay(instapayBtn, {
        androidIntent:
          "intent://#Intent;package=com.egyptianbanks.instapay;scheme=https;S.browser_fallback_url=https%3A%2F%2Fplay.google.com%2Fstore%2Fapps%2Fdetails%3Fid%3Dcom.egyptianbanks.instapay;end",
        iosScheme: "instapay://",
        storeUrl:
          "https://apps.apple.com/eg/app/instapay-egypt/id6443915040",
      })
    );
  }

  if (vodafoneBtn) {
    vodafoneBtn.addEventListener("click", () =>
      handlePay(vodafoneBtn, {
        androidIntent:
          "intent://#Intent;package=com.emeint.android.myservices;scheme=https;S.browser_fallback_url=https%3A%2F%2Fplay.google.com%2Fstore%2Fapps%2Fdetails%3Fid%3Dcom.emeint.android.myservices;end",
        iosScheme: "anavodafone://",
        storeUrl: "https://apps.apple.com/eg/app/ana-vodafone/id1062531920",
      })
    );
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
initPayButtons();
