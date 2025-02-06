import { LoginReq } from '../../../core/models/admin/auth.model';
import { basicConstant } from '../../../core/constants/basic.constants';
import axiosCustomer from '../../../utils/api/axios-customization';

/** 登入 API 服務 */
export class AuthService {
  /**
   * 登入
   *
   * @param formData - url 中的參數
   * @returns API 回傳的資料
   */
  login(formData: LoginReq) {
    return axiosCustomer.post(`${basicConstant.API_BASE}/admin/signin`, formData, {});
  }

  /**
   * 登入驗證
   *
   * @param token - token
   * @returns API 回傳的資料
   */
  checkLogin(token: string) {
    return axiosCustomer.post(
      `${basicConstant.API_BASE}/api/user/check`,
      {},
      {
        headers: {
          Authorization: token,
        },
      }
    );
  }

  /**
   * 登出
   *
   * @param token - token
   * @returns API 回傳的資料
   */
  logout(token: string) {
    return axiosCustomer.post(
      `${basicConstant.API_BASE}/logout`,
      {},
      {
        headers: {
          Authorization: token,
        },
      }
    );
  }
}

export default new AuthService();
