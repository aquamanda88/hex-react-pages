import Button from '@material-ui/core/Button';
import Header from '../components/header';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';

import { useEffect, useState } from 'react';
import axios, { AxiosError } from 'axios';
import { LoginReq } from '../core/models/admin/auth.model';
import { ProductFullDatum } from '../core/models/utils.model';
import Swal from 'sweetalert2';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import EditIcon from '@mui/icons-material/Edit';
import CloseIcon from '@mui/icons-material/Close';
import DeleteIcon from '@mui/icons-material/Delete';
import { TextField } from '@mui/material';

const API_BASE = 'https://ec-course-api.hexschool.io/v2';
const API_PATH = 'olivebranch';

export default function Week03() {
  const [formData, setFormData] = useState<LoginReq>({
    username: '',
    password: '',
  });
  const [isAuth, setIsAuth] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [products, setProducts] = useState<ProductFullDatum[]>([]);
  const [checked, setChecked] = useState(false);
  const [open, setOpen] = useState(false);
  const [tempProduct, setTempProduct] = useState<ProductFullDatum | null>(null);

  const handleOpen = (item: ProductFullDatum) => {
    setTempProduct({
      is_enabled: item.is_enabled,
      num: item.num,
      title: item.title,
      content: item.content,
      description: item.description,
      category: item.category,
      unit: item.unit,
      origin_price: item.origin_price,
      price: item.price,
      imageUrl: item.imageUrl,
      imagesUrl: item.imagesUrl,
      id: item.id,
    });
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSave = () => {
    console.log('tempProduct: ', tempProduct);
    
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setChecked(e.target.checked);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const name = e.target.name;
    setFormData({
      ...formData,
      [name]: value,
    });
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
    login();
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
                <h2>所有文具商品</h2>
                <div className='card mb-4'>
                  <table className='table table-hover mb-0'>
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
                              {item.is_enabled ? '啟用' : '未啟用'}
                            </td>
                            <td>
                              <Button
                                className='btn'
                                onClick={() => {
                                  handleOpen(item);
                                }}
                              >
                                <EditIcon />
                              </Button>
                              <Button className='btn'>
                                <DeleteIcon sx={{ color: '#dc3545' }} />
                              </Button>
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
              <div className='col-lg-6'>
                <h2>單一產品細節</h2>
                <Dialog
                  fullScreen
                  open={open}
                  onClose={handleClose}
                  aria-labelledby='alert-dialog-title'
                  aria-describedby='alert-dialog-description'
                >
                  <div className='modal-header bg-white sticky-top d-flex justify-content-end'>
                    <DialogActions className='justify-content-center'>
                      <Button onClick={handleClose}>
                        <CloseIcon />
                      </Button>
                    </DialogActions>
                  </div>
                  <div className='modal-content'>
                    <div className='container'>
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
                              <img
                                src={tempProduct?.imageUrl}
                                className='object-fit rounded w-100 image-size'
                                alt='主圖'
                              />
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
                              <div className='image-group d-flex flex-column'>
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
                    </div>
                  </div>
                  <div className='bg-white d-flex justify-content-center'>
                    <div className='justify-content-center py-2'>
                      <Button onClick={handleClose}>取消</Button>
                      <Button onClick={handleSave} autoFocus>
                        儲存
                      </Button>
                    </div>
                  </div>
                </Dialog>
                <p className='text-secondary'>請選擇一個商品查看</p>
              </div>
            </div>
          </div>
        </>
      ) : (
        <div className='container layout'>
          <div className='row justify-content-center mb-3'>
            <div className='card col-4 col-md-6'>
              <h2 className='h2 mb-3 font-weight-normal text-center'>
                Sign In
              </h2>
              <p>Enter your email and password to sign in!</p>
              <form id='form' className='form-signin' onSubmit={handleSubmit}>
                <div className='form-input-group'>
                  <div className='form-floating'>
                    <input
                      type='email'
                      className='form-control'
                      id='username'
                      name='username'
                      placeholder='Email'
                      onChange={handleInputChange}
                      value={formData.username}
                      required
                    />
                    <label htmlFor='username'>Email</label>
                  </div>
                  <div className='form-floating'>
                    <input
                      type='password'
                      className='form-control'
                      id='password'
                      name='password'
                      placeholder='Password'
                      onChange={handleInputChange}
                      value={formData.password}
                      required
                    />
                    <label htmlFor='password'>Password</label>
                  </div>
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
                  label='Keep me logged in'
                />
                <Button
                  className='button w-100'
                  variant='contained'
                  color='primary'
                  type='submit'
                >
                  Sign In
                </Button>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
