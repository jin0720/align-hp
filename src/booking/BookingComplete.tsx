import React from 'react';
import type { BookingSession, Menu } from './types';
import { useBookingText } from '../i18n/useBookingText';

interface BookingCompleteProps {
  booking: BookingSession;
  menus: Menu[];
  onViewHistory: () => void;
  onNewBooking: () => void;
  isTrial?: boolean;
}

const ALIGN_GREEN = '#557A64';
const ALIGN_GREEN_DARK = '#3A5A46';

function getEndTime(startTime: string, duration: number): string {
  const [h, min] = startTime.split(':').map(Number);
  const total = h * 60 + min + duration;
  return `${String(Math.floor(total / 60)).padStart(2, '0')}:${String(total % 60).padStart(2, '0')}`;
}

const Row: React.FC<{ label: string; children: React.ReactNode }> = ({ label, children }) => (
  <div className="px-4 py-3 border-b last:border-b-0" style={{ borderColor: '#E8EFE9' }}>
    <p className="text-xs font-bold mb-1" style={{ color: ALIGN_GREEN }}>{label}</p>
    <div className="text-sm font-medium" style={{ color: '#333' }}>{children}</div>
  </div>
);

export const BookingComplete: React.FC<BookingCompleteProps> = ({
  booking,
  menus,
  onViewHistory,
  onNewBooking,
  isTrial = false,
}) => {
  const { tb, menuName } = useBookingText();
  const formatDate = (dateStr: string): string => {
    const [y, m, d] = dateStr.split('-').map(Number);
    return tb.longDate(y, m, d, tb.datetime.weekdays[new Date(y, m - 1, d).getDay()]);
  };
  const selectedMenu = menus.find(m => m.id === booking.menu);
  const priceInfo = selectedMenu?.prices[booking.duration];
  const endTime = booking.time ? getEndTime(booking.time, booking.duration) : '';
  const isTraining = booking.menu.startsWith('training');

  // ── トレーニング仮予約受付画面 ────────────────────────────
  if (isTraining) {
    return (
      <div className="flex flex-col min-h-screen" style={{ background: '#F7FAF8' }}>
        <div className="text-white text-center py-3 font-bold text-base tracking-widest" style={{ background: '#2C5F3F' }}>
          {tb.complete.pendingHeader}
        </div>

        <div className="flex-1 overflow-y-auto pb-36 px-4 pt-6 space-y-5">
          {/* 受付メッセージ */}
          <div className="text-center py-4">
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center text-3xl mx-auto mb-3"
              style={{ background: 'linear-gradient(135deg, #D4AF37 0%, #A08020 100%)' }}
            >
              ⏳
            </div>
            <p className="font-bold text-lg" style={{ color: '#7A6520' }}>
              {tb.complete.pendingTitle}
            </p>
            <p className="text-xs mt-1" style={{ color: '#6A6D6B' }}>
              {isTrial ? tb.complete.trialSession : (selectedMenu ? menuName(selectedMenu.id, selectedMenu.name) : tb.complete.defaultTraining)}
            </p>
          </div>

          {/* 予約詳細カード */}
          <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
            <div className="py-2.5 text-center text-sm font-bold text-white" style={{ background: '#2C5F3F' }}>
              {tb.complete.cardTitle}
            </div>
            <Row label={tb.complete.date}>
              {tb.dateTime(formatDate(booking.date), booking.time, endTime)}
            </Row>
            <Row label={tb.complete.menu}>
              {tb.confirm.menuLine(selectedMenu ? menuName(selectedMenu.id, selectedMenu.name) : '', tb.duration(booking.duration))}
            </Row>
            {priceInfo && (
              <Row label={tb.complete.price}>
                <span className="font-bold" style={{ color: '#2C5F3F' }}>
                  {isTrial ? tb.complete.first : ''}¥{priceInfo.discounted.toLocaleString()}{tb.yenSuffix}
                </span>
                <span className="text-xs text-gray-500 ml-1">{tb.complete.payOnsite}</span>
              </Row>
            )}
          </div>

          {/* 次のステップ説明 */}
          <div className="rounded-2xl p-4 text-xs leading-relaxed" style={{ background: '#FFF8E7', border: '1px solid #D4AF37', color: '#7A6520' }}>
            <p className="font-bold mb-2">{tb.complete.nextTitle}</p>
            <p>{tb.complete.step1}</p>
            <p>{tb.complete.step2Before}<strong>{tb.complete.step2Strong}</strong>{tb.complete.step2After}</p>
            <p>{tb.complete.step3}</p>
          </div>
        </div>

        {/* 下部ボタン */}
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg px-4 pt-3 pb-6">
          <button
            onClick={onNewBooking}
            className="w-full py-3 rounded-2xl font-bold text-sm"
            style={{ color: ALIGN_GREEN, border: '1.5px solid #C8D9CE', background: '#fff' }}
          >
            {tb.complete.backTop}
          </button>
        </div>
      </div>
    );
  }

  // ── 通常予約完了画面 ──────────────────────────────────────
  return (
    <div className="flex flex-col min-h-screen" style={{ background: '#F7FAF8' }}>
      {/* ヘッダー */}
      <div className="text-white text-center py-3 font-bold text-base tracking-widest" style={{ background: ALIGN_GREEN }}>
        {tb.complete.header}
      </div>

      <div className="flex-1 overflow-y-auto pb-36 px-4 pt-6 space-y-5">
        {/* 完了メッセージ */}
        <div className="text-center py-4">
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center text-3xl mx-auto mb-3"
            style={{ background: `linear-gradient(135deg, ${ALIGN_GREEN} 0%, ${ALIGN_GREEN_DARK} 100%)` }}
          >
            ✓
          </div>
          <p className="font-bold text-lg" style={{ color: ALIGN_GREEN_DARK }}>
            {tb.complete.confirmed}
          </p>
          <p className="text-xs mt-1" style={{ color: '#6A6D6B' }}>
            {tb.complete.seeYou}
          </p>
        </div>

        {/* 予約詳細カード */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="py-2.5 text-center text-sm font-bold text-white" style={{ background: ALIGN_GREEN_DARK }}>
            {tb.complete.cardTitle}
          </div>

          {booking.bookingRef && (
            <Row label={tb.complete.bookingNo}>
              <span className="font-bold tracking-wider">{booking.bookingRef}</span>
            </Row>
          )}
          <Row label={tb.complete.date}>
            {tb.dateTime(formatDate(booking.date), booking.time, endTime)}
          </Row>
          <Row label={tb.complete.menu}>
            {tb.confirm.menuLine(selectedMenu ? menuName(selectedMenu.id, selectedMenu.name) : '', tb.duration(booking.duration))}
          </Row>
          {priceInfo && (
            <Row label={tb.complete.total}>
              <span className="font-bold" style={{ color: ALIGN_GREEN_DARK }}>
                ¥{priceInfo.discounted.toLocaleString()}{tb.yenSuffix}
              </span>
              <span className="text-xs text-gray-500 ml-1">{tb.complete.payOnsite}</span>
            </Row>
          )}
        </div>

        {/* お知らせ */}
        <div className="rounded-2xl p-4 text-xs leading-relaxed" style={{ background: '#EEF3F0', border: '1px solid #C8D9CE', color: '#3A5A46' }}>
          <p className="font-bold mb-1" style={{ color: ALIGN_GREEN_DARK }}>{tb.complete.visitTitle}</p>
          <p>{tb.complete.visitLines[0]}<br />{tb.complete.visitLines[1]}</p>
        </div>
      </div>

      {/* 下部ボタン */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg px-4 pt-3 pb-6 space-y-2">
        <button
          onClick={onNewBooking}
          className="w-full font-bold text-white flex items-center justify-center rounded-2xl"
          style={{
            height: '56px',
            fontSize: '17px',
            background: `linear-gradient(90deg, ${ALIGN_GREEN} 0%, ${ALIGN_GREEN_DARK} 100%)`,
          }}
        >
          {tb.complete.newBooking}
        </button>
        <button
          onClick={onViewHistory}
          className="w-full py-3 rounded-2xl font-bold text-sm"
          style={{ color: ALIGN_GREEN, border: '1.5px solid #C8D9CE', background: '#fff' }}
        >
          {tb.complete.viewHistory}
        </button>
      </div>
    </div>
  );
};
