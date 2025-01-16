import axios from 'axios';
import Swal from 'sweetalert2';

const axiosInstance = axios.create({
  baseURL: 'https://ec-course-api.hexschool.io/v2',
});

axiosInstance.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

/**
 * 顯示 HTTP 錯誤訊息
 *
 * @param message - API 回傳錯誤訊息
 * @param status - API 錯誤狀態
 * @returns 無回傳值
 */
function formatErrorMessage(message: string, status: number) {
  Swal.fire({
    icon: 'error',
    text: `(${status}) ${message}`,
  });
}

axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    const message = error?.response?.data?.message;
    formatErrorMessage(message, error.status)
    return Promise.reject(error);
  }
);

export default axiosInstance;
