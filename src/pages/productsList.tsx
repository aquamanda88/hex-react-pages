import { useEffect, useState } from 'react';
import productApiService from '../services/user/products.service';
import { PaginationDatum, ProductFullDatum } from '../core/models/utils.model';
import { Checkbox, Pagination, Skeleton, Stack } from '@mui/material';
import { Link } from 'react-router-dom';
import { Favorite, FavoriteBorder } from '@mui/icons-material';

export default function ProductsList() {
  const [isProductLoading, setIsProductLoading] = useState(true);
  const [pagination, setPagination] = useState<PaginationDatum>({});
  const [currentPage, setCurrentPage] = useState(1);
  const [products, setProducts] = useState<ProductFullDatum[]>([]);
  const [isFavoriteChecked, setIsFavoriteChecked] = useState<boolean[]>([]);
  const favoriteList = localStorage.getItem('favoriteList') ?? '';

  const handleFavoriteChange = (index: number, id: string) => {
    const favoriteListArray = favoriteList.split(', ');

    // 根據 current checked 狀態判斷是否新增或刪除 id
    const updatedList = isFavoriteChecked[index]
      ? favoriteListArray.filter((item) => item !== id)
      : [...favoriteListArray, id];

    // 更新 localStorage
    localStorage.setItem('favoriteList', updatedList.join(', '));

    // 切換 checked 狀態
    setIsFavoriteChecked((prevState) => {
      const newState = [...prevState];
      newState[index] = !newState[index];
      return newState;
    });
  };

  /**
   * 處理分頁事件
   *
   * @prop _ - ChangeEvent
   * @prop page - 選取的頁數
   */
  const handlePageChange = (_: React.ChangeEvent<unknown>, page: number) => {
    setCurrentPage(page);
    getProducts(page);
  };

  /**
   * 呼叫取得商品列表 API
   *
   * @prop page - 選取頁數
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

  const checkFavoriteItem = (productId: string): boolean => {
    return favoriteList.split(', ').includes(productId);
  };

  useEffect(() => {
    getProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className='container py-4'>
      <div className='card mb-4'>
        <div className='row'>
          {isProductLoading ? (
            <>
              <div className='col col-12 col-lg-4'>
                <Skeleton variant='rectangular' height='350px'></Skeleton>
              </div>
              <div className='col col-12 col-lg-4'>
                <Skeleton variant='rectangular' height='350px'></Skeleton>
              </div>
              <div className='col col-12 col-lg-4'>
                <Skeleton variant='rectangular' height='350px'></Skeleton>
              </div>
            </>
          ) : (
            products.map((item, index) => {
              return (
                <div className='col col-12 col-lg-4' key={item.id}>
                  <Link to={`/product/${item.id}`}>
                    <img
                      src={item.imageUrl}
                      className='item-image'
                      alt={item.imageUrl}
                    ></img>
                  </Link>
                  <div>
                    <div className='d-flex justify-content-between align-items-center'>
                      <h3>{item.title}</h3>
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
                    <p>TWD {formatPrice(item.price)}</p>
                  </div>
                </div>
              );
            })
          )}
        </div>
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
  );
}
