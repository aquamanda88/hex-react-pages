import { format } from 'date-fns/fp/format';
import { CartsDatum } from '../core/models/cart.model';

/**
 * 價格加上千分位
 *
 * @param price - 價格
 * @returns 加上千分位之價格
 */
export function formatPrice(price: number | undefined): string {
  if (price) {
    return new Intl.NumberFormat().format(price);
  } else {
    return '0';
  }
}

/**
 * 取得轉換後的日期
 *
 * @param secondsValue - 秒數
 * @returns 轉換後的日期
 */
export function formatDate(secondsValue: number): string {
  const dateValue = new Date(secondsValue * 1000);
  return format('yyyy/MM/dd HH:mm:ss')(dateValue);
}

/**
 * 設定無資料時顯示文字
 *
 * @param name - 欄位名稱
 * @param value - 欲處理資料
 * @returns 處理後的文字
 */
export function formatUnknownText(name: string, value?: string): string {
  if (value) {
    return value;
  } else {
    return name === 'artists_zh_tw' ? '佚名' : 'Unknown';
  }
}

/**
 * 取得購物車總數量
 *
 * @param carts - 購物車資料
 * @returns 購物車內產品總數量
 */
export function calculateTotalQty(carts: CartsDatum[]): number {
  return carts.length;
}
