/**
 * useBooking.ts - 予約フローの状態管理カスタムフック
 */

import { useState, useCallback, useEffect } from 'react';
import liff from '@line/liff';
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


const FALLBACK_MENUS: Menu[] = [
  {
    id: 'oil',
    name: 'オイルマッサージ',
    prices: {
      70:  { original: 10000, discounted: 9000,  label: '70分' },
      100: { original: 13000, discounted: 12000, label: '100分' },
      130: { original: 16000, discounted: 15000, label: '130分' },
      160: { original: 19000, discounted: 18000, label: '160分' },
    },
  },
  {
    id: 'seitai',
    name: '整体',
    prices: {
      70:  { original: 10000, discounted: 9000,  label: '70分' },
      100: { original: 13000, discounted: 12000, label: '100分' },
      130: { original: 16000, discounted: 15000, label: '130分' },
      160: { original: 19000, discounted: 18000, label: '160分' },
    },
  },
  {
    id: 'training',
    name: 'パーソナルトレーニング',
    prices: {
      60: { original: 10000, discounted: 9000,  label: '60分' },
      90: { original: 13000, discounted: 12000, label: '90分' },
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

export function useBooking() {
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

      try {
        await liff.init({ liffId, withLoginOnExternalBrowser: true });

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
        setError(`LINE連携エラー: ${msg} — LINEアプリから開き直してください`);
      }
    };

    initLiff();
  }, []);

  // ── メニュー取得 ──────────────────────────────────────
  const fetchMenus = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetchWithTimeout(`${API_BASE}/api/menus`);
      if (!res.ok) throw new Error('メニュー取得に失敗しました');
      const data = await res.json();
      setMenus(data);
    } catch (err) {
      console.warn('メニュー取得失敗、フォールバックを使用:', err);
      setMenus(FALLBACK_MENUS);
    } finally {
      setLoading(false);
    }
  }, []);

  // ── 利用可能スロット取得（単一日） ────────────────────
  const fetchAvailableSlots = useCallback(async (date: string, duration: number, menu?: string) => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({ date, duration: String(duration) });
      if (menu) params.set('menu', menu);
      const res = await fetchWithTimeout(`${API_BASE}/api/availability?${params}`);

      if (!res.ok) throw new Error('利用可能時間の取得に失敗しました');

      const data: AvailabilityResponse = await res.json();
      setAvailableSlots(data.slots);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'エラーが発生しました';
      setError(message);
      console.error('スロット取得エラー:', err);
    } finally {
      setLoading(false);
    }
  }, []);

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
      setError('LINEアプリ内から開いてください（LIFF未初期化）');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const bookingData = {
        ...booking,
        userId: userProfile.userId,
        name: booking.name || userProfile.name,
      };

      const res = await fetchWithTimeout(`${API_BASE}/api/bookings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bookingData),
      }, 15000);

      const data = await res.json();

      if (res.status === 409) {
        setError(data.message || 'この時間は埋まってしまいました');
        setAvailableSlots(data.availableSlots || []);
        setCurrentStep('datetime');
        return;
      }

      if (!res.ok) {
        throw new Error(data.error || '予約に失敗しました');
      }

      const bookingRef = 'AL' + Date.now().toString(36).toUpperCase();
      setBooking(prev => ({ ...prev, endTime: data.booking.endTime, bookingRef, pending: data.pending || false }));
      setCurrentStep('complete');

    } catch (err) {
      console.error('予約APIエラー:', err);
      setError('サーバーへの接続に失敗しました。しばらく待ってから再度お試しください。');
    } finally {
      setLoading(false);
    }
  }, [booking, userProfile]);

  // ── 予約履歴を取得（マッサージ・整体 + トレーニング） ──────────
  const fetchBookingHistory = useCallback(async (userId: string) => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({ userId });
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
      const message = err instanceof Error ? err.message : 'エラーが発生しました';
      setError(message);
      console.error('予約履歴取得エラー:', err);
    } finally {
      setLoading(false);
    }
  }, []);

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
        }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || 'キャンセルに失敗しました');

      if (userProfile) {
        await fetchBookingHistory(userProfile.userId);
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'エラーが発生しました';
      setError(message);
      console.error('キャンセルエラー:', err);
    } finally {
      setLoading(false);
    }
  }, [userProfile, fetchBookingHistory]);

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

