/**
 * pricing.ts - マッサージ/整体の料金表（切替日時で自動的に新料金へ）
 * サーバー(align-booking-bot/src/config.js)の料金表と必ず同じ値にすること。
 */

// 2026-11-15 00:00 (JST) 以降は新料金
export const PRICE_CHANGE_AT = new Date('2026-11-15T00:00:00+09:00');

const OLD: Record<number, number> = { 70: 10000, 100: 13000, 130: 16000, 160: 19000 };
const NEW: Record<number, number> = { 70: 10000, 100: 14000, 130: 18000, 160: 22000 };

/** 指定時点（既定は現在）のマッサージ/整体の定価 */
export const massageListPrices = (at: Date = new Date()): Record<number, number> =>
  at < PRICE_CHANGE_AT ? OLD : NEW;
