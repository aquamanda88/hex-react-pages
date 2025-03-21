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

/** pagination */
export interface PaginationDatum {
  /** 總頁數 */
  total_pages?: number;
  /** 目前頁數 */
  current_page?: number;
  /** 是否有上一頁 */
  has_pre?: boolean;
  /** 是否有下一頁 */
  has_next?: boolean;
  /** 分類 */
  category?: string;
}

/** 商品類 API 回傳基準欄位 (無 id) */
export interface ProductDatum {
  /** 是否啟用 */
  is_enabled?: number;
  /** 排序 */
  num?: number;
  /** 標題 */
  title?: string;
  /** 描述 */
  description?: string;
  /** 內容 */
  content?: ContentDatum;
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

/** 新增產品 request */
export interface AddProductRequest {
  /** 回傳格式 */
  data: ProductDatum;
}

/** 編輯產品 request */
export interface EditProductRequest {
  /** 回傳格式 */
  data: ProductDatum;
}

/** 擴充欄位 */
export interface ProductItemDatum {
  /** 描述 */
  description?: string;
  /** 主圖網址 */
  imageUrl?: string;
  /** 圖片網址陣列 */
  imagesUrl?: string[];
}

/** 內容擴充欄位 */
export interface ContentDatum {
  /** 內容 */
  content?: string;
  /** 作品名稱 */
  name?: string;
  /** 作者名稱 */
  artists?: string;
  /** 作者華文名稱 */
  artists_zh_tw?: string;
  /** 作品年份 */
  year?: string;
}

/** 商品表單欄位 */
export interface ProductForm {
  /** 是否啟用 */
  is_enabled?: number;
  /** 排序 */
  num?: number;
  /** 標題 */
  title?: string;
  /** 描述 */
  description?: string;
  /** 內容 */
  content?: string;
  /** 作品名稱 */
  name?: string;
  /** 作者名稱 */
  artists?: string;
  /** 作者華文名稱 */
  artists_zh_tw?: string;
  /** 作品年份 */
  year?: string;
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
