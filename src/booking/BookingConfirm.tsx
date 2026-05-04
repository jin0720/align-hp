import React from 'react';
import type { BookingSession, Menu } from './types';

interface BookingConfirmProps {
  booking: BookingSession;
  menus: Menu[];
  onConfirm: () => void;
  onCommentChange: (comment: string) => void;
  onBack: () => void;
  loading: boolean;
  error: string | null;
}

const WEEKDAYS = ['日', '月', '火', '水', '木', '金', '土'];
const ALIGN_GREEN = '#557A64';
const ALIGN_GREEN_DARK = '#3A5A46';

function getDayOfWeek(dateStr: string): string {
  const [year, month, day] = dateStr.split('-').map(Number);
  return WEEKDAYS[new Date(year, month - 1, day).getDay()];
}

function getEndTime(startTime: string, duration: number): string {
  const [h, m] = startTime.split(':').map(Number);
  const total = h * 60 + m + duration;
  return `${String(Math.floor(total / 60)).padStart(2, '0')}:${String(total % 60).padStart(2, '0')}`;
}

function formatDate(dateStr: string): string {
  const [y, m, d] = dateStr.split('-').map(Number);
  return `${y}年${m}月${d}日（${getDayOfWeek(dateStr)}）`;
}

const Row: React.FC<{ label: string; children: React.ReactNode }> = ({ label, children }) => (
  <div className="px-4 py-3 border-b last:border-b-0" style={{ borderColor: '#E8EFE9' }}>
    <p className="text-xs font-bold mb-1" style={{ color: ALIGN_GREEN }}>{label}</p>
    <div className="text-sm font-medium" style={{ color: '#333' }}>{children}</div>
  </div>
);

export const BookingConfirm: React.FC<BookingConfirmProps> = ({
  booking,
  menus,
  onConfirm,
  onCommentChange,
  onBack,
  loading,
  error,
}) => {
  const selectedMenu = menus.find(m => m.id === booking.menu);
  const priceInfo = selectedMenu?.prices[booking.duration];
  const endTime = booking.time ? getEndTime(booking.time, booking.duration) : '';

  return (
    <div className="flex flex-col min-h-screen" style={{ background: '#F7FAF8' }}>
      {/* ヘッダー */}
      <div className="text-white text-center py-3 font-bold text-base tracking-widest" style={{ background: ALIGN_GREEN }}>
        ご予約内容の確認
      </div>

      <div className="flex-1 overflow-y-auto pb-36 px-4 pt-5 space-y-4">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-2xl text-sm">
            {error}
          </div>
        )}

        {/* 予約内容カード */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="py-2.5 text-center text-sm font-bold text-white" style={{ background: ALIGN_GREEN_DARK }}>
            ご予約内容
          </div>
          <Row label="日付">
            {formatDate(booking.date)}　{booking.time}〜{endTime}
          </Row>
          <Row label="メニュー">
            {selectedMenu?.name}　{booking.duration}分
          </Row>
          {priceInfo && (
            <Row label="合計（消費税込）">
              <div className="flex items-baseline gap-2">
                {priceInfo.original !== priceInfo.discounted && (
                  <span className="text-xs text-gray-400 line-through">
                    ¥{priceInfo.original.toLocaleString()}
                  </span>
                )}
                <span className="text-base font-bold" style={{ color: ALIGN_GREEN_DARK }}>
                  ¥{priceInfo.discounted.toLocaleString()}円
                </span>
                <span className="text-xs text-gray-500">（現地決済）</span>
              </div>
            </Row>
          )}
        </div>

        {/* コメント欄 */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="py-2.5 text-center text-sm font-bold text-white" style={{ background: ALIGN_GREEN_DARK }}>
            その他ご要望
          </div>
          <div className="px-4 py-4">
            <p className="text-xs leading-relaxed mb-3" style={{ color: '#6A6D6B' }}>
              ご予約時間の5分前からご来店可能です。<br />
              その他ご要望がありましたらコメントをご入力ください。<br />
              ※コメントへの返信は行っておりません。
            </p>
            <textarea
              value={booking.comment || ''}
              onChange={e => onCommentChange(e.target.value)}
              placeholder="コメントを入力（任意）"
              rows={3}
              className="w-full rounded-xl px-3 py-2 text-sm resize-none focus:outline-none"
              style={{
                border: `1.5px solid #C8D9CE`,
                color: '#333',
              }}
            />
          </div>
        </div>
      </div>

      {/* 下部ボタン */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg px-4 pt-3 pb-6 space-y-2">
        <button
          onClick={onConfirm}
          disabled={loading}
          className="w-full font-bold text-white flex items-center justify-center rounded-2xl transition-opacity"
          style={{
            height: '56px',
            fontSize: '17px',
            background: loading
              ? '#C8CEC9'
              : `linear-gradient(90deg, ${ALIGN_GREEN} 0%, ${ALIGN_GREEN_DARK} 100%)`,
            opacity: loading ? 0.7 : 1,
          }}
        >
          {loading ? '予約確定中...' : 'この内容で予約する　→'}
        </button>
        <button
          onClick={onBack}
          disabled={loading}
          className="w-full py-3 rounded-2xl font-bold text-sm"
          style={{ color: ALIGN_GREEN, border: `1.5px solid #C8D9CE`, background: '#fff' }}
        >
          修正する
        </button>
      </div>
    </div>
  );
};
