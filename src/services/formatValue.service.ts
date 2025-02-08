import { format } from "date-fns/fp/format";
import { CartsDatum } from "../core/models/cart.model";

/** 轉換內容值服務 */
export class FormatValueService {
  /**
   * 價格加上千分位
   *
   * @param price - 價格
   * @returns 加上千分位之價格
   */
  formatPrice(price: number | undefined): string {
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
  formatDate(secondsValue: number): string {
    const dateValue = new Date(secondsValue * 1000);
    const formattedDate = format('yyyy/MM/dd HH:mm:ss')(dateValue);
    return formattedDate;
  }

  /**
   * 取得購物車總數量
   *
   * @param carts - 購物車資料
   * @returns 購物車內產品總數量
   */
  calculateTotalQty(carts: CartsDatum[]): number {
    return carts.length;
  }
}

export default new FormatValueService();
