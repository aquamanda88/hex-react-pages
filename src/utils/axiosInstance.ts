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
  const env = process.env.NODE_ENV;
  let urlText = '';

  switch (env) {
    case 'production':
      urlText = `/hex-react-pages/#/${path}`;
      break;
    case 'development':
      urlText = `/#/${path}`;
      break;
    default:
      urlText = `/#/${path}`;
      break;
  }
  window.location.href = urlText;
};

/**
 * 顯示 HTTP 錯誤訊息
 *
 * @param message - API 回傳錯誤訊息
 * @returns 無回傳值
 */
function formatErrorMessage(message: string) {
  const text = message;
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
        goToPage('login');
        break;
      case '請重新登入':
        sessionStorage.removeItem('token');
        goToPage('login');
        break;
      case '請重新登出':
        goToPage('products');
        break;
    }
  });
}

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      const { data } = error.response;
      const { message } = data;
      const formattedMessage = message.message ? message.message : message;
      formatErrorMessage(formattedMessage);
    } else {
      formatErrorMessage(error.message);
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
