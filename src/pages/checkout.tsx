import { useEffect, useState } from 'react';
import { MenuBar, Spinners, Steppers } from '../components';
import cartApiService from '../services/user/cart.service';
import { CartsDatum } from '../core/models/cart.model';

export default function Checkout() {
  const [isProductLoading, setIsProductLoading] = useState(true);
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
        <Steppers />
      </div>
    </>
  );
}
