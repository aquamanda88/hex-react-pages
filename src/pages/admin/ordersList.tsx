import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import {
  Button,
  IconButton,
  Pagination,
  Skeleton,
  Stack,
} from '@mui/material';
import { DataTable, Spinners } from '../../components/Index';
import { PaginationDatum } from '../../core/models/utils.model';
import { OrdersDatum } from '../../core/models/order.model';
import { Column } from '../../components/DataTable';
import {
  formatPrice,
  formatDate,
  generateOrderCode,
} from '../../services/formatValue.service';
import authService from '../../services/api/admin/auth.service';
import ordersApiService from '../../services/api/admin/orders.service';
import { Delete, Edit } from '../../components/Icons';
import Swal from 'sweetalert2';
import { useDispatch } from 'react-redux';
import { toggleToast, updateMessage } from '../../redux/toastSlice';

export default function AdminOrdersList() {
  const token = sessionStorage.getItem('token') ?? '';
  const [isFullScreenLoading, setIsFullScreenLoading] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [orders, setOrders] = useState<OrdersDatum[]>([]);
  const [pagination, setPagination] = useState<PaginationDatum>({});
  const [currentPage, setCurrentPage] = useState(1);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const columns: Column<OrdersDatum>[] = [
    {
      header: '訂單編號',
      accessor: (item: OrdersDatum) => generateOrderCode(item.create_at),
      tdClass: 'text-center',
    },
    {
      header: '訂單日期',
      accessor: (item: OrdersDatum) => formatDate(item.create_at, 'short'),
      tdClass: 'text-center',
    },
    {
      header: '客戶姓名',
      accessor: (item: OrdersDatum) => item.user?.name,
      tdClass: 'text-center',
    },
    {
      header: '客戶聯絡電話',
      accessor: (item: OrdersDatum) => item.user?.tel,
      tdClass: 'text-center',
    },
    {
      header: '訂單總價',
      accessor: (item: OrdersDatum) => formatPrice(item.total),
      tdClass: 'text-end',
    },
    {
      header: '付款狀態',
      accessor: (item: OrdersDatum) =>
        item.is_paid ? (
          <p className='text-success'>付款完成</p>
        ) : (
          <p className='text-danger'>尚未付款</p>
        ),
      tdClass: 'text-center',
    },
  ];

  const actions = (item: OrdersDatum) => (
    <>
      <IconButton>
        <Edit />
      </IconButton>
      <IconButton onClick={() => handleDeleteItem(item)}>
        <Delete sx={{ color: '#dc3545' }} />
      </IconButton>
    </>
  );

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
   * 處理開啟刪除訂單 modal 事件
   *
   * @param deleteItem - 欲刪除的訂單資料
   */
  const handleDeleteItem = (deleteItem: OrdersDatum) => {
    Swal.fire({
      title: `是否確定要刪除訂單 ${generateOrderCode(deleteItem.create_at)}？`,
      icon: 'warning',
      showCancelButton: true,
      cancelButtonText: '我再想想',
      confirmButtonColor: '#cc2e41',
      cancelButtonColor: 'grey',
      confirmButtonText: '確認刪除',
    }).then((result) => {
      if (result.isConfirmed && deleteItem.id) {
        deleteOrderItem(deleteItem.id);
      }
    });
  };

  /**
   * 處理開啟刪除所有訂單 modal 事件
   */
  const handleDeleteAll = () => {
    Swal.fire({
      title: `是否確定要刪除所有訂單？`,
      icon: 'warning',
      showCancelButton: true,
      cancelButtonText: '我再想想',
      confirmButtonColor: '#cc2e41',
      cancelButtonColor: 'grey',
      confirmButtonText: '確認刪除',
    }).then((result) => {
      if (result.isConfirmed) {
        deleteOrderAll();
      }
    });
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
        setOrders(orders);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  /**
   * 呼叫刪除單一訂單資料 API
   *
   * @param id - 訂單 ID
   */
  const deleteOrderItem = async (id: string) => {
    setIsLoading(true);
    ordersApiService
      .deleteOrderItem(id)
      .then(({ data: { message, success } }) => {
        getOrders();
        dispatch(toggleToast(true));
        dispatch(
          updateMessage({
            text: message,
            status: success,
          })
        );
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  /**
   * 呼叫刪除全部訂單資料 API
   */
  const deleteOrderAll = async () => {
    setIsLoading(true);
    ordersApiService
      .deleteOrders()
      .then(({ data: { message, success } }) => {
        getOrders();
        dispatch(toggleToast(true));
        dispatch(
          updateMessage({
            text: message,
            status: success,
          })
        );
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
              <h2>所有訂單</h2>
              <Button
                variant='contained'
                className='btn btn-secondary'
                onClick={handleDeleteAll}
                disabled={orders.length === 0}
              >
                刪除所有訂單
              </Button>
            </div>
            <div className='products-table'>
              {isLoading ? (
                <Skeleton variant='rectangular' width='100%'>
                  <div style={{ paddingTop: '300px' }} />
                </Skeleton>
              ) : (
                <div className='table-responsive'>
                  <DataTable
                    data={orders}
                    columns={columns}
                    actions={actions}
                  />
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
