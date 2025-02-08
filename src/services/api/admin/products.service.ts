import { AddProductRequest, EditProductRequest } from '../../../core/models/utils.model';
import axiosCustomer from '../../../utils/api/axios-customization';
const { VITE_API, VITE_API_PATH } = import.meta.env;

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
      `${VITE_API}/api/${VITE_API_PATH}/admin/upload`,
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

    return axiosCustomer.get(
      `${VITE_API}/api/${VITE_API_PATH}/admin/${URL_PATH}`,
      {
        headers: {
          Authorization: token,
        },
      }
    );
  }

  /**
   * 新增產品資料
   *
   * @param addProductRequest - 新增產品 request
   * @param temporaryToken - 未保持登入時 token
   * @returns API 回傳的資料
   */
  addProductItem(addProductRequest: AddProductRequest) {
    /** 權限 token */
    const token = sessionStorage.getItem('token');

    return axiosCustomer.post(
      `${VITE_API}/api/${VITE_API_PATH}/admin/product`,
      addProductRequest,
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
   * @param editProductRequest - 編輯產品 request
   * @param temporaryToken - 未保持登入時 token
   * @returns API 回傳的資料
   */
  editProductItem(id: string, editProductRequest: EditProductRequest) {
    /** 權限 token */
    const token = sessionStorage.getItem('token');

    return axiosCustomer.put(
      `${VITE_API}/api/${VITE_API_PATH}/admin/product/${id}`,
      editProductRequest,
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
  deleteProductItem(id: string) {
    /** 權限 token */
    const token = sessionStorage.getItem('token');

    return axiosCustomer.delete(
      `${VITE_API}/api/${VITE_API_PATH}/admin/product/${id}`,
      {
        headers: {
          Authorization: token,
        },
      }
    );
  }
}

export default new ProductApiService();
