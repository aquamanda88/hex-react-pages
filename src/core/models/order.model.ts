import { CartsDatum } from './cart.model';
import { PaginationDatum } from './utils.model';

/** 送出訂單之回傳資料 request */
export interface OrderDataRequest {
  /** 回傳格式 */
  data: OrderDataRequestDatum;
}

/** 訂單資料 request 資料 */
export interface OrderDataRequestDatum {
  /** 會員資料 */
  user: OrderUserDatum;
  /** 留言備註 */
  message?: string;
}

/** 會員資料 */
export interface OrderUserDatum {
  /** 會員姓名 */
  name: string;
  /** 會員電子信箱 */
  email: string;
  /** 會員聯絡電話 */
  tel: string;
  /** 會員地址 */
  address: string;
}

/** 訂單資料 formData */
export interface OrderFormData {
  /** 會員姓名 */
  name: string;
  /** 會員電子信箱 */
  email: string;
  /** 會員聯絡電話 */
  tel: string;
  /** 會員地址 */
  address: string;
  /** 留言備註 */
  message?: string;
}

/** 送出訂單之回傳資料 response */
export interface OrderDataResponse {
  /** 是否成功 */
  success?: boolean;
  /** 回傳訊息 */
  message?: string | string[];
  /** 訂單總價 */
  total?: number;
  /** 訂單送出時間 */
  create_at?: number;
  /** 訂單 ID */
  orderId?: string;
}

/** 查詢所有訂單 response */
export interface OrdersResponse {
  /** 是否成功 */
  success?: boolean;
  /** 回傳訊息 */
  message?: string | string[];
  /** 訂單資料 */
  orders: OrdersDatum[];
  /** 頁數資料	 */
  pagination?: PaginationDatum;
}

/** 查詢特定訂單 response */
export interface OrderResponse {
  /** 是否成功 */
  success?: boolean;
  /** 訂單資料 */
  order: OrderDatum;
}

/** 特定訂單資料 */
export interface OrderDatum extends OrdersDatum {
  /** 訂單總價 */
  total?: number;
}

/** 訂單資料 */
export interface OrdersDatum {
  /** 訂單送出時間 */
  create_at?: number;
  /** 訂單 ID */
  id?: string;
  /** 是否已付款 */
  is_paid?: boolean;
  /** 付款時間 */
  paid_date?: number;
  /** 數量 */
  num?: number;
  /** 會員留言備註內容 */
  message?: number;
  /** 產品物件陣列 */
  products: ProductsDatum;
  /** 會員資料 */
  user?: OrderUserDatum;
}

/** 產品資料 request 資料 */
export interface ProductsDatum {
  /** 各產品資訊 */
  [key: string]: CartsDatum;
}
