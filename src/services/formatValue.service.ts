import { format } from 'date-fns/fp/format';
import { CartsDatum } from '../core/models/cart.model';

/**
 * 價格加上千分位
 *
 * @param price - 價格
 * @returns 加上千分位之價格
 */
export function formatPrice(price?: number): string {
  if (price) {
    return new Intl.NumberFormat().format(price);
  } else {
    return '0';
  }
}

/**
 * 取得轉換後的日期格式
 *
 * @param secondsValue - 秒數
 * @param formatType - 格式類型
 * @returns 轉換後的日期
 */
export function formatDate(
  secondsValue?: number,
  formatType: 'full' | 'short' = 'full'
): string {
  if (secondsValue) {
    const dateValue = new Date(secondsValue * 1000);
    const formatString =
      formatType === 'full' ? 'yyyy/MM/dd HH:mm:ss' : 'yyyy/MM/dd';
    return format(formatString)(dateValue);
  } else {
    return 'Unknown';
  }
}

/**
 * 取得自定義訂單編號
 *
 * @param secondsValue - 秒數
 * @returns 自定義訂單編號
 */
export function generateOrderCode(secondsValue?: number): string {
  if (secondsValue) {
    const dateValue = new Date(secondsValue * 1000);
    return format('yyyyMMddHHmmss')(dateValue);
  } else {
    return '00000000000000';
  }
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
