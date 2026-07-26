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
    discountsTitle: "Discounts",
    discountA: "Get 2.5% off when buying products worth of 5,000 EGP or higher",
    discountB: "Get 5% off when buying products worth of 10,000 EGP or higher",
    hoursLabel: "Hours",
    hoursValue: "8:00AM – 2:00AM",
    cityLabel: "Location",
    cityValue: "Giza, Egypt",
    footer: "Sherif Pharmacy · Always here for you",
    toastCopied: "Vodafone Cash number copied",
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
    discountsTitle: "الخصومات",
    discountA: "خصم ٢٫٥٪ عند شراء منتجات بقيمة ٥٬٠٠٠ جنيه أو أكثر",
    discountB: "خصم ٥٪ عند شراء منتجات بقيمة ١٠٬٠٠٠ جنيه أو أكثر",
    hoursLabel: "المواعيد",
    hoursValue: "٨:٠٠ ص – ٢:٠٠ ص",
    cityLabel: "الموقع",
    cityValue: "الجيزة، مصر",
    footer: "صيدلية شريف · دائماً في خدمتك",
    toastCopied: "تم نسخ رقم فودافون كاش",
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
