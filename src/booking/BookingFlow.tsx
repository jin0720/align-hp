/**
 * BookingFlow.tsx - 予約フロー全体管理（ルーティング＆状態遷移）
 */

import React, { useEffect, useState } from 'react';
import { useBooking } from './useBooking';
import { MenuSelect } from './MenuSelect';
import { DateTimeSelect } from './DateTimeSelect';
import { BookingConfirm } from './BookingConfirm';
import { BookingComplete } from './BookingComplete';
import { BookingHistory } from './BookingHistory';
import { StepIndicator } from './StepIndicator';

export const BookingFlow: React.FC = () => {
  const {
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
    fetchAvailableSlots,
    fetchWeekAvailability,
    submitBooking,
    fetchBookingHistory,
    cancelBooking,
    resetBooking,
  } = useBooking();

  // ── URL パラメータによる初期画面遷移 ──────────────────────
  // リッチメニューから ?view=history で開いた場合に予約確認画面へ直接遷移
  const [initialNavDone, setInitialNavDone] = useState(false);
  useEffect(() => {
    if (!initialNavDone && userProfile) {
      const view = new URLSearchParams(window.location.search).get('view');
      if (view === 'history') {
        setInitialNavDone(true);
        fetchBookingHistory(userProfile.userId);
        setCurrentStep('history');
      }
    }
  }, [userProfile, initialNavDone, fetchBookingHistory, setCurrentStep]);

  // ── ステップ遷移ハンドラー ──────────────────────────────
  const handleMenuNext = () => {
    if (booking.menu && booking.duration) {
      setCurrentStep('datetime');
    }
  };

  const handleDateTimeNext = () => {
    if (booking.date && booking.time) {
      // LINEプロフィール名が未セットなら自動補完
      if (!booking.name && userProfile) {
        updateBooking({ name: userProfile.name });
      }
      setCurrentStep('confirm');
    }
  };

  const handleConfirmNext = async () => {
    await submitBooking();
  };

  const handleComplete = () => {
    resetBooking();
    setCurrentStep('menu');
  };

  const handleHistory = () => {
    if (userProfile) {
      fetchBookingHistory(userProfile.userId);
      setCurrentStep('history');
    }
  };

  const handleCancelBooking = async (rowIndex: number, bookingItem: any) => {
    if (window.confirm('本当にこの予約をキャンセルしてもよろしいですか？')) {
      await cancelBooking(rowIndex, bookingItem);
    }
  };

  // history ステップはインジケーターを非表示
  const showIndicator = currentStep !== 'history';

  // ── ステップに応じてコンポーネントをレンダリング ──────
  const renderStep = () => {
    switch (currentStep) {
      case 'menu':
        return (
          <MenuSelect
            menus={menus}
            booking={booking}
            onMenuSelect={(menuId) => updateBooking({ menu: menuId })}
            onDurationSelect={(duration) => updateBooking({ duration })}
            onNext={handleMenuNext}
            loading={loading}
          />
        );

      case 'datetime':
        return (
          <DateTimeSelect
            booking={booking}
            availableSlots={availableSlots}
            weekAvailability={weekAvailability}
            weekLoading={weekLoading}
            onDateSelect={(date) => updateBooking({ date })}
            onTimeSelect={(time) => updateBooking({ time })}
            onNext={handleDateTimeNext}
            onFetchSlots={fetchAvailableSlots}
            onFetchWeekAvailability={fetchWeekAvailability}
            onBack={() => setCurrentStep('menu')}
            loading={loading}
          />
        );

      case 'confirm':
        return (
          <BookingConfirm
            booking={booking}
            menus={menus}
            onConfirm={handleConfirmNext}
            onCommentChange={(comment) => updateBooking({ comment })}
            onBack={() => setCurrentStep('datetime')}
            loading={loading}
            error={error}
          />
        );

      case 'complete':
        return (
          <BookingComplete
            booking={booking}
            menus={menus}
            onViewHistory={handleHistory}
            onNewBooking={handleComplete}
          />
        );

      case 'history':
        return (
          <BookingHistory
            history={bookingHistory}
            loading={loading}
            error={error}
            onBack={() => setCurrentStep('menu')}
            onCancel={handleCancelBooking}
            onNewBooking={() => {
              resetBooking();
              setCurrentStep('menu');
            }}
            userId={userProfile?.userId}
            onFetchHistory={
              userProfile
                ? async (userId) => fetchBookingHistory(userId)
                : undefined
            }
          />
        );

      default:
        return <div>Unknown step</div>;
    }
  };

  return (
    <div className="bg-white min-h-screen">
      {showIndicator && <StepIndicator currentStep={currentStep} />}
      {renderStep()}
      {/* バージョン確認用 — 動作確認後に削除 */}
      <div style={{ position: 'fixed', bottom: 4, right: 6, fontSize: 10, color: '#bbb', zIndex: 9999 }}>
        v2026-05-04c · {userProfile ? `✅ ${userProfile.userId.slice(0, 6)}…` : `⚠️ ${liffStatus}`}
      </div>
    </div>
  );
};
