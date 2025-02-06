import { useState } from 'react';
import { LoginReq } from '../core/models/admin/auth.model';
import { Button, FormControl, TextField } from '@mui/material';
import validationService from '../services/validation.service';
import authService from '../services/api/admin/auth.service';
import { Spinners } from '../components';
import { Controller, useForm } from 'react-hook-form';

export default function Login() {
  const [isLoginLoading, setIsLoginLoading] = useState(false);

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
        window.location.reload();
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
      <div className='container'>
        <div className='row justify-content-center mb-3'>
          <div className='login-card card col-12 col-md-6'>
            <h2 className='h2 mb-3 font-weight-normal text-center'>登入</h2>
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
