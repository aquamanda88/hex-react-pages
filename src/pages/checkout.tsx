import { useEffect, useRef, useState } from 'react';
import { MenuBar, Spinners, Steppers } from '../components';
import cartApiService from '../services/user/cart.service';
import { CartsDatum } from '../core/models/cart.model';
import { Button, TextField } from '@mui/material';
import {
  OrderDataRequestDatum,
  OrderValidation,
  OrderValidationMessage,
} from '../core/models/order.model';

const steps = ['填寫訂單資料', '確認訂單內容並付款', '完成結帳'];

export default function Checkout() {
  const [formData, setFormData] = useState<OrderDataRequestDatum>({
    user: { name: '', email: '', tel: '', address: '' },
  });
  const [isProductLoading, setIsProductLoading] = useState(true);
  const [cartCount, setCartCount] = useState(0);
  const [loginErrors, setLoginErrors] = useState<OrderValidation>({});
  const [loginErrorsMessage, setLoginErrorsMessage] =
    useState<OrderValidationMessage>({});
  const stepperRef = useRef<{ nextStep: () => void } | null>(null);

  /**
   * 處理登入頁 input 內容變更事件
   *
   * @prop e - ChangeEvent
   */
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (
      name === 'name' ||
      name === 'email' ||
      name === 'tel' ||
      name === 'address'
    ) {
      setFormData({
        ...formData,
        user: {
          ...formData.user,
          [name]: value,
        },
      });
    } else if (name === 'message') {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

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
      email:
        (name === 'email' && value === '') ||
        !emailPattern.test(formData.user.email ?? '')
          ? true
          : false,
      name: name === 'name' && value === '',
    });
    setLoginErrorsMessage({
      email:
        name === 'email' && value === ''
          ? getErrorMessageForField(name)
          : !emailPattern.test(formData.user.email ?? '')
            ? '請輸入有效的 Email'
            : '',
      name: name === 'name' && value === '' ? '請輸入 name' : '',
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
      email: !formData?.user.email
        ? '請輸入 Email'
        : !emailPattern.test(formData.user.email ?? '')
          ? '請輸入有效的 Email'
          : '',
      name: !formData?.user.name ? '請輸入收件人姓名' : '',
    };

    setLoginErrors({
      email:
        !formData?.user.email || !emailPattern.test(formData.user.email ?? ''),
      name: !formData?.user.name,
    });
    setLoginErrorsMessage(errorMessage);

    if (formData.user.email && formData.user.name) {
      if (stepperRef.current) {
        stepperRef.current.nextStep();
      }
    }
  };

  /**
   * 呼叫取得購物車資料 API
   *
   */
  const getCart = async () => {
    setIsProductLoading(true);
    cartApiService
      .getCart()
      .then(({ data: { data } }) => {
        setCartCount(calculateTotalQty(data.carts));
      })
      .finally(() => {
        setIsProductLoading(false);
      });
  };

  /**
   * 取得購物車總數量
   *
   * @param carts - 購物車資料
   * @returns 購物車內產品總數量
   */
  function calculateTotalQty(carts: CartsDatum[]): number {
    return carts.length;
  }

  /**
   * 取得錯誤訊息
   *
   * @param inputName - input 欄位 name 屬性值
   *
   * @returns 相對應欄位之錯誤訊息
   */
  function getErrorMessageForField(inputName: string): string {
    switch (inputName) {
      case 'email':
        return '請輸入 Email';
      case 'name':
        return '請輸入收件人姓名';
      default:
        return '';
    }
  }

  useEffect(() => {
    getCart();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <MenuBar cartCount={cartCount} />
      <div className='container py-4'>
        <div className={`${isProductLoading ? 'd-flex' : 'd-none'} loading`}>
          <Spinners />
        </div>
        <div className='row justify-content-center mb-3'>
          <div className='col-12 col-lg-6'>
            <Steppers ref={stepperRef} steps={steps}>
              <form id='form' className='form-signin' onSubmit={handleSubmit}>
                <div className='form-input-group'>
                  <TextField
                    type='email'
                    id='email'
                    name='email'
                    label='電子信箱'
                    onChange={handleInputChange}
                    onBlur={handleInputBlur}
                    value={formData.user.email}
                    error={loginErrors.email}
                    helperText={
                      loginErrorsMessage.email ? loginErrorsMessage.email : ' '
                    }
                    required
                  />
                  <TextField
                    type='text'
                    id='name'
                    name='name'
                    label='收件人姓名'
                    onChange={handleInputChange}
                    onBlur={handleInputBlur}
                    value={formData.user.name}
                    error={loginErrors.name}
                    helperText={
                      loginErrorsMessage.name ? loginErrorsMessage.name : ' '
                    }
                    required
                  />
                  <TextField
                    type='tel'
                    id='tel'
                    name='tel'
                    label='聯絡電話'
                    onChange={handleInputChange}
                    onBlur={handleInputBlur}
                    value={formData.user.tel}
                    error={loginErrors.tel}
                    helperText={
                      loginErrorsMessage.tel ? loginErrorsMessage.tel : ' '
                    }
                    required
                  />
                  <TextField
                    type='text'
                    id='address'
                    name='address'
                    label='收件人地址'
                    onChange={handleInputChange}
                    onBlur={handleInputBlur}
                    value={formData.user.address}
                    error={loginErrors.address}
                    helperText={
                      loginErrorsMessage.address
                        ? loginErrorsMessage.address
                        : ' '
                    }
                    required
                  />
                  <TextField
                    type='text'
                    id='message'
                    name='message'
                    label='留言'
                    multiline
                    rows={6}
                    onChange={handleInputChange}
                    onBlur={handleInputBlur}
                    value={formData.message}
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
              <div>這是第二步的內容</div>
              <div>這是第三步的內容</div>
            </Steppers>
          </div>
        </div>
      </div>
    </>
  );
}
