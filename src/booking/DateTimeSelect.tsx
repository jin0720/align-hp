/**
 * DateTimeSelect.tsx - 週グリッド形式の日時選択
 */

import React, { useState, useEffect, useCallback } from 'react';
import type { BookingSession, Menu } from './types';

interface DateTimeSelectProps {
  booking: BookingSession;
  availableSlots: string[];
  weekAvailability: { [date: string]: string[] };
  weekLoading: boolean;
  onDateSelect: (date: string) => void;
  onTimeSelect: (time: string) => void;
  onNext: () => void;
  onFetchSlots: (date: string, duration: number) => Promise<void>;
  onFetchWeekAvailability: (weekStart: string, duration: number) => Promise<void>;
  onBack: () => void;
  loading: boolean;
  menus?: Menu[];
}

const WEEKDAYS = ['日', '月', '火', '水', '木', '金', '土'];
const WEEKDAY_COLORS = ['text-red-500', 'text-gray-700', 'text-gray-700', 'text-gray-700', 'text-gray-700', 'text-gray-700', 'text-blue-500'];

// 10:00〜22:30を30分刻みで生成
const TIME_SLOTS: string[] = (() => {
  const slots: string[] = [];
  for (let h = 10; h <= 22; h++) {
    for (const m of [0, 30]) {
      if (h === 22 && m === 30) break;
      slots.push(`${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`);
    }
  }
  return slots;
})();

const toDateString = (date: Date): string => {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
};

const parseDate = (dateStr: string): Date => {
  const [y, m, d] = dateStr.split('-').map(Number);
  return new Date(y, m - 1, d);
};

