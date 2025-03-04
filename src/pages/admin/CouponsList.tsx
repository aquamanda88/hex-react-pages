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
  Select,
  MenuItem,
  InputLabel,
} from '@mui/material';
import { Column } from '../../components/DataTable';
import { DataTable, Modal, Spinners } from '../../components/Index';
import { Add, Check, Close, Delete, Edit } from '../../components/Icons';
import { toggleToast, updateMessage } from '../../redux/toastSlice';
import {
  CouponDataRequest,
  CouponDatum,
  CouponFullDatum,
} from '../../core/models/coupon.model';
import { PaginationDatum } from '../../core/models/utils.model';
import { format } from 'date-fns/fp/format';
import { formatDate } from '../../services/formatValue.service';
import validationService from '../../services/validation.service';
import authService from '../../services/api/admin/auth.service';
import couponApiService from '../../services/api/admin/coupons.service';
import Swal from 'sweetalert2';

const defaultValues = {
  id: '',
  title: '',
  code: '',
  is_enabled: 0,
  percent: 10,
  due_date: `${new Date().getFullYear()}-12-31`,
};

export default function AdminCouponsList() {
  const token = sessionStorage.getItem('token') ?? '';
  const [isFullScreenLoading, setIsFullScreenLoading] = useState(false);
  const [isCouponLoading, setIsCouponLoading] = useState(false);
  const [coupons, setCoupons] = useState<CouponFullDatum[]>([]);
  const [pagination, setPagination] = useState<PaginationDatum>({});
  const [currentPage, setCurrentPage] = useState(1);
  const [addOpen, setAddOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [modalType, setModalType] = useState('');
  const [tempProduct, setTempProduct] = useState<CouponFullDatum | null>(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const selectOptions = [
    { discount: '10%', value: 10 },
    { discount: '20%', value: 20 },
    { discount: '30%', value: 30 },
    { discount: '40%', value: 40 },
    { discount: '50%', value: 50 },
    { discount: '60%', value: 60 },
    { discount: '70%', value: 70 },
    { discount: '80%', value: 80 },
    { discount: '90%', value: 90 },
  ];

  const columns: Column<CouponFullDatum>[] = [
    { header: '優惠券名稱', accessor: 'title', tdClass: 'text-center' },
    { header: '優惠券代碼', accessor: 'code', tdClass: 'text-center' },
    {
      header: '折價比例',
      accessor: (item: CouponFullDatum) => `${item.percent}% OFF`,
      tdClass: 'text-center',
    },
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
      <IconButton onClick={() => handleDeleteItem(item)}>
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
    defaultValues,
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
   * 處理開啟新增優惠券 modal 事件
   */
  const handleAddOpen = () => {
    clearErrors();
    setCouponValues();
    setModalType('add');
    setAddOpen(true);
  };

  /**
   * 處理開啟編輯優惠券 modal 事件
   *
   * @param editItem - 欲編輯的優惠券資料
   */
  const handleEditOpen = (editItem?: CouponFullDatum) => {
    if (!editItem) return;
    clearErrors();
    setCouponValues(editItem);
    setModalType('edit');
    setEditOpen(true);
  };

  /**
   * 處理開啟刪除優惠券 modal 事件
   *
   * @param deleteItem - 欲刪除的優惠券資料
   */
  const handleDeleteItem = (deleteItem: CouponFullDatum) => {
    Swal.fire({
      title: '是否確定要刪除',
      text: `${deleteItem.title}【${deleteItem.code}】`,
      icon: 'warning',
      showCancelButton: true,
      cancelButtonText: '我再想想',
      confirmButtonColor: '#CD2745',
      cancelButtonColor: '#888888',
      confirmButtonText: '確認刪除',
    }).then((result) => {
      if (result.isConfirmed && deleteItem.id) {
        deleteCouponItem(deleteItem.id);
      }
    });
  };

  /**
   * 處理新增/編輯優惠券事件
   * 
    @param data - 欲新增/編輯的優惠券資料
   */
  const onSubmit = (data: {
    id: string;
    title: string;
    code: string;
    is_enabled: number;
    percent: number;
    due_date: string;
  }) => {
    const transformedData: CouponDatum = {
      ...data,
      due_date: Date.parse(`${data.due_date}T00:00:00`) / 1000,
    };

    if (modalType === 'add') {
      addCouponItem(getAddCouponRequest(transformedData));
    } else if (modalType === 'edit') {
      editCouponItem(
        tempProduct?.id ?? '',
        getAddCouponRequest(transformedData)
      );
    }
  };

  /**
   * 取得 AddCouponRequest
   *
   * @param data - 優惠券表單欄位
   */
  const getAddCouponRequest = (data: CouponDatum) => {
    const newTempProduct: CouponDataRequest = {
      data: {
        title: data.title,
        code: data.code,
        is_enabled: data.is_enabled,
        percent: Number(data.percent),
        due_date: data.due_date,
      },
    };
    return newTempProduct;
  };

  /**
   * 取得表單內容值
   *
   * @param editItem - 優惠券類 API 回傳基準欄位 (有 id)
   */
  const setCouponValues = (editItem?: CouponFullDatum) => {
    const item = editItem ?? defaultValues;
    const { title, code, is_enabled, percent, due_date } = item;

    setValue('title', title);
    setValue('code', code ?? '');
    setValue('is_enabled', is_enabled ?? 0);
    setValue('percent', percent ?? 0);
    if (typeof due_date === 'number') {
      const dateString = format('yyyy-MM-dd')(new Date(due_date * 1000));
      setValue('due_date', dateString);
    } else if (typeof due_date === 'string') {
      setValue('due_date', due_date.toString());
    }

    const dueDateAsNumber = Date.parse(`${due_date}T00:00:00`) / 1000;
    const updatedItem = {
      ...item,
      due_date: dueDateAsNumber,
    };

    setTempProduct(updatedItem);
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
   * 呼叫取得優惠券列表 API
   *
   * @param page - 選取頁數
   */
  const getCoupons = async (page?: number) => {
    setIsCouponLoading(true);

    couponApiService
      .getCoupons(page)
      .then(({ data: { pagination, coupons } }) => {
        setPagination(pagination);
        setCoupons(coupons);
      })
      .finally(() => {
        setIsCouponLoading(false);
      });
  };

  /**
   * 呼叫新增優惠券列表 API
   *
   * @param addCouponRequest - 新增優惠券 request
   */
  const addCouponItem = async (addCouponRequest: CouponDataRequest) => {
    setAddOpen(false);
    setIsCouponLoading(true);

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
        setIsCouponLoading(false);
      });
  };

  /**
   * 呼叫編輯優惠券列表 API
   *
   * @param id - 優惠券 ID
   * @param editProductRequest - 編輯優惠券 request
   */
  const editCouponItem = async (
    id: string,
    editCouponRequest: CouponDataRequest
  ) => {
    setEditOpen(false);
    setIsCouponLoading(true);

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
        setIsCouponLoading(false);
      });
  };

  /**
   * 呼叫刪除指定優惠券 API
   *
   * @param id - 優惠券 ID
   */
  const deleteCouponItem = async (id: string) => {
    setIsCouponLoading(true);

    couponApiService
      .deleteCouponItem(id)
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
        setIsCouponLoading(false);
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
              <h2>所有優惠券</h2>
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
              {isCouponLoading ? (
                <Skeleton variant='rectangular' width='100%'>
                  <div style={{ paddingTop: '300px' }} />
                </Skeleton>
              ) : (
                <div className='table-responsive'>
                  <DataTable
                    data={coupons}
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
          <div className='col-lg-6'>
            <Modal
              open={modalType === 'add' ? addOpen : editOpen}
              setOpen={modalType === 'add' ? setAddOpen : setEditOpen}
              isCloseModalContent={true}
            >
              <div className='container card rounded-0'>
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
                          rules={validationService.couponTitleValidator()}
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
                          rules={validationService.couponCodeValidator()}
                          render={({ field }) => (
                            <TextField
                              {...field}
                              label='優惠券代碼'
                              type='text'
                              error={!!errors.code}
                              helperText={validationService.getHelperText(
                                errors.code
                              )}
                              onChange={(e) => {
                                if (validationService.isValidInput(e)) {
                                  field.onChange(e.target.value);
                                }
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
                            <>
                              <InputLabel>折價比例</InputLabel>
                              <Select
                                {...field}
                                label='折價比例'
                                value={field.value || ''}
                                onChange={(e) => {
                                  field.onChange(e.target.value);
                                }}
                              >
                                {selectOptions.map((item, index) => (
                                  <MenuItem key={index} value={item.value}>
                                    {item.discount}
                                  </MenuItem>
                                ))}
                              </Select>
                            </>
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
                              type='date'
                              onChange={(e) => {
                                if (validationService.isValidInput(e)) {
                                  field.onChange(e);
                                }
                              }}
                            />
                          )}
                        />
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
