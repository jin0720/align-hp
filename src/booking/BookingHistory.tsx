/**
 * BookingHistory.tsx - 予約履歴
 */

import React from 'react';
import type { BookingHistory as BookingHistoryItem } from './types';
import classnames from 'classnames';

const BRAND = '#557A64';

interface BookingHistoryProps {
  history: BookingHistoryItem[];
  loading: boolean;
  error: string | null;
  onBack: () => void;
  onCancel: (rowIndex: number, booking: BookingHistoryItem) => Promise<void>;
  onNewBooking: () => void;
}

export const BookingHistory: React.FC<BookingHistoryProps> = ({
  history,
  loading,
  error,
  onBack,
  onCancel,
  onNewBooking,
}) => {
  const formatDate = (dateStr: string): string => {
    const [year, month, day] = dateStr.split('-').map(Number);
    return `${year}年${month}月${day}日`;
  };

  const formatTime = (dateStr: string, timeStr: string): string => {
    const [year, month, day] = dateStr.split('-').map(Number);
    const date = new Date(year, month - 1, day);
    const days = ['日', '月', '火', '水', '木', '金', '土'];
    return `${days[date.getDay()]} ${timeStr}`;
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Header */}
      <div className="text-white px-4 py-3 flex items-center justify-between sticky top-0" style={{ backgroundColor: BRAND }}>
        <button onClick={onBack} className="text-xl">←</button>
        <h1 className="text-sm font-bold">予約履歴</h1>
        <div className="w-6" />
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 pb-20">
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            <p className="text-sm">{error}</p>
          </div>
        )}

        {loading ? (
          <div className="text-center text-gray-600 py-6">読み込み中...</div>
        ) : history.length === 0 ? (
          <div className="text-center text-gray-600 py-8">
            <p className="mb-4">予約履歴はありません</p>
            <button
              onClick={onNewBooking}
              className="text-white px-4 py-2 rounded transition"
              style={{ backgroundColor: BRAND }}
            >
              新規予約
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            <h2 className="text-sm font-bold text-gray-800 mb-3">現在の予約</h2>
            {history.map(booking => (
              <div
                key={booking.rowIndex}
                className="bg-white rounded-lg p-4 shadow-sm"
                style={{ borderLeft: `4px solid ${BRAND}` }}
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className="text-sm font-bold text-gray-800 mb-1">
                      {formatDate(booking.date)}（{formatTime(booking.date, booking.time)}）
                    </p>
                    <p className="text-xs text-gray-600">
                      {booking.time} ～ {booking.endTime}
                    </p>
                  </div>
                  <span className="px-2 py-1 rounded text-xs font-semibold text-white" style={{ backgroundColor: BRAND }}>
                    確定
                  </span>
                </div>

                <div className="bg-gray-50 rounded p-3 mb-3 space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-600">メニュー</span>
                    <span className="text-gray-800 font-semibold">{booking.menu}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-600">時間</span>
                    <span className="text-gray-800 font-semibold">{booking.duration}分</span>
                  </div>
                </div>

                <button
                  onClick={() => onCancel(booking.rowIndex, booking)}
                  className={classnames(
                    'w-full py-2 rounded text-sm font-semibold transition',
                    'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  )}
                >
                  予約の変更・キャンセル
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-3">
        <button
          onClick={onNewBooking}
          className="w-full py-3 rounded font-bold text-white transition"
          style={{ backgroundColor: BRAND }}
        >
          新規予約
        </button>
      </div>
    </div>
  );
};
