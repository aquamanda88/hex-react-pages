import { useEffect, useState } from 'react';
import axios, { AxiosError } from 'axios';
import { Header, Modal } from '../components';
import { LoginReq } from '../core/models/admin/auth.model';
import { ProductFullDatum } from '../core/models/utils.model';
import {
  Button,
  IconButton,
  TextField,
  Checkbox,
  FormControlLabel,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import AddIcon from '@mui/icons-material/Add';
import Swal from 'sweetalert2';

const API_BASE = 'https://ec-course-api.hexschool.io/v2';
const API_PATH = 'olivebranch';

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
  const [products, setProducts] = useState<ProductFullDatum[]>([]);
  const [checked, setChecked] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteItem, setDeleteItem] = useState({
    title: '',
    id: '',
  });
  const [tempProduct, setTempProduct] = useState<ProductFullDatum | null>(null);

  const handleOpen = (item?: ProductFullDatum) => {
    setTempProduct({
      is_enabled: item?.is_enabled ?? 0,
      num: item?.num ?? 0,
      title: item?.title ?? '',
      content: item?.content ?? '',
      description: item?.description ?? '',
      category: item?.category ?? '',
      unit: item?.unit ?? '',
      origin_price: item?.origin_price ?? 0,
      price: item?.price ?? 0,
      imageUrl: item?.imageUrl ?? '',
      imagesUrl: item?.imagesUrl ?? [],
      id: item?.id ?? '',
    });
    setEditOpen(true);
  };

  const handleSave = () => {
    console.log(tempProduct);
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

  const handleInputBlur = () => {
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

  const getProducts = async (token: string) => {
    try {
      setIsLoading(true);
      const result = await axios.get(
        `${API_BASE}/api/${API_PATH}/admin/products`,
        {
          headers: {
            Authorization: checked ? sessionStorage.getItem('token') : token,
          },
        }
      );
      if (result.data.products) {
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

  const handleDeleteOpen = (title: string, id: string) => {
    setDeleteItem({ title, id });
    setDeleteOpen(true);
  };

  const deleteProduct = async () => {
    try {
      setDeleteOpen(false);
      setIsLoading(true);
      const result = await axios.delete(
        `${API_BASE}/api/${API_PATH}/admin/product/${deleteItem.id}`,
        {
          headers: {
            Authorization: sessionStorage.getItem('token'),
          },
        }
      );
      getProducts(sessionStorage.getItem('token') ?? '');
      Swal.fire({
        title: result.data.message
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
    }finally {
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
            <div
              className='loading'
              style={{ display: isLoading ? 'flex' : 'none' }}
            >
              <div className='spinner-border' role='status'>
                <span className='visually-hidden'>Loading...</span>
              </div>
            </div>
            <div className='row flex-column justify-content-center align-items-center'>
              <div className='col-lg-6'>
                <div className='card mb-4'>
                  <div className='d-flex justify-content-between'>
                    <h2>所有商品</h2>
                    <Button
                      variant='contained'
                      className='btn btn-secondary'
                      onClick={() => {
                        handleOpen();
                      }}
                    >
                      <AddIcon />
                      <p className='btn-icon'>新增</p>
                    </Button>
                  </div>
                  <table className='table mb-0'>
                    <thead className='text-center'>
                      <tr>
                        <th>產品名稱</th>
                        <th>原價</th>
                        <th>售價</th>
                        <th>是否啟用</th>
                        <th>修改</th>
                      </tr>
                    </thead>
                    <tbody className='text-center'>
                      {products && products.length > 0 ? (
                        products.map((item) => (
                          <tr key={item.id}>
                            <td>{item.title}</td>
                            <td>{item.origin_price}</td>
                            <td>{item.price}</td>
                            <td
                              className={
                                item.is_enabled ? 'text-success' : 'text-danger'
                              }
                            >
                              {item.is_enabled ? <CheckIcon /> : <CloseIcon />}
                            </td>
                            <td>
                              <IconButton
                                onClick={() => {
                                  handleOpen(item);
                                }}
                              >
                                <EditIcon />
                              </IconButton>
                              <IconButton
                                onClick={() => {
                                  handleDeleteOpen(
                                    item.title ?? '',
                                    item.id ?? ''
                                  );
                                }}
                              >
                                <DeleteIcon sx={{ color: '#dc3545' }} />
                              </IconButton>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={5}>尚無產品資料</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
              <Modal
                open={deleteOpen}
                setOpen={setDeleteOpen}
                handleSave={deleteProduct}
              >
                <div className='row'>
                  <h2>是否要刪除{deleteItem.title}？</h2>
                </div>
              </Modal>
              <div className='col-lg-6'>
                <Modal
                  open={editOpen}
                  setOpen={setEditOpen}
                  handleSave={handleSave}
                >
                  <div className='row'>
                    <div className='text-field-group card'>
                      <TextField
                        id='title'
                        name='title'
                        label='標題'
                        value={tempProduct?.title}
                        onChange={handleInputEdit}
                        required
                      />
                      <TextField
                        id='description'
                        name='description'
                        label='描述'
                        multiline
                        maxRows={4}
                        defaultValue={tempProduct?.description}
                        onChange={handleInputEdit}
                      />
                      <TextField
                        id='content'
                        name='content'
                        label='說明'
                        multiline
                        maxRows={4}
                        defaultValue={tempProduct?.content}
                        onChange={handleInputEdit}
                      />
                      <div className='d-flex gap-3'>
                        <TextField
                          className='w-100'
                          id='category'
                          name='category'
                          label='分類'
                          variant='outlined'
                          onChange={handleInputEdit}
                          value={tempProduct?.category}
                          required
                        />
                        <TextField
                          className='w-100'
                          id='unit'
                          name='unit'
                          label='單位'
                          variant='outlined'
                          onChange={handleInputEdit}
                          value={tempProduct?.unit}
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
                          value={tempProduct?.origin_price}
                          required
                        />
                        <TextField
                          className='w-100'
                          id='price'
                          name='price'
                          label='售價'
                          type='number'
                          onChange={handleInputEdit}
                          value={tempProduct?.price}
                          required
                        />
                      </div>
                      <div
                        className='d-grid'
                        style={{
                          gridTemplateColumns: 'repeat(2, 1fr)',
                          gap: '1.5rem',
                        }}
                      >
                        <div className='image-group d-flex flex-column'>
                          <TextField
                            className='w-100'
                            id='imageUrl'
                            name='imageUrl'
                            label='主圖網址'
                            variant='outlined'
                            onChange={handleInputEdit}
                            value={tempProduct?.imageUrl}
                            required
                          />
                          {tempProduct?.imageUrl && (
                            <img
                              src={tempProduct.imageUrl}
                              className='object-fit rounded w-100 image-size'
                              alt='主圖'
                            />
                          )}
                        </div>
                      </div>
                      <div
                        className='d-grid'
                        style={{
                          gridTemplateColumns: 'repeat(2, 1fr)',
                          gap: '1.5rem',
                        }}
                      >
                        {tempProduct?.imagesUrl?.map((url, index) => (
                          <div
                            className='image-group d-flex flex-column'
                            key={index}
                          >
                            <TextField
                              id='imagesUrl'
                              name='imagesUrl'
                              label={`副圖網址 ${index + 1}`}
                              variant='outlined'
                              onChange={(e) => handleInputEdit(e, index)}
                              value={url}
                            />
                            <img
                              key={index}
                              src={url}
                              className='object-fit rounded image-size'
                              alt='副圖'
                            />
                          </div>
                        ))}
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
