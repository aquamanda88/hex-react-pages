/** 基本 BaseData */
export interface BaseData {
  /** HttpStatus 狀態碼 */
  status?: string;
  /** 是否成功 */
  success?: boolean;
  /** 錯誤訊息 */
  message?: string | string[];
}

/** 商品類 API 回傳欄位 */
export interface ProductObj {
  /** 各產品資訊 */
  [key: string]: ProductFullDatum;
}

/** 商品類 API 回傳基準欄位 (無 id) */
export interface ProductDatum {
  /** 是否啟用 */
  is_enabled?: number;
  /** 數量 */
  num?: number;
  /** 標題 */
  title?: string;
  /** 描述 */
  content?: string;
  /** 說明 */
  description?: string;
  /** 分類 */
  category?: string;
  /** 單位 */
  unit?: string;
  /** 原價 */
  origin_price?: number;
  /** 售價 */
  price?: number;
  /** 主圖網址 */
  imageUrl?: string;
  /** 圖片網址陣列 */
  imagesUrl?: string[];
}

/** 商品類 API 回傳基準欄位 (有 id) */
export interface ProductFullDatum extends ProductDatum {
  /** 產品資訊 id */
  id?: string;
}
