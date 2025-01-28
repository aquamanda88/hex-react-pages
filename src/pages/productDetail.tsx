import { useEffect, useState } from 'react';
import productApiService from '../services/user/products.service';
import { useParams } from 'react-router-dom';
import InsertPhotoIcon from '@mui/icons-material/InsertPhoto';
import { ProductDatum } from '../core/models/utils.model';
import { Spinners } from '../components';
import { Button } from '@mui/material';
import {
  CartDataDatum,
  CartDataRequest,
  CartsDatum,
} from '../core/models/cart.model';
import cartApiService from '../services/user/cart.service';
import Swal from 'sweetalert2';
import MenuBar from '../components/menuBar';

export default function ProductDetail() {
  const [isProductLoading, setIsProductLoading] = useState(true);
  const [product, setProduct] = useState<ProductDatum>({});
  const [, setCart] = useState<CartDataDatum>();
  const [cartCount, setCartCount] = useState(0);
  const { id } = useParams();

  /**
   * 呼叫取得商品列表 API
   *
   * @prop page - 選取頁數
   */
  const getProductDetail = async (id: string) => {
    setIsProductLoading(true);

    productApiService
      .getProductDetail(id)
      .then(({ data: { product } }) => {
        setProduct(product);
      })
      .finally(() => {
        setIsProductLoading(false);
      });
  };

  /**
   * 呼叫加入購物車 API
   *
   */
  const addCart = async () => {
    const data: CartDataRequest = {
      data: {
        product_id: id ?? '',
        qty: 1,
      },
    };

    setIsProductLoading(true);
    cartApiService
      .addCart(data)
      .then(({ data: { message } }) => {
        Swal.fire({
          title: message,
        });
        getCart();
      })
      .finally(() => {
        setIsProductLoading(false);
      });
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
   * 取得購物車總數量
   *
   * @param carts - 購物車資料
   * @returns 購物車內產品總數量
   */
  function calculateTotalQty(carts: CartsDatum[]): number {
    return carts.reduce((sum, item) => sum + item.qty, 0);
  }

  useEffect(() => {
    getProductDetail(id ?? '');
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
        <h2>商品詳情頁</h2>
        <div className='row'>
          <div className='col col-6'>
            {product.imageUrl ? (
              <img src={product.imageUrl} className='object-fit' alt='主圖' />
            ) : (
              <InsertPhotoIcon className='no-image-icon' color='disabled' />
            )}
          </div>
          <div className='col col-6'>
            <h5>
              {product.content?.artists_zh_tw} ({product.content?.artists})
            </h5>
            <h2>{product.title}</h2>
            <h3>
              <i>{product.content?.name}</i>
            </h3>
            <h4>{product.content?.year}</h4>
            <h5>
              <span className='badge rounded-pill bg-primary'>
                {product.category}
              </span>
            </h5>
            <p>{product.description}</p>
            <Button
              className='btn btn-primary w-100'
              component='label'
              variant='contained'
              onClick={addCart}
            >
              加入購物車
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
