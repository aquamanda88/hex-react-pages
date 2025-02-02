import axiosCustomer from '../../utils/api/axios-customization';
import { basicConstant } from '../../core/constants/basic.constants';
import { CartDataRequest } from '../../core/models/cart.model';
import { OrderDataRequest } from '../../core/models/order.model';

/** 訂單結帳 API 服務 */
export class OrderApiService {
  /**
   * 送出訂單
   *
   * @param data - 欲送出訂單資料
   * @returns API 回傳的資料
   */
  addOrder(data: OrderDataRequest) {
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
   * 替換購物車指定產品數量
   *
   * @param id - 購物車 ID
   * @param data - 加入購物車之產品資料
   * @returns API 回傳的資料
   */
  editOrder(id: string, data: CartDataRequest) {
    return axiosCustomer.put(
      `${basicConstant.API_BASE}/api/${basicConstant.API_PATH}/cart/${id}`,
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
    return axiosCustomer.delete(
      `${basicConstant.API_BASE}/api/${basicConstant.API_PATH}/cart/${id}`
    );
  }

  /**
   * 刪除購物車內所有產品
   *
   * @returns API 回傳的資料
   */
  deleteCarts() {
    return axiosCustomer.delete(
      `${basicConstant.API_BASE}/api/${basicConstant.API_PATH}/carts`
    );
  }
}

export default new OrderApiService();
