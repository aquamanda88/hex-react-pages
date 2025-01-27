import axiosCustomer from '../../utils/api/axios-customization';
/** API 呼叫路徑 */
const API_BASE = 'https://ec-course-api.hexschool.io/v2';
/** 專案路徑名稱 */
const API_PATH = 'olive-branch';

/** 產品 API 服務 */
export class ProductApiService {

  /**
   * 取得產品資料
   *
   * @param page - 頁數
   * @returns API 回傳的資料
   */
  getProducts(page?: number) {
    /** API 網址 */
    const URL_PATH = page ? `products?page=${page}` : 'products';
    return axiosCustomer.get(`${API_BASE}/api/${API_PATH}/${URL_PATH}`);
  }

  /**
   * 取得單一產品詳細資料
   *
   * @param id - ID
   * @returns API 回傳的資料
   */
  getProductDetail(id: string) {
    return axiosCustomer.get(`${API_BASE}/api/${API_PATH}/product/${id}`);
  }
}

export default new ProductApiService();
