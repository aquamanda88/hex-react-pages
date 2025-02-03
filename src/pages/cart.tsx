import { useEffect, useState } from 'react';
import { Spinners } from '../components';
import {
  CartDataDatum,
  CartDataRequest,
  CartsDatum,
} from '../core/models/cart.model';
import cartApiService from '../services/user/cart.service';
import MenuBar from '../components/menuBar';
import CloseIcon from '@mui/icons-material/Close';
import { Button, IconButton, TextField } from '@mui/material';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import Swal from 'sweetalert2';
import { Link } from 'react-router-dom';

export default function Cart() {
  const [isProductLoading, setIsProductLoading] = useState(true);
  const [cart, setCart] = useState<CartDataDatum>();
  const [cartCount, setCartCount] = useState(0);

  /**
   * 處理開啟刪除商品 modal 事件
   *
   */
  const handleDeleteOpen = () => {
    Swal.fire({
      title: '是否確定要清空購物車？',
      icon: 'warning',
      showCancelButton: true,
      cancelButtonText: '我再想想',
      confirmButtonColor: '#cc2e41',
      cancelButtonColor: 'grey',
      confirmButtonText: '確認清除',
    }).then((result) => {
      if (result.isConfirmed) {
        deleteCarts();
      }
    });
  };

  /**
   * 處理變更數量事件
   *
   * @prop e - ChangeEvent
   */
  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, name, value } = e.target;
    if (cart) {
      const newCart = {
        ...cart,
        carts: cart.carts.map((item, index) =>
          index === parseInt(name)
            ? { ...item, qty: Math.max(1, parseInt(value) || 0) }
            : item
        ),
      };
      setCart(newCart);
      editCart(id, parseInt(value));
    }
  };

  /**
   * 處理 input 複製貼上事件
   *
   * @prop e - ClipboardEvent
   */
  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    const pasteData = e.clipboardData.getData('text');
    if (!/^\d+$/.test(pasteData)) {
      e.preventDefault();
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
        setCart(data);
        setCartCount(calculateTotalQty(data.carts));
      })
      .finally(() => {
        setIsProductLoading(false);
      });
  };

  /**
   * 呼叫替換購物車指定產品數量 API
   *
   */
  const editCart = async (id: string, qty: number) => {
    const data: CartDataRequest = {
      data: {
        product_id: id,
        qty: qty,
      },
    };

    setIsProductLoading(true);
    cartApiService
      .editCart(id, data)
      .then(({ data: { message } }) => {
        Swal.fire({
          icon: 'success',
          title: message,
        });
        getCart();
      })
      .finally(() => {
        setIsProductLoading(false);
      });
  };

  /**
   * 呼叫刪除單一購物車資料 API
   *
   */
  const deleteCartItem = async (id: string) => {
    setIsProductLoading(true);
    cartApiService
      .deleteCartItem(id)
      .then(({ data: { message } }) => {
        getCart();
        Swal.fire({
          icon: 'success',
          title: message,
        });
      })
      .finally(() => {
        setIsProductLoading(false);
      });
  };

  /**
   * 呼叫刪除購物車內所有產品 API
   *
   */
  const deleteCarts = async () => {
    setIsProductLoading(true);

    cartApiService
      .deleteCarts()
      .then(({ data: { message } }) => {
        getCart();
        Swal.fire({
          icon: 'success',
          title: message,
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

  /**
   * 價格加上千分位
   *
   * @param price - 價格
   * @returns 加上千分位之價格
   */
  function formatPrice(price: number | undefined): string {
    if (price) {
      return new Intl.NumberFormat().format(price);
    } else {
      return '0';
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
        <h2 className='text-center mb-4'>購物車</h2>
        {cart?.carts && cart?.carts.length > 0 ? (
          <>
            <div className='table-responsive-lg mb-4'>
              <table className='cart-table table'>
                <thead className='text-center table-light'>
                  <tr className='align-baseline'>
                    <th>操作</th>
                    <th>作品縮圖</th>
                    <th>作品名稱</th>
                    <th>作品資訊</th>
                    <th className='text-end'>單價</th>
                    <th>數量</th>
                    <th className='text-end'>總計</th>
                  </tr>
                </thead>
                <tbody>
                  {cart?.carts.map((item, index) => (
                    <tr key={item.id}>
                      <td className='col-md-1'>
                        <IconButton onClick={() => deleteCartItem(item.id)}>
                          <CloseIcon />
                        </IconButton>
                      </td>
                      <td>
                        <img
                          className='cart-image'
                          src={item.product.imageUrl}
                          alt={item.product.content?.name}
                        />
                      </td>
                      <td className='text-start'>
                        <p>{item.product.title}</p>
                        <p>
                          <small>({item.product.content?.name})</small>
                        </p>
                      </td>
                      <td className='text-start'>
                        <p>作者：{item.product.content?.artists_zh_tw}</p>
                        <p>媒材：{item.product.category}</p>
                      </td>
                      <td className='text-end col-md-2'>
                        <p className='font-en-p-medium'>
                          TWD {formatPrice(item.product.price)}
                        </p>
                        <p className='text-secondary'>
                          <del>
                            TWD {formatPrice(item.product.origin_price)}
                          </del>
                        </p>
                      </td>
                      <td className='col-md-1'>
                        <TextField
                          id={item.id}
                          name={index.toString()}
                          type='number'
                          slotProps={{
                            input: {
                              inputProps: {
                                min: 1,
                              },
                            },
                          }}
                          onPaste={handlePaste}
                          onChange={handleQuantityChange}
                          value={item.qty}
                        />
                      </td>
                      <td className='text-end col-md-2'>
                        <p className='font-en-p-medium'>
                          TWD {formatPrice(item.final_total)}
                        </p>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <Button
                className='btn btn-secondary small'
                variant='contained'
                onClick={handleDeleteOpen}
              >
                清空購物車
              </Button>
            </div>

            <div className='row justify-content-end'>
              <div className='col-12 col-lg-6'>
                <div className='d-flex justify-content-between'>
                  <h4>總金額</h4>
                  <h3>TWD {formatPrice(cart?.final_total)}</h3>
                </div>
                <div className='d-flex justify-content-end'>
                  <Link to='/checkout' className='w-100'>
                    <Button
                      className='btn btn-primary w-100'
                      variant='contained'
                    >
                      去結帳
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className='layout'>
            <div className='d-flex justify-content-center'>
              <p>
                您的購物車中沒有商品，
                <Link to='/products' className='text-color-main d-inline-flex'>
                  <p className='btn-icon'>立即去選購</p>
                  <KeyboardArrowRightIcon />
                </Link>
              </p>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
