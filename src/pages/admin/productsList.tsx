import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useNavigate } from 'react-router';
import {
  Button,
  TextField,
  Checkbox,
  FormControlLabel,
  Skeleton,
  Stack,
  Pagination,
  styled,
  FormControl,
  IconButton,
} from '@mui/material';
import { Column } from '../../components/DataTable';
import { DataTable, Modal, Spinners } from '../../components/Index';
import {
  Add,
  Check,
  Close,
  CloudUpload,
  Delete,
  Edit,
  InsertPhoto,
} from '../../components/Icons';
import {
  AddProductRequest,
  ContentDatum,
  EditProductRequest,
  PaginationDatum,
  ProductForm,
  ProductFullDatum,
  ProductItemDatum,
} from '../../core/models/utils.model';
import {
  formatPrice,
  formatUnknownText,
} from '../../services/formatValue.service';
import validationService from '../../services/validation.service';
import authService from '../../services/api/admin/auth.service';
import productApiService from '../../services/api/admin/products.service';
import eventBus from '../../components/EventBus';
import Swal from 'sweetalert2';

const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
});

const defaultValues: ProductFullDatum = {
  title: '',
  category: '',
  unit: '',
  origin_price: 0,
  price: 0,
  imageUrl: undefined,
  imagesUrl: undefined,
  description: undefined,
  is_enabled: 0,
  content: {
    name: undefined,
    artists: undefined,
    artists_zh_tw: undefined,
    year: undefined,
  },
};

