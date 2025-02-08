import { LoginReq } from '../../../core/models/admin/auth.model';
const { VITE_API } = import.meta.env;
import axiosInstance from '../../../utils/axiosInstance';

/** 登入 API 服務 */
export class AuthService {
  /**
   * 登入
   *
   * @param formData - url 中的參數
   * @returns API 回傳的資料
   */
  login(formData: LoginReq) {
    return axiosInstance.post(`${VITE_API}/admin/signin`, formData, {});
  }

  /**
   * 登入驗證
   *
   * @param token - token
   * @returns API 回傳的資料
   */
  checkLogin(token: string) {
    return axiosInstance.post(
      `${VITE_API}/api/user/check`,
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
    return axiosInstance.post(
      `${VITE_API}/logout`,
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
