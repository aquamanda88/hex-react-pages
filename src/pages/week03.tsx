import Button from "@material-ui/core/Button";
import Header from "../components/header";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";

import { useEffect, useState } from 'react';
import axios, { AxiosError } from 'axios';
import { LoginReq } from '../core/models/admin/auth.model';
import { ProductFullDatum } from '../core/models/utils.model';
import Swal from 'sweetalert2';
import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogActions from "@material-ui/core/DialogActions";

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
  const [tempProduct, setTempProduct] = useState<ProductFullDatum | null>(null);
  const [checked, setChecked] = useState(false);
  const [open, setOpen] = useState(false);
  const [formValues, setFormValues] = useState<ProductFullDatum| null>(null);

  const handleOpen = (item: ProductFullDatum) => {
    setTempProduct(item);
    setFormValues({
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

  const handleInputEdit = (e: React.ChangeEvent<HTMLInputElement|HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormValues((prevValues) => ({
      // 保留 item 的完整結構
      is_enabled: prevValues!.is_enabled,
      num: prevValues!.num,
      title: name === "title" ? value : prevValues!.title,
      content: name === "content" ? value : prevValues!.content,
      description: name === "description" ? value : prevValues!.description,
      category: name === "category" ? value : prevValues!.category,
      unit: name === "unit" ? value : prevValues!.unit,
      origin_price: name === "origin_price" ? parseInt(value) : prevValues!.origin_price,
      price: name === "price" ? parseInt(value) : prevValues!.price,
      imageUrl: name === "imageUrl" ? value : prevValues!.imageUrl,
      imagesUrl: name === "imagesUrl" ? [value] : prevValues!.imagesUrl,
      id: prevValues!.id, // 不更新 id
    }));
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
        if(checked){
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
          headers: { Authorization: checked ? sessionStorage.getItem('token') : token },
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
    if(token){
      checkLogin().then((res)=>{
        if(res){
          setIsAuth(true);
          getProducts(token);
        }
      });
    }
  }, []);

  return (
    <>
      <Header title="熟練 React.js" />
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
                                onClick={() => {handleOpen(item)}}
                              >
                                編輯
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
                <Dialog
                  fullScreen
                  open={open}
                  onClose={handleClose}
                  aria-labelledby="alert-dialog-title"
                  aria-describedby="alert-dialog-description"
                >
                  <div className="bg-light sticky-top d-flex justify-content-end">
                  <DialogActions className="justify-content-center">
                      <Button onClick={handleClose}>X</Button>
                    </DialogActions>
                  </div>
                  <div className="container">
                    <DialogTitle id="alert-dialog-title">
                      <input
                        type='text'
                        className='form-control'
                        id='title'
                        name='title'
                        onChange={handleInputEdit}
                        value={formValues?.title}
                        required
                      />
                    </DialogTitle>
                    <DialogContent>
                      <img
                        src={tempProduct?.imageUrl}
                        className='object-fit card-img-top rounded mb-4'
                        alt='主圖'
                      />
                      <DialogContentText id="alert-dialog-description">
                      <textarea className="form-control mb-4" id="content" name="content" rows={2} defaultValue={formValues?.content} onChange={handleInputEdit}>
                      </textarea>
                      <div className="row">
                        <div className="col-6">
                          <label htmlFor="price" className="form-label">售價</label>
                          <input
                            type='number'
                            className='form-control'
                            id='price'
                            name='price'
                            onChange={handleInputEdit}
                            value={formValues?.price}
                            required
                          />
                        </div>
                        <div className="col-6">
                          <label htmlFor="origin_price" className="form-label">原價</label>
                          <input
                            type='number'
                            className='form-control'
                            id='origin_price'
                            name='origin_price'
                            onChange={handleInputEdit}
                            value={formValues?.origin_price}
                            required
                          />
                        </div>
                      </div>
                        <h5 className='mt-3'>更多圖片：</h5>
                        <div className='d-flex flex-wrap'>
                          {tempProduct?.imagesUrl?.map((url, index) => (
                            <img
                              key={index}
                              src={url}
                              className='images object-fit'
                              alt='副圖'
                            />
                          ))}
                        </div>
                      </DialogContentText>
                    </DialogContent>
                    
                  </div>
                  <div className="bg-light fixed-bottom justify-content-center">
                    <DialogActions className="justify-content-center">
                      <Button onClick={handleClose}>取消</Button>
                      <Button onClick={handleClose} autoFocus>
                        儲存
                      </Button>
                    </DialogActions>
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
              <h2 className='h2 mb-3 font-weight-normal text-center'>Sign In</h2>
              <p>Enter your email and password to sign in!</p>
              <form id='form' className='form-signin' onSubmit={handleSubmit}>
                <div className="form-input-group">
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
                <FormControlLabel className="mb-2" control={<Checkbox checked={checked} color="primary" onChange={handleCheckboxChange}/>} label="Keep me logged in" />
                <Button className='button w-100' variant="contained" color="primary" type='submit'>Sign In</Button>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
