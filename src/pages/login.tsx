import { useEffect, useState } from 'react';
import { LoginReq, LoginValidation } from '../core/models/admin/auth.model';
import { Button, TextField } from '@mui/material';
import apiService from '../services/api.service';
import { Spinners } from '../components';

/** 元件參數型別 */
interface LoginProps {
  /** 登入資料 */
  formData: LoginReq;
  /** 處理登入頁 input 內容變更事件 */
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function Login({ formData, handleInputChange }: LoginProps) {
  const [loginErrors, setLoginErrors] = useState<LoginValidation>({});
  const [loginErrorsMessage, setLoginErrorsMessage] = useState<LoginReq>({});
  const [isLoginLoading, setIsLoginLoading] = useState(false);

  /**
   * 處理 input 模糊事件
   *
   * @prop e - ChangeEvent
   */
  const handleInputBlur = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    setLoginErrors({
      ...loginErrors,
      [name]:
        value === '' || !emailPattern.test(formData.username ?? '')
          ? true
          : false,
    });
    setLoginErrorsMessage({
      ...loginErrorsMessage,
      [name]:
        value === ''
          ? getErrorMessageForField(name)
          : !emailPattern.test(formData.username ?? '')
            ? '請輸入有效的 Email'
            : '',
    });
  };

  /**
   * 處理送出表單事件
   *
   * @prop e - FormEvent
   */
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    const errorMessage = {
      username: !formData?.username
        ? '請輸入帳號'
        : !emailPattern.test(formData.username ?? '')
          ? '請輸入有效的 Email'
          : '',
      password: !formData?.password ? '請輸入密碼' : '',
    };

    setLoginErrors({
      username:
        !formData?.username || !emailPattern.test(formData.username ?? ''),
      password: !formData?.password,
    });
    setLoginErrorsMessage(errorMessage);

    if (formData.username && formData.password) {
      login();
    }
  };

  /**
   * 呼叫登入 API
   *
   */
  const login = async () => {
    setIsLoginLoading(true);
    apiService
      .login(formData)
      .then(({ data: { token } }) => {
        sessionStorage.setItem('token', token);
        window.location.reload();
      })
      .finally(() => {
        setIsLoginLoading(false);
      });
  };

  /**
   * 取得錯誤訊息
   *
   * @param inputName - input 欄位 name 屬性值
   *
   * @returns 相對應欄位之錯誤訊息
   */
  function getErrorMessageForField(inputName: string): string {
    switch (inputName) {
      case 'username':
        return '請輸入帳號';
      case 'password':
        return '請輸入密碼';
      default:
        return '';
    }
  }

  useEffect(() => {
    setLoginErrors({
      username: false,
      password: false,
    });
    setLoginErrorsMessage({
      username: '',
      password: '',
    });
  }, []);

  return (
    <>
      <div className={`${isLoginLoading ? 'd-flex' : 'd-none'} loading`}>
        <Spinners />
      </div>
      <div className='container layout'>
        <div className='row justify-content-center mb-3'>
          <div className='card col-4 col-md-6'>
            <h2 className='h2 mb-3 font-weight-normal text-center'>登入</h2>
            <form id='form' className='form-signin' onSubmit={handleSubmit}>
              <div className='form-input-group'>
                <TextField
                  type='email'
                  id='username'
                  name='username'
                  label='電子信箱'
                  onChange={handleInputChange}
                  onBlur={handleInputBlur}
                  value={formData.username}
                  error={loginErrors.username}
                  helperText={
                    loginErrorsMessage.username
                      ? loginErrorsMessage.username
                      : ' '
                  }
                />
                <TextField
                  type='password'
                  id='password'
                  name='password'
                  label='密碼'
                  onChange={handleInputChange}
                  onBlur={handleInputBlur}
                  value={formData.password}
                  error={loginErrors.password}
                  helperText={
                    loginErrorsMessage.password
                      ? loginErrorsMessage.password
                      : ' '
                  }
                />
              </div>
              <Button
                className='btn btn-primary w-100'
                variant='contained'
                color='primary'
                type='submit'
              >
                登入
              </Button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
