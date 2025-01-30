import { useEffect, useState } from 'react';
import productApiService from '../services/user/products.service';
import { useParams } from 'react-router-dom';
import InsertPhotoIcon from '@mui/icons-material/InsertPhoto';
import { ProductDatum } from '../core/models/utils.model';
import { Spinners } from '../components';
import { Button, Checkbox } from '@mui/material';
import {
  CartDataDatum,
  CartDataRequest,
  CartsDatum,
} from '../core/models/cart.model';
import cartApiService from '../services/user/cart.service';
import Swal from 'sweetalert2';
import MenuBar from '../components/menuBar';
import { Favorite, FavoriteBorder } from '@mui/icons-material';

export default function ProductDetail() {
  const [isProductLoading, setIsProductLoading] = useState(true);
  const [product, setProduct] = useState<ProductDatum>({});
  const [, setCart] = useState<CartDataDatum>();
  const [cartCount, setCartCount] = useState(0);
  const [isFavoriteChecked, setIsFavoriteChecked] = useState<boolean>(false);
  const favoriteList = localStorage.getItem('favoriteList') ?? '';
  const { id } = useParams();

  /**
   * 處理收藏清單事件
   *
   * @prop id - 產品 ID
   */
  const handleFavoriteChange = (id: string) => {
    const favoriteListArray = favoriteList.split(', ');
    const updatedList = isFavoriteChecked
      ? favoriteListArray.filter((item) => item !== id)
      : [...favoriteListArray, id];

    localStorage.setItem('favoriteList', updatedList.join(', '));

    setIsFavoriteChecked(updatedList.includes(id));
  };

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
        setIsFavoriteChecked(checkFavoriteItem(id));
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
   * 確認目前該產品是否已加入收藏清單
   *
   * @prop productId - 產品 ID
   * @returns 該產品是否已加入收藏清單
   */
  const checkFavoriteItem = (productId: string): boolean => {
    return favoriteList.split(', ').includes(productId);
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
            <div className='d-flex justify-content-between align-items-center'>
              <h5 className='mb-0'>
                {product.content?.artists_zh_tw} ({product.content?.artists})
              </h5>
              <Checkbox
                checked={isFavoriteChecked}
                icon={<FavoriteBorder />}
                checkedIcon={<Favorite />}
                onChange={() => handleFavoriteChange(id ?? '')}
                sx={{
                  '& .MuiSvgIcon-root': {
                    color: 'gray',
                  },
                }}
              />
              {/* <IconButton onClick={handleFavoriteChange}>
                {isFavorite ? <FavoriteIcon /> : <FavoriteBorderIcon />}
              </IconButton> */}
            </div>
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
            <p>
              <span className='me-2'>NTD {formatPrice(product.price)}</span>
              <del>NTD {formatPrice(product.origin_price)}</del>
            </p>
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
