import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from 'react';
import { ja, type Dict } from './ja';
import { en } from './en';

export type Lang = 'ja' | 'en';

const DICTS: Record<Lang, Dict> = { ja, en };
const STORAGE_KEY = 'align-lang';

// 予約ミニアプリ(/booking)ではページのタイトルを書き換えない
const isBookingPage = () => window.location.pathname.startsWith('/booking');

const asLang = (v: string | null | undefined): Lang | null => (v === 'ja' || v === 'en' ? v : null);

/** ユーザーが切替ボタンで選んだ言語 */
function readSaved(): Lang | null {
  try {
    return asLang(localStorage.getItem(STORAGE_KEY));
  } catch {
    // ストレージ不可の環境では保存値なし
    return null;
  }
}

/** URL の ?lang= (LINEのボットが、お客様のLINEの言語に合わせて付ける) */
function readParam(): Lang | null {
  try {
    return asLang(new URLSearchParams(window.location.search).get('lang'));
  } catch {
    return null;
  }
}

/** 切替ボタンの選択 → URLの指定 → ブラウザの言語 の順で決める */
function detectLang(): Lang {
  const chosen = readSaved() ?? readParam();
  if (chosen) return chosen;
  return navigator.language?.toLowerCase().startsWith('en') ? 'en' : 'ja';
}

interface LanguageValue {
  lang: Lang;
  /** 切替ボタンなど、ユーザーが明示的に選んだとき。選択は保存される */
  setLang: (lang: Lang) => void;
  /** LIFFが返すLINEアプリの言語など。ユーザーの選択やURL指定がないときだけ反映する */
  suggestLang: (lang: Lang) => void;
  t: Dict;
}

const LanguageContext = createContext<LanguageValue>({ lang: 'ja', setLang: () => {}, suggestLang: () => {}, t: ja });

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(detectLang);
  const explicit = useRef(readSaved() !== null || readParam() !== null);

  const setLang = (next: Lang) => {
    explicit.current = true;
    setLangState(next);
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // 保存できなくても表示切替は行う
    }
  };

  const suggestLang = (next: Lang) => {
    if (!explicit.current) setLangState(next);
  };

  useEffect(() => {
    document.documentElement.lang = DICTS[lang].htmlLang;
    if (!isBookingPage()) document.title = DICTS[lang].docTitle;
  }, [lang]);

  return (
    <LanguageContext.Provider value={{ lang, setLang, suggestLang, t: DICTS[lang] }}>
      {children}
    </LanguageContext.Provider>
  );
}

export const useLang = () => useContext(LanguageContext);
