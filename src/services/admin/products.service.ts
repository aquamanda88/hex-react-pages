import { ProductDatum } from '../../core/models/utils.model';
import axiosCustomer from '../../utils/api/axios-customization';
/** API 呼叫路徑 */
const API_BASE = 'https://ec-course-api.hexschool.io/v2';
/** 專案路徑名稱 */
const API_PATH = 'olive-branch';

/** 產品 API 服務 */
export class ProductApiService {
  /**
   * 上傳圖片
   * 
   * @param imageData - 欲上傳圖片資料
   * @param temporaryToken - 未保持登入時 token
   * @returns API 回傳的資料
   */
  uploadImage(imageData: FormData) {
    /** 權限 token */
    const token = sessionStorage.getItem('token');

    return axiosCustomer.post(
      `${API_BASE}/api/${API_PATH}/admin/upload`,
      imageData,
      {
        headers: {
          Authorization: token,
        },
      }
    );
  }

  /**
   * 取得產品資料
   *
   * @param page - 頁數
   * @param temporaryToken - 未保持登入時 token
   * @returns API 回傳的資料
   */
  getProducts(page?: number) {
    /** 權限 token */
    const token = sessionStorage.getItem('token');
    /** API 網址 */
    const URL_PATH = page ? `products?page=${page}` : 'products';

    return axiosCustomer.get(`${API_BASE}/api/${API_PATH}/admin/${URL_PATH}`, {
      headers: {
        Authorization: token,
      },
    });
  }

  /**
   * 新增產品資料
   *
   * @param addProductData - 新增產品資料
   * @param temporaryToken - 未保持登入時 token
   * @returns API 回傳的資料
   */
  addProduct(addProductData: { data: ProductDatum }) {
    /** 權限 token */
    const token = sessionStorage.getItem('token');

    return axiosCustomer.post(
      `${API_BASE}/api/${API_PATH}/admin/product`,
      addProductData,
      {
        headers: {
          Authorization: token,
        },
      }
    );
  }

  /**
   * 編輯產品資料
   *
   * @param id - 欲編輯產品 ID
   * @param editProductData - 編輯產品資料
   * @param temporaryToken - 未保持登入時 token
   * @returns API 回傳的資料
   */
  editProduct(id: string, editProductData: { data: ProductDatum }) {
    /** 權限 token */
    const token = sessionStorage.getItem('token');

    return axiosCustomer.put(
      `${API_BASE}/api/${API_PATH}/admin/product/${id}`,
      editProductData,
      {
        headers: {
          Authorization: token,
        },
      }
    );
  }

  /**
   * 刪除產品資料
   *
   * @param id - 欲刪除產品 ID
   * @param temporaryToken - 未保持登入時 token
   * @returns API 回傳的資料
   */
  deleteProduct(id: string) {
    /** 權限 token */
    const token = sessionStorage.getItem('token');

    return axiosCustomer.delete(
      `${API_BASE}/api/${API_PATH}/admin/product/${id}`,
      {
        headers: {
          Authorization: token,
        },
      }
    );
  }
}

export default new ProductApiService();
