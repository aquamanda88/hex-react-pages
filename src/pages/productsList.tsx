import { useEffect, useState } from 'react';
import { Link } from 'react-router';
import { useDispatch } from 'react-redux';
import { Checkbox, Pagination, Skeleton, Stack } from '@mui/material';
import { Favorite, FavoriteBorder } from '../components/Icons';
import { PaginationDatum, ProductFullDatum } from '../core/models/utils.model';
import { toggleToast, updateMessage } from '../redux/toastSlice';
import { formatPrice } from '../services/formatValue.service';
import productApiService from '../services/api/user/products.service';

export default function ProductsList() {
  const [isProductLoading, setIsProductLoading] = useState(false);
  const [skeletonCount, setSkeletonCount] = useState(5);
  const [skeletonWidth, setSkeletonWidth] = useState('');
  const [pagination, setPagination] = useState<PaginationDatum>({});
  const [currentPage, setCurrentPage] = useState(1);
  const [products, setProducts] = useState<ProductFullDatum[]>([]);
  const [isFavoriteChecked, setIsFavoriteChecked] = useState<boolean[]>([]);
  const favoritesList = localStorage.getItem('favoritesList') ?? '';
  const dispatch = useDispatch();

  /**
   * 處理收藏清單事件
   *
   * @param index - 產品陣列索引值
   * @param id - 產品 ID
   */
  const handleFavoriteChange = (index: number, id: string) => {
    const favoritesListArray = favoritesList.split(', ');
    const updatedList = isFavoriteChecked[index]
      ? favoritesListArray.filter((item) => item !== id)
      : [...favoritesListArray, id];

    localStorage.setItem('favoritesList', updatedList.join(', '));

    if (isFavoriteChecked[index]) {
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
    if (page === currentPage) return;
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
   * 確認目前該產品是否已加入收藏清單
   *
   * @param productId - 產品 ID
   * @returns 該產品是否已加入收藏清單
   */
  const checkFavoriteItem = (productId: string): boolean => {
    return favoritesList.split(', ').includes(productId);
  };

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
    window.addEventListener('resize', updateSkeletonCount); // 監聽視窗大小變化
    return () => window.removeEventListener('resize', updateSkeletonCount); // 移除監聽
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <h2 className='page-title'>全部作品</h2>
      <div className='content-layout container'>
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
