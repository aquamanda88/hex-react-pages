import { LoginReq } from '../core/models/admin/auth.model';
import axiosCustomer from '../utils/api/axios-customization';
/** API 呼叫路徑 */
const API_BASE = 'https://ec-course-api.hexschool.io/v2';

/** API 呼叫服務 */
export class ApiService {
  /**
   * 登入
   *
   * @param formData - url 中的參數
   * @returns API 回傳的資料
   */
  login(formData: LoginReq) {
    return axiosCustomer.post(`${API_BASE}/admin/signin`, formData, {
    });
  }

  /**
   * 登入驗證
   *
   * @returns API 回傳的資料
   */
  checkLogin() {
    /** 權限 token */
    const token = sessionStorage.getItem('token');
    return axiosCustomer.post(`${API_BASE}/api/user/check`, {}, {
      headers: {
        Authorization: token,
      },
    });
  }
}

export default new ApiService();