export const DateTimeSelect: React.FC<DateTimeSelectProps> = ({
  booking,
  weekAvailability,
  weekLoading,
  onDateSelect,
  onTimeSelect,
  onNext,
  onFetchWeekAvailability,
  onBack,
}) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [weekStart, setWeekStart] = useState<Date>(() => {
    const d = new Date(today);
    return d;
  });

  // 週の7日分の Date 配列
  const weekDays = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(weekStart);
    d.setDate(weekStart.getDate() + i);
    return d;
  });

  const maxDate = new Date(today);
  maxDate.setMonth(maxDate.getMonth() + 3);

  const isDisabled = (date: Date): boolean => date < today || date > maxDate;

  // 週が変わった or duration が変わったらデータ取得
  const loadWeek = useCallback(() => {
    onFetchWeekAvailability(toDateString(weekStart), booking.duration);
  }, [weekStart, booking.duration, onFetchWeekAvailability]);

  useEffect(() => {
    loadWeek();
  }, [loadWeek]);

  // iOSのbodyスクロールを封じる（LIFFでの戻り現象を防ぐ）
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
      document.documentElement.style.overflow = '';
    };
  }, []);

  const handlePrevWeek = () => {
    const prev = new Date(weekStart);
    prev.setDate(weekStart.getDate() - 7);
    // 今日より前には戻らない
    if (prev >= today) {
      setWeekStart(prev);
    } else {
      setWeekStart(new Date(today));
    }
  };

  const handleNextWeek = () => {
    const next = new Date(weekStart);
    next.setDate(weekStart.getDate() + 7);
    setWeekStart(next);
  };

  const handleCellClick = (date: Date, time: string) => {
    const dateStr = toDateString(date);
    const slots = weekAvailability[dateStr] || [];
    if (!slots.includes(time)) return;
    onDateSelect(dateStr);
    onTimeSelect(time);
  };

  // 月表示（週をまたぐ場合は "YYYY年MM月〜MM月"）
  const firstDay = weekDays[0];
  const lastDay = weekDays[6];
  const monthLabel =
    firstDay.getMonth() === lastDay.getMonth()
      ? `${firstDay.getFullYear()}年${String(firstDay.getMonth() + 1).padStart(2, '0')}月`
      : `${firstDay.getFullYear()}年${String(firstDay.getMonth() + 1).padStart(2, '0')}月〜${String(lastDay.getMonth() + 1).padStart(2, '0')}月`;

  const canGoPrev = new Date(weekStart).setDate(weekStart.getDate() - 7) >= today.getTime();

  return (
    <div className="fixed inset-0 flex flex-col bg-gray-50" style={{ zIndex: 0 }}>
      {/* ナビゲーション */}
      <div className="flex items-center justify-between px-4 py-2 bg-white border-b text-sm font-bold">
        <button
          onClick={handlePrevWeek}
          disabled={!canGoPrev}
          style={{ color: canGoPrev ? '#557A64' : '#C8C8C8' }}
          className={canGoPrev ? '' : 'cursor-not-allowed'}
        >
          前の一週間
        </button>
        <span className="text-gray-600 text-xs">{monthLabel}</span>
        <button onClick={handleNextWeek} style={{ color: '#557A64' }}>
          次の一週間
        </button>
      </div>

      {/* グリッド */}
      <div className="flex-1 overflow-auto pb-40" style={{ WebkitOverflowScrolling: 'touch', overscrollBehavior: 'none' }}>
        <div className="relative">
          {/* 読み込み中オーバーレイ */}
          {weekLoading && (
            <div className="absolute inset-0 bg-white bg-opacity-60 flex items-center justify-center z-10">
              <span className="text-gray-500 text-sm">読み込み中...</span>
            </div>
          )}

          <table className="w-full border-collapse text-center" style={{ tableLayout: 'fixed' }}>
            <thead>
              <tr className="bg-white border-b border-gray-200">
                {/* 時間列ヘッダー */}
                <th className="border-r border-gray-200 py-2 text-xs text-gray-500 font-normal" style={{ width: '46px' }}>
                  日時
                </th>
                {weekDays.map((date, i) => {
                  const disabled = isDisabled(date);
                  const isToday = toDateString(date) === toDateString(today);
                  const dow = date.getDay();
                  return (
                    <th
                      key={i}
                      className={[
                        'py-2 text-xs font-bold border-r border-gray-100',
                        disabled ? 'bg-gray-50' : 'bg-white',
                      ].join(' ')}
                    >
                      <div className={['text-sm', disabled ? 'text-gray-300' : WEEKDAY_COLORS[dow]].join(' ')}>
                        {String(date.getDate()).padStart(2, '0')}
                      </div>
                      <div className={['text-xs', disabled ? 'text-gray-300' : dow === 0 ? 'text-red-400' : dow === 6 ? 'text-blue-400' : 'text-gray-500'].join(' ')}>
                        {WEEKDAYS[dow]}
                        {isToday && <span className="ml-0.5" style={{ color: '#557A64' }}>●</span>}
                      </div>
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody>
              {TIME_SLOTS.map(time => (
                <tr key={time} className="border-b border-gray-100">
                  {/* 時間ラベル */}
                  <td className="border-r border-gray-200 py-2 text-xs text-gray-600 font-medium bg-white" style={{ fontSize: '11px' }}>
                    {time}
                  </td>
                  {weekDays.map((date, di) => {
                    const dateStr = toDateString(date);
                    const disabled = isDisabled(date);
                    const slots = weekAvailability[dateStr];
                    const available = !disabled && slots !== undefined && slots.includes(time);
                    const isSelected = booking.date === dateStr && booking.time === time;

                    return (
                      <td
                        key={di}
                        onClick={() => !disabled && available && handleCellClick(date, time)}
                        className={[
                          'py-2 border-r border-gray-100 transition-colors',
                          isSelected
                            ? 'bg-pink-100'
                            : disabled
                            ? 'bg-gray-50'
                            : available
                            ? 'hover:bg-pink-50 cursor-pointer'
                            : 'bg-gray-50',
                        ].join(' ')}
                      >
                        {disabled || slots === undefined ? (
                          <span className="text-gray-300 text-base">×</span>
                        ) : available ? (
                          <span
                            className="inline-flex items-center justify-center w-6 h-6 rounded-full border-2"
                            style={isSelected
                              ? { borderColor: '#557A64', background: '#557A64' }
                              : { borderColor: '#557A64', background: 'transparent' }
                            }
                          />
                        ) : (
                          <span className="text-gray-300 text-base">×</span>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 下部スティッキーバー */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg px-4 pt-3 pb-6">
        {booking.date && booking.time ? (
          <div className="flex items-center gap-2 mb-3 px-1">
            <span className="text-white text-xs font-bold px-2.5 py-1 rounded-full flex-shrink-0" style={{ background: '#557A64' }}>選択中</span>
            <span className="text-sm font-bold" style={{ color: '#3A5A46' }}>
              {(() => {
                const d = parseDate(booking.date);
                return `${d.getMonth() + 1}/${d.getDate()}（${WEEKDAYS[d.getDay()]}）${booking.time}〜`;
              })()}
            </span>
          </div>
        ) : (
          <p className="text-xs text-center mb-3" style={{ color: '#9E9E9E' }}>日時を選択してください</p>
        )}
        <div className="flex gap-2">
          <button
            onClick={onBack}
            className="w-1/4 rounded-2xl border text-sm font-bold"
            style={{ height: '56px', borderColor: '#C8D9CE', color: '#557A64' }}
          >
            戻る
          </button>
          <button
            onClick={onNext}
            disabled={!booking.date || !booking.time}
            className="flex-1 rounded-2xl font-bold text-white text-base transition-opacity flex items-center justify-center gap-2"
            style={{
              height: '56px',
              background: booking.date && booking.time
                ? 'linear-gradient(90deg, #557A64 0%, #3A5A46 100%)'
                : '#C8CEC9',
              opacity: booking.date && booking.time ? 1 : 0.7,
            }}
          >
            次へ　→
          </button>
        </div>
      </div>
    </div>
  );
};
