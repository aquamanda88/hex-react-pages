import { useEffect, useState } from 'react';
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
import { Header, Modal, Spinners } from '../components';
import { Add, Check, Close, Delete, Edit, InsertPhoto } from '../components/icons';
import {
  ContentDatum,
  PaginationDatum,
  ProductDatum,
  ProductFullDatum,
  ProductValidation,
  ProductValidationMessage,
} from '../core/models/utils.model';
import { LoginReq, LoginValidation } from '../core/models/admin/auth.model';
import authService from '../services/auth.service';
import productApiService from '../services/admin/products.service';
import Swal from 'sweetalert2';

export default function Week03() {
  const [isAuth, setIsAuth] = useState(false);
  const [formData, setFormData] = useState<LoginReq>({});
  const [loginErrors, setLoginErrors] = useState<LoginValidation>({});
  const [loginErrorsMessage, setLoginErrorsMessage] = useState<LoginReq>({});
  const [productErrors, setProductErrors] = useState<ProductValidation>({});
  const [productErrorsMessage, setProductErrorsMessage] =
    useState<ProductValidationMessage>({});
  const [isLoginLoading, setIsLoginLoading] = useState(true);
  const [isProductLoading, setIsProductLoading] = useState(true);
  const [products, setProducts] = useState<ProductFullDatum[]>([]);
  const [pagination, setPagination] = useState<PaginationDatum>({});
  const [currentPage, setCurrentPage] = useState(1);
  const [addOpen, setAddOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [modalType, setModalType] = useState('');
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteItem, setDeleteItem] = useState<ProductFullDatum>();
  const [tempProduct, setTempProduct] = useState<ProductFullDatum | null>(null);
  const [isEnabledChecked, setIsEnabledChecked] = useState(false);

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
   * 處理登入頁 input 內容變更事件
   *
   * @prop e - ChangeEvent
   */
  const handleLoginInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  /**
   * 處理商品 input 內容變更事件
   *
   * @prop e - ChangeEvent
   */
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    setTempProduct((prevValues) => {
      const updatedContent = { ...prevValues?.content };

      if (name in updatedContent) {
        updatedContent[name as keyof ContentDatum] = value;
      }

      if (
        name === 'content' ||
        name === 'name' ||
        name === 'artists' ||
        name === 'artists_zh_tw' ||
        name === 'year'
      ) {
        return {
          ...prevValues,
          content: {
            ...updatedContent,
            [name]: value,
          },
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

  /**
   * 處理 input 模糊事件
   *
   * @prop e - ChangeEvent
   */
  const handleInputBlur = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    setLoginErrors({
      ...loginErrors,
      [name]:
        value === '' || !emailPattern.test(formData.username ?? '')
          ? true
          : false,
    });
    setProductErrors({
      ...productErrors,
      [name]: value === '' ? true : false,
    });
    setLoginErrorsMessage({
      ...loginErrorsMessage,
      [name]:
        value === ''
          ? getErrorMessageForField(name)
          : !emailPattern.test(formData.username ?? '')
            ? '請輸入有效的 Email'
            : '',
    });
    setProductErrorsMessage({
      ...productErrorsMessage,
      [name]: value === '' ? getErrorMessageForField(name) : '',
    });
  };

  /**
   * 處理開啟新增商品 modal 事件
   *
   */
  const handleAddOpen = () => {
    setTempProduct({
      is_enabled: 0,
      title: '',
      content: {},
      category: '',
      unit: '',
      origin_price: 0,
      price: 0,
    });
    clearProductsValidation();
    setIsEnabledChecked(false);
    setModalType('add');
    setAddOpen(true);
  };

  /**
   * 處理開啟編輯商品 modal 事件
   *
   * @prop editItem - 欲編輯的商品資料
   */
  const handleEditOpen = (editItem?: ProductFullDatum) => {
    clearProductsValidation();
    setTempProduct({
      is_enabled: editItem?.is_enabled ?? 0,
      num: editItem?.num ?? 0,
      title: editItem?.title,
      content: {
        content: editItem?.content?.content,
        name: editItem?.content?.name,
        artists: editItem?.content?.artists,
        artists_zh_tw: editItem?.content?.artists_zh_tw,
        year: editItem?.content?.year,
      },
      description: editItem?.description ?? '',
      category: editItem?.category,
      unit: editItem?.unit,
      origin_price: editItem?.origin_price,
      price: editItem?.price,
      imageUrl: editItem?.imageUrl ?? '',
      imagesUrl: editItem?.imagesUrl ?? [],
      id: editItem?.id,
    });
    setIsEnabledChecked(editItem?.is_enabled === 1);
    setModalType('edit');
    setEditOpen(true);
  };

  /**
   * 處理開啟刪除商品 modal 事件
   *
   * @prop deleteItem - 欲刪除的商品資料
   */
  const handleDeleteOpen = (deleteItem: ProductFullDatum) => {
    setDeleteItem(deleteItem);
    setDeleteOpen(true);
  };

  /**
   * 處理新增商品事件
   *
   */
  const handleSave = () => {
    doProductsValidation();

    if (
      tempProduct?.title !== '' &&
      tempProduct?.category !== '' &&
      tempProduct?.unit !== '' &&
      tempProduct?.origin_price !== 0 &&
      tempProduct?.price !== 0
    ) {
      const newTempProduct = { data: { ...tempProduct } };
      delete newTempProduct.data.id;

      if (modalType === 'add') {
        addProduct(newTempProduct);
      } else if (modalType === 'edit') {
        editProduct(tempProduct?.id ?? '', newTempProduct);
      }
    }
  };

  /**
   * 處理 checkbox 變更事件
   *
   * @prop e - ChangeEvent
   * @prop checkFn - 傳入的 useState
   */
  const handleCheckboxChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    checkFn: React.Dispatch<React.SetStateAction<boolean>>
  ) => {
    const { checked } = e.target;
    checkFn(e.target.checked);
    if (checkFn === setIsEnabledChecked) {
      setTempProduct({
        ...tempProduct,
        is_enabled: checked ? 1 : 0,
      });
    }
  };

  /**
   * 處理送出表單事件
   *
   * @prop e - FormEvent
   */
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    const errorMessage = {
      username: !formData?.username
        ? '請輸入帳號'
        : !emailPattern.test(formData.username ?? '')
          ? '請輸入有效的 Email'
          : '',
      password: !formData?.password ? '請輸入密碼' : '',
    };

    setLoginErrors({
      username:
        !formData?.username || !emailPattern.test(formData.username ?? ''),
      password: !formData?.password,
    });
    setLoginErrorsMessage(errorMessage);

    if (formData.username && formData.password) {
      login();
    }
  };

  /**
   * 呼叫登入 API
   *
   */
  const login = async () => {
    const result = await authService.login(formData);
    if (result.data.token) {
      setIsAuth(true);
      sessionStorage.setItem('token', result.data.token);
      getProducts();
      setIsLoginLoading(false);
    } else {
      setIsAuth(false);
    }
  };

  /**
   * 呼叫登入驗證 API
   *
   */
  const checkLogin = async () => {
    const token = sessionStorage.getItem('token') ?? '';
    const result = await authService.checkLogin(token);
    return result.data.success;
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

  /**
   * 呼叫新增商品列表 API
   *
   * @prop addProductData - 欲新增商品物件
   */
  const addProduct = async (addProductData: { data: ProductDatum }) => {
    setAddOpen(false);
    setIsProductLoading(true);

    productApiService
      .addProduct(addProductData)
      .then(({ data: { message } }) => {
        getProducts();
        Swal.fire({
          title: message,
        });
      })
      .finally(() => {
        setIsProductLoading(false);
      });
  };

  /**
   * 呼叫編輯商品列表 API
   *
   * @prop id - 商品 ID
   * @prop editProductData - 欲編輯商品物件
   */
  const editProduct = async (
    id: string,
    editProductData: { data: ProductDatum }
  ) => {
    setEditOpen(false);
    setIsProductLoading(true);

    productApiService
      .editProduct(id, editProductData)
      .then(({ data: { message } }) => {
        getProducts();
        Swal.fire({
          title: message,
        });
      })
      .finally(() => {
        setIsProductLoading(false);
      });
  };

  /**
   * 呼叫刪除商品列表 API
   *
   */
  const deleteProduct = async () => {
    setDeleteOpen(false);
    setIsProductLoading(true);

    productApiService
      .deleteProduct(deleteItem?.id ?? '')
      .then(({ data: { message } }) => {
        getProducts();
        Swal.fire({
          title: message,
        });
      })
      .finally(() => {
        setIsProductLoading(false);
      });
  };

  /**
   * 初始化商品表單驗證
   *
   * @returns 無回傳值
   */
  function clearProductsValidation(): void {
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
  }

  /**
   * 取得錯誤訊息
   *
   * @param inputName - input 欄位 name 屬性值
   *
   * @returns 相對應欄位之錯誤訊息
   */
  function getErrorMessageForField(inputName: string): string {
    switch (inputName) {
      case 'username':
        return '請輸入帳號';
      case 'password':
        return '請輸入密碼';
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

  /**
   * 取得價格驗證錯誤訊息
   *
   * @param type - 價格類型
   * @param price - 價格數值
   *
   * @returns 相對應欄位之錯誤訊息
   */
  function doPriceValidation(type: string, price: number): string {
    if (price === 0) {
      return `${type}不可為 0 元`;
    } else if (isNaN(price) || Object.is(price, null)) {
      return `請輸入${type}`;
    } else if (price < 0) {
      return `${type}不可為負數`;
    } else {
      return '';
    }
  }

  /**
   * 驗證商品表單
   *
   * @returns 無回傳值
   */
  function doProductsValidation(): void {
    const errorMessage = {
      title: tempProduct?.title === '' ? '請輸入作品名稱' : '',
      category: tempProduct?.category === '' ? '請輸入分類' : '',
      unit: tempProduct?.unit === '' ? '請輸入單位' : '',
      origin_price: doPriceValidation('原價', tempProduct?.origin_price ?? 0),
      price: doPriceValidation('售價', tempProduct?.price ?? 0),
    };

    setProductErrors({
      title: tempProduct?.title === '',
      category: tempProduct?.category === '',
      unit: tempProduct?.unit === '',
      origin_price:
        doPriceValidation('原價', tempProduct?.origin_price ?? 0) !== '',
      price: doPriceValidation('售價', tempProduct?.price ?? 0) !== '',
    });
    setProductErrorsMessage(errorMessage);
  }

  useEffect(() => {
    const token = sessionStorage.getItem('token');
    setLoginErrors({
      username: false,
      password: false,
    });
    setLoginErrorsMessage({
      username: '',
      password: '',
    });
    if (token) {
      setIsLoginLoading(true);
      checkLogin().then((res) => {
        if (res) {
          setIsAuth(true);
          getProducts().finally(() => {
            setIsLoginLoading(false);
          });
        } else {
          setIsLoginLoading(false);
        }
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <Header title='熟練 React.js' />
      {isAuth ? (
        <>
          <div className='container py-4'>
            <div className={`${isLoginLoading ? 'd-flex' : 'd-none'} loading`}>
              <Spinners />
            </div>
            <div className='row flex-column justify-content-center align-items-center'>
              <div>
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
                                    {item.content?.artists_zh_tw ??
                                      '未知的作者'}
                                  </td>
                                  <td className='text-end'>
                                    {item.origin_price}
                                  </td>
                                  <td className='text-end'>{item.price}</td>
                                  <td
                                    className={`${item.is_enabled ? 'text-success' : 'text-danger'} text-center`}
                                  >
                                    {item.is_enabled ? (
                                      <Check />
                                    ) : (
                                      <Close />
                                    )}
                                  </td>
                                  <td className='text-center'>
                                    <IconButton
                                      onClick={() => {
                                        handleEditOpen(item);
                                      }}
                                    >
                                      <Edit />
                                    </IconButton>
                                    <IconButton
                                      onClick={() => {
                                        handleDeleteOpen(item);
                                      }}
                                    >
                                      <Delete sx={{ color: '#dc3545' }} />
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
                    {deleteItem?.imageUrl ? (
                      <img
                        src={deleteItem?.imageUrl}
                        className='object-fit rounded preview-image p-0'
                        alt='主圖'
                      />
                    ) : (
                      <InsertPhoto
                        className='no-image-icon'
                        color='disabled'
                      />
                    )}
                  </div>
                </div>
              </Modal>
              <div className='col-lg-6'>
                <Modal
                  open={modalType === 'add' ? addOpen : editOpen}
                  setOpen={modalType === 'add' ? setAddOpen : setEditOpen}
                  handleConfirm={handleSave}
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
                            onChange={handleInputChange}
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
                            id='name'
                            name='name'
                            label='作品原文名稱'
                            defaultValue={tempProduct?.content?.name}
                            onChange={handleInputChange}
                            helperText={' '}
                          />
                          <div className='d-flex gap-3'>
                            <TextField
                              className='w-100'
                              id='artists_zh_tw'
                              name='artists_zh_tw'
                              label='作者名稱'
                              defaultValue={tempProduct?.content?.artists_zh_tw}
                              onChange={handleInputChange}
                              helperText={' '}
                            />
                            <TextField
                              className='w-100'
                              id='artists'
                              name='artists'
                              label='作者原文名稱'
                              defaultValue={tempProduct?.content?.artists}
                              onChange={handleInputChange}
                              helperText={' '}
                            />
                          </div>

                          <TextField
                            id='year'
                            name='year'
                            label='作品年份'
                            defaultValue={tempProduct?.content?.year}
                            onChange={handleInputChange}
                            helperText={' '}
                          />
                          <TextField
                            id='description'
                            name='description'
                            label='描述'
                            multiline
                            maxRows={6}
                            defaultValue={tempProduct?.description}
                            onChange={handleInputChange}
                            helperText={' '}
                          />
                          <div className='d-flex gap-3'>
                            <TextField
                              className='w-100'
                              id='category'
                              name='category'
                              label='分類'
                              variant='outlined'
                              onChange={handleInputChange}
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
                              onChange={handleInputChange}
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
                              slotProps={{
                                input: {
                                  inputProps: {
                                    min: 0,
                                  },
                                },
                              }}
                              onChange={handleInputChange}
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
                              slotProps={{
                                input: {
                                  inputProps: {
                                    min: 0,
                                  },
                                },
                              }}
                              onChange={handleInputChange}
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
                        <FormControlLabel
                          className='mb-2'
                          control={
                            <Checkbox
                              checked={isEnabledChecked}
                              color='primary'
                              onChange={(e) =>
                                handleCheckboxChange(e, setIsEnabledChecked)
                              }
                            />
                          }
                          label='是否啟用'
                        />
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
                              onChange={handleInputChange}
                              value={tempProduct?.imageUrl}
                              helperText={' '}
                            />
                            {tempProduct?.imageUrl ? (
                              <img
                                src={tempProduct?.imageUrl}
                                className='object-fit rounded'
                                alt='主圖'
                              />
                            ) : (
                              <InsertPhoto
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
                    onChange={handleLoginInputChange}
                    onBlur={handleInputBlur}
                    value={formData.username}
                    error={loginErrors.username}
                    helperText={
                      loginErrorsMessage.username
                        ? loginErrorsMessage.username
                        : ' '
                    }
                  />
                  <TextField
                    type='password'
                    id='password'
                    name='password'
                    label='密碼'
                    onChange={handleLoginInputChange}
                    onBlur={handleInputBlur}
                    value={formData.password}
                    error={loginErrors.password}
                    helperText={
                      loginErrorsMessage.password
                        ? loginErrorsMessage.password
                        : ' '
                    }
                  />
                </div>
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
