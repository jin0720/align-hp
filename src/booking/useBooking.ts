/**
 * useBooking.ts - 予約フローの状態管理カスタムフック
 */

import { useState, useCallback, useEffect } from 'react';
import liff from '@line/liff';
import { useLang } from '../i18n/LanguageContext';
import { useBookingText } from '../i18n/useBookingText';
import type {
  BookingStep,
  BookingSession,
  Menu,
  BookingHistory,
  AvailabilityResponse,
} from './types';

const API_BASE = 'https://align-booking-bot.onrender.com';

const fetchWithTimeout = (url: string, options?: RequestInit, ms = 5000): Promise<Response> => {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), ms);
  return fetch(url, { ...options, signal: controller.signal }).finally(() => clearTimeout(timer));
};


// キャンペーン割引（1,000円OFF）終了日時。この日時（JST）以降は discounted === original になる
const CAMPAIGN_END = new Date('2026-08-01T00:00:00+09:00');
const isCampaignActive = () => new Date() < CAMPAIGN_END;

const campaignPrice = (original: number, discounted: number, label: string) => ({
  original,
  discounted: isCampaignActive() ? discounted : original,
  label,
});

const FALLBACK_MENUS: Menu[] = [
  {
    id: 'oil',
    name: 'オイルマッサージ',
    prices: {
      70:  campaignPrice(10000, 9000,  '70分'),
      100: campaignPrice(13000, 12000, '100分'),
      130: campaignPrice(16000, 15000, '130分'),
      160: campaignPrice(19000, 18000, '160分'),
    },
  },
  {
    id: 'seitai',
    name: '整体',
    prices: {
      70:  campaignPrice(10000, 9000,  '70分'),
      100: campaignPrice(13000, 12000, '100分'),
      130: campaignPrice(16000, 15000, '130分'),
      160: campaignPrice(19000, 18000, '160分'),
    },
  },
  {
    id: 'training',
    name: 'パーソナルトレーニング',
    prices: {
      60: campaignPrice(10000, 9000,  '60分'),
      90: campaignPrice(13000, 12000, '90分'),
    },
  },
  {
    id: 'training_early',
    name: '早朝パーソナル(6時〜9時スタート)',
    prices: {
      50: campaignPrice(7000, 7000, '50分'),
      80: campaignPrice(10000, 10000, '80分'),
    },
  },
  {
    id: 'oil_first',
    name: '初回オイルマッサージ(1000円OFF)',
    prices: {
      70:  { original: 10000, discounted: 9000,  label: '70分' },
      100: { original: 13000, discounted: 12000, label: '100分' },
      130: { original: 16000, discounted: 15000, label: '130分' },
      160: { original: 19000, discounted: 18000, label: '160分' },
    },
  },
  {
    id: 'seitai_first',
    name: '初回整体(1000円OFF)',
    prices: {
      70:  { original: 10000, discounted: 9000,  label: '70分' },
      100: { original: 13000, discounted: 12000, label: '100分' },
      130: { original: 16000, discounted: 15000, label: '130分' },
      160: { original: 19000, discounted: 18000, label: '160分' },
    },
  },
  {
    id: 'training_first',
    name: '初回パーソナルトレーニング(2000円OFF)',
    prices: {
      60: { original: 10000, discounted: 8000,  label: '60分' },
      90: { original: 13000, discounted: 11000, label: '90分' },
    },
  },
];

/** URLパラメータから初期値を読み取る */
function getInitialParamsFromUrl(): { menu: string; duration: number; isTrial: boolean } {
  const params = new URLSearchParams(window.location.search);
  const menu = params.get('menu') || '';
  const duration = parseInt(params.get('duration') || '0') || 0;
  const isTrial = params.get('trial') === 'true';
  return { menu, duration, isTrial };
}

const toDateString = (date: Date): string => {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
};

