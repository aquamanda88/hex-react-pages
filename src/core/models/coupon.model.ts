import { PaginationDatum } from './utils.model';

/** 優惠券資料 request */
export interface CouponDataRequest {
  /** 回傳格式 */
  data: CouponDatum;
}

/** 優惠券資料 request 資料 */
export interface CouponDatum {
  /** 優惠券名稱 */
  title: string;
  /** 是否啟用 */
  is_enabled: number;
  /** 折價比例 (%) */
  percent: number;
  /** 優惠券使用截止日期 - 單位 (秒) */
  due_date: number;
  /** 優惠券使用代碼 */
  code?: string;
}

/** 優惠券資料 response */
export interface CouponDataResponse {
  /** 是否成功 */
  success?: boolean;
  /** 優惠券物件陣列 */
  coupons: CouponDatum[];
  /** 頁數資料	 */
  pagination?: PaginationDatum;
  /** 錯誤訊息 */
  messages?: string | string[];
}

/** 優惠券資料 (有 id) */
export interface CouponFullDatum extends CouponDatum {
  /** 優惠券 ID */
  id: string;
}

/** 套用優惠券資料 request */
export interface CouponUsingRequest {
  /** 回傳格式 */
  data: {
    /** 優惠券使用代碼 */
    code?: string;
  };
}

/** 套用優惠券資料 response */
export interface CouponUsingResponse {
  /** 是否成功 */
  success: boolean;
  /** 回傳格式 */
  data: {
    /** 購物車最終總價 */
    final_total: number;
  };
  /** 回傳訊息 */
  message: string;
}
