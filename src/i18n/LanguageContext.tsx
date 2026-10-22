import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { ja, type Dict } from './ja';
import { en } from './en';

export type Lang = 'ja' | 'en';

const DICTS: Record<Lang, Dict> = { ja, en };
const STORAGE_KEY = 'align-lang';

// 予約ミニアプリ(/booking)は日本語固定
const isBookingPage = () => window.location.pathname.startsWith('/booking');

function detectLang(): Lang {
  if (isBookingPage()) return 'ja';
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved === 'ja' || saved === 'en') return saved;
  } catch {
    // ストレージ不可の環境ではブラウザ言語で判定
  }
  return navigator.language?.toLowerCase().startsWith('en') ? 'en' : 'ja';
}

interface LanguageValue {
  lang: Lang;
  setLang: (lang: Lang) => void;
  t: Dict;
}

const LanguageContext = createContext<LanguageValue>({ lang: 'ja', setLang: () => {}, t: ja });

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(detectLang);

  const setLang = (next: Lang) => {
    setLangState(next);
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // 保存できなくても表示切替は行う
    }
  };

  useEffect(() => {
    if (isBookingPage()) return;
    document.documentElement.lang = DICTS[lang].htmlLang;
    document.title = DICTS[lang].docTitle;
  }, [lang]);

  return (
    <LanguageContext.Provider value={{ lang, setLang, t: DICTS[lang] }}>
      {children}
    </LanguageContext.Provider>
  );
}

export const useLang = () => useContext(LanguageContext);
