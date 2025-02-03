import Header from '../../components/header';
import { useEffect, useState } from 'react';
import axios, { AxiosError } from 'axios';
import { LoginReq } from '../../core/models/admin/auth.model';
import { ProductFullDatum } from '../../core/models/utils.model';
import Swal from 'sweetalert2';
import Button from '@material-ui/core/Button';

const API_BASE = 'https://ec-course-api.hexschool.io/v2';
const API_PATH = 'olivebranch';

export default function Week02() {
  const [formData, setFormData] = useState<LoginReq>({
    username: '',
    password: '',
  });
  const [token, setToken] = useState('');
  const [isAuth, setIsAuth] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [products, setProducts] = useState<ProductFullDatum[]>([]);
  const [tempProduct, setTempProduct] = useState<ProductFullDatum | null>(null);

  const handleInputChange = (e: {
    target: { value: string; name: string };
  }) => {
    const value = e.target.value;
    const name = e.target.name;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e: { preventDefault: () => void }) => {
    e.preventDefault();
    login();
  };

  const login = async () => {
    try {
      const result = await axios.post(`${API_BASE}/admin/signin`, formData);
      if (result.data.token) {
        setToken(result.data.token);
        setIsAuth(true);
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
          headers: { Authorization: token },
        }
      );
      if (result.data.success) {
        getProducts();
      } else {
        console.log(result.data.message);
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

  const getProducts = async () => {
    try {
      setIsLoading(true);
      const result = await axios.get(
        `${API_BASE}/api/${API_PATH}/admin/products`,
        {
          headers: { Authorization: token },
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
        setIsLoading(false);
      } else {
        Swal.fire({
          icon: 'error',
          title: '發生無預期錯誤',
        });
        setIsLoading(false);
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isAuth) {
      checkLogin();
    }
  }, [isAuth]);

  return (
    <>
      <Header title='RESTful API 串接' />
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
                        <th>查看細節</th>
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
                              <button
                                className='btn btn-secondary rounded-pill w-100'
                                onClick={() => setTempProduct(item)}
                              >
                                查看細節
                              </button>
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
                {tempProduct ? (
                  <div className='card mb-3'>
                    <img
                      src={tempProduct.imageUrl}
                      className='rounded'
                      style={{
                        objectFit: 'cover',
                        maxWidth: '100%',
                        height: '250px',
                      }}
                      height={250}
                      alt='主圖'
                    />
                    <div className='card-body'>
                      <h5 className='card-title'>
                        {tempProduct.title}
                        <span className='badge rounded-pill bg-secondary ms-2'>
                          {tempProduct.category}
                        </span>
                      </h5>
                      <p className='card-text'>
                        商品描述：{tempProduct?.content?.content}
                      </p>
                      <div className='d-flex align-items-center'>
                        <p className='fs-5 mb-0 me-2'>
                          <strong>${tempProduct.price}</strong>
                        </p>
                        <p className='card-text text-secondary'>
                          <del>${tempProduct.origin_price}</del>
                        </p>
                      </div>
                      <h5 className='mt-3'>更多圖片：</h5>
                      <div className='d-flex flex-wrap'>
                        {tempProduct.imagesUrl?.map((url, index) => (
                          <img
                            key={index}
                            src={url}
                            style={{
                              objectFit: 'cover',
                              width: '150px',
                              height: '150px',
                              marginRight: '8px',
                              marginBottom: '8px',
                            }}
                            width={200}
                            height={200}
                            alt='副圖'
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <p className='text-secondary'>請選擇一個商品查看</p>
                )}
              </div>
            </div>
          </div>
        </>
      ) : (
        <div className='container layout'>
          <div className='row justify-content-center mb-3'>
            <div className='card col-4 col-md-6'>
              <h2 className='h2 mb-3 font-weight-normal text-center'>
                請先登入
              </h2>
              <form id='form' className='form-signin' onSubmit={handleSubmit}>
                <div className='form-input-group'>
                  <div className='form-floating'>
                    <input
                      type='email'
                      className='form-control'
                      id='username'
                      name='username'
                      placeholder='帳號'
                      onChange={handleInputChange}
                      value={formData.username}
                      required
                    />
                    <label htmlFor='username'>帳號</label>
                  </div>
                  <div className='form-floating'>
                    <input
                      type='password'
                      className='form-control'
                      id='password'
                      name='password'
                      placeholder='密碼'
                      onChange={handleInputChange}
                      value={formData.password}
                      required
                    />
                    <label htmlFor='password'>密碼</label>
                  </div>
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
