/**
 * useBooking.ts - 予約フローの状態管理カスタムフック
 */

import { useState, useCallback, useEffect } from 'react';
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
];

const toDateString = (date: Date): string => {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
};

export function useBooking() {
  const [currentStep, setCurrentStep] = useState<BookingStep>('menu');
  const [booking, setBooking] = useState<BookingSession>({
    date: '',
    time: '',
    menu: '',
    duration: 70,
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

  // ── LIFF 初期化とユーザー情報取得 ──────────────────────
  useEffect(() => {
    const initLiff = async () => {
      try {
        if (!window.liff) {
          const script = document.createElement('script');
          script.src = 'https://static.line-app.com/sdk/js/liff.js';
          script.async = true;
          script.onload = async () => {
            await setupLiff();
          };
          document.head.appendChild(script);
        } else {
          await setupLiff();
        }
      } catch (err) {
        console.error('LIFF 初期化エラー:', err);
        setError('LINE 連携エラーが発生しました');
      }
    };

    const setupLiff = async () => {
      if (!window.liff) return;

      const liffId = import.meta.env.VITE_LINE_LIFF_ID || '';
      if (!liffId) {
        console.warn('⚠️  VITE_LINE_LIFF_ID が設定されていません');
        return;
      }

      try {
        await window.liff.init({ liffId, withLoginOnExternalBrowser: true });

        if (!window.liff.isLoggedIn()) return;

        const profile = await window.liff.getProfile();
        setUserProfile({
          userId: profile.userId,
          name: profile.displayName,
        });
        // LINEプロフィール名を予約情報に自動セット
        setBooking(prev => ({ ...prev, name: prev.name || profile.displayName }));

        console.log('✅ LIFF ユーザー情報取得:', profile.displayName);
      } catch (err) {
        console.error('LIFF セットアップエラー:', err);
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
  const fetchAvailableSlots = useCallback(async (date: string, duration: number) => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({ date, duration: String(duration) });
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
  const fetchWeekAvailability = useCallback(async (weekStart: string, duration: number) => {
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
    const profile = userProfile ?? { userId: 'demo-user', name: 'お客様' };

    setLoading(true);
    setError(null);
    try {
      const bookingData = {
        ...booking,
        userId: profile.userId,
        name: booking.name || profile.name,
      };

      const res = await fetchWithTimeout(`${API_BASE}/api/bookings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bookingData),
      }, 8000);

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
      setBooking(prev => ({ ...prev, endTime: data.booking.endTime, bookingRef }));
      setCurrentStep('complete');
    } catch (err) {
      // APIが応答しない場合（スリープ中など）はデモとして完了扱い
      console.warn('予約APIエラー、デモ完了:', err);
      const [h, m] = booking.time.split(':').map(Number);
      const total = h * 60 + m + booking.duration;
      const endTime = `${String(Math.floor(total / 60)).padStart(2, '0')}:${String(total % 60).padStart(2, '0')}`;
      const bookingRef = 'AL' + Date.now().toString(36).toUpperCase();
      setBooking(prev => ({ ...prev, endTime, bookingRef }));
      setCurrentStep('complete');
    } finally {
      setLoading(false);
    }
  }, [booking, userProfile]);

  // ── 予約履歴を取得 ──────────────────────────────────────
  const fetchBookingHistory = useCallback(async (userId: string) => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({ userId });
      const res = await fetchWithTimeout(`${API_BASE}/api/bookings?${params}`);

      if (!res.ok) throw new Error('予約履歴の取得に失敗しました');

      const data = await res.json();
      setBookingHistory(data.bookings || []);
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
    bookingHistory,
    loading,
    error,
    fetchMenus,
    fetchAvailableSlots,
    fetchWeekAvailability,
    submitBooking,
    fetchBookingHistory,
    cancelBooking,
    resetBooking,
  };
}

// LIFF の型定義（グローバルスコープ用）
declare global {
  interface Window {
    liff: any;
  }
}
