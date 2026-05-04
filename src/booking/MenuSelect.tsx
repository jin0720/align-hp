import React from 'react';
import type { BookingSession, Menu } from './types';

interface MenuSelectProps {
  menus: Menu[];
  booking: BookingSession;
  onMenuSelect: (menuId: string) => void;
  onDurationSelect: (duration: number) => void;
  onNext: () => void;
  loading: boolean;
}

const ALIGN_GREEN = '#557A64';
const ALIGN_GREEN_DARK = '#3A5A46';
const ALIGN_GREEN_LIGHT = '#EEF3F0';

const MENU_META: Record<string, { emoji: string; desc: string }> = {
  oil: {
    emoji: '🫧',
    desc: '全身のコリや疲れを癒すオイルトリートメント',
  },
  seitai: {
    emoji: '🌿',
    desc: '骨格・姿勢を整える本格整体ケア',
  },
};

export const MenuSelect: React.FC<MenuSelectProps> = ({
  menus,
  booking,
  onMenuSelect,
  onDurationSelect,
  onNext,
  loading,
}) => {
  const selectedMenu = menus.find(m => m.id === booking.menu);
  const selectedPrice = selectedMenu?.prices[booking.duration];

  const handleMenuClick = (menuId: string) => {
    onMenuSelect(menuId);
    const menu = menus.find(m => m.id === menuId);
    if (menu) {
      const firstDuration = Number(Object.keys(menu.prices)[0]);
      onDurationSelect(firstDuration);
    }
  };

  const getPriceRange = (menu: Menu) => {
    const prices = Object.values(menu.prices);
    const min = Math.min(...prices.map(p => p.discounted));
    const max = Math.max(...prices.map(p => p.discounted));
    return `¥${min.toLocaleString()} 〜 ¥${max.toLocaleString()}`;
  };

  return (
    <div className="flex flex-col min-h-screen" style={{ background: '#F7FAF8' }}>
      {/* ヘッダー */}
      <div
        className="text-white text-center py-3 font-bold text-base tracking-widest"
        style={{ background: ALIGN_GREEN }}
      >
        メニュー
      </div>

      {/* コンテンツ */}
      <div className="flex-1 overflow-y-auto pb-32">
        {/* セクションタイトル */}
        <div className="px-4 pt-5 pb-2">
          <p className="text-xs font-bold tracking-widest" style={{ color: ALIGN_GREEN }}>
            ★ ディープリラクゼーション ★
          </p>
          <p className="text-xs mt-0.5" style={{ color: '#6A6D6B' }}>
            ご希望のメニューをお選びください
          </p>
        </div>

        {/* メニューカード */}
        <div className="px-4 space-y-3">
          {loading && menus.length === 0 ? (
            <div className="text-center py-12" style={{ color: '#6A6D6B' }}>読み込み中...</div>
          ) : (
            menus.map(menu => {
              const isSelected = booking.menu === menu.id;
              const meta = MENU_META[menu.id] ?? { emoji: '✨', desc: '' };
              const durations = Object.keys(menu.prices).map(Number);

              return (
                <div key={menu.id}>
                  {/* カード本体 */}
                  <button
                    onClick={() => handleMenuClick(menu.id)}
                    className="w-full text-left rounded-2xl overflow-hidden shadow-sm border-2 transition-all"
                    style={{
                      borderColor: isSelected ? ALIGN_GREEN : '#E0EDE6',
                      background: '#FFFFFF',
                    }}
                  >
                    <div className="flex items-stretch">
                      {/* 左：アクセントカラー帯 + 絵文字 */}
                      <div
                        className="flex items-center justify-center w-24 flex-shrink-0 text-4xl"
                        style={{
                          background: isSelected
                            ? `linear-gradient(160deg, ${ALIGN_GREEN} 0%, ${ALIGN_GREEN_DARK} 100%)`
                            : `linear-gradient(160deg, #C8D9CE 0%, #A8C4B0 100%)`,
                          minHeight: '108px',
                        }}
                      >
                        {meta.emoji}
                      </div>

                      {/* 右：テキスト */}
                      <div className="flex-1 px-4 py-4">
                        <div className="flex items-start justify-between">
                          <p
                            className="font-bold text-base leading-snug"
                            style={{ color: isSelected ? ALIGN_GREEN_DARK : '#333333' }}
                          >
                            {menu.name}
                          </p>
                          {isSelected ? (
                            <span
                              className="w-6 h-6 rounded-full flex items-center justify-center text-white text-xs flex-shrink-0 ml-2 mt-0.5"
                              style={{ background: ALIGN_GREEN }}
                            >
                              ✓
                            </span>
                          ) : (
                            <span
                              className="w-6 h-6 rounded-full border-2 flex-shrink-0 ml-2 mt-0.5"
                              style={{ borderColor: '#C8D9CE' }}
                            />
                          )}
                        </div>
                        <p className="text-xs mt-1 leading-relaxed" style={{ color: '#6A6D6B' }}>
                          {meta.desc}
                        </p>
                        <p className="text-sm font-bold mt-2" style={{ color: ALIGN_GREEN }}>
                          {getPriceRange(menu)}
                        </p>
                      </div>
                    </div>
                  </button>

                  {/* 時間・料金オプション（選択中のみ展開） */}
                  {isSelected && (
                    <div
                      className="rounded-b-2xl -mt-2 pt-4 pb-3 px-4 space-y-2 border-x-2 border-b-2"
                      style={{ borderColor: ALIGN_GREEN, background: ALIGN_GREEN_LIGHT }}
                    >
                      <p className="text-xs font-bold mb-2" style={{ color: ALIGN_GREEN_DARK }}>
                        施術時間を選択
                      </p>
                      <div className="grid grid-cols-2 gap-2">
                        {durations.map(dur => {
                          const price = menu.prices[dur];
                          const isSelectedDur = booking.duration === dur;
                          return (
                            <button
                              key={dur}
                              onClick={() => onDurationSelect(dur)}
                              className="rounded-xl py-3 px-2 text-center border-2 transition-all"
                              style={{
                                borderColor: isSelectedDur ? ALIGN_GREEN : '#C8D9CE',
                                background: isSelectedDur ? ALIGN_GREEN : '#FFFFFF',
                                color: isSelectedDur ? '#FFFFFF' : '#333333',
                              }}
                            >
                              <p className="font-bold text-sm">{price.label}</p>
                              <p
                                className="text-xs mt-0.5"
                                style={{ color: isSelectedDur ? 'rgba(255,255,255,0.75)' : '#6A6D6B' }}
                              >
                                <span className="line-through">¥{price.original.toLocaleString()}</span>
                              </p>
                              <p className="font-bold text-base">
                                ¥{price.discounted.toLocaleString()}
                              </p>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* ご来店について */}
        <div
          className="mx-4 mt-6 rounded-2xl p-4 text-xs"
          style={{ background: '#EEF3F0', border: '1px solid #C8D9CE', color: '#3A5A46' }}
        >
          <p className="font-bold mb-2" style={{ color: ALIGN_GREEN_DARK }}>ご来店について</p>
          <ul className="space-y-1.5">
            <li className="flex gap-2"><span style={{ color: ALIGN_GREEN }}>●</span>ご予約時間の5分前からご来店可能です。早く着きそうな場合はLINEでご確認おねがいします</li>
            <li className="flex gap-2 flex-col">
              <div className="flex gap-2"><span style={{ color: ALIGN_GREEN }}>●</span><span>キャンセルについて</span></div>
              <div className="ml-4 space-y-0.5" style={{ color: '#5A7A6A' }}>
                <p>前日23時まで：無料</p>
                <p>当日キャンセル：全額</p>
              </div>
            </li>
          </ul>
        </div>
      </div>

      {/* 下部スティッキーバー */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg px-4 pt-3 pb-6">
        {booking.menu && selectedPrice ? (
          <div className="flex items-center gap-2 mb-3 px-1">
            <span
              className="text-white text-xs font-bold px-2.5 py-1 rounded-full flex-shrink-0"
              style={{ background: ALIGN_GREEN }}
            >
              選択中
            </span>
            <span className="text-sm font-bold truncate" style={{ color: ALIGN_GREEN_DARK }}>
              {selectedMenu?.name}
            </span>
            <span className="text-sm font-bold ml-auto flex-shrink-0" style={{ color: ALIGN_GREEN }}>
              ¥{selectedPrice.discounted.toLocaleString()}
            </span>
          </div>
        ) : (
          <p className="text-xs text-center mb-3" style={{ color: '#9E9E9E' }}>
            メニューを選択してください
          </p>
        )}
        <button
          onClick={onNext}
          disabled={!booking.menu || loading}
          className="w-full rounded-2xl font-bold text-white transition-opacity flex items-center justify-center gap-2"
          style={{
            height: '56px',
            fontSize: '17px',
            letterSpacing: '0.05em',
            background: booking.menu && !loading
              ? `linear-gradient(90deg, ${ALIGN_GREEN} 0%, ${ALIGN_GREEN_DARK} 100%)`
              : '#C8CEC9',
            opacity: booking.menu && !loading ? 1 : 0.7,
          }}
        >
          次へ　→
        </button>
      </div>
    </div>
  );
};
