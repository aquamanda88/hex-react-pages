import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Checkbox, Pagination, Skeleton, Stack } from '@mui/material';
import { MenuBar } from '../components';
import { Favorite, FavoriteBorder } from '../components/icons';
import { PaginationDatum, ProductFullDatum } from '../core/models/utils.model';
import { CartsDatum } from '../core/models/cart.model';
import formatValueService from '../services/formatValue.service';
import productApiService from '../services/api/user/products.service';
import cartApiService from '../services/api/user/cart.service';

export default function ProductsList() {
  const [isProductLoading, setIsProductLoading] = useState(true);
  const [skeletonCount, setSkeletonCount] = useState(5);
  const [skeletonWidth, setSkeletonWidth] = useState('');
  const [pagination, setPagination] = useState<PaginationDatum>({});
  const [currentPage, setCurrentPage] = useState(1);
  const [products, setProducts] = useState<ProductFullDatum[]>([]);
  const [cartCount, setCartCount] = useState(0);
  const [isFavoriteChecked, setIsFavoriteChecked] = useState<boolean[]>([]);
  const favoriteList = localStorage.getItem('favoriteList') ?? '';

  /**
   * 處理收藏清單事件
   *
   * @param index - 產品陣列索引值
   * @param id - 產品 ID
   */
  const handleFavoriteChange = (index: number, id: string) => {
    const favoriteListArray = favoriteList.split(', ');
    const updatedList = isFavoriteChecked[index]
      ? favoriteListArray.filter((item) => item !== id)
      : [...favoriteListArray, id];

    localStorage.setItem('favoriteList', updatedList.join(', '));

    setIsFavoriteChecked((prevState) => {
      const newState = [...prevState];
      newState[index] = !newState[index];
      return newState;
    });
  };

  /**
   * 處理分頁事件
   *
   * @param _ - ChangeEvent
   * @param page - 選取的頁數
   */
  const handlePageChange = (_: React.ChangeEvent<unknown>, page: number) => {
    setCurrentPage(page);
    getProducts(page);
  };

  /**
   * 呼叫取得商品列表 API
   *
   * @param page - 選取頁數
   */
  const getProducts = async (page?: number) => {
    setIsProductLoading(true);

    productApiService
      .getProducts(page)
      .then(({ data: { pagination, products } }) => {
        setPagination(pagination);
        setProducts(products);
        const checkedList: boolean[] = products.map((e: { id: string }) =>
          checkFavoriteItem(e.id)
        );
        setIsFavoriteChecked(checkedList);
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
        setCartCount(calculateTotalQty(data.carts));
      })
      .finally(() => {
        setIsProductLoading(false);
      });
  };

  /**
   * 確認目前該產品是否已加入收藏清單
   *
   * @param productId - 產品 ID
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
    return carts.length;
  }

  function updateSkeletonCount(): void {
    const width = window.innerWidth;
    if (width > 1024) {
      setSkeletonCount(5);
      setSkeletonWidth('20%');
    } else if (width > 575) {
      setSkeletonCount(2);
      setSkeletonWidth('50%');
    } else {
      setSkeletonCount(1);
      setSkeletonWidth('100%');
    }
  }

  useEffect(() => {
    updateSkeletonCount();
    getProducts();
    getCarts();
    window.addEventListener('resize', updateSkeletonCount); // 監聽視窗大小變化
    return () => window.removeEventListener('resize', updateSkeletonCount); // 移除監聽
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <MenuBar cartCount={cartCount} />
      <div className='container py-4'>
        <div className='row mb-4'>
          {isProductLoading ? (
            <>
              {[...Array(skeletonCount)].map((_, index) => (
                <div
                  key={index}
                  className='col col-12'
                  style={{ width: skeletonWidth }}
                >
                  <Skeleton variant='rectangular' height='350px' />
                </div>
              ))}
            </>
          ) : (
            products.map((item, index) => {
              return (
                <div className='product-list-grid position-relative' key={item.id}>
                  <Link
                    to={`/product/${item.id}`}
                    className='product-image-item stretched-link'
                  >
                    <img
                      src={item.imageUrl}
                      className='image-item'
                      alt={item.imageUrl}
                    ></img>
                  </Link>
                  <div className='product-info-item'>
                    <div className='item-title d-flex justify-content-between align-items-start'>
                      <h3 className='font-zh-h5'>{item.title}</h3>
                      <Checkbox
                        checked={isFavoriteChecked[index] || false}
                        icon={<FavoriteBorder />}
                        checkedIcon={<Favorite />}
                        onChange={() =>
                          handleFavoriteChange(index, item.id ?? '')
                        }
                        sx={{
                          '& .MuiSvgIcon-root': {
                            color: 'gray',
                          },
                        }}
                      />
                    </div>
                    <p className='font-en-h4-medium mb-0'>
                      TWD {formatValueService.formatPrice(item.price)}
                    </p>
                    <p className='font-en-p-regular text-secondary'>
                      <del>
                        TWD {formatValueService.formatPrice(item.origin_price)}
                      </del>
                    </p>
                  </div>
                </div>
              );
            })
          )}
        </div>
        <div className='d-flex justify-content-center'>
          <Stack spacing={2}>
            <Pagination
              count={pagination.total_pages}
              page={currentPage}
              onChange={handlePageChange}
            />
          </Stack>
        </div>
      </div>
    </>
  );
}
