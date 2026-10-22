import React from 'react';
import { useLang } from '../i18n/LanguageContext';

/** 予約画面のヘッダー右端に置く JA | EN 切替 (緑のヘッダー上で使う) */
export const LangToggle: React.FC = () => {
  const { lang, setLang } = useLang();
  return (
    <div className="lang-toggle lang-toggle--light" role="group" aria-label="Language">
      <button type="button" className={lang === 'ja' ? 'is-active' : ''} onClick={() => setLang('ja')} translate="no">JA</button>
      <button type="button" className={lang === 'en' ? 'is-active' : ''} onClick={() => setLang('en')} translate="no">EN</button>
    </div>
  );
};
