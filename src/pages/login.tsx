import { useState } from 'react';
import { LoginReq } from '../core/models/admin/auth.model';
import { Button, FormControl, TextField } from '@mui/material';
import validationService from '../services/validation.service';
import authService from '../services/api/admin/auth.service';
import { Spinners } from '../components/Index';
import { Controller, useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router';

export default function Login() {
  const [isLoginLoading, setIsLoginLoading] = useState(false);
  const navigate = useNavigate();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    mode: 'all',
    defaultValues: { username: '', password: '' },
  });

  /**
   * 處理送出表單事件
   *
   * @param data - LoginReq
   */
  const onSubmit = (data: LoginReq) => {
    login(data);
  };

  /**
   * 呼叫登入 API
   *
   * @param data - LoginReq
   */
  const login = async (data: LoginReq) => {
    setIsLoginLoading(true);
    authService
      .login(data)
      .then(({ data: { token } }) => {
        sessionStorage.setItem('token', token);
        navigate('/admin');
      })
      .finally(() => {
        setIsLoginLoading(false);
      });
  };

  return (
    <>
      <div className={`${isLoginLoading ? 'd-flex' : 'd-none'} loading`}>
        <Spinners />
      </div>
      <div className='login-layout'>
        <div className='container'>
          <div className='row justify-content-center mb-3'>
            <div className='login-card card col-12 col-xl-5'>
              <h2 className='font-zh-h3 text-center'>管理員登入</h2>
              <form
                id='form'
                className='form-signin'
                onSubmit={handleSubmit(onSubmit)}
              >
                <div className='form-input-group'>
                  <FormControl error={!!errors.username}>
                    <Controller
                      name='username'
                      control={control}
                      rules={validationService.emailValidator()}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          label='電子信箱'
                          type='email'
                          error={!!errors.username}
                          helperText={validationService.getHelperText(
                            errors.username
                          )}
                          onChange={(e) => {
                            if (validationService.isValidInput(e)) {
                              field.onChange(e.target.value);
                            }
                          }}
                        />
                      )}
                    />
                  </FormControl>
                  <FormControl error={!!errors.password}>
                    <Controller
                      name='password'
                      control={control}
                      rules={validationService.passwordValidator()}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          label='密碼'
                          type='password'
                          error={!!errors.password}
                          helperText={validationService.getHelperText(
                            errors.password
                          )}
                        />
                      )}
                    />
                  </FormControl>
                </div>
                <div className='d-flex gap-2'>
                  <Link to='/products' className="w-100">
                    <Button
                      className='btn btn-secondary w-100'
                      variant='contained'
                      color='primary'
                      type='button'
                    >
                      返回商品頁
                    </Button>
                  </Link>
                  <Button
                    className='btn btn-primary w-100'
                    variant='contained'
                    color='primary'
                    type='submit'
                  >
                    登入
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
