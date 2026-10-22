import React from 'react';
import type { BookingSession, Menu } from './types';
import { useBookingText } from '../i18n/useBookingText';
import { LangToggle } from './LangToggle';

interface BookingConfirmProps {
  booking: BookingSession;
  menus: Menu[];
  onConfirm: () => void;
  onCommentChange: (comment: string) => void;
  onBack: () => void;
  loading: boolean;
  error: string | null;
  isTrial?: boolean;
}

const ALIGN_GREEN = '#557A64';
const ALIGN_GREEN_DARK = '#3A5A46';

function getEndTime(startTime: string, duration: number): string {
  const [h, m] = startTime.split(':').map(Number);
  const total = h * 60 + m + duration;
  return `${String(Math.floor(total / 60)).padStart(2, '0')}:${String(total % 60).padStart(2, '0')}`;
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

  return (
    <div className="flex flex-col min-h-screen" style={{ background: '#F7FAF8' }}>
      {/* ヘッダー */}
      <div className="relative text-white text-center py-3 font-bold text-base tracking-widest" style={{ background: ALIGN_GREEN }}>
        {tb.confirm.header}
        <div className="absolute right-3 top-1/2 -translate-y-1/2"><LangToggle /></div>
      </div>

      <div className="flex-1 overflow-y-auto pb-36 px-4 pt-5 space-y-4">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-2xl text-sm">
            {error}
          </div>
        )}

        {/* 体験バッジ（trial=true のとき） */}
        {isTrial && (
          <div className="rounded-2xl px-4 py-3 text-center font-bold text-sm" style={{ background: '#2C5F3F', color: '#fff' }}>
            {tb.confirm.trialBadge}
          </div>
        )}

        {/* 予約内容カード */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="py-2.5 text-center text-sm font-bold text-white" style={{ background: ALIGN_GREEN_DARK }}>
            {tb.confirm.cardTitle}
          </div>
          <Row label={tb.confirm.date}>
            {tb.dateTime(formatDate(booking.date), booking.time, endTime)}
          </Row>
          <Row label={tb.confirm.menu}>
            {tb.confirm.menuLine(selectedMenu ? menuName(selectedMenu.id, selectedMenu.name) : '', tb.duration(booking.duration))}
          </Row>
          {priceInfo && (
            <Row label={tb.confirm.total}>
              <div className="flex items-baseline gap-2">
                {priceInfo.original !== priceInfo.discounted && (
                  <span className="text-xs text-gray-400 line-through">
                    ¥{priceInfo.original.toLocaleString()}
                  </span>
                )}
                <span className="text-base font-bold" style={{ color: ALIGN_GREEN_DARK }}>
                  {isTrial ? tb.confirm.first : ''}¥{priceInfo.discounted.toLocaleString()}{tb.yenSuffix}
                </span>
                <span className="text-xs text-gray-500">{tb.confirm.payOnsite}</span>
              </div>
            </Row>
          )}
        </div>

        {/* トレーニング注意書き */}
        {isTraining && (
          <div className="rounded-2xl p-4 text-xs leading-relaxed" style={{ background: '#FFF8E7', border: '1px solid #D4AF37', color: '#7A6520' }}>
            <p className="font-bold mb-1">{tb.confirm.trainingTitle}</p>
            <p>{tb.confirm.trainingBefore}<strong>{tb.confirm.trainingStrong}</strong>{tb.confirm.trainingAfter}</p>
          </div>
        )}

        {/* コメント欄 */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="py-2.5 text-center text-sm font-bold text-white" style={{ background: ALIGN_GREEN_DARK }}>
            {tb.confirm.commentTitle}
          </div>
          <div className="px-4 py-4">
            <p className="text-xs leading-relaxed mb-3" style={{ color: '#6A6D6B' }}>
              {tb.confirm.commentLines.map((line, i) => (
                <React.Fragment key={i}>{i > 0 && <br />}{line}</React.Fragment>
              ))}
            </p>
            <textarea
              value={booking.comment || ''}
              onChange={e => onCommentChange(e.target.value)}
              placeholder={tb.confirm.commentPlaceholder}
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
        {/* キャンセルポリシー（マッサージのみ） */}
        {!isTraining && (
          <div className="rounded-xl px-4 py-3 text-xs leading-relaxed"
               style={{ background: '#FFF0F0', border: '1px solid #FFAAAA', color: '#C0392B' }}>
            <p className="font-bold mb-1">{tb.confirm.policyTitle}</p>
            <p>{tb.confirm.policyFreeBefore}<strong>{tb.confirm.policyFreeStrong}</strong></p>
            <p>{tb.confirm.policyFullBefore}<strong>{tb.confirm.policyFullStrong}</strong></p>
          </div>
        )}
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
          {loading ? tb.confirm.sending : isTraining ? tb.confirm.submitTraining : tb.confirm.submit}
        </button>
        <button
          onClick={onBack}
          disabled={loading}
          className="w-full py-3 rounded-2xl font-bold text-sm"
          style={{ color: ALIGN_GREEN, border: `1.5px solid #C8D9CE`, background: '#fff' }}
        >
          {tb.confirm.edit}
        </button>
      </div>
    </div>
  );
};
