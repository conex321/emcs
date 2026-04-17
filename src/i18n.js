import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from './locales/en.json';
import vi from './locales/vi.json';
import enStorefronts from './locales/en-storefronts.json';
import viStorefronts from './locales/vi-storefronts.json';

const savedLang = localStorage.getItem('i18nextLng') || 'en';

// Deep-merge so nested namespaces (e.g. `cta`) that exist in both files
// don't clobber each other. Spread merge at the top level would drop
// en.cta.title when en-storefronts.cta is spread on top.
function deepMerge(base, extra) {
    const out = { ...base };
    for (const [k, v] of Object.entries(extra || {})) {
        if (v && typeof v === 'object' && !Array.isArray(v) && out[k] && typeof out[k] === 'object' && !Array.isArray(out[k])) {
            out[k] = deepMerge(out[k], v);
        } else {
            out[k] = v;
        }
    }
    return out;
}

i18n
    .use(initReactI18next)
    .init({
        resources: {
            en: { translation: deepMerge(en, enStorefronts) },
            vi: { translation: deepMerge(vi, viStorefronts) }
        },
        lng: savedLang,
        fallbackLng: 'en',
        interpolation: {
            escapeValue: false
        }
    });

i18n.on('languageChanged', (lng) => {
    localStorage.setItem('i18nextLng', lng);
});

export default i18n;