export default function AdminProductsList() {
  const token = sessionStorage.getItem('token') ?? '';
  const [isFullScreenLoading, setIsFullScreenLoading] = useState(false);
  const [isProductLoading, setIsProductLoading] = useState(false);
  const [products, setProducts] = useState<ProductFullDatum[]>([]);
  const [pagination, setPagination] = useState<PaginationDatum>({});
  const [currentPage, setCurrentPage] = useState(1);
  const [addOpen, setAddOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [modalType, setModalType] = useState('');
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteItem, setDeleteItem] = useState<ProductFullDatum>();
  const [tempProduct, setTempProduct] = useState<ProductFullDatum | null>(null);
  const [subImagesMap, setSubImagesMap] = useState<{ [key: string]: string[] }>(
    {}
  );
  const subImagesUrl = subImagesMap[tempProduct?.id ?? ''] || [];
  const [newSubImagesUrl, setNewSubImagesUrl] = useState<string[]>([]);
  const navigate = useNavigate();

  const columns: Column<ProductFullDatum>[] = [
    { header: '作品名稱', accessor: 'title' },
    {
      header: '作品原文名稱',
      accessor: (item: ProductFullDatum) =>
        formatUnknownText('name', item.content?.name),
    },
    {
      header: '作者名稱',
      accessor: (item: ProductFullDatum) =>
        formatUnknownText('artists_zh_tw', item.content?.artists_zh_tw),
    },
    {
      header: '原價',
      accessor: (item: ProductFullDatum) => formatPrice(item.origin_price),
      tdClass: 'text-end',
    },
    {
      header: '售價',
      accessor: (item: ProductFullDatum) => formatPrice(item.price),
      tdClass: 'text-end',
    },
    {
      header: '是否啟用',
      accessor: (item: ProductFullDatum) =>
        item.is_enabled ? (
          <Check className='text-success' />
        ) : (
          <Close className='text-danger' />
        ),
      tdClass: 'text-center',
    },
  ];

  const actions = (item: ProductFullDatum) => (
    <>
      <IconButton onClick={() => handleEditOpen(item)}>
        <Edit />
      </IconButton>
      <IconButton onClick={() => handleDeleteOpen(item)}>
        <Delete sx={{ color: '#dc3545' }} />
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
      title: '',
      name: '',
      artists: '',
      artists_zh_tw: '',
      year: '',
      description: '',
      category: '',
      unit: '',
      origin_price: 0,
      price: 0,
      imageUrl: '',
      imagesUrl: [''],
      is_enabled: 0,
    },
  });

  /**
   * 處理分頁事件
   *
   * @param _ - ChangeEvent
   * @param page - 選取的頁數
   */
  const handlePageChange = (_: React.ChangeEvent<unknown>, page: number) => {
    setCurrentPage(page);
    getProducts(page);
  };

  /**
   * 處理開啟新增商品 modal 事件
   */
  const handleAddOpen = () => {
    clearErrors();
    setProductValues();
    setNewSubImagesUrl([]);
    setModalType('add');
    setAddOpen(true);
  };

  /**
   * 處理開啟編輯商品 modal 事件
   *
   * @param editItem - 欲編輯的商品資料
   */
  const handleEditOpen = (editItem?: ProductFullDatum) => {
    if (!editItem) return;

    clearErrors();
    setProductValues(editItem);
    setNewSubImagesUrl([]);
    setModalType('edit');
    setEditOpen(true);
  };

  /**
   * 處理開啟刪除商品 modal 事件
   *
   * @param deleteItem - 欲刪除的商品資料
   */
  const handleDeleteOpen = (deleteItem: ProductFullDatum) => {
    setDeleteItem(deleteItem);
    setDeleteOpen(true);
  };

  /**
   * 處理 input 複製貼上事件
   *
   * @param e - ClipboardEvent
   */
  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    const pasteData = e.clipboardData.getData('text');
    if (!/^\d+$/.test(pasteData)) {
      e.preventDefault();
    }
  };

  /**
   * 處理新增 編輯商品事件
   */
  const onSubmit = (data: ProductForm) => {
    if (modalType === 'add') {
      addProductItem(getAddProductRequest(data));
    } else if (modalType === 'edit') {
      editProductItem(tempProduct?.id ?? '', getAddProductRequest(data));
    }
  };

  /**
   * 取得 AddProductRequest
   *
   * @param data - 商品表單欄位
   */
  const getAddProductRequest = (data: ProductForm) => {
    const newTempProduct: AddProductRequest = {
      data: {
        title: data.title,
        content: {
          name: data.name,
          artists: data.artists,
          artists_zh_tw: data.artists_zh_tw,
          year: data.year,
        },
        description: data.description,
        category: data.category,
        unit: data.unit,
        origin_price: Number(data.origin_price),
        price: Number(data.price),
        imageUrl: data.imageUrl,
        imagesUrl: data.imagesUrl,
        is_enabled: data.is_enabled ? 1 : 0,
      },
    };

    const productKeys: (keyof ProductItemDatum)[] = [
      'description',
      'imageUrl',
      'imagesUrl',
    ];

    const contentKeys: (keyof ContentDatum)[] = [
      'artists',
      'artists_zh_tw',
      'name',
      'year',
      'content',
    ];

    productKeys.forEach((key) => {
      if (newTempProduct.data?.[key] === '') {
        delete newTempProduct.data[key];
      }
    });

    contentKeys.forEach((key) => {
      if (newTempProduct.data?.content?.[key] === '') {
        delete newTempProduct.data?.content[key];
      }
    });

    return newTempProduct;
  };

  /**
   * 取得表單內容值
   *
   * @param editItem - 商品類 API 回傳基準欄位 (有 id)
   */
  const setProductValues = (editItem?: ProductFullDatum) => {
    const item = editItem ?? defaultValues;

    const {
      title,
      category,
      unit,
      origin_price,
      price,
      imageUrl,
      imagesUrl,
      description,
      is_enabled,
      content = {},
    } = item;

    const { name = '', artists = '', artists_zh_tw = '', year = '' } = content;

    setValue('title', title!);
    setValue('category', category!);
    setValue('unit', unit!);
    setValue('origin_price', origin_price!);
    setValue('price', price!);
    setValue('imageUrl', imageUrl ?? '');
    setValue('imagesUrl', imagesUrl ?? []);
    setValue('description', description ?? '');
    setValue('name', name);
    setValue('artists', artists);
    setValue('artists_zh_tw', artists_zh_tw);
    setValue('year', year);
    setValue('is_enabled', is_enabled ?? 0);
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
   * 呼叫圖片上傳 API
   *
   * @param e - ChangeEvent
   */
  const handleImageUpload = async (
    type: string,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setIsFullScreenLoading(true);
    if (e.target.files !== null) {
      const file = e.target.files[0];
      const formData = new FormData();
      formData.append('file-to-upload', file);

      productApiService
        .uploadImage(formData)
        .then(({ data: { imageUrl } }) => {
          if (type === 'sub') {
            const updatedImagesUrl = [
              ...(tempProduct?.imagesUrl || []),
              imageUrl,
            ];

            if (tempProduct?.id) {
              setSubImagesMap((prev) => ({
                ...prev,
                [tempProduct.id ?? '']: [
                  ...(prev[tempProduct.id ?? ''] || []),
                  imageUrl,
                ],
              }));
            } else {
              setNewSubImagesUrl((prev) => [...prev, imageUrl]);
            }

            setTempProduct((prev) => ({
              ...prev,
              imagesUrl: updatedImagesUrl,
            }));
          } else {
            setTempProduct({
              ...tempProduct,
              imageUrl: imageUrl,
            });
          }
        })
        .finally(() => {
          setIsFullScreenLoading(false);
        });
    }
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
      })
      .finally(() => {
        setIsProductLoading(false);
      });
  };

  /**
   * 呼叫新增商品列表 API
   *
   * @param addProductRequest - 新增產品 request
   */
  const addProductItem = async (addProductRequest: AddProductRequest) => {
    setAddOpen(false);
    setIsProductLoading(true);

    productApiService
      .addProductItem(addProductRequest)
      .then(({ data: { message } }) => {
        getProducts();
        Swal.fire({
          icon: 'success',
          title: message,
        });
        eventBus.emit('updateCart');
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
  const editProductItem = async (
    id: string,
    editProductRequest: EditProductRequest
  ) => {
    setEditOpen(false);
    setIsProductLoading(true);

    productApiService
      .editProductItem(id, editProductRequest)
      .then(({ data: { message } }) => {
        getProducts();
        Swal.fire({
          icon: 'success',
          title: message,
        });
        eventBus.emit('updateCart');
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

    productApiService
      .deleteProductItem(deleteItem?.id ?? '')
      .then(({ data: { message } }) => {
        getProducts();
        Swal.fire({
          icon: 'success',
          title: message,
        });
        eventBus.emit('updateCart');
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
          getProducts().finally(() => {
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
                <h5>
                  <i>{formatUnknownText('name', deleteItem?.content?.name)}</i>
                </h5>
                <p>
                  <span>
                    {formatUnknownText(
                      'artists_zh_tw',
                      deleteItem?.content?.artists_zh_tw
                    )}{' '}
                  </span>
                  <span>
                    (
                    {formatUnknownText('artists', deleteItem?.content?.artists)}
                    ),{' '}
                  </span>
                  <span>
                    {formatUnknownText('year', deleteItem?.content?.year)}
                  </span>
                </p>
                {deleteItem?.imageUrl ? (
                  <img
                    src={deleteItem?.imageUrl}
                    className='object-fit rounded preview-image p-0'
                    alt='主圖'
                  />
                ) : (
                  <InsertPhoto className='no-image-icon' color='disabled' />
                )}
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
                <div className='row'>
                  <div className='col-md-6'>
                    <form
                      id='form'
                      className='form-signin'
                      onSubmit={handleSubmit(onSubmit)}
                    >
                      <div className='text-field-group'>
                        <FormControl error={!!errors.title}>
                          <Controller
                            name='title'
                            control={control}
                            rules={validationService.titleValidator()}
                            render={({ field }) => (
                              <TextField
                                {...field}
                                label='作品名稱'
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
                        <FormControl>
                          <Controller
                            name='name'
                            control={control}
                            render={({ field }) => (
                              <TextField
                                {...field}
                                label='作品原文名稱（選填）'
                                type='text'
                                helperText={validationService.getHelperText()}
                                onChange={(e) => {
                                  field.onChange(e);
                                }}
                              />
                            )}
                          />
                        </FormControl>
                        <div className='d-flex gap-3'>
                          <FormControl className='w-100'>
                            <Controller
                              name='artists_zh_tw'
                              control={control}
                              render={({ field }) => (
                                <TextField
                                  {...field}
                                  label='作者名稱（選填）'
                                  type='text'
                                  helperText={validationService.getHelperText()}
                                  onChange={(e) => {
                                    field.onChange(e);
                                  }}
                                />
                              )}
                            />
                          </FormControl>
                          <FormControl className='w-100'>
                            <Controller
                              name='artists'
                              control={control}
                              render={({ field }) => (
                                <TextField
                                  {...field}
                                  label='作者原文名稱（選填）'
                                  type='text'
                                  helperText={validationService.getHelperText()}
                                  onChange={(e) => {
                                    field.onChange(e);
                                  }}
                                />
                              )}
                            />
                          </FormControl>
                        </div>
                        <FormControl>
                          <Controller
                            name='year'
                            control={control}
                            render={({ field }) => (
                              <TextField
                                {...field}
                                label='作品年份（選填）'
                                type='text'
                                helperText={validationService.getHelperText()}
                                onChange={(e) => {
                                  field.onChange(e);
                                }}
                              />
                            )}
                          />
                        </FormControl>
                        <FormControl>
                          <Controller
                            name='description'
                            control={control}
                            render={({ field }) => (
                              <TextField
                                {...field}
                                label='描述（選填）'
                                type='text'
                                multiline
                                maxRows={6}
                                helperText={validationService.getHelperText()}
                                onChange={(e) => {
                                  field.onChange(e);
                                }}
                              />
                            )}
                          />
                        </FormControl>
                        <div className='d-flex gap-3'>
                          <FormControl
                            error={!!errors.category}
                            className='w-100'
                          >
                            <Controller
                              name='category'
                              control={control}
                              rules={validationService.categoryValidator()}
                              render={({ field }) => (
                                <TextField
                                  {...field}
                                  label='分類'
                                  type='text'
                                  error={!!errors.category}
                                  helperText={validationService.getHelperText(
                                    errors.category
                                  )}
                                  onChange={(e) => {
                                    field.onChange(e);
                                  }}
                                />
                              )}
                            />
                          </FormControl>
                          <FormControl
                            error={!!errors.category}
                            className='w-100'
                          >
                            <Controller
                              name='unit'
                              control={control}
                              rules={validationService.unitValidator()}
                              render={({ field }) => (
                                <TextField
                                  {...field}
                                  label='單位'
                                  type='text'
                                  error={!!errors.category}
                                  helperText={validationService.getHelperText(
                                    errors.category
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
                          <FormControl
                            error={!!errors.origin_price}
                            className='w-100'
                          >
                            <Controller
                              name='origin_price'
                              control={control}
                              rules={validationService.priceValidator(
                                'origin_price'
                              )}
                              render={({ field }) => (
                                <TextField
                                  {...field}
                                  label='原價'
                                  type='number'
                                  error={!!errors.origin_price}
                                  helperText={validationService.getHelperText(
                                    errors.origin_price
                                  )}
                                  onPaste={handlePaste}
                                  onChange={(e) => {
                                    if (validationService.isValidInput(e)) {
                                      field.onChange(e);
                                    }
                                  }}
                                />
                              )}
                            />
                          </FormControl>
                          <FormControl error={!!errors.price} className='w-100'>
                            <Controller
                              name='price'
                              control={control}
                              rules={validationService.priceValidator('price')}
                              render={({ field }) => (
                                <TextField
                                  {...field}
                                  label='售價'
                                  type='number'
                                  error={!!errors.price}
                                  helperText={validationService.getHelperText(
                                    errors.price
                                  )}
                                  onPaste={handlePaste}
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
                                  onChange={(e) => field.onChange(e)}
                                />
                              }
                              label='是否啟用'
                            />
                          )}
                        />
                      </FormControl>
                    </form>
                  </div>
                  <div className='col-md-6'>
                    <div className='d-grid'>
                      <div className='d-flex flex-column align-items-center'>
                        <div className='image-group mb-4'>
                          <Button
                            className='btn btn-primary w-100'
                            component='label'
                            variant='contained'
                          >
                            <CloudUpload />
                            <p className='btn-icon'>上傳主圖</p>
                            <VisuallyHiddenInput
                              type='file'
                              accept='.jpg,.jpeg,.png'
                              onChange={(e) => handleImageUpload('major', e)}
                              multiple
                            />
                          </Button>
                          <div className='d-flex justify-content-center'>
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
                        <div className='image-group'>
                          <Button
                            className='btn btn-primary w-100'
                            component='label'
                            variant='contained'
                            disabled={
                              6 <=
                              (tempProduct?.imagesUrl?.length ??
                                subImagesUrl.length)
                            }
                          >
                            <CloudUpload />
                            <p className='btn-icon'>
                              {(tempProduct?.imagesUrl?.length ??
                                subImagesUrl.length) >= 6
                                ? `已達到張數上限`
                                : `上傳副圖（還可上傳 ${6 - ((tempProduct?.imagesUrl?.length ?? newSubImagesUrl.length) || 0)} 張）`}
                            </p>
                            <VisuallyHiddenInput
                              type='file'
                              accept='.jpg,.jpeg,.png'
                              onChange={(e) => handleImageUpload('sub', e)}
                              multiple
                            />
                          </Button>
                          <ul className='image-list row'>
                            {tempProduct?.imagesUrl &&
                              tempProduct?.imagesUrl.map((item, index) => (
                                <li key={index} className='col-4'>
                                  <img
                                    className='sub-images rounded'
                                    src={item}
                                    alt={item}
                                  />
                                </li>
                              ))}
                            {!tempProduct?.imagesUrl &&
                              newSubImagesUrl &&
                              newSubImagesUrl.map((item, index) => (
                                <li key={index} className='col-4'>
                                  <img
                                    className='sub-images rounded'
                                    src={item}
                                    alt={item}
                                  />
                                </li>
                              ))}
                          </ul>
                        </div>
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
  );
}
