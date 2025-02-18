import { useEffect, useState } from 'react';
import { Link } from 'react-router';
import { Pagination, Skeleton, Stack } from '@mui/material';
import { DataTable } from '../components/Index';
import { ArrowForwardIos } from '../components/Icons';
import { PaginationDatum } from '../core/models/utils.model';
import { OrdersDatum } from '../core/models/order.model';
import { Column } from '../components/DataTable';
import {
  formatPrice,
  formatDate,
  generateOrderCode,
} from '../services/formatValue.service';
import ordersApiService from '../services/api/user/orders.service';

export default function OrdersList() {
  const [isLoading, setIsLoading] = useState(true);
  const [orders, setOrders] = useState<OrdersDatum[]>([]);
  const [pagination, setPagination] = useState<PaginationDatum>({});
  const [currentPage, setCurrentPage] = useState(1);

  const columns: Column<OrdersDatum>[] = [
    {
      header: '訂單編號',
      accessor: (item: OrdersDatum) => (
        <Link
          to={item.is_paid ? `/order/${item.id}` : `/checkout/${item.id}`}
          className='table-text-link'
        >
          <p>{generateOrderCode(item.create_at)}</p>
          <ArrowForwardIos />
        </Link>
      ),
      tdClass: 'text-center',
    },
    {
      header: '訂單日期',
      accessor: (item: OrdersDatum) => formatDate(item.create_at, 'short'),
      thClass: 'w-10',
      tdClass: 'text-center',
    },
    {
      header: '訂單狀態',
      accessor: () => '訂單成立',
      thClass: 'w-10',
      tdClass: 'text-center',
    },
    {
      header: '總價 (TWD)',
      accessor: (item: OrdersDatum) => `$${formatPrice(item.total)}`,
      thClass: 'w-10',
      tdClass: 'text-end',
    },
    {
      header: '付款方式',
      accessor: () => '信用卡',
      thClass: 'w-10',
      tdClass: 'text-center',
    },
    {
      header: '付款狀態',
      accessor: (item: OrdersDatum) =>
        item.is_paid ? (
          <p className='text-success'>付款完成</p>
        ) : (
          <p className='text-danger'>尚未付款</p>
        ),
        thClass: 'w-10',
      tdClass: 'text-center',
    },
  ];

  /**
   * 處理分頁事件
   *
   * @param _ - ChangeEvent
   * @param page - 選取的頁數
   */
  const handlePageChange = (_: React.ChangeEvent<unknown>, page: number) => {
    if (page === currentPage) return;
    setCurrentPage(page);
    getOrders(page);
  };

  /**
   * 呼叫取得訂單列表 API
   *
   * @param page - 選取頁數
   */
  const getOrders = async (page?: number) => {
    setIsLoading(true);

    ordersApiService
      .getOrders(page)
      .then(({ data: { pagination, orders } }) => {
        setPagination(pagination);
        setOrders(orders);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  useEffect(() => {
    getOrders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <h2 className='page-title'>訂單記錄</h2>
      <div className='container py-4'>
        <div className='row flex-column justify-content-center align-items-center'>
          <div className='mb-4'>
            <div className='products-table'>
              {isLoading ? (
                <Skeleton variant='rectangular' width='100%'>
                  <div style={{ paddingTop: '300px' }} />
                </Skeleton>
              ) : (
                <div className='table-responsive'>
                  <DataTable data={orders} columns={columns} />
                </div>
              )}
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
          </div>
        </div>
      </div>
    </>
  );
}
