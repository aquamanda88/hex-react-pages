/** 訂單資料 request */
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

/** 訂單資料 驗證欄位 */
export interface OrderValidation {
  /** 會員姓名 */
  name?: boolean;
  /** 會員電子信箱 */
  email?: boolean;
  /** 會員聯絡電話 */
  tel?: boolean;
  /** 會員地址 */
  address?: boolean;
}

/** 訂單資料 錯誤訊息欄位 */
export interface OrderValidationMessage {
  /** 會員姓名 */
  name?: string;
  /** 會員電子信箱 */
  email?: string;
  /** 會員聯絡電話 */
  tel?: string;
  /** 會員地址 */
  address?: string;
}