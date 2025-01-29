import { useEffect, useState } from 'react';
import { Spinners } from '../components';
import { CartDataDatum, CartsDatum } from '../core/models/cart.model';
import cartApiService from '../services/user/cart.service';
import MenuBar from '../components/menuBar';
import CloseIcon from '@mui/icons-material/Close';
import { IconButton } from '@mui/material';
import Swal from 'sweetalert2';

export default function Cart() {
  const [isProductLoading, setIsProductLoading] = useState(true);
  const [cart, setCart] = useState<CartDataDatum>();
  const [cartCount, setCartCount] = useState(0);

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
    return carts.reduce((sum, item) => sum + item.qty, 0);
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
        <h2>購物車詳情頁</h2>
        {cart?.carts && cart?.carts.length > 0 ? (
          <>
            <table className='cart-table table'>
              <thead className='text-center'>
                <tr>
                  <th>移除</th>
                  <th colSpan={2}>作品資料</th>
                  <th>數量</th>
                  <th>作品單價</th>
                  <th>總價</th>
                </tr>
              </thead>
              <tbody>
                {cart?.carts.map((item) => (
                  <tr key={item.id}>
                    <td>
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
                    <td>
                      <p>{item.product.title}</p>
                      <p className='mb-0'>({item.product.content?.name})</p>
                    </td>
                    <td>{item.qty}</td>
                    <td>{formatPrice(item.product.price)}</td>
                    <td>{formatPrice(item.final_total)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className='row justify-content-end'>
              <div className='col-12 col-lg-6'>
                <div className='d-flex justify-content-between'>
                  <h4>總價</h4>
                  <h3>TWD {formatPrice(cart?.final_total)}</h3>
                </div>
              </div>
            </div>
          </>
        ) : (
          <p>目前購物車為空</p>
        )}
      </div>
    </>
  );
}
