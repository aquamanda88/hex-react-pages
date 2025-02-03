import axiosCustomer from '../../utils/api/axios-customization';
import { basicConstant } from '../../core/constants/basic.constants';
import { OrderDataRequest } from '../../core/models/order.model';

/** 訂單結帳 API 服務 */
export class OrderApiService {
  /**
   * 送出訂單
   *
   * @param data - 欲送出訂單資料
   * @returns API 回傳的資料
   */
  sendOrder(data: OrderDataRequest) {
    return axiosCustomer.post(
      `${basicConstant.API_BASE}/api/${basicConstant.API_PATH}/order`,
      data
    );
  }

  /**
   * 取得訂單資料
   *
   * @returns API 回傳的資料
   */
  getOrders() {
    return axiosCustomer.get(
      `${basicConstant.API_BASE}/api/${basicConstant.API_PATH}/orders`
    );
  }

  /**
   * 取得特定訂單資料
   *
   * @param order_id - 訂單 ID
   * @returns API 回傳的資料
   */
  getOrderData(order_id: string) {
    return axiosCustomer.get(
      `${basicConstant.API_BASE}/api/${basicConstant.API_PATH}/order/${order_id}`
    );
  }

  /**
   * 付款結帳
   *
   * @param order_id - 訂單 ID
   * @returns API 回傳的資料
   */
  payOrder(order_id: string) {
    return axiosCustomer.post(
      `${basicConstant.API_BASE}/api/${basicConstant.API_PATH}/pay/${order_id}`
    );
  }
}

export default new OrderApiService();
