import axios from 'axios';
import Swal, { SweetAlertOptions } from 'sweetalert2';
const { VITE_API } = import.meta.env;

const axiosInstance = axios.create({
  baseURL: VITE_API,
});

axiosInstance.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

const goToPage = (path: string) => {
  window.location.href = path;
};

/**
 * 顯示 HTTP 錯誤訊息
 *
 * @param message - API 回傳錯誤訊息
 * @param status - API 錯誤狀態
 * @returns 無回傳值
 */
function formatErrorMessage(message: string, status?: number) {
  const text = status ? `(${status}) ${message}` : message;
  const options: SweetAlertOptions = {
    icon: 'error',
    text,
    showCancelButton: false,
    confirmButtonText: '確認',
    allowOutsideClick: false,
    customClass: { container: 'my-swal-container' },
  };

  Swal.fire(options).then((result) => {
    if (!result.isConfirmed) return;

    switch (message) {
      case '驗證錯誤, 請重新登入':
        break;
      case '請重新登入':
        sessionStorage.removeItem('token');
        window.location.reload();
        break;
      case '請重新登出':
        window.location.reload();
        break;
      case '禁止使用, 請確認 api_path 是否為本人使用。':
        goToPage('/#/products');
        break;
    }

    switch (status) {
      case 404:
        goToPage('/#/pageNotFound');
        break;
    }
  });
}

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      const { data, status } = error.response;
      const { message } = data;
      const formattedMessage = message.message ? message.message : message;
      formatErrorMessage(formattedMessage, status);
    } else {
      formatErrorMessage(error.message);
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
