import { useEffect, useState } from 'react';
import { Navbar } from '../../components';
import formatValueService from '../../services/formatValue.service';
import cartApiService from '../../services/api/user/cart.service';
import ProductsList from '../productsList';

export default function Week05() {
  const [cartCount, setCartCount] = useState(0);

  /**
   * 呼叫取得購物車資料 API
   */
  const getCarts = async () => {
    cartApiService.getCarts().then(({ data: { data } }) => {
      setCartCount(formatValueService.calculateTotalQty(data.carts));
    });
  };

  useEffect(() => {
    getCarts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <Navbar cartCount={cartCount} />
      <ProductsList />
    </>
  );
}
