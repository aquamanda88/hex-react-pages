import { BaseData } from "../utils.model";

/** 登入 request */
export interface LoginReq {
  /** 會員帳號 */
  username?: string;
  /** 會員密碼 */
  password?: string;
}

/** 登入 request 驗證欄位 */
export interface LoginValidation {
  /** 會員帳號 */
  username?: boolean;
  /** 會員密碼 */
  password?: boolean;
}

/** 登入 response */
export interface LoginRes extends BaseData {
  /** 訊息資料 */
  message?: string;
  /** uid */
  uid?: string;
  /** 登入憑證 */
  token?: string;
  /** 有效期間 */
  expired?: number;
  /** 錯誤訊息物件 */
  error?: ErrorData;
}

/** 檢查使用者狀態 response */
export interface CheckUserRes extends BaseData {
  /** uid */
  uid?: string;
}

/** 錯誤訊息物件 */
export interface ErrorData {
  /** 錯誤代碼 */
  code: string;
  /** 錯誤訊息 */
  message: string;
}
