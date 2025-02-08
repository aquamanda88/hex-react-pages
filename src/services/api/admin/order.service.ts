import axiosInstance from '../../../utils/axiosInstance';
import { CartDataRequest } from '../../../core/models/cart.model';
const { VITE_API, VITE_API_PATH } = import.meta.env;

/** 訂單結帳 API 服務 */
export class OrderApiService {
  /**
   * 取得訂單資料
   *
   * @returns API 回傳的資料
   */
  getOrders() {
    return axiosInstance.get(
      `${VITE_API}/api/${VITE_API_PATH}/admin/orders`
    );
  }

  /**
   * 更新訂單資料
   *
   * @param id - 訂單資料 ID
   * @param data - 欲修改的訂單資料
   * @returns API 回傳的資料
   */
  editOrderItem(id: string, data: CartDataRequest) {
    return axiosInstance.put(
      `${VITE_API}/api/${VITE_API_PATH}/admin/order/${id}`,
      data
    );
  }

  /**
   * 刪除指定訂單資料
   *
   * @param id - 訂單資料 ID
   * @returns API 回傳的資料
   */
  deleteOrderItem(id: string) {
    return axiosInstance.delete(
      `${VITE_API}/api/${VITE_API_PATH}/admin/order/${id}`
    );
  }

  /**
   * 刪除所有訂單資料
   *
   * @returns API 回傳的資料
   */
  deleteOrders() {
    return axiosInstance.delete(
      `${VITE_API}/api/${VITE_API_PATH}/admin/orders/all`
    );
  }
}

export default new OrderApiService();
