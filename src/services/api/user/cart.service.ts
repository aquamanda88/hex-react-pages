import axiosInstance from '../../../utils/axiosInstance';
import { CartDataRequest } from '../../../core/models/cart.model';
const { VITE_API, VITE_API_PATH } = import.meta.env;

/** 購物車 API 服務 */
export class CartApiService {
  /**
   * 加入購物車
   *
   * @param data - 加入購物車之產品資料
   * @returns API 回傳的資料
   */
  addCartItem(data: CartDataRequest) {
    return axiosInstance.post(
      `${VITE_API}/api/${VITE_API_PATH}/cart`,
      data
    );
  }

  /**
   * 取得購物車資料
   *
   * @returns API 回傳的資料
   */
  getCarts() {
    return axiosInstance.get(
      `${VITE_API}/api/${VITE_API_PATH}/cart`
    );
  }

  /**
   * 替換購物車指定產品數量
   *
   * @param id - 購物車 ID
   * @param data - 加入購物車之產品資料
   * @returns API 回傳的資料
   */
  editCartItem(id: string, data: CartDataRequest) {
    return axiosInstance.put(
      `${VITE_API}/api/${VITE_API_PATH}/cart/${id}`,
      data
    );
  }

  /**
   * 刪除購物車指定產品
   *
   * @param id - 購物車 ID
   * @returns API 回傳的資料
   */
  deleteCartItem(id: string) {
    return axiosInstance.delete(
      `${VITE_API}/api/${VITE_API_PATH}/cart/${id}`
    );
  }

  /**
   * 刪除購物車內所有產品
   *
   * @returns API 回傳的資料
   */
  deleteCarts() {
    return axiosInstance.delete(
      `${VITE_API}/api/${VITE_API_PATH}/carts`
    );
  }
}

export default new CartApiService();
