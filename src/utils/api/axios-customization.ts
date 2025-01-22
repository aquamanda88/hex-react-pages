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
function formatErrorMessage(message: string, status?: number) {
  if (message === '驗證錯誤, 請重新登入' || message === '請重新登入') {
    Swal.fire({
      icon: 'error',
      text: status ? `(${status}) ${message}` : message,
      showCancelButton: false,
      confirmButtonText: '回到登入頁',
      customClass: {
        container: 'my-swal-container',
      },
    }).then((result) => {
      if (result.isConfirmed) {
        sessionStorage.removeItem('token');
        window.location.reload();
      }
    });
  } else if (message === '請重新登出') {
    Swal.fire({
      icon: 'error',
      text: status ? `(${status}) ${message}` : message,
      showCancelButton: false,
      confirmButtonText: '確認',
      customClass: {
        container: 'my-swal-container',
      },
    }).then((result) => {
      if (result.isConfirmed) {
        window.location.reload();
      }
    });
  } else {
    Swal.fire({
      icon: 'error',
      text: status ? `(${status}) ${message}` : message,
      showCancelButton: false,
      confirmButtonText: '確認',
      customClass: {
        container: 'my-swal-container',
      },
    });
  }
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
