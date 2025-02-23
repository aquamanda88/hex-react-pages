import { CouponFullDatum } from "./coupon.model";
import { ProductFullDatum } from "./utils.model";

/** 產品資料 request */
export interface CartDataRequest {
  /** 回傳格式 */
  data: CartDataRequestDatum;
}

/** 產品資料 request 資料 */
export interface CartDataRequestDatum {
  /** 產品 ID */
  product_id: string;
  /** 產品數量 */
  qty: number;
}

/** 產品資料 response */
export interface CartDataResponse {
  /** 是否成功 */
  success?: boolean;
  /** 資料物件 */
  data: CartDataDatum;
  /** 錯誤訊息 */
  message?: string | string[];
}

/** 產品資料 */
export interface CartDataDatum {
  /** 購物車資料 */
  carts: CartsDatum[];
  /** 購物車總價 */
  total: number;
  /** 購物車最終總價 */
  final_total: number;
}

/** 購物車資料 */
export interface CartsDatum {
  /** 優惠券使用資料 */
  coupon?: CouponFullDatum;
  /** 購物車總價 */
  total: number;
  /** 購物車最終總價 */
  final_total: number;
  /** 購物車內同產品之品項 ID */
  id: string;
  /** 購物車產品內容 */
  product: ProductFullDatum;
  /** 產品資訊 ID */
  product_id: string;
  /** 數量 */
  qty: number;
}