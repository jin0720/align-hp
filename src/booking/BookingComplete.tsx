import React from 'react';
import type { BookingSession, Menu } from './types';

interface BookingCompleteProps {
  booking: BookingSession;
  menus: Menu[];
  onViewHistory: () => void;
  onNewBooking: () => void;
}

const WEEKDAYS = ['日', '月', '火', '水', '木', '金', '土'];
const ALIGN_GREEN = '#557A64';
const ALIGN_GREEN_DARK = '#3A5A46';

function formatDate(dateStr: string): string {
  const [y, m, d] = dateStr.split('-').map(Number);
  const dow = WEEKDAYS[new Date(y, m - 1, d).getDay()];
  return `${y}年${m}月${d}日（${dow}）`;
}

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
}) => {
  const selectedMenu = menus.find(m => m.id === booking.menu);
  const priceInfo = selectedMenu?.prices[booking.duration];
  const endTime = booking.time ? getEndTime(booking.time, booking.duration) : '';

  return (
    <div className="flex flex-col min-h-screen" style={{ background: '#F7FAF8' }}>
      {/* ヘッダー */}
      <div className="text-white text-center py-3 font-bold text-base tracking-widest" style={{ background: ALIGN_GREEN }}>
        ご予約完了
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
            ご予約が確定しました
          </p>
          <p className="text-xs mt-1" style={{ color: '#6A6D6B' }}>
            またのご来店を心よりお待ちしております
          </p>
        </div>

        {/* 予約詳細カード */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="py-2.5 text-center text-sm font-bold text-white" style={{ background: ALIGN_GREEN_DARK }}>
            ご予約内容
          </div>

          {booking.bookingRef && (
            <Row label="予約番号">
              <span className="font-bold tracking-wider">{booking.bookingRef}</span>
            </Row>
          )}
          <Row label="日付">
            {formatDate(booking.date)}　{booking.time}〜{endTime}
          </Row>
          <Row label="メニュー">
            {selectedMenu?.name}　{booking.duration}分
          </Row>
          {priceInfo && (
            <Row label="合計（消費税込）">
              <span className="font-bold" style={{ color: ALIGN_GREEN_DARK }}>
                ¥{priceInfo.discounted.toLocaleString()}円
              </span>
              <span className="text-xs text-gray-500 ml-1">（現地決済）</span>
            </Row>
          )}
        </div>

        {/* お知らせ */}
        <div className="rounded-2xl p-4 text-xs leading-relaxed" style={{ background: '#EEF3F0', border: '1px solid #C8D9CE', color: '#3A5A46' }}>
          <p className="font-bold mb-1" style={{ color: ALIGN_GREEN_DARK }}>ご来店について</p>
          <p>ご予約時間の5分前からご来店可能です。<br />ご不明な点はLINEよりお気軽にお問い合わせください。</p>
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
          新しく予約する　→
        </button>
        <button
          onClick={onViewHistory}
          className="w-full py-3 rounded-2xl font-bold text-sm"
          style={{ color: ALIGN_GREEN, border: '1.5px solid #C8D9CE', background: '#fff' }}
        >
          予約確認ページへ
        </button>
      </div>
    </div>
  );
};
