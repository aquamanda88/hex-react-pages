import axiosInstance from '../../../utils/axiosInstance';
import { CouponDataRequest } from '../../../core/models/coupon.model';
const { VITE_API, VITE_API_PATH } = import.meta.env;

/** 優惠券 API 服務 */
export class CouponApiService {
  /**
   * 取得優惠券資料
   *
   * @param page - 頁數
   * @returns API 回傳的資料
   */
  getCoupons(page?: number) {
    /** 權限 token */
    const token = sessionStorage.getItem('token');
    /** API 網址 */
    const URL_PATH = page ? `coupons?page=${page}` : 'coupons';

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
   * 新增優惠券資料
   *
   * @param addCouponRequest - 新增優惠券 request
   * @returns API 回傳的資料
   */
  addCouponItem(addCouponRequest: CouponDataRequest) {
    /** 權限 token */
    const token = sessionStorage.getItem('token');

    return axiosInstance.post(
      `${VITE_API}/api/${VITE_API_PATH}/admin/coupon`,
      addCouponRequest,
      {
        headers: {
          Authorization: token,
        },
      }
    );
  }

  /**
   * 更新優惠券資料
   *
   * @param id - 優惠券資料 ID
   * @param data - 欲修改的優惠券資料
   * @returns API 回傳的資料
   */
  editCouponItem(id: string, data: CouponDataRequest) {
    /** 權限 token */
    const token = sessionStorage.getItem('token');

    return axiosInstance.put(
      `${VITE_API}/api/${VITE_API_PATH}/admin/coupon/${id}`,
      data,
      {
        headers: {
          Authorization: token,
        },
      }
    );
  }

  /**
   * 刪除指定優惠券資料
   *
   * @param id - 優惠券資料 ID
   * @returns API 回傳的資料
   */
  deleteCouponItem(id: string) {
    /** 權限 token */
    const token = sessionStorage.getItem('token');

    return axiosInstance.delete(
      `${VITE_API}/api/${VITE_API_PATH}/admin/coupon/${id}`,
      {
        headers: {
          Authorization: token,
        },
      }
    );
  }
}

export default new CouponApiService();
