import { useEffect, useState } from 'react';
import { Outlet } from 'react-router';
import { Footer, Navbar } from '../components';
import { calculateTotalQty } from '../services/formatValue.service';
import cartApiService from '../services/api/user/cart.service';

export default function Layout() {
  const [cartCount, setCartCount] = useState(0);

  /**
   * 呼叫取得購物車資料 API
   */
  const getCarts = async () => {
    cartApiService.getCarts().then(({ data: { data } }) => {
      setCartCount(calculateTotalQty(data.carts));
    });
  };

  useEffect(() => {
    getCarts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <Navbar cartCount={cartCount} />
      <Outlet />
      <Footer />
    </>
  );
}
