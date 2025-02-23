import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { Pagination, Skeleton, Stack } from '@mui/material';
import { DataTable, Spinners } from '../../components/Index';
import { PaginationDatum } from '../../core/models/utils.model';
import { OrdersDatum, ProductsDatum } from '../../core/models/order.model';
import { Column } from '../../components/DataTable';
import {
  formatDate,
  formatPrice,
  formatUnknownText,
} from '../../services/formatValue.service';
import authService from '../../services/api/admin/auth.service';
import ordersApiService from '../../services/api/admin/orders.service';
import { CartsDatum } from '../../core/models/cart.model';
import { Check, Close } from '../../components/Icons';

export default function AdminOrderDetail() {
  const token = sessionStorage.getItem('token') ?? '';
  const [isFullScreenLoading, setIsFullScreenLoading] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<OrdersDatum>();
  const [products, setProducts] = useState<ProductsDatum>({});
  const [pagination, setPagination] = useState<PaginationDatum>({});
  const [currentPage, setCurrentPage] = useState(1);
  const { id } = useParams();
  const navigate = useNavigate();

  const columns: Column<CartsDatum>[] = [
    {
      header: '作品名稱',
      accessor: (item: CartsDatum) =>
        formatUnknownText('name', item.product.title),
    },
    {
      header: '作品原文名稱',
      accessor: (item: CartsDatum) =>
        formatUnknownText('name', item.product.content?.name),
    },
    {
      header: '作者名稱',
      accessor: (item: CartsDatum) =>
        formatUnknownText('artists_zh_tw', item.product.content?.artists_zh_tw),
      tdClass: 'text-center',
    },
    {
      header: '原價 (TWD)',
      accessor: (item: CartsDatum) => formatPrice(item.product.origin_price),
      tdClass: 'text-end',
    },
    {
      header: '售價 (TWD)',
      accessor: (item: CartsDatum) => formatPrice(item.product.price),
      tdClass: 'text-end',
    },
    {
      header: '數量',
      accessor: (item: CartsDatum) => `${item.qty} ${item.product.unit}`,
      tdClass: 'text-center',
    },
    {
      header: '是否有套用優惠券',
      accessor: (item: CartsDatum) =>
        item.coupon ? (
          <Check className='text-success' />
        ) : (
          <Close className='text-danger' />
        ),
      tdClass: 'text-center',
    },
    {
      header: '優惠券名稱',
      accessor: (item: CartsDatum) =>
        item.coupon?.title ? item.coupon?.title : '－',
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
   * 呼叫登入驗證 API
   *
   * @param token - token
   */
  const checkLogin = async (token: string) => {
    const result = await authService.checkLogin(token);
    return result.data.success;
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
        const selectedOrder =
          orders.find((item: OrdersDatum) => item.id === id) || null;
        setProducts(selectedOrder ? selectedOrder.products : {});
        setSelectedOrder(selectedOrder);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  useEffect(() => {
    setIsFullScreenLoading(true);
    if (token) {
      checkLogin(token).then((res) => {
        if (res) {
          getOrders().finally(() => {
            setIsFullScreenLoading(false);
          });
        } else {
          setIsFullScreenLoading(false);
        }
      });
    } else {
      navigate('/login');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <div className='container py-4'>
        <div className={`${isFullScreenLoading ? 'd-flex' : 'd-none'} loading`}>
          <Spinners />
        </div>
        <div className='row flex-column justify-content-center align-items-center'>
          <div className='mb-4'>
            <div className='d-flex justify-content-between mb-4'>
              <h2>訂單明細</h2>
            </div>
            <div className='products-table'>
              {isLoading ? (
                <Skeleton variant='rectangular' width='100%'>
                  <div style={{ paddingTop: '300px' }} />
                </Skeleton>
              ) : (
                <>
                  <div className='detail-item'>
                    <div className='d-flex justify-content-between'>
                      <div className='info-item-list'>
                        <p>訂單 ID：{selectedOrder?.id}</p>
                        <div className='info-item'>
                          <p>
                            訂單成立時間：{formatDate(selectedOrder?.create_at)}
                          </p>
                          <p>付款方式：信用卡</p>
                        </div>
                        <div className='info-item'>
                          {selectedOrder?.paid_date && (
                            <p className='mb-0'>
                              付款時間：{formatDate(selectedOrder?.paid_date)}
                            </p>
                          )}
                          <p className='mb-0'>
                            總金額：TWD {formatPrice(selectedOrder?.total)}
                          </p>
                        </div>
                      </div>
                      {selectedOrder?.is_paid ? (
                        <p className='text-success font-zh-h3-medium'>
                          付款完成
                        </p>
                      ) : (
                        <p className='text-danger font-zh-h3-medium'>
                          尚未付款
                        </p>
                      )}
                    </div>
                    <hr />
                    <ul>
                      <li>
                        訂購人姓名：
                        {selectedOrder?.user?.name}
                      </li>
                      <li>
                        電子信箱：
                        {selectedOrder?.user?.email}
                      </li>
                      <li>
                        聯絡電話：
                        {selectedOrder?.user?.tel}
                      </li>
                      <li>
                        寄送地址：
                        {selectedOrder?.user?.address}
                      </li>
                    </ul>
                  </div>

                  <div className='table-responsive'>
                    <DataTable
                      data={Object.values(products)}
                      columns={columns}
                    />
                  </div>
                </>
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
