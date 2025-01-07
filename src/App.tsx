import { useState } from 'react'
import axios from 'axios';
import "./styles/_main.scss"

const API_BASE = "https://ec-course-api.hexschool.io/v2"

const API_PATH = "olivebranch"

function App() {
  const [formData, setFormData] = useState({
    username: "",
    password: ""
  });
  const [token, setToken] = useState('');
  const [isAuth, setIsAuth] = useState(false);
  const [products, setProducts] = useState([]);
  const [tempProduct, setTempProduct] = useState(null);

  const handleInputChange = (e) => {
    const value = e.target.value;
    const name = e.target.name;    
    setFormData({
      ...formData,
      [name]: value,
    });
  };
  

  const handleSubmit = (e) => {
    e.preventDefault();    
    getData();
  };

  const getData = async() =>{
    try {
      const result = await axios.post(`${API_BASE}/admin/signin`, formData);
      setToken(result.data.token)
      setIsAuth(true)
    } catch (error) {
      console.log(error);
    }
    
  }

  return (
    <>
      {isAuth?(
        <div className='card'>token {token}</div>
    ):(
        <div className="container login">
          <div className="row justify-content-center">
            <h1 className="h3 mb-3 font-weight-normal text-center">請先登入</h1>
            <div className="col-8">
              <form id="form" className="form-signin" onSubmit={handleSubmit}>
                <div className="form-floating mb-3">
                  <input
                    type="email"
                    className="form-control"
                    id="username"
                    name='username'
                    onChange={handleInputChange}
                    value={formData.username}
                  />
                  <label htmlFor="username">Email address</label>
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
                  <label htmlFor="password">Password</label>
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
          <p className="mt-5 mb-3 text-muted text-center">&copy; 2024~∞ - 六角學院</p>
        </div>
      )}
    </>
  )
}

export default App
