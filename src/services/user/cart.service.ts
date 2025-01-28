import axiosCustomer from '../../utils/api/axios-customization';
import { basicConstant } from '../../core/constants/basic.constants';
import { CartDataRequest } from '../../core/models/cart.model';

/** 購物車 API 服務 */
export class CartApiService {
  /**
   * 加入購物車
   *
   * @param data - 加入購物車之產品資料
   * @returns API 回傳的資料
   */
  addCart(data: CartDataRequest) {
    return axiosCustomer.post(
      `${basicConstant.API_BASE}/api/${basicConstant.API_PATH}/cart`,
      data
    );
  }

  /**
   * 取得購物車資料
   *
   * @returns API 回傳的資料
   */
  getCart() {
    return axiosCustomer.get(
      `${basicConstant.API_BASE}/api/${basicConstant.API_PATH}/cart`
    );
  }

  /**
   * 替換購物車指定產品數量
   *
   * @param id - 購物車 ID
   * @param data - 加入購物車之產品資料
   * @returns API 回傳的資料
   */
  editCart(id: string, data: CartDataRequest) {
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

export default new CartApiService();
