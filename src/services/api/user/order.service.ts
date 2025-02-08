import axiosInstance from '../../../utils/axiosInstance';
import { OrderDataRequest } from '../../../core/models/order.model';
const { VITE_API, VITE_API_PATH } = import.meta.env;

/** 訂單結帳 API 服務 */
export class OrderApiService {
  /**
   * 送出訂單
   *
   * @param data - 欲送出訂單資料
   * @returns API 回傳的資料
   */
  sendOrderItem(data: OrderDataRequest) {
    return axiosInstance.post(
      `${VITE_API}/api/${VITE_API_PATH}/order`,
      data
    );
  }

  /**
   * 取得訂單資料
   *
   * @returns API 回傳的資料
   */
  getOrders() {
    return axiosInstance.get(
      `${VITE_API}/api/${VITE_API_PATH}/orders`
    );
  }

  /**
   * 取得特定訂單資料
   *
   * @param order_id - 訂單 ID
   * @returns API 回傳的資料
   */
  getOrderItem(order_id: string) {
    return axiosInstance.get(
      `${VITE_API}/api/${VITE_API_PATH}/order/${order_id}`
    );
  }

  /**
   * 付款結帳
   *
   * @param order_id - 訂單 ID
   * @returns API 回傳的資料
   */
  sendPayment(order_id: string) {
    return axiosInstance.post(
      `${VITE_API}/api/${VITE_API_PATH}/pay/${order_id}`
    );
  }
}

export default new OrderApiService();
