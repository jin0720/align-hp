/**
 * BookingHistory.tsx - 予約履歴（スクリーンショット 2318、2354 ベース）
 */

import React, { useEffect } from 'react';
import type { BookingHistory as BookingHistoryItem } from './types';
import classnames from 'classnames';

interface BookingHistoryProps {
  history: BookingHistoryItem[];
  loading: boolean;
  error: string | null;
  onBack: () => void;
  onCancel: (rowIndex: number, booking: BookingHistoryItem) => Promise<void>;
  onNewBooking: () => void;
  userId?: string;
  onFetchHistory?: (userId: string) => Promise<void>;
}

export const BookingHistory: React.FC<BookingHistoryProps> = ({
  history,
  loading,
  error,
  onBack,
  onCancel,
  onNewBooking,
  userId,
  onFetchHistory,
}) => {
  // ── 初期化: 履歴を取得 ──────────────────────────────────
  useEffect(() => {
    if (userId && onFetchHistory) {
      onFetchHistory(userId);
    }
  }, [userId, onFetchHistory]);

  const formatDate = (dateStr: string): string => {
    const [year, month, day] = dateStr.split('-').map(Number);
    return `${year}年${month}月${day}日`;
  };

  const formatTime = (dateStr: string, timeStr: string): string => {
    const [year, month, day] = dateStr.split('-').map(Number);
    const date = new Date(year, month - 1, day);
    const days = ['日', '月', '火', '水', '木', '金', '土'];
    const dayOfWeek = days[date.getDay()];
    return `${dayOfWeek} ${timeStr}`;
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-pink-500 text-white px-4 py-3 flex items-center justify-between sticky top-0">
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
          <div className="text-center text-gray-600 py-6">
            読み込み中...
          </div>
        ) : history.length === 0 ? (
          <div className="text-center text-gray-600 py-8">
            <p className="mb-4">予約履歴はありません</p>
            <button
              onClick={onNewBooking}
              className="bg-pink-500 text-white px-4 py-2 rounded hover:bg-pink-600 transition"
            >
              新規予約
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {/* 現在の予約 */}
            {history.length > 0 && (
              <div className="mb-4">
                <h2 className="text-sm font-bold text-gray-800 mb-3">
                  💗 現在の予約
                </h2>
                {history.map(booking => (
                  <div
                    key={booking.rowIndex}
                    className="bg-white rounded-lg p-4 border-l-4 border-pink-500 shadow-sm"
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
                      <span className="bg-pink-100 text-pink-600 px-2 py-1 rounded text-xs font-semibold">
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
                      <div className="flex justify-between text-xs">
                        <span className="text-gray-600">スタッフ</span>
                        <span className="text-gray-800 font-semibold">—</span>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => onCancel(booking.rowIndex, booking)}
                        className={classnames(
                          'flex-1 py-2 rounded text-sm font-semibold transition',
                          'bg-gray-200 text-gray-700 hover:bg-gray-300'
                        )}
                      >
                        予約の変更・キャンセル
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* 過去の予約 - ここは将来的に拡張可能 */}
            <div>
              <h2 className="text-sm font-bold text-gray-800 mb-3">
                過去の予約
              </h2>
              <div className="text-center text-gray-600 py-6">
                <p>表示できる過去の予約はありません</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer Button */}
      {history.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-3 max-w-full">
          <button
            onClick={onNewBooking}
            className="w-full py-3 rounded font-bold text-white bg-pink-500 hover:bg-pink-600 transition"
          >
            新規予約
          </button>
        </div>
      )}
    </div>
  );
};
