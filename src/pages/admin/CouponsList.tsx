import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useNavigate } from 'react-router';
import { useDispatch } from 'react-redux';
import {
  Button,
  TextField,
  Checkbox,
  FormControlLabel,
  Skeleton,
  Stack,
  Pagination,
  FormControl,
  IconButton,
} from '@mui/material';
import { Column } from '../../components/DataTable';
import { DataTable, Modal, Spinners } from '../../components/Index';
import { toggleToast, updateMessage } from '../../redux/toastSlice';
import { Add, Check, Close, Delete, Edit } from '../../components/Icons';
import { PaginationDatum } from '../../core/models/utils.model';
import validationService from '../../services/validation.service';
import authService from '../../services/api/admin/auth.service';
import couponApiService from '../../services/api/admin/coupons.service';
import {
  CouponDataRequest,
  CouponDatum,
  CouponFullDatum,
} from '../../core/models/coupon.model';
import { formatDate } from '../../services/formatValue.service';

const defaultValues: CouponFullDatum = {
  title: '',
  is_enabled: 0,
  percent: 0,
  due_date: 0,
  id: '',
  code: '',
};

export default function AdminCouponsList() {
  const token = sessionStorage.getItem('token') ?? '';
  const [isFullScreenLoading, setIsFullScreenLoading] = useState(false);
  const [isProductLoading, setIsProductLoading] = useState(false);
  const [products, setProducts] = useState<CouponFullDatum[]>([]);
  const [pagination, setPagination] = useState<PaginationDatum>({});
  const [currentPage, setCurrentPage] = useState(1);
  const [addOpen, setAddOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [modalType, setModalType] = useState('');
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteItem, setDeleteItem] = useState<CouponFullDatum>();
  const [tempProduct, setTempProduct] = useState<CouponFullDatum | null>(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const columns: Column<CouponFullDatum>[] = [
    { header: '優惠券名稱', accessor: 'title', tdClass: 'text-center' },
    { header: '優惠券代碼', accessor: 'code', tdClass: 'text-center' },
    { header: '折價比例', accessor: 'percent', tdClass: 'text-center' },
    {
      header: '到期時間',
      accessor: (item: CouponFullDatum) => formatDate(item?.due_date),
      tdClass: 'text-center',
    },
    {
      header: '是否啟用',
      accessor: (item: CouponFullDatum) =>
        item.is_enabled ? (
          <Check className='text-success' />
        ) : (
          <Close className='text-danger' />
        ),
      tdClass: 'text-center',
    },
  ];

  const actions = (item: CouponFullDatum) => (
    <>
      <IconButton onClick={() => handleEditOpen(item)}>
        <Edit />
      </IconButton>
      <IconButton onClick={() => handleDeleteOpen(item)}>
        <Delete className='text-danger' />
      </IconButton>
    </>
  );

  const {
    control,
    setValue,
    clearErrors,
    handleSubmit,
    formState: { errors },
  } = useForm({
    mode: 'all',
    defaultValues: {
      id: '',
      code: '',
      title: '',
      is_enabled: 0,
      percent: 0,
      due_date: 0,
    },
  });

  /**
   * 處理分頁事件
   *
   * @param _ - ChangeEvent
   * @param page - 選取的頁數
   */
  const handlePageChange = (_: React.ChangeEvent<unknown>, page: number) => {
    if (page === currentPage) return;
    setCurrentPage(page);
    getCoupons(page);
  };

  /**
   * 處理開啟新增商品 modal 事件
   */
  const handleAddOpen = () => {
    clearErrors();
    setProductValues();
    setModalType('add');
    setAddOpen(true);
  };

  /**
   * 處理開啟編輯商品 modal 事件
   *
   * @param editItem - 欲編輯的商品資料
   */
  const handleEditOpen = (editItem?: CouponFullDatum) => {
    if (!editItem) return;
    clearErrors();
    setProductValues(editItem);
    setModalType('edit');
    setEditOpen(true);
  };

  /**
   * 處理開啟刪除商品 modal 事件
   *
   * @param deleteItem - 欲刪除的商品資料
   */
  const handleDeleteOpen = (deleteItem: CouponFullDatum) => {
    setDeleteItem(deleteItem);
    setDeleteOpen(true);
  };

  /**
   * 處理新增 編輯商品事件
   */
  const onSubmit = (data: CouponDatum) => {
    if (modalType === 'add') {
      addCouponItem(getAddCouponRequest(data));
    } else if (modalType === 'edit') {
      editCouponItem(tempProduct?.id ?? '', getAddCouponRequest(data));
    }
  };

  /**
   * 取得 AddCouponRequest
   *
   * @param data - 商品表單欄位
   */
  const getAddCouponRequest = (data: CouponDatum) => {
    const newTempProduct: CouponDataRequest = {
      data: {
        title: data.title,
        code: data.code,
        is_enabled: data.is_enabled,
        percent: Number(data.percent),
        due_date: Math.floor(new Date('2025-03-03').getTime() / 1000),
      },
    };

    return newTempProduct;
  };

  /**
   * 取得表單內容值
   *
   * @param editItem - 商品類 API 回傳基準欄位 (有 id)
   */
  const setProductValues = (editItem?: CouponFullDatum) => {
    const item = editItem ?? defaultValues;

    const { title, code, is_enabled, percent, due_date } = item;

    setValue('title', title);
    setValue('code', code ?? '');
    setValue('is_enabled', is_enabled ?? 0);
    setValue('percent', percent ?? 0);
    setValue('due_date', due_date ?? 0);
    setTempProduct(item);
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
   * 呼叫取得商品列表 API
   *
   * @param page - 選取頁數
   */
  const getCoupons = async (page?: number) => {
    setIsProductLoading(true);

    couponApiService
      .getCoupons(page)
      .then(({ data: { pagination, coupons } }) => {
        setPagination(pagination);
        setProducts(coupons);
      })
      .finally(() => {
        setIsProductLoading(false);
      });
  };

  /**
   * 呼叫新增商品列表 API
   *
   * @param addCouponRequest - 新增產品 request
   */
  const addCouponItem = async (addCouponRequest: CouponDataRequest) => {
    setAddOpen(false);
    setIsProductLoading(true);

    couponApiService
      .addCouponItem(addCouponRequest)
      .then(({ data: { message, success } }) => {
        getCoupons(currentPage);
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
   * 呼叫編輯商品列表 API
   *
   * @param id - 商品 ID
   * @param editProductRequest - 編輯產品 request
   */
  const editCouponItem = async (
    id: string,
    editCouponRequest: CouponDataRequest
  ) => {
    setEditOpen(false);
    setIsProductLoading(true);

    couponApiService
      .editCouponItem(id, editCouponRequest)
      .then(({ data: { message, success } }) => {
        getCoupons(currentPage);
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
   * 呼叫刪除商品列表 API
   */
  const deleteProduct = async () => {
    setDeleteOpen(false);
    setIsProductLoading(true);

    couponApiService
      .deleteCouponItem(deleteItem?.id ?? '')
      .then(({ data: { message, success } }) => {
        getCoupons(currentPage);
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

  useEffect(() => {
    setIsFullScreenLoading(true);
    if (token) {
      checkLogin(token).then((res) => {
        if (res) {
          getCoupons(currentPage).finally(() => {
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
              <h2>所有商品</h2>
              <Button
                variant='contained'
                className='btn btn-secondary'
                onClick={() => {
                  handleAddOpen();
                }}
              >
                <Add />
                <p className='btn-icon'>新增</p>
              </Button>
            </div>
            <div className='products-table'>
              {isProductLoading ? (
                <Skeleton variant='rectangular' width='100%'>
                  <div style={{ paddingTop: '300px' }} />
                </Skeleton>
              ) : (
                <div className='table-responsive'>
                  <DataTable
                    data={products}
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
          <Modal
            open={deleteOpen}
            setOpen={setDeleteOpen}
            confirmBtnText={'刪除'}
            handleConfirm={deleteProduct}
          >
            <div className='container'>
              <div className='row text-center justify-content-center'>
                <h4>是否確定要刪除</h4>
                <h2>《{deleteItem?.title}》</h2>
              </div>
            </div>
          </Modal>
          <div className='col-lg-6'>
            <Modal
              open={modalType === 'add' ? addOpen : editOpen}
              setOpen={modalType === 'add' ? setAddOpen : setEditOpen}
              isFullScreen={true}
            >
              <div className='container card'>
                <form
                  id='form'
                  className='form-signin'
                  onSubmit={handleSubmit(onSubmit)}
                >
                  <div className='text-field-group'>
                    <div className='d-flex gap-3'>
                      <FormControl error={!!errors.title} className='w-100'>
                        <Controller
                          name='title'
                          control={control}
                          rules={validationService.titleValidator()}
                          render={({ field }) => (
                            <TextField
                              {...field}
                              label='優惠券名稱'
                              type='text'
                              error={!!errors.title}
                              helperText={validationService.getHelperText(
                                errors.title
                              )}
                              onChange={(e) => {
                                field.onChange(e);
                              }}
                            />
                          )}
                        />
                      </FormControl>
                      <FormControl error={!!errors.code} className='w-100'>
                        <Controller
                          name='code'
                          control={control}
                          rules={validationService.titleValidator()}
                          render={({ field }) => (
                            <TextField
                              {...field}
                              label='優惠券使用代碼'
                              type='text'
                              error={!!errors.code}
                              helperText={validationService.getHelperText(
                                errors.code
                              )}
                              onChange={(e) => {
                                field.onChange(e);
                              }}
                            />
                          )}
                        />
                      </FormControl>
                    </div>
                    <div className='d-flex gap-3'>
                      <FormControl className='w-100'>
                        <Controller
                          name='percent'
                          control={control}
                          render={({ field }) => (
                            <TextField
                              {...field}
                              label='折價比例'
                              type='number'
                              onChange={(e) => {
                                if (validationService.isValidInput(e)) {
                                  field.onChange(e);
                                }
                              }}
                            />
                          )}
                        />
                      </FormControl>
                      <FormControl className='w-100'>
                        <Controller
                          name='due_date'
                          control={control}
                          render={({ field }) => (
                            <TextField
                              {...field}
                              label='到期時間'
                              type='text'
                              onChange={(e) => {
                                if (validationService.isValidInput(e)) {
                                  field.onChange(e);
                                }
                              }}
                            />
                          )}
                        />
                        {formatDate(tempProduct?.due_date)}
                      </FormControl>
                    </div>
                  </div>
                  <FormControl className='mb-2'>
                    <Controller
                      name='is_enabled'
                      control={control}
                      render={({ field }) => (
                        <FormControlLabel
                          control={
                            <Checkbox
                              color='primary'
                              checked={field.value === 1 ? true : false}
                              onChange={(e) =>
                                field.onChange(e.target.checked ? 1 : 0)
                              }
                            />
                          }
                          label='是否啟用'
                        />
                      )}
                    />
                  </FormControl>
                </form>
              </div>
            </Modal>
          </div>
        </div>
      </div>
    </>
  );
}
