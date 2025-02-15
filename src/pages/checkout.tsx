import { useEffect, useRef, useState } from 'react';
import { NavLink, useNavigate, useParams } from 'react-router';
import { Controller, useForm } from 'react-hook-form';
import { Button, TextField } from '@mui/material';
import { Spinners, Steppers } from '../components/Index';
import { CartDataDatum, CartsDatum } from '../core/models/cart.model';
import {
  OrderDataRequest,
  OrderDatum,
  OrderFormData,
} from '../core/models/order.model';
import {
  formatPrice,
  formatDate,
  formatUnknownText,
} from '../services/formatValue.service';
import validationService from '../services/validation.service';
import cartApiService from '../services/api/user/cart.service';
import orderApiService from '../services/api/user/order.service';
import FormControl from '@mui/material/FormControl';
import Swal from 'sweetalert2';
import { CheckCircleOutline, InsertPhoto } from '../components/Icons';

const steps = ['填寫訂單資料', '確認訂單內容', '進行付款', '完成結帳'];

/** 元件參數型別 */
interface CheckoutProps {
  /** 步驟數值 */
  activeStep?: number;
}

export default function Checkout({ activeStep }: CheckoutProps) {
  const [isProductLoading, setIsProductLoading] = useState(true);
  const [cartCount, setCartCount] = useState(0);
  const [cartData, setCartData] = useState<CartDataDatum>();
  const [orderDataRequest, setOrderDataRequest] = useState<OrderDataRequest>();
  const [orderUserData, setOrderUserData] = useState<OrderFormData>();
  const [selectedOrderData, setSelectedOrderData] = useState<OrderDatum>();
  const [selectedOrderId, setSelectedOrderId] = useState<string[]>([]);
  const stepperRef = useRef<{ nextStep: () => void } | null>(null);
  const { id } = useParams();
  const navigate = useNavigate();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    mode: 'all',
    defaultValues: { email: '', name: '', tel: '', address: '', message: '' },
  });

  /**
   * 處理送出表單事件
   *
   * @param data - 訂單資料 formData
   */
  const onSubmit = (data: OrderFormData) => {
    setOrderDataRequest({
      data: {
        user: {
          email: data.email,
          name: data.name,
          tel: data.tel,
          address: data.address,
        },
        ...(data.message ? { message: data.message } : {}),
      },
    });
    if (stepperRef.current) {
      stepperRef.current.nextStep();
      setOrderUserData(data);
    }
  };

  /**
   * 處理開啟送出訂單 modal 事件
   */
  const handleSendOrderOpen = (orderData: OrderDataRequest | undefined) => {
    if (orderData) {
      Swal.fire({
        title: '是否已確認資料正確無誤？',
        icon: 'warning',
        showCancelButton: true,
        cancelButtonText: '我再想想',
        cancelButtonColor: 'grey',
        confirmButtonText: '確認送出',
      }).then((result) => {
        if (result.isConfirmed) {
          sendOrderItem(orderData);
        }
      });
    }
  };

  /**
   * 呼叫取得購物車資料 API
   */
  const getCarts = async () => {
    setIsProductLoading(true);
    cartApiService
      .getCarts()
      .then(({ data: { data } }) => {
        setCartCount(calculateTotalQty(data.carts));
        setCartData(data);
      })
      .finally(() => {
        setIsProductLoading(false);
      });
  };

  /**
   * 呼叫送出訂單 API
   */
  const sendOrderItem = async (data: OrderDataRequest) => {
    setIsProductLoading(true);
    orderApiService
      .sendOrderItem(data)
      .then(({ data }) => {
        Swal.fire({
          icon: 'success',
          title: data.message,
        }).then((result) => {
          if (result.isConfirmed) {
            navigate(`/checkout/${data.orderId}`);
            window.location.reload();
          }
        });
      })
      .finally(() => {
        setIsProductLoading(false);
      });
  };

  /**
   * 呼叫特定訂單資料 API
   */
  const getOrderItem = async (order_id: string) => {
    setIsProductLoading(true);
    orderApiService
      .getOrderItem(order_id)
      .then(({ data: { order } }) => {
        setSelectedOrderData(order);
        const keys: string[] = Object.keys(order.products);
        setSelectedOrderId(keys);
      })
      .finally(() => {
        setIsProductLoading(false);
      });
  };

  /**
   * 呼叫付款結帳 API
   */
  const sendPayment = async (order_id: string) => {
    setIsProductLoading(true);
    orderApiService
      .sendPayment(order_id)
      .then(({ data: { message } }) => {
        getCarts();
        Swal.fire({
          icon: 'success',
          title: message,
        }).then((result) => {
          if (result.isConfirmed && stepperRef.current) {
            stepperRef.current.nextStep();
            if (id) {
              getOrderItem(id);
            }
          }
        });
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

  useEffect(() => {
    getCarts();
    if (id) {
      getOrderItem(id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <div className='content-layout container'>
        <div className={`${isProductLoading ? 'd-flex' : 'd-none'} loading`}>
          <Spinners />
        </div>
        {(cartCount && cartCount > 0) || id ? (
          <div className='row justify-content-center mb-3'>
            <div className='col-12'>
              <Steppers
                ref={stepperRef}
                steps={steps}
                activeStepNum={activeStep}
              >
                {/* Step 1 */}
                <div className='row justify-content-center'>
                  <div className='col-lg-6'>
                    <form
                      id='form'
                      className='form-signin'
                      onSubmit={handleSubmit(onSubmit)}
                      noValidate
                    >
                      <div className='form-input-group'>
                        <FormControl error={!!errors.email}>
                          <Controller
                            name='email'
                            control={control}
                            rules={validationService.emailValidator()}
                            render={({ field }) => (
                              <TextField
                                {...field}
                                label='電子信箱'
                                type='email'
                                error={!!errors.email}
                                helperText={validationService.getHelperText(
                                  errors.email
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
                        <FormControl error={!!errors.name}>
                          <Controller
                            name='name'
                            control={control}
                            rules={validationService.nameValidator()}
                            render={({ field }) => (
                              <TextField
                                {...field}
                                label='訂購人姓名'
                                type='text'
                                error={!!errors.name}
                                helperText={validationService.getHelperText(
                                  errors.name
                                )}
                              />
                            )}
                          />
                        </FormControl>
                        <FormControl error={!!errors.tel}>
                          <Controller
                            name='tel'
                            control={control}
                            rules={validationService.telValidator()}
                            render={({ field }) => (
                              <TextField
                                {...field}
                                label='聯絡電話'
                                type='tel'
                                error={!!errors.tel}
                                helperText={validationService.getHelperText(
                                  errors.tel
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
                        <FormControl error={!!errors.address}>
                          <Controller
                            name='address'
                            control={control}
                            rules={validationService.addressValidator()}
                            render={({ field }) => (
                              <TextField
                                {...field}
                                label='收件地址'
                                type='text'
                                error={!!errors.address}
                                helperText={validationService.getHelperText(
                                  errors.address
                                )}
                              />
                            )}
                          />
                        </FormControl>
                        <FormControl>
                          <Controller
                            name='message'
                            control={control}
                            render={({ field }) => (
                              <TextField
                                {...field}
                                label='留言'
                                type='text'
                                multiline
                                rows={6}
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
                        送出
                      </Button>
                    </form>
                  </div>
                </div>
                {/* Step 2 */}
                <div>
                  <div className='table-responsive-lg mb-2'>
                    <table className='cart-table table'>
                      <thead className='text-center table-light'>
                        <tr className='align-baseline'>
                          <th>作品縮圖</th>
                          <th>作品名稱</th>
                          <th>作品資訊</th>
                          <th className='text-end'>單價</th>
                          <th>數量</th>
                          <th className='text-end'>總計</th>
                        </tr>
                      </thead>
                      <tbody>
                        {cartData?.carts.map((item) => (
                          <tr key={item.id}>
                            <td>
                              <NavLink to={`/product/${item.product.id}`}>
                                {item.product.imageUrl ? (
                                  <img
                                    className='cart-image'
                                    src={item.product.imageUrl}
                                    alt={item.product.content?.name}
                                  />
                                ) : (
                                  <InsertPhoto
                                    className='no-image-icon'
                                    color='disabled'
                                  />
                                )}
                              </NavLink>
                            </td>
                            <td className='text-start'>
                              <NavLink
                                className='link-button'
                                to={`/product/${item.product.id}`}
                              >
                                <p>{item.product.title}</p>
                                <p>
                                  <small>
                                    (
                                    {formatUnknownText(
                                      'name',
                                      item.product.content?.name
                                    )}
                                    )
                                  </small>
                                </p>
                              </NavLink>
                            </td>
                            <td className='text-start'>
                              <p>
                                作者：
                                {formatUnknownText(
                                  'artists_zh_tw',
                                  item.product.content?.artists_zh_tw
                                )}
                              </p>
                              <p>
                                媒材：
                                {item.product.category}
                              </p>
                            </td>
                            <td className='text-end col-md-2'>
                              <p className='font-en-p-medium'>
                                TWD {formatPrice(item.product.price)}
                              </p>
                            </td>
                            <td className='col-md-1'>{item.qty}</td>
                            <td className='text-end col-md-2'>
                              <p className='font-en-p-medium'>
                                TWD {formatPrice(item.final_total)}
                              </p>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <div className='row justify-content-end'>
                    <div className='col-12 col-lg-6'>
                      <ul className='mb-4'>
                        <li>
                          訂購人姓名：
                          {orderUserData?.name}
                        </li>
                        <li>
                          電子信箱：
                          {orderUserData?.email}
                        </li>
                        <li>
                          聯絡電話：
                          {orderUserData?.tel}
                        </li>
                        <li>
                          寄送地址：
                          {orderUserData?.address}
                        </li>
                        {orderUserData?.message && (
                          <li>
                            留言備註：
                            {orderUserData?.message}
                          </li>
                        )}
                      </ul>
                    </div>
                    <div className='col-12 col-lg-6'>
                      <div className='d-flex justify-content-between'>
                        <h4>總金額</h4>
                        <h3>TWD {formatPrice(cartData?.total)}</h3>
                      </div>
                      <div className='row'>
                        <div className='col-6'>
                          <NavLink to='/products' className='w-100'>
                            <Button
                              className='btn btn-secondary w-100'
                              variant='contained'
                            >
                              先逛逛
                            </Button>
                          </NavLink>
                        </div>
                        <div className='col-6'>
                          <Button
                            className='btn btn-primary w-100'
                            variant='contained'
                            onClick={() =>
                              handleSendOrderOpen(orderDataRequest)
                            }
                          >
                            送出訂單
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                {/* Step 3 */}
                <div>
                  {selectedOrderData ? (
                    <>
                      <div className='table-responsive-lg'>
                        <table className='cart-table table'>
                          <thead className='text-center table-light'>
                            <tr className='align-baseline'>
                              <th>作品縮圖</th>
                              <th>作品名稱</th>
                              <th>作品資訊</th>
                              <th className='text-end'>單價</th>
                              <th>數量</th>
                              <th className='text-end'>總計</th>
                            </tr>
                          </thead>
                          <tbody>
                            {selectedOrderData?.products ? (
                              selectedOrderId?.map((res: string) => (
                                <tr key={res}>
                                  <td>
                                    <img
                                      className='cart-image'
                                      src={
                                        selectedOrderData.products[res].product
                                          .imageUrl
                                      }
                                      alt={
                                        selectedOrderData.products[res].product
                                          .content?.name
                                      }
                                    />
                                  </td>
                                  <td className='text-start'>
                                    <p>
                                      {
                                        selectedOrderData.products[res].product
                                          .title
                                      }
                                    </p>
                                    <p>
                                      <small>
                                        (
                                        {
                                          selectedOrderData.products[res]
                                            .product.content?.name
                                        }
                                        )
                                      </small>
                                    </p>
                                  </td>
                                  <td className='text-start'>
                                    <p>
                                      作者：
                                      {
                                        selectedOrderData.products[res].product
                                          .content?.artists_zh_tw
                                      }
                                    </p>
                                    <p>
                                      媒材：
                                      {
                                        selectedOrderData.products[res].product
                                          .category
                                      }
                                    </p>
                                  </td>
                                  <td className='text-end col-md-2'>
                                    <p className='font-en-p-medium'>
                                      TWD{' '}
                                      {formatPrice(
                                        selectedOrderData.products[res].product
                                          .price
                                      )}
                                    </p>
                                  </td>
                                  <td className='col-md-1'>
                                    {selectedOrderData.products[res].qty}
                                  </td>
                                  <td className='text-end col-md-2'>
                                    <p className='font-en-p-medium'>
                                      TWD{' '}
                                      {formatPrice(
                                        selectedOrderData.products[res]
                                          .final_total
                                      )}
                                    </p>
                                  </td>
                                </tr>
                              ))
                            ) : (
                              <></>
                            )}
                          </tbody>
                        </table>
                      </div>
                      <div className='row justify-content-end'>
                        <div className='col-12 col-lg-6'>
                          <ul className='mb-4'>
                            <li>
                              訂購人姓名：
                              {selectedOrderData?.user?.name}
                            </li>
                            <li>
                              電子信箱：
                              {selectedOrderData?.user?.email}
                            </li>
                            <li>
                              聯絡電話：
                              {selectedOrderData?.user?.tel}
                            </li>
                            <li>
                              寄送地址：
                              {selectedOrderData?.user?.address}
                            </li>
                            <li>
                              訂單成立時間：
                              {formatDate(selectedOrderData?.create_at ?? 0)}
                            </li>
                            <li>
                              訂單付款狀態：
                              {selectedOrderData?.is_paid ? '已付款' : '未付款'}
                            </li>
                          </ul>
                        </div>
                        <div className='col-12 col-lg-6'>
                          <div className='d-flex justify-content-between'>
                            <h4>總金額</h4>
                            <h3>TWD {formatPrice(selectedOrderData?.total)}</h3>
                          </div>
                          <div className='row'>
                            <div className='col-6'>
                              <NavLink to='/products' className='w-100'>
                                <Button
                                  className='btn btn-secondary w-100'
                                  variant='contained'
                                >
                                  先逛逛
                                </Button>
                              </NavLink>
                            </div>
                            <div className='col-6'>
                              <Button
                                className='btn btn-primary w-100'
                                variant='contained'
                                disabled={selectedOrderData?.is_paid}
                                onClick={() => id && sendPayment(id)}
                              >
                                {selectedOrderData?.is_paid
                                  ? '已付款'
                                  : '去付款'}
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className='layout'>
                      <div className='d-flex flex-column text-center'>
                        <h2 className='font-zh-h2'>
                          您目前沒有可供進行付款的訂單。
                        </h2>
                        <NavLink
                          to='/products'
                          className='text-color-main d-flex justify-content-center'
                        >
                          <p className='btn-icon'>立即去選購</p>
                        </NavLink>
                      </div>
                    </div>
                  )}
                </div>
                {/* Step 4 */}
                <div className='row justify-content-center'>
                  <div className='col-12 col-lg-6'>
                    <div className='d-flex flex-column align-items-center gap-4'>
                      <div>
                        <CheckCircleOutline
                          className='mb-2'
                          style={{ fontSize: '80px', color: '#78a1b1' }}
                        />
                        <h5 style={{ color: '#78a1b1' }}>付款成功</h5>
                      </div>
                      <ul className='border-secondary border-top border-bottom w-100 pt-3'>
                        <li className='d-flex justify-content-between'>
                          <p>訂單編號</p>
                          <p>{selectedOrderData?.id}</p>
                        </li>
                        <li className='d-flex justify-content-between'>
                          <p>訂單總金額</p>
                          <p>TWD {formatPrice(selectedOrderData?.total)}</p>
                        </li>
                        <li className='d-flex justify-content-between'>
                          <p>訂單成立時間</p>
                          <p>{formatDate(selectedOrderData?.create_at ?? 0)}</p>
                        </li>
                        <li className='d-flex justify-content-between'>
                          <p>付款狀態</p>
                          <p>
                            {selectedOrderData?.is_paid ? '已付款' : '未付款'}
                          </p>
                        </li>
                        <li className='d-flex justify-content-between'>
                          <p>付款時間</p>
                          <p>{formatDate(selectedOrderData?.paid_date ?? 0)}</p>
                        </li>
                      </ul>
                      <NavLink to='/products' className='w-100'>
                        <Button
                          className='btn btn-primary w-100'
                          variant='contained'
                        >
                          回商品頁
                        </Button>
                      </NavLink>
                    </div>
                  </div>
                </div>
              </Steppers>
            </div>
          </div>
        ) : (
          <div className='layout'>
            <div className='d-flex justify-content-center'>
              <h2 className='font-zh-h2'>
                您的購物車中沒有商品，
                <NavLink
                  to='/products'
                  className='text-color-main d-inline-flex'
                >
                  <p className='btn-icon'>立即去選購</p>
                </NavLink>
              </h2>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
