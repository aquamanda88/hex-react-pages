import { useEffect, useState } from 'react';
import axios, { AxiosError } from 'axios';
import { Header, Modal } from '../components';
import { LoginReq } from '../core/models/admin/auth.model';
import {
  PaginationDatum,
  ProductDatum,
  ProductFullDatum,
  ProductValidation,
  ProductValidationMessage,
} from '../core/models/utils.model';
import {
  Button,
  IconButton,
  TextField,
  Checkbox,
  FormControlLabel,
  Skeleton,
  Stack,
  Pagination,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import AddIcon from '@mui/icons-material/Add';
import InsertPhotoIcon from '@mui/icons-material/InsertPhoto';
import Swal from 'sweetalert2';

const API_BASE = 'https://ec-course-api.hexschool.io/v2';
const API_PATH = 'olive-branch';

export default function Week03() {
  const [isAuth, setIsAuth] = useState(false);
  const [formData, setFormData] = useState<LoginReq>({
    username: '',
    password: '',
  });
  const [errors, setErrors] = useState<LoginReq>({
    username: '',
    password: '',
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isLoaded, setIsLoaded] = useState(false);
  const [products, setProducts] = useState<ProductFullDatum[]>([]);
  const [pagination, setPagination] = useState<PaginationDatum>({});
  const [currentPage, setCurrentPage] = useState(1);
  const [checked, setChecked] = useState(false);
  const [addOpen, setAddOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteItem, setDeleteItem] = useState<ProductFullDatum>();
  const [tempProduct, setTempProduct] = useState<ProductFullDatum | null>(null);
  const [productErrors, setProductErrors] = useState<ProductValidation>({});
  const [productErrorsMessage, setProductErrorsMessage] =
    useState<ProductValidationMessage>({});

  const handleAddOpen = () => {
    setTempProduct({
      is_enabled: 0,
      num: 0,
      title: '',
      content: {},
      description: '',
      category: '',
      unit: '',
      origin_price: 0,
      price: 0,
      imageUrl: '',
      imagesUrl: [],
    });
    setProductErrors({
      title: false,
      category: false,
      unit: false,
      origin_price: false,
      price: false,
    });
    setProductErrorsMessage({
      title: '',
      category: '',
      unit: '',
      origin_price: '',
      price: '',
    });
    setAddOpen(true);
  };

  const handleEditOpen = (item?: ProductFullDatum) => {
    setTempProduct({
      is_enabled: item?.is_enabled ?? 0,
      num: item?.num ?? 0,
      title: item?.title,
      content: item?.content,
      description: item?.description ?? '',
      category: item?.category,
      unit: item?.unit,
      origin_price: item?.origin_price,
      price: item?.price,
      imageUrl: item?.imageUrl ?? '',
      imagesUrl: item?.imagesUrl ?? [],
      id: item?.id,
    });
    setAddOpen(true);
  };

  const handleSave = () => {
    const errorMessage = {
      title: tempProduct?.title === '' ? '請輸入作品名稱' : '',
      category: tempProduct?.category === '' ? '請輸入分類' : '',
      unit: tempProduct?.unit === '' ? '請輸入單位' : '',
      origin_price:
        tempProduct?.origin_price === 0
          ? '原價不可為 0 元'
          : isNaN(tempProduct?.origin_price ?? 0)
            ? '請輸入原價'
            : '',
      price:
        tempProduct?.price === 0
          ? '售價不可為 0 元'
          : isNaN(tempProduct?.price ?? 0)
            ? '請輸入售價'
            : '',
    };

    setProductErrors({
      title: tempProduct?.title === '',
      category: tempProduct?.category === '',
      unit: tempProduct?.unit === '',
      origin_price:
        tempProduct?.origin_price === 0 ||
        isNaN(tempProduct?.origin_price ?? 0),
      price: tempProduct?.price === 0 || isNaN(tempProduct?.price ?? 0),
    });

    setProductErrorsMessage(errorMessage);
    if (
      tempProduct?.title !== '' &&
      tempProduct?.category !== '' &&
      tempProduct?.unit !== '' &&
      tempProduct?.origin_price !== 0 &&
      tempProduct?.price !== 0
    ) {
      const newTempProduct = { data: { ...tempProduct } };
      delete newTempProduct.data.id;
      addProduct(newTempProduct);
    }
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setChecked(e.target.checked);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleInputBlur = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const errorStatus: LoginReq = {
      username: '',
      password: '',
    };

    if (!formData.username) {
      errorStatus.username = '請輸入帳號';
    } else if (!emailPattern.test(formData.username)) {
      errorStatus.username = '請輸入有效的 Email';
    }

    if (!formData.password) {
      errorStatus.password = '請輸入密碼';
    }

    setErrors(errorStatus);
    setProductErrors({
      ...productErrors,
      [name]: value === '' ? true : false,
    });
    setProductErrorsMessage({
      ...productErrorsMessage,
      [name]: value === '' ? getErrorMessageForField(name) : '',
    });
  };

  function getErrorMessageForField(fieldName: string): string {
    switch (fieldName) {
      case 'title':
        return '請輸入作品名稱';
      case 'category':
        return '請輸入類型';
      case 'unit':
        return '請輸入單位';
      case 'origin_price':
        return '請輸入原價';
      case 'price':
        return '請輸入售價';
      default:
        return '';
    }
  }

  const handlePageChange = (
    _: React.ChangeEvent<unknown>,
    page: number
  ) => {
    setCurrentPage(page);
    getProducts(sessionStorage.getItem('token') ?? '', page);
  };

  const handleInputEdit = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    index?: number
  ) => {
    const { name, value } = e.target;

    setTempProduct((prevValues) => {
      if (name === 'imagesUrl' && index !== undefined) {
        const updatedImagesUrl = [...(prevValues?.imagesUrl ?? [])];
        updatedImagesUrl[index] = value;
        return {
          ...prevValues,
          imagesUrl: updatedImagesUrl,
        };
      }

      if (name === 'price' || name === 'origin_price') {
        return {
          ...prevValues,
          [name]: parseFloat(value),
        };
      }

      return {
        ...prevValues,
        [name]: value,
      };
    });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!formData.username && !formData.password) {
      setErrors(() => ({
        username: '請輸入帳號',
        password: '請輸入密碼',
      }));
    }

    if (formData.username !== '' && formData.password !== '') {
      login();
    }
  };

  const login = async () => {
    try {
      const result = await axios.post(`${API_BASE}/admin/signin`, formData);
      if (result.data.token) {
        setIsAuth(true);
        if (checked) {
          sessionStorage.setItem('token', result.data.token);
        }
        getProducts(result.data.token);
      } else {
        setIsAuth(false);
      }
    } catch (error) {
      if (error instanceof AxiosError) {
        Swal.fire({
          icon: 'error',
          title: error.response?.data?.message,
        });
      } else {
        Swal.fire({
          icon: 'error',
          title: '發生無預期錯誤',
        });
      }
    }
  };

  const checkLogin = async () => {
    try {
      const result = await axios.post(
        `${API_BASE}/api/user/check`,
        {},
        {
          headers: { Authorization: sessionStorage.getItem('token') },
        }
      );
      return result.data.success;
    } catch (error) {
      if (error instanceof AxiosError) {
        Swal.fire({
          icon: 'error',
          title: error.response?.data?.message,
        });
      } else {
        Swal.fire({
          icon: 'error',
          title: '發生無預期錯誤',
        });
      }
    }
  };

  const getProducts = async (token: string, page?: number) => {
    try {
      const URL_PATH = page ? `products?page=${page}` : 'products';
      setIsLoading(true);
      const result = await axios.get(
        `${API_BASE}/api/${API_PATH}/admin/${URL_PATH}`,
        {
          headers: {
            Authorization: checked ? sessionStorage.getItem('token') : token,
          },
        }
      );
      if (result.data) {
        setPagination(result.data.pagination);
        setProducts(result.data.products);
      }
    } catch (error) {
      if (error instanceof AxiosError) {
        Swal.fire({
          icon: 'error',
          title: error.response?.data?.message,
        });
      } else {
        Swal.fire({
          icon: 'error',
          title: '發生無預期錯誤',
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteOpen = (deleteItem: ProductFullDatum) => {
    setDeleteItem(deleteItem);
    setDeleteOpen(true);
  };

  const addProduct = async (data: { data: ProductDatum }) => {
    try {
      setAddOpen(false);
      setIsLoading(true);
      const result = await axios.post(
        `${API_BASE}/api/${API_PATH}/admin/product`,
        data,
        {
          headers: {
            Authorization: sessionStorage.getItem('token'),
          },
        }
      );
      getProducts(sessionStorage.getItem('token') ?? '');
      Swal.fire({
        title: result.data.message,
      });
    } catch (error) {
      if (error instanceof AxiosError) {
        Swal.fire({
          icon: 'error',
          title: error.response?.data?.message,
        });
      } else {
        Swal.fire({
          icon: 'error',
          title: '發生無預期錯誤',
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const deleteProduct = async () => {
    try {
      setDeleteOpen(false);
      setIsLoading(true);
      const result = await axios.delete(
        `${API_BASE}/api/${API_PATH}/admin/product/${deleteItem?.id}`,
        {
          headers: {
            Authorization: sessionStorage.getItem('token'),
          },
        }
      );
      getProducts(sessionStorage.getItem('token') ?? '');
      Swal.fire({
        title: result.data.message,
      });
    } catch (error) {
      if (error instanceof AxiosError) {
        Swal.fire({
          icon: 'error',
          title: error.response?.data?.message,
        });
      } else {
        Swal.fire({
          icon: 'error',
          title: '發生無預期錯誤',
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const token = sessionStorage.getItem('token');
    if (token) {
      checkLogin().then((res) => {
        if (res) {
          setIsAuth(true);
          getProducts(token);
        }
      });
    }
  }, []);

  return (
    <>
      <Header title='熟練 React.js' />
      {isAuth ? (
        <>
          <div className='container py-4'>
            <div className='row flex-column justify-content-center align-items-center'>
              <div className=''>
                <div className='card mb-4'>
                  <div className='d-flex justify-content-between mb-4'>
                    <h2>所有商品</h2>
                    <Button
                      variant='contained'
                      className='btn btn-secondary'
                      onClick={() => {
                        handleAddOpen();
                      }}
                    >
                      <AddIcon />
                      <p className='btn-icon'>新增</p>
                    </Button>
                  </div>
                  <div className='products-table'>
                    {isLoading ? (
                      <Skeleton variant='rectangular' width='100%'>
                        <div style={{ paddingTop: '300px' }} />
                      </Skeleton>
                    ) : (
                      <table className='table table-striped table-bordered mb-0'>
                        <thead className='text-center'>
                          <tr>
                            <th>作品名稱</th>
                            <th>作品原文名稱</th>
                            <th>作者名稱</th>
                            <th>原價</th>
                            <th>售價</th>
                            <th>是否啟用</th>
                            <th>修改</th>
                          </tr>
                        </thead>
                        <tbody>
                          {products && products.length > 0 ? (
                            products.map((item) => (
                              <tr key={item.id}>
                                <td>{item.title}</td>
                                <td>{item.content?.name ?? 'Untitled'}</td>
                                <td>
                                  {item.content?.artists_zh_tw ?? '未知的作者'}
                                </td>
                                <td className='text-end'>
                                  {item.origin_price}
                                </td>
                                <td className='text-end'>{item.price}</td>
                                <td
                                  className={`${item.is_enabled ? 'text-success' : 'text-danger'} text-center`}
                                >
                                  {item.is_enabled ? (
                                    <CheckIcon />
                                  ) : (
                                    <CloseIcon />
                                  )}
                                </td>
                                <td className='text-center'>
                                  <IconButton
                                    onClick={() => {
                                      handleEditOpen(item);
                                    }}
                                  >
                                    <EditIcon />
                                  </IconButton>
                                  <IconButton
                                    onClick={() => {
                                      handleDeleteOpen(item);
                                    }}
                                  >
                                    <DeleteIcon sx={{ color: '#dc3545' }} />
                                  </IconButton>
                                </td>
                              </tr>
                            ))
                          ) : (
                            <tr>
                              <td colSpan={7}>尚無產品資料</td>
                            </tr>
                          )}
                        </tbody>
                      </table>
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
              <Modal
                open={deleteOpen}
                setOpen={setDeleteOpen}
                handleSave={deleteProduct}
              >
                <div className='container'>
                  <div className='row text-center justify-content-center'>
                    <h4>是否確定要刪除</h4>
                    <h2>《{deleteItem?.title}》</h2>
                    <h5>
                      <i>{deleteItem?.content?.name ?? 'Untitled'}</i>
                    </h5>
                    <p>
                      <span>
                        {deleteItem?.content?.artists_zh_tw ?? '未知的作者'}{' '}
                      </span>
                      <span>
                        ({deleteItem?.content?.artists ?? 'Unknown'}),{' '}
                      </span>
                      <span>{deleteItem?.content?.year ?? 'Unknown'}</span>
                    </p>
                    {deleteItem?.imageUrl !== '' ? (
                      <img
                        src={deleteItem?.imageUrl}
                        className='object-fit rounded preview-image p-0'
                        alt='主圖'
                      />
                    ) : (
                      <InsertPhotoIcon
                        className='no-image-icon'
                        color='disabled'
                      />
                    )}
                  </div>
                </div>
              </Modal>
              <div className='col-lg-6'>
                <Modal
                  open={addOpen}
                  setOpen={setAddOpen}
                  handleSave={handleSave}
                  isFullScreen={true}
                >
                  <div className='container card'>
                    <div className='row'>
                      <div className='col-md-6'>
                        <div className='text-field-group'>
                          <TextField
                            id='title'
                            name='title'
                            label='作品名稱'
                            value={tempProduct?.title}
                            onChange={handleInputEdit}
                            onBlur={handleInputBlur}
                            error={productErrors.title}
                            helperText={
                              productErrorsMessage.title
                                ? productErrorsMessage.title
                                : ' '
                            }
                            required
                          />
                          <TextField
                            id='content'
                            name='content'
                            label='作品原文名稱'
                            defaultValue={tempProduct?.content?.name}
                            onChange={handleInputEdit}
                            helperText={' '}
                          />
                          <div className='d-flex gap-3'>
                            <TextField
                              className='w-100'
                              id='content'
                              name='content'
                              label='作者名稱'
                              defaultValue={tempProduct?.content?.artists_zh_tw}
                              onChange={handleInputEdit}
                              helperText={' '}
                            />
                            <TextField
                              className='w-100'
                              id='content'
                              name='content'
                              label='作者原文名稱'
                              defaultValue={tempProduct?.content?.artists}
                              onChange={handleInputEdit}
                              helperText={' '}
                            />
                          </div>

                          <TextField
                            id='content'
                            name='content'
                            label='作品年份'
                            defaultValue={tempProduct?.content?.year}
                            onChange={handleInputEdit}
                            helperText={' '}
                          />
                          <TextField
                            id='description'
                            name='description'
                            label='描述'
                            multiline
                            maxRows={6}
                            defaultValue={tempProduct?.description}
                            onChange={handleInputEdit}
                            helperText={' '}
                          />
                          <div className='d-flex gap-3'>
                            <TextField
                              className='w-100'
                              id='category'
                              name='category'
                              label='分類'
                              variant='outlined'
                              onChange={handleInputEdit}
                              onBlur={handleInputBlur}
                              value={tempProduct?.category}
                              error={productErrors.category}
                              helperText={
                                productErrorsMessage.category
                                  ? productErrorsMessage.category
                                  : ' '
                              }
                              required
                            />
                            <TextField
                              className='w-100'
                              id='unit'
                              name='unit'
                              label='單位'
                              variant='outlined'
                              onChange={handleInputEdit}
                              onBlur={handleInputBlur}
                              value={tempProduct?.unit}
                              error={productErrors.unit}
                              helperText={
                                productErrorsMessage.unit
                                  ? productErrorsMessage.unit
                                  : ' '
                              }
                              required
                            />
                          </div>
                          <div className='d-flex gap-3'>
                            <TextField
                              className='w-100'
                              id='origin_price'
                              name='origin_price'
                              label='原價'
                              type='number'
                              onChange={handleInputEdit}
                              onBlur={handleInputBlur}
                              value={tempProduct?.origin_price}
                              error={productErrors.origin_price}
                              helperText={
                                productErrorsMessage.origin_price
                                  ? productErrorsMessage.origin_price
                                  : ' '
                              }
                              required
                            />
                            <TextField
                              className='w-100'
                              id='price'
                              name='price'
                              label='售價'
                              type='number'
                              onChange={handleInputEdit}
                              onBlur={handleInputBlur}
                              value={tempProduct?.price}
                              error={productErrors.price}
                              helperText={
                                productErrorsMessage.price
                                  ? productErrorsMessage.price
                                  : ' '
                              }
                              required
                            />
                          </div>
                        </div>
                      </div>
                      <div className='col-md-6'>
                        <div className='d-grid'>
                          <div className='image-group d-flex flex-column align-items-center'>
                            <TextField
                              className='w-100'
                              id='imageUrl'
                              name='imageUrl'
                              label='主圖網址'
                              variant='outlined'
                              onChange={handleInputEdit}
                              value={tempProduct?.imageUrl}
                              helperText={' '}
                            />
                            {!isLoaded && tempProduct?.imageUrl !== '' && (
                              <Skeleton variant='rectangular' width='100%'>
                                <div style={{ paddingTop: '50%' }} />
                              </Skeleton>
                            )}
                            {tempProduct?.imageUrl !== '' ? (
                              <img
                                src={tempProduct?.imageUrl}
                                className='object-fit rounded'
                                alt='主圖'
                                onLoad={() => setIsLoaded(true)}
                              />
                            ) : (
                              <InsertPhotoIcon
                                className='no-image-icon'
                                color='disabled'
                              />
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </Modal>
              </div>
            </div>
          </div>
        </>
      ) : (
        <div className='container layout'>
          <div className='row justify-content-center mb-3'>
            <div className='card col-4 col-md-6'>
              <h2 className='h2 mb-3 font-weight-normal text-center'>登入</h2>
              <form id='form' className='form-signin' onSubmit={handleSubmit}>
                <div className='form-input-group'>
                  <TextField
                    type='email'
                    id='username'
                    name='username'
                    label='電子信箱'
                    onChange={handleInputChange}
                    onBlur={handleInputBlur}
                    value={formData.username}
                    error={!!errors.username}
                    helperText={errors.username ? errors.username : ' '}
                  />
                  <TextField
                    type='password'
                    id='password'
                    name='password'
                    label='密碼'
                    onChange={handleInputChange}
                    onBlur={handleInputBlur}
                    value={formData.password}
                    error={!!errors.password}
                    helperText={errors.password ? errors.password : ' '}
                  />
                </div>
                <FormControlLabel
                  className='mb-2'
                  control={
                    <Checkbox
                      checked={checked}
                      color='primary'
                      onChange={handleCheckboxChange}
                    />
                  }
                  label='保持登入'
                />
                <Button
                  className='btn btn-primary w-100'
                  variant='contained'
                  color='primary'
                  type='submit'
                >
                  登入
                </Button>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