// 開発サーバーで ?mock=1 を付けると LIFF ログインを省いて画面確認できる (本番ビルドでは無効)
const isMockPreview = () => import.meta.env.DEV && new URLSearchParams(window.location.search).get('mock') === '1';

export function useBooking() {
  const { lang, suggestLang } = useLang();
  const { tb, menuName } = useBookingText();
  const urlParams = getInitialParamsFromUrl();
  const initialMenu = urlParams.menu;
  const initialDuration = urlParams.duration;
  const [isTrial] = useState<boolean>(urlParams.isTrial);

  const [currentStep, setCurrentStep] = useState<BookingStep>('menu');
  const [booking, setBooking] = useState<BookingSession>({
    date: '',
    time: '',
    menu: initialMenu || '',
    duration: initialDuration || 70,
    name: '',
    comment: '',
  });
  const [menus, setMenus] = useState<Menu[]>([]);
  const [availableSlots, setAvailableSlots] = useState<string[]>([]);
  const [weekAvailability, setWeekAvailability] = useState<{ [date: string]: string[] }>({});
  const [weekLoading, setWeekLoading] = useState(false);
  const [userProfile, setUserProfile] = useState<{ userId: string; name: string } | null>(null);
  const [bookingHistory, setBookingHistory] = useState<BookingHistory[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [liffStatus, setLiffStatus] = useState<string>('初期化中');

  // ── LIFF 初期化とユーザー情報取得 ──────────────────────
  useEffect(() => {
    const initLiff = async () => {
      const liffId = import.meta.env.VITE_LINE_LIFF_ID || '2009962690-j5dQBfYL';
      setLiffStatus('init中');

      if (isMockPreview()) {
        setUserProfile({ userId: 'demo-preview', name: 'Preview Guest' });
        setBooking(prev => ({ ...prev, name: prev.name || 'Preview Guest' }));
        setLiffStatus('MOCK');
        return;
      }

      try {
        await liff.init({ liffId, withLoginOnExternalBrowser: true });

        // LINEアプリの言語に合わせる（切替ボタンやURLでの指定があればそちらを優先）
        suggestLang(liff.getLanguage().toLowerCase().startsWith('ja') ? 'ja' : 'en');

        if (!liff.isLoggedIn()) {
          console.warn('LIFF: 未ログイン → LINE ログインにリダイレクト');
          setLiffStatus('ログインへ');
          liff.login();
          return;
        }

        setLiffStatus('プロフィール取得中');
        const profile = await liff.getProfile();
        setUserProfile({
          userId: profile.userId,
          name: profile.displayName,
        });
        setBooking(prev => ({ ...prev, name: prev.name || profile.displayName }));
        setLiffStatus('OK');

        console.log('✅ LIFF ユーザー情報取得:', profile.displayName, '/ userId:', profile.userId);
      } catch (err: any) {
        const msg = err?.message || String(err);
        console.error('LIFF セットアップエラー:', msg);
        setLiffStatus(`ERR:${msg.slice(0, 30)}`);
        setError(tb.err.liff(msg));
      }
    };

    initLiff();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── メニュー取得 ──────────────────────────────────────
  const fetchMenus = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetchWithTimeout(`${API_BASE}/api/menus?lang=${lang}`);
      if (!res.ok) throw new Error('menus request failed');
      const data = await res.json();
      setMenus(data);
    } catch (err) {
      console.warn('メニュー取得失敗、フォールバックを使用:', err);
      setMenus(FALLBACK_MENUS);
    } finally {
      setLoading(false);
    }
  }, [lang]);

  // ── 利用可能スロット取得（単一日） ────────────────────
  const fetchAvailableSlots = useCallback(async (date: string, duration: number, menu?: string) => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({ date, duration: String(duration), lang });
      if (menu) params.set('menu', menu);
      const res = await fetchWithTimeout(`${API_BASE}/api/availability?${params}`);

      if (!res.ok) throw new Error(tb.err.availabilityFailed);

      const data: AvailabilityResponse = await res.json();
      setAvailableSlots(data.slots);
    } catch (err) {
      const message = err instanceof Error ? err.message : tb.err.unknown;
      setError(message);
      console.error('スロット取得エラー:', err);
    } finally {
      setLoading(false);
    }
  }, [lang, tb]);

  // ── 週単位の利用可能スロット取得 ──────────────────────
  const fetchWeekAvailability = useCallback(async (weekStart: string, duration: number, menu?: string) => {
    setWeekLoading(true);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const maxDate = new Date();
    maxDate.setMonth(maxDate.getMonth() + 3);

    const [y, m, d] = weekStart.split('-').map(Number);
    const startDate = new Date(y, m - 1, d);

    const fetches = Array.from({ length: 7 }, (_, i) => {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);

      if (date < today || date > maxDate) {
        return Promise.resolve({ dateStr: toDateString(date), slots: [] as string[] });
      }

      const dateStr = toDateString(date);
      const params = new URLSearchParams({ date: dateStr, duration: String(duration) });
      if (menu) params.set('menu', menu);
      return fetchWithTimeout(`${API_BASE}/api/availability?${params}`, undefined, 6000)
        .then(async res => {
          if (!res.ok) return { dateStr, slots: [] as string[] };
          const data: AvailabilityResponse = await res.json();
          return { dateStr, slots: data.slots || [] };
        })
        .catch(() => ({ dateStr, slots: [] as string[] }));
    });

    const results = await Promise.all(fetches);
    setWeekAvailability(prev => {
      const next = { ...prev };
      results.forEach(({ dateStr, slots }) => {
        next[dateStr] = slots;
      });
      return next;
    });
    setWeekLoading(false);
  }, []);

  // ── 予約を送信 ──────────────────────────────────────────
  const submitBooking = useCallback(async () => {
    if (!userProfile) {
      setError(tb.err.notInLine);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const bookingData = {
        ...booking,
        userId: userProfile.userId,
        name: booking.name || userProfile.name,
        lang,
      };

      // 画面確認用 (?mock=1): 予約は作成せず、完了画面だけ表示する
      if (isMockPreview()) {
        const [h, m] = booking.time.split(':').map(Number);
        const end = h * 60 + m + booking.duration;
        const endTime = `${String(Math.floor(end / 60)).padStart(2, '0')}:${String(end % 60).padStart(2, '0')}`;
        setBooking(prev => ({ ...prev, endTime, bookingRef: 'ALPREVIEW', pending: booking.menu.startsWith('training') }));
        setCurrentStep('complete');
        return;
      }

      const res = await fetchWithTimeout(`${API_BASE}/api/bookings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bookingData),
      }, 15000);

      const data = await res.json();

      if (res.status === 409) {
        setError(data.message || tb.err.slotTaken);
        setAvailableSlots(data.availableSlots || []);
        setCurrentStep('datetime');
        return;
      }

      if (!res.ok) {
        throw new Error(data.error || tb.err.bookingFailed);
      }

      const bookingRef = 'AL' + Date.now().toString(36).toUpperCase();
      setBooking(prev => ({ ...prev, endTime: data.booking.endTime, bookingRef, pending: data.pending || false }));
      setCurrentStep('complete');

      // 公式アカウントのチャット履歴を残すため、お客様名義で予約内容を自動送信する
      // （LIFFをトーク画面から開いた場合のみ有効。失敗しても予約には影響させない）
      try {
        if (liff.isInClient()) {
          const menu = menus.find(m => m.id === booking.menu);
          const [y, mo, d] = booking.date.split('-').map(Number);
          const dow = tb.datetime.weekdays[new Date(y, mo - 1, d).getDay()];
          await liff.sendMessages([{
            type: 'text',
            text: tb.chatMessage({
              menuName: menu ? menuName(menu.id, menu.name) : booking.menu,
              duration: tb.duration(booking.duration),
              m: mo,
              d,
              wd: dow,
              time: booking.time,
              endTime: data.booking.endTime,
              name: bookingData.name,
            }),
          }]);
        }
      } catch (sendErr) {
        console.warn('LIFF sendMessages 失敗（予約は完了済み）:', sendErr);
      }

    } catch (err) {
      console.error('予約APIエラー:', err);
      setError(tb.err.connection);
    } finally {
      setLoading(false);
    }
  }, [booking, userProfile, menus, lang, tb, menuName]);

  // ── 予約履歴を取得（マッサージ・整体 + トレーニング） ──────────
  const fetchBookingHistory = useCallback(async (userId: string) => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({ userId, lang });
      const [regularRes, trainingRes] = await Promise.all([
        fetchWithTimeout(`${API_BASE}/api/bookings?${params}`),
        fetchWithTimeout(`${API_BASE}/api/training-bookings?${params}`),
      ]);

      const regularData = regularRes.ok ? await regularRes.json() : { bookings: [] };
      const trainingData = trainingRes.ok ? await trainingRes.json() : { bookings: [] };

      const regularBookings = (regularData.bookings || []).map((b: any) => ({ ...b, isTraining: false }));
      const trainingBookings = (trainingData.bookings || []).map((b: any) => ({ ...b, isTraining: true }));

      const allBookings = [...regularBookings, ...trainingBookings].sort((a, b) =>
        `${a.date}${a.time}`.localeCompare(`${b.date}${b.time}`)
      );
      setBookingHistory(allBookings);
    } catch (err) {
      const message = err instanceof Error ? err.message : tb.err.unknown;
      setError(message);
      console.error('予約履歴取得エラー:', err);
    } finally {
      setLoading(false);
    }
  }, [lang, tb]);

  // ── 予約をキャンセル ────────────────────────────────────
  const cancelBooking = useCallback(async (rowIndex: number, bookingItem: BookingHistory) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetchWithTimeout(`${API_BASE}/api/bookings/${rowIndex}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          date: bookingItem.date,
          time: bookingItem.time,
          endTime: bookingItem.endTime,
          menu: bookingItem.menu,
          duration: bookingItem.duration,
          name: bookingItem.name,
          lang,
        }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || tb.err.cancelFailed);

      if (userProfile) {
        await fetchBookingHistory(userProfile.userId);
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : tb.err.unknown;
      setError(message);
      console.error('キャンセルエラー:', err);
    } finally {
      setLoading(false);
    }
  }, [userProfile, fetchBookingHistory, lang, tb]);

  // ── 予約情報を更新 ──────────────────────────────────────
  const updateBooking = useCallback((data: Partial<BookingSession>) => {
    setBooking(prev => ({ ...prev, ...data }));
  }, []);

  // ── 予約をリセット ──────────────────────────────────────
  const resetBooking = useCallback(() => {
    setBooking({
      date: '',
      time: '',
      menu: '',
      duration: 70,
      name: userProfile?.name || '',
      comment: '',
    });
    setCurrentStep('menu');
    setError(null);
    // URL パラメータをクリア（ブラウザ履歴を壊さずに）
    if (window.history.replaceState) {
      window.history.replaceState({}, '', window.location.pathname);
    }
  }, [userProfile]);

  // ── メニュー初期ロード ──────────────────────────────────
  useEffect(() => {
    fetchMenus();
  }, [fetchMenus]);

  return {
    currentStep,
    setCurrentStep,
    booking,
    updateBooking,
    menus,
    availableSlots,
    weekAvailability,
    weekLoading,
    userProfile,
    liffStatus,
    bookingHistory,
    loading,
    error,
    isTrial,
    fetchMenus,
    fetchAvailableSlots,
    fetchWeekAvailability,
    submitBooking,
    fetchBookingHistory,
    cancelBooking,
    resetBooking,
  };
}

