import axiosInstance from '../../../utils/axiosInstance';
import { CartDataRequest } from '../../../core/models/cart.model';
const { VITE_API, VITE_API_PATH } = import.meta.env;

/** 訂單結帳 API 服務 */
export class OrderApiService {
  /**
   * 取得訂單資料
   *
   * @param page - 頁數
   * @returns API 回傳的資料
   */
  getOrders(page?: number) {
    /** 權限 token */
    const token = sessionStorage.getItem('token');
    /** API 網址 */
    const URL_PATH = page ? `orders?page=${page}` : 'orders';

    return axiosInstance.get(
      `${VITE_API}/api/${VITE_API_PATH}/admin/${URL_PATH}`,
      {
        headers: {
          Authorization: token,
        },
      }
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
    /** 權限 token */
    const token = sessionStorage.getItem('token');

    return axiosInstance.put(
      `${VITE_API}/api/${VITE_API_PATH}/admin/order/${id}`,
      data,
      {
        headers: {
          Authorization: token,
        },
      }
    );
  }

  /**
   * 刪除指定訂單資料
   *
   * @param id - 訂單資料 ID
   * @returns API 回傳的資料
   */
  deleteOrderItem(id: string) {
    /** 權限 token */
    const token = sessionStorage.getItem('token');

    return axiosInstance.delete(
      `${VITE_API}/api/${VITE_API_PATH}/admin/order/${id}`,
      {
        headers: {
          Authorization: token,
        },
      }
    );
  }

  /**
   * 刪除所有訂單資料
   *
   * @returns API 回傳的資料
   */
  deleteOrders() {
    /** 權限 token */
    const token = sessionStorage.getItem('token');

    return axiosInstance.delete(
      `${VITE_API}/api/${VITE_API_PATH}/admin/orders/all`,
      {
        headers: {
          Authorization: token,
        },
      }
    );
  }
}

export default new OrderApiService();
