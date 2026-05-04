import React from 'react';
import type { BookingStep } from './types';

interface StepIndicatorProps {
  currentStep: BookingStep;
}

const STEPS: { key: BookingStep; label: string }[] = [
  { key: 'menu', label: 'メニュー' },
  { key: 'datetime', label: '日時選択' },
  { key: 'confirm', label: '予約内容確認' },
  { key: 'complete', label: 'ご予約完了' },
];

const STEP_ORDER: BookingStep[] = ['menu', 'datetime', 'confirm', 'complete'];

const ALIGN_GREEN = '#557A64';
const ALIGN_GREEN_DONE = '#7A9E8E';

export const StepIndicator: React.FC<StepIndicatorProps> = ({ currentStep }) => {
  const currentIndex = STEP_ORDER.indexOf(currentStep);

  return (
    <div className="bg-white px-4 py-3 border-b border-gray-100">
      <div className="flex items-center justify-between">
        {STEPS.map((step, index) => {
          const isDone = index < currentIndex;
          const isActive = index === currentIndex;

          return (
            <React.Fragment key={step.key}>
              <div className="flex flex-col items-center" style={{ minWidth: 0, flex: '0 0 auto' }}>
                <div
                  className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold transition-colors"
                  style={{
                    background: isDone
                      ? ALIGN_GREEN_DONE
                      : isActive
                      ? ALIGN_GREEN
                      : '#E0E0E0',
                    color: isDone || isActive ? '#FFFFFF' : '#9E9E9E',
                    boxShadow: isActive ? `0 2px 8px ${ALIGN_GREEN}60` : 'none',
                  }}
                >
                  {isDone ? '✓' : index + 1}
                </div>
                <span
                  className="mt-1 text-center leading-tight"
                  style={{
                    fontSize: '10px',
                    maxWidth: '56px',
                    color: isActive ? ALIGN_GREEN : '#9E9E9E',
                    fontWeight: isActive ? 700 : 400,
                  }}
                >
                  {step.label}
                </span>
              </div>

              {index < STEPS.length - 1 && (
                <div
                  className="flex-1 h-0.5 mx-1 mb-5"
                  style={{
                    background: index < currentIndex ? ALIGN_GREEN_DONE : '#E0E0E0',
                  }}
                />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};
