import { useEffect, useState } from 'react';
import { Link } from 'react-router';
import { Checkbox, Pagination, Skeleton, Stack } from '@mui/material';
import { Favorite, FavoriteBorder } from '../components/Icons';
import { ProductFullDatum } from '../core/models/utils.model';
import { formatPrice } from '../services/formatValue.service';
import productApiService from '../services/api/user/products.service';
import { useDispatch } from 'react-redux';
import { toggleToast, updateMessage } from '../redux/toastSlice';

export default function FavoritesList() {
  const [isProductLoading, setIsProductLoading] = useState(false);
  const [skeletonCount, setSkeletonCount] = useState(5);
  const [skeletonWidth, setSkeletonWidth] = useState('');
  const [pagination, setPagination] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [products, setProducts] = useState<ProductFullDatum[]>([]);
  const [isFavoriteChecked, setIsFavoriteChecked] = useState<boolean[]>([]);
  const favoritesList = localStorage.getItem('favoritesList');
  const dispatch = useDispatch();

  /**
   * 處理我的收藏事件
   *
   * @param index - 產品陣列索引值
   * @param id - 產品 ID
   */
  const handleFavoriteChange = (index: number, id: string) => {
    const favoritesListArray = favoritesList ? favoritesList.split(', ') : [];
    const updatedList = isFavoriteChecked[index]
      ? favoritesListArray.filter((item) => item !== id)
      : [...favoritesListArray, id];

    localStorage.setItem('favoritesList', updatedList.join(', '));

    if (isFavoriteChecked[index]) {
      dispatch(toggleToast(true));
      dispatch(
        updateMessage({
          text: '已從我的收藏移除',
          status: true,
        })
      );
    } else {
      dispatch(toggleToast(true));
      dispatch(
        updateMessage({
          text: '已加入我的收藏',
          status: true,
        })
      );
    }

    setIsFavoriteChecked((prevState) => {
      setIsProductLoading(true);
      const newState = [...prevState];
      newState[index] = !newState[index];
      return newState;
    });
    const filteredProducts = products.filter((item: ProductFullDatum) =>
      favoritesList?.includes(item.id!)
    );
    setProducts(filteredProducts);
  };

  /**
   * 處理分頁事件
   *
   * @param _ - ChangeEvent
   * @param page - 選取的頁數
   */
  const handlePageChange = (_: React.ChangeEvent<unknown>, page: number) => {
    if (page === currentPage) return;
    setCurrentPage(page);
    getAllProducts();
  };

  /**
   * 呼叫取得所有商品列表 API
   *
   */
  const getAllProducts = async () => {
    setIsProductLoading(true);

    productApiService
      .getAllProducts()
      .then(({ data: { products } }) => {
        const filteredProducts = products.filter((item: ProductFullDatum) =>
          favoritesList?.includes(item.id!)
        );
        setProducts(filteredProducts);
        setPagination(checkPagesCount(filteredProducts.length));
        const checkedList: boolean[] = filteredProducts.map(
          (e: { id: string }) => checkFavoriteItem(e.id)
        );
        setIsFavoriteChecked(checkedList);
      })
      .finally(() => {
        setIsProductLoading(false);
      });
  };

  /**
   * 確認目前該產品是否已加入我的收藏
   *
   * @param productId - 產品 ID
   * @returns 該產品是否已加入我的收藏
   */
  const checkFavoriteItem = (productId: string): boolean => {
    return favoritesList
      ? favoritesList.split(', ').includes(productId)
      : false;
  };

  /**
   * 計算總頁數
   *
   * @param productsLength - 我的收藏長度
   * @returns 總頁數
   */
  const checkPagesCount = (productsLength: number): number => {
    return Math.ceil(productsLength / 10);
  };

  /**
   * 計算 skeleton 所需數量
   *
   * @returns 無回傳值
   */
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
    getAllProducts();
    window.addEventListener('resize', updateSkeletonCount); // 監聽視窗大小變化
    return () => window.removeEventListener('resize', updateSkeletonCount); // 移除監聽
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [favoritesList]);

  return (
    <>
      <h2 className='page-title'>我的收藏</h2>
      <div className='content-layout container'>
        {products && products.length > 0 ? (
          <>
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
                    <div
                      className='product-list-grid position-relative'
                      key={item.id}
                    >
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
                          TWD {formatPrice(item.price)}
                        </p>
                        <p className='font-en-p-regular text-secondary'>
                          <del>TWD {formatPrice(item.origin_price)}</del>
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
                  count={pagination}
                  page={currentPage}
                  onChange={handlePageChange}
                />
              </Stack>
            </div>
          </>
        ) : (
          <div className='layout'>
            <div className='d-flex justify-content-center text-center'>
              <h2 className='font-zh-h2'>
                您的收藏中沒有任何商品，
                <Link to='/products' className='text-color-blue d-inline-flex'>
                  <p className='btn-icon'>馬上去逛逛</p>
                </Link>
              </h2>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
