import axiosCustomer from '../../utils/api/axios-customization';
import { basicConstant } from '../../core/constants/basic.constants';
import { CartDataRequest } from '../../core/models/cart.model';

/** 訂單結帳 API 服務 */
export class OrderApiService {
  /**
   * 取得訂單資料
   *
   * @returns API 回傳的資料
   */
  getOrders() {
    return axiosCustomer.get(
      `${basicConstant.API_BASE}/api/${basicConstant.API_PATH}/admin/orders`
    );
  }

  /**
   * 更新訂單資料
   *
   * @param id - 訂單資料 ID
   * @param data - 欲修改的訂單資料
   * @returns API 回傳的資料
   */
  editOrder(id: string, data: CartDataRequest) {
    return axiosCustomer.put(
      `${basicConstant.API_BASE}/api/${basicConstant.API_PATH}/admin/order/${id}`,
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
    return axiosCustomer.delete(
      `${basicConstant.API_BASE}/api/${basicConstant.API_PATH}/admin/order/${id}`
    );
  }

  /**
   * 刪除所有訂單資料
   *
   * @returns API 回傳的資料
   */
  deleteOrders() {
    return axiosCustomer.delete(
      `${basicConstant.API_BASE}/api/${basicConstant.API_PATH}/admin/orders/all`
    );
  }
}

export default new OrderApiService();
