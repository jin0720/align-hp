/**
 * BookingHistory.tsx - 予約履歴
 */

import React from 'react';
import type { BookingHistory as BookingHistoryItem } from './types';
import classnames from 'classnames';
import { useBookingText } from '../i18n/useBookingText';
import { LangToggle } from './LangToggle';

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
  const { tb, sheetMenuName, goals } = useBookingText();

  const formatHeading = (dateStr: string, timeStr: string): string => {
    const [year, month, day] = dateStr.split('-').map(Number);
    const date = new Date(year, month - 1, day);
    return tb.history.heading(year, month, day, tb.history.weekdays[date.getDay()], timeStr);
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Header */}
      <div className="text-white px-4 py-3 flex items-center justify-between sticky top-0" style={{ backgroundColor: BRAND }}>
        <button onClick={onBack} className="text-xl">←</button>
        <h1 className="text-sm font-bold">{tb.history.header}</h1>
        <LangToggle />
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 pb-20">
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            <p className="text-sm">{error}</p>
          </div>
        )}

        {loading ? (
          <div className="text-center text-gray-600 py-6">{tb.history.loading}</div>
        ) : history.length === 0 ? (
          <div className="text-center text-gray-600 py-8">
            <p className="mb-4">{tb.history.empty}</p>
            <button
              onClick={onNewBooking}
              className="text-white px-4 py-2 rounded transition"
              style={{ backgroundColor: BRAND }}
            >
              {tb.history.newBooking}
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            <h2 className="text-lg font-bold text-gray-800 mb-3">{tb.history.current}</h2>
            {history.map(booking => {
              const isPending = booking.status === '仮予約';
              const borderColor = isPending ? '#B8860B' : BRAND;
              const [cy, cm, cd] = booking.date.split('-').map(Number);
              const cancelDeadline = new Date(cy, cm - 1, cd - 1);
              cancelDeadline.setHours(23, 0, 0, 0);
              const canCancel = new Date() < cancelDeadline;
              return (
                <div
                  key={`${booking.isTraining ? 'tr' : 'ms'}-${booking.rowIndex}`}
                  className="bg-white rounded-lg p-4 shadow-sm"
                  style={{ borderLeft: `4px solid ${borderColor}` }}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <p className="text-lg font-bold text-gray-800 mb-1">
                        {formatHeading(booking.date, booking.time)}
                      </p>
                      <p className="text-base text-gray-600">
                        {tb.history.timeRange(booking.time, booking.endTime)}
                      </p>
                    </div>
                    <span
                      className="px-3 py-1 rounded text-sm font-semibold text-white"
                      style={{ backgroundColor: isPending ? '#B8860B' : BRAND }}
                    >
                      {isPending ? tb.history.pending : tb.history.confirmed}
                    </span>
                  </div>

                  <div className="bg-gray-50 rounded p-4 mb-4 space-y-3">
                    <div className="flex justify-between text-base">
                      <span className="text-gray-600">{tb.history.menu}</span>
                      <span className="text-gray-800 font-semibold">{sheetMenuName(booking.menu)}</span>
                    </div>
                    <div className="flex justify-between text-base">
                      <span className="text-gray-600">{tb.history.duration}</span>
                      <span className="text-gray-800 font-semibold">{tb.duration(booking.duration)}</span>
                    </div>
                    {booking.isTraining && booking.goals && (
                      <div className="flex justify-between text-base">
                        <span className="text-gray-600">{tb.history.goals}</span>
                        <span className="text-gray-800 font-semibold text-right max-w-[60%]">{goals(booking.goals)}</span>
                      </div>
                    )}
                  </div>

                  {booking.isTraining ? (
                    <p className="text-base text-center text-gray-400">
                      {isPending ? tb.history.trainingPending : tb.history.trainingConfirmed}
                    </p>
                  ) : canCancel ? (
                    <button
                      onClick={() => onCancel(booking.rowIndex, booking)}
                      className={classnames(
                        'w-full py-3 rounded text-base font-semibold transition',
                        'bg-gray-200 text-gray-700 hover:bg-gray-300'
                      )}
                    >
                      {tb.history.changeCancel}
                    </button>
                  ) : (
                    <p className="text-base text-center text-red-500">
                      {tb.history.pastDeadlineLines[0]}<br />
                      {tb.history.pastDeadlineLines[1]}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg px-4 pt-3"
           style={{ paddingBottom: 'calc(env(safe-area-inset-bottom) + 32px)' }}>
        <button
          onClick={onNewBooking}
          className="w-full rounded-2xl font-bold text-white text-lg transition"
          style={{ backgroundColor: BRAND, height: '56px' }}
        >
          {tb.history.newBooking}
        </button>
      </div>
    </div>
  );
};
