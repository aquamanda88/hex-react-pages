import { useEffect, useState } from 'react'
import { LoginReq } from './core/models/admin/auth.model';
import { ProductFullDatum } from './core/models/utils.model';
import axios from 'axios';
import "./styles/_main.scss"
import Swal from 'sweetalert2';

const API_BASE = "https://ec-course-api.hexschool.io/v2"
const API_PATH = "olivebranch"

function App() {
  const [formData, setFormData] = useState<LoginReq>({
    username: "",
    password: ""
  });
  const [token, setToken] = useState('');
  const [isAuth, setIsAuth] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [products, setProducts] = useState<ProductFullDatum[]>([]);
  const [tempProduct, setTempProduct] = useState<ProductFullDatum|null>(null);

  const handleInputChange = (e: { target: { value: string; name: string; }; }) => {
    const value = e.target.value;
    const name = e.target.name;    
    setFormData({
      ...formData,
      [name]: value,
    });
  };
  

  const handleSubmit = (e: { preventDefault: () => void; }) => {
    e.preventDefault();    
    login();
  };

  const login = async() =>{
    try {
      const result = await axios.post(`${API_BASE}/admin/signin`, formData);
      if(result.data.token){
        setToken(result.data.token)
        setIsAuth(true)
      }else{
        setIsAuth(false)
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: error.response.data.message
      });
    }
  }

  const checkLogin = async() =>{
    try {
      const result = await axios.post(`${API_BASE}/api/user/check`, {}, {
        headers: { Authorization: token }
      });
      if(result.data.success){
        getProducts()
      }else{
        console.log(result.data.message);
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: error.response.data.message
      });
    }
  }

  const getProducts = async() =>{
    try {
      setIsLoading(true);
      const result = await axios.get(`${API_BASE}/api/${API_PATH}/admin/products`, {
        headers: { Authorization: token }
      });
      if(result.data.products){
        setProducts(result.data.products);
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: error.response.data.message
      });
    }finally {
      setIsLoading(false); 
    }
  }

  useEffect(() => {
    if(isAuth){
      checkLogin()
    }
  }, [isAuth])

  return (
    <>
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
          <div className="row flex-column justify-content-center align-items-center">
            <div className="col-lg-6">
              <h2>所有文具商品</h2>
              <div className="card mb-4">
                <table className="table table-hover mb-0">
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
                          <td className={item.is_enabled ? "text-success" : "text-danger"}>{item.is_enabled ? "啟用" : "未啟用"}</td>
                          <td>
                            <button
                              className="btn btn-secondary rounded-pill w-100"
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
            <div className="col-lg-6">
                <h2>單一產品細節</h2>
                {tempProduct ? (
                  <div className="card mb-3">
                    <img
                      src={tempProduct.imageUrl}
                      className="object-fit card-img-top rounded"
                      alt="主圖"
                    />
                    <div className="card-body">
                      <h5 className="card-title">
                        {tempProduct.title}
                        <span className="badge rounded-pill bg-secondary ms-2">
                          {tempProduct.category}
                        </span>
                      </h5>
                      <p className="card-text">
                        商品描述：{tempProduct.content}
                      </p>
                      <div className="d-flex align-items-center">
                        <p className='fs-5 mb-0 me-2'>
                          <strong>${tempProduct.price}</strong>
                        </p>
                        <p className="card-text text-secondary">
                          <del>${tempProduct.origin_price}</del>
                        </p>
                      </div>
                      <h5 className="mt-3">更多圖片：</h5>
                      <div className="d-flex flex-wrap">
                        {tempProduct.imagesUrl?.map((url, index) => (
                          <img
                            key={index}
                            src={url}
                            className="images object-fit"
                            alt="副圖"
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <p className="text-secondary">請選擇一個商品查看</p>
                )}
            </div>
          </div>
        </div>
      </>
        
    ):(
        <div className="container py-4">
          <div className="row justify-content-center mb-3">
            <h1 className="h3 mb-3 font-weight-normal text-center">請先登入</h1>
            <div className="card col-8">
              <form id="form" className="form-signin" onSubmit={handleSubmit}>
                <div className="form-floating mb-3">
                  <input
                    type="email"
                    className="form-control"
                    id="username"
                    name='username'
                    onChange={handleInputChange}
                    value={formData.username}
                    required
                    autoFocus
                  />
                  <label htmlFor="username">帳號</label>
                </div>
                <div className="form-floating">
                  <input
                    type="password"
                    className="form-control"
                    id="password"
                    name='password'
                    onChange={handleInputChange}
                    value={formData.password}
                    required
                  />
                  <label htmlFor="password">密碼</label>
                </div>
                <button
                  className="btn btn-lg btn-primary w-100 mt-3"
                  type="submit"
                >
                  登入
                </button>
              </form>
            </div>
          </div>
          <p className="mt-5 mb-3 text-muted text-center">&copy; {new Date().getFullYear()}~∞ - 六角學院</p>
        </div>
      )}
    </>
  )
}

export default App
