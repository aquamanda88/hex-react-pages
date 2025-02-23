import axiosInstance from '../../../utils/axiosInstance';
import { CouponUsingRequest } from '../../../core/models/coupon.model';
const { VITE_API, VITE_API_PATH } = import.meta.env;

/** 優惠券 API 服務 */
export class CouponApiService {
  /**
   * 套用優惠券資料
   *
   * @param couponUsingRequest - 套用優惠券 request
   * @returns API 回傳的資料
   */
  applyCoupon(couponUsingRequest: CouponUsingRequest) {
    return axiosInstance.post(
      `${VITE_API}/api/${VITE_API_PATH}/coupon`,
      couponUsingRequest
    );
  }
}

export default new CouponApiService();
