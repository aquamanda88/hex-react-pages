import { Link } from 'react-router';
import { GitHub } from './Icons';
import { Button, FormControl, TextField } from '@mui/material';
import validationService from '../services/validation.service';
import { Controller, useForm } from 'react-hook-form';
import { toggleToast, updateMessage } from '../redux/toastSlice';
import { useDispatch } from 'react-redux';

export default function Footer() {
  const dispatch = useDispatch();
  
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    mode: 'onSubmit',
    defaultValues: { email: '' },
  });

  /**
   * 處理送出表單事件
   *
   */
  const onSubmit = () => {
    dispatch(toggleToast(true));
        dispatch(
          updateMessage({
            text: '已送出',
            status: true,
          })
        );
  };

  return (
    <>
      <div className='email-block'>
        <div className='dark-mask'></div>
        <div className='email-block-content'>
          <h2 className='font-zh-h2'>
            訂閱我們的電子報
            <br />
            接收最新消息
          </h2>
          <form className='d-flex' onSubmit={handleSubmit(onSubmit)}>
            <FormControl className='email-input' error={!!errors.email}>
              <Controller
                name='email'
                control={control}
                rules={validationService.emailValidator()}
                render={({ field }) => (
                  <TextField
                    {...field}
                    variant='filled'
                    label='Email'
                    type='email'
                    onChange={(e) => {
                      if (validationService.isValidInput(e)) {
                        field.onChange(e.target.value);
                      }
                    }}
                  />
                )}
              />
            </FormControl>
            <Button
              className='btn btn-primary'
              variant='contained'
              type='submit'
            >
              送出
            </Button>
          </form>
        </div>
      </div>
      <footer className='footer mt-auto py-3'>
        <div className='container text-center'>
          <div className='footer-block flex-column flex-md-row'>
            <div className='content'>
              <p className='mb-0'>本網站僅供作品使用，無包含任何商業用途</p>
              <span className='text-color-gray-400'>
                &copy; {new Date().getFullYear()} Olive Branch - All Rights
                Reserved.
              </span>
            </div>
            <div className='footer-links'>
              <Link className='link-light' to='/copyright-statement'>
                著作權聲明
              </Link>
              <Link className='link-light' to='/admin'>
                後台
              </Link>
              <a
                className='link-light'
                href='https://github.com/aquamanda88/'
                target='_blank'
                rel='noopener noreferrer'
              >
                <GitHub />
              </a>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
