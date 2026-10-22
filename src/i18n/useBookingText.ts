import { useLang } from './LanguageContext';
import { BOOKING_DICTS, localizedGoals, localizedMenuName, localizedMenuNameFromSheet } from './booking';

/** 予約ミニアプリ用: 言語に応じた文言 (tb) と表示名の変換 */
export function useBookingText() {
  const { lang } = useLang();
  const tb = BOOKING_DICTS[lang];
  return {
    lang,
    tb,
    menuName: (id: string | undefined, fallback: string) => localizedMenuName(tb, id, fallback),
    sheetMenuName: (sheetName: string) => localizedMenuNameFromSheet(tb, sheetName),
    goals: (goals: string) => localizedGoals(tb, goals),
  };
}
