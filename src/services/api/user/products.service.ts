import axiosInstance from '../../../utils/axiosInstance';
const { VITE_API, VITE_API_PATH } = import.meta.env;

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
    return axiosInstance.get(
      `${VITE_API}/api/${VITE_API_PATH}/${URL_PATH}`
    );
  }

  /**
   * 取得單一產品詳細資料
   *
   * @param id - ID
   * @returns API 回傳的資料
   */
  getProductItem(id: string) {
    return axiosInstance.get(
      `${VITE_API}/api/${VITE_API_PATH}/product/${id}`
    );
  }
}

export default new ProductApiService();
