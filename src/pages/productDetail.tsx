import { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { useDispatch } from 'react-redux';
import { Button, Checkbox } from '@mui/material';
import { Spinners } from '../components/Index';
import { Favorite, FavoriteBorder, InsertPhoto } from '../components/Icons';
import { calculateCartCount } from '../redux/countSlice';
import { ProductDatum } from '../core/models/utils.model';
import { CartDataDatum, CartDataRequest } from '../core/models/cart.model';
import {
  formatPrice,
  formatUnknownText,
} from '../services/formatValue.service';
import productApiService from '../services/api/user/products.service';
import cartApiService from '../services/api/user/cart.service';
import Swal from 'sweetalert2';
import { toggleToast, updateMessage } from '../redux/toastSlice';

export default function ProductDetail() {
  const [isProductLoading, setIsProductLoading] = useState(false);
  const [product, setProduct] = useState<ProductDatum>({});
  const [, setCart] = useState<CartDataDatum>();
  const [isFavoriteChecked, setIsFavoriteChecked] = useState<boolean>(false);
  const { id } = useParams();
  const favoritesList = localStorage.getItem('favoritesList');
  const dispatch = useDispatch();

  /**
   * 處理收藏清單事件
   *
   * @param id - 產品 ID
   */
  const handleFavoriteChange = (id: string) => {
    const favoritesListArray = favoritesList ? favoritesList.split(', ') : [];
    const updatedList = isFavoriteChecked
      ? favoritesListArray.filter((item) => item !== id)
      : [...favoritesListArray, id];

    localStorage.setItem('favoritesList', updatedList.join(', '));
    if (isFavoriteChecked) {
      dispatch(toggleToast(true));
      dispatch(
        updateMessage({
          text: '已從收藏清單移除',
          status: true,
        })
      );
    } else {
      dispatch(toggleToast(true));
      dispatch(
        updateMessage({
          text: '已加入收藏清單',
          status: true,
        })
      );
    }
    setIsFavoriteChecked(updatedList.includes(id));
  };

  /**
   * 處理開啟圖片事件
   *
   * @param name - 作品原文名稱
   * @param imageUrl - 作品圖片網址
   */
  const handleImageClick = (name: string, imageUrl: string) => {
    if (window.innerWidth < 992) {
      return;
    }

    Swal.fire({
      imageUrl: imageUrl,
      imageAlt: name,
      width: '70%',
      showConfirmButton: false,
      customClass: {
        popup: 'my-swal-popup',
        image: 'my-swal-image',
      },
    });
  };

  /**
   * 呼叫取得商品列表 API
   *
   * @param id - 商品 ID
   */
  const getProductItem = async (id: string) => {
    setIsProductLoading(true);

    productApiService
      .getProductItem(id)
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
   */
  const addCartItem = async () => {
    const data: CartDataRequest = {
      data: {
        product_id: id ?? '',
        qty: 1,
      },
    };

    setIsProductLoading(true);
    cartApiService
      .addCartItem(data)
      .then(({ data: { message, success } }) => {
        getCarts();
        dispatch(toggleToast(true));
        dispatch(
          updateMessage({
            text: message,
            status: success,
          })
        );
      })
      .finally(() => {
        setIsProductLoading(false);
      });
  };

  /**
   * 呼叫取得購物車資料 API
   */
  const getCarts = async () => {
    setIsProductLoading(true);
    cartApiService
      .getCarts()
      .then(({ data: { data } }) => {
        setCart(data);
        dispatch(calculateCartCount(data.carts.length));
      })
      .finally(() => {
        setIsProductLoading(false);
      });
  };

  /**
   * 確認目前該產品是否已加入收藏清單
   *
   * @param productId - 商品 ID
   * @returns 該產品是否已加入收藏清單
   */
  const checkFavoriteItem = (productId: string): boolean => {
    return favoritesList
      ? favoritesList.split(', ').includes(productId)
      : false;
  };

  useEffect(() => {
    getProductItem(id ?? '');
    getCarts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
    <h2 className='page-title'>作品資訊</h2>
      <div className='product-detail-container container'>
        <div className={`${isProductLoading ? 'd-flex' : 'd-none'} loading`}>
          <Spinners />
        </div>
        <div className='row'>
          <div className='product-image col-12 col-lg-6'>
            {product.imageUrl ? (
              <button
                className='hvr-glow'
                type='button'
                onClick={() =>
                  handleImageClick(
                    product.content?.name ?? 'Unknown',
                    product.imageUrl ?? 'noImage'
                  )
                }
              >
                <img
                  src={product.imageUrl}
                  className='object-fit'
                  alt={product.content?.name ?? 'Unknown'}
                />
              </button>
            ) : (
              <InsertPhoto className='no-image-icon' color='disabled' />
            )}
            {product.imagesUrl && (
              <ul className='image-list row pt-4'>
                {product.imagesUrl.map((item, index) => (
                  <li key={index} className='col-2'>
                    <button
                      className='hvr-grow-shadow'
                      type='button'
                      onClick={() =>
                        handleImageClick(
                          product.content?.name ?? 'Unknown',
                          item
                        )
                      }
                    >
                      <img className='sub-images' src={item} alt={item} />
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div className='detail-item col-12 col-lg-6'>
            {JSON.stringify(product) !== '{}' && (
              <>
                <div className='d-flex justify-content-between align-items-center'>
                  <h5 className='mb-0'>
                    {formatUnknownText(
                      'artists_zh_tw',
                      product.content?.artists_zh_tw
                    )}{' '}
                    ({formatUnknownText('artists', product.content?.artists)})
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
                </div>
                <h2 className='font-zh-h4-medium'>{product.title}</h2>
                <h3 className='font-zh-h5-medium'>
                  <i>{formatUnknownText('name', product.content?.name)}</i>
                </h3>
                <h4 className='font-zh-h4-medium'>
                  {formatUnknownText('year', product.content?.year)}
                </h4>
                <h5>
                  <span className='badge rounded-pill bg-secondary font-zh-p-regular'>
                    {product.category}
                  </span>
                </h5>
                <p className='font-zh-p-medium'>{product.description}</p>
                <p className='font-en-h4-medium mb-0'>
                  TWD {formatPrice(product.price)}
                </p>
                <p className='font-en-p-regular text-secondary'>
                  <del>TWD {formatPrice(product.origin_price)}</del>
                </p>

                <Button
                  className='btn btn-primary w-100'
                  component='label'
                  variant='contained'
                  onClick={addCartItem}
                >
                  加入購物車
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
