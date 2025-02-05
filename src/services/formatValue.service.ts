import { format } from "date-fns/fp/format";

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
}

export default new FormatValueService();
