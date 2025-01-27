import { useEffect, useState } from 'react';
import productApiService from '../services/user/products.service';
import { PaginationDatum, ProductFullDatum } from '../core/models/utils.model';
import { Pagination, Skeleton, Stack } from '@mui/material';
import { Link } from 'react-router-dom';

export default function ProductsList() {
  const [isProductLoading, setIsProductLoading] = useState(true);
  const [pagination, setPagination] = useState<PaginationDatum>({});
  const [currentPage, setCurrentPage] = useState(1);
  const [products, setProducts] = useState<ProductFullDatum[]>([]);

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
      })
      .finally(() => {
        setIsProductLoading(false);
      });
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
            products.map((item) => {
              return (
                <div className='col col-12 col-lg-4'>
                  <Link to={`/product/${item.id}`}>
                    <img
                      src={item.imageUrl}
                      className='item-image'
                      alt={item.imageUrl}
                    ></img>
                    <div>
                      <h3>{item.title}</h3>
                      <p>NT$ {item.price}</p>
                    </div>
                  </Link>
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
