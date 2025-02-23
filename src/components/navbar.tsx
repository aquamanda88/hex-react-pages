import { useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import { ShoppingCart } from './Icons';
import { Badge, IconButton } from '@mui/material';
import { calculateCartCount, selectCount } from '../redux/countSlice';
import cartApiService from '../services/api/user/cart.service';

export default function NavBar() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const count = useSelector(selectCount);

  const dropdownItems = [
    {
      url: '/products',
      content: '全部作品',
    },
    {
      url: '/cart',
      content: '購物車',
    },
    {
      url: '/favorites',
      content: '我的收藏',
    },
    {
      url: '/orders',
      content: '訂單記錄',
    },
  ];

  /**
   * 呼叫取得購物車資料 API
   */
  const getCarts = async () => {
    cartApiService.getCarts().then(({ data: { data } }) => {
      dispatch(calculateCartCount(data.carts.length));
    });
  };

  useEffect(() => {
    getCarts();
  }, []);

  return (
    <>
      <nav className='navbar navbar-expand-lg'>
        <div className='container-fluid'>
          <div className='container navbar-menu-bar'>
            <h1>
              <Link className='font-en-h2-medium' to='/home'>
                Olive Branch
              </Link>
            </h1>
            <ul className='navbar-menu'>
              <li>
                <Link
                  className={pathname === '/products' ? 'marker-pen' : ''}
                  to='/products'
                >
                  <span className='font-zh-p-medium'>全部作品</span>
                </Link>
              </li>
              <li>
                <Link
                  className={pathname === '/favorites' ? 'marker-pen' : ''}
                  to='/favorites'
                >
                  <span className='font-zh-p-medium'>我的收藏</span>
                </Link>
              </li>
              <li>
                <Link
                  className={pathname === '/orders' ? 'marker-pen' : ''}
                  to='/orders'
                >
                  <span className='font-zh-p-medium'>訂單記錄</span>
                </Link>
              </li>
              <li>
                <IconButton onClick={() => navigate('/cart')}>
                  <Badge badgeContent={count} color='primary'>
                    <ShoppingCart />
                  </Badge>
                </IconButton>
              </li>
            </ul>
            <button
              className='navbar-toggler'
              type='button'
              data-bs-toggle='collapse'
              data-bs-target='#navbarSupportedContent'
              aria-controls='navbarSupportedContent'
              aria-expanded='false'
              aria-label='Toggle navigation'
            >
              <span className='navbar-toggler-icon'></span>
            </button>
          </div>
          <div className='collapse navbar-collapse' id='navbarSupportedContent'>
            <ul className='navbar-nav me-auto'>
              {dropdownItems.map((item, index) => (
                <li className='nav-item'>
                  <Link
                    className='nav-link font-zh-p-medium'
                    to={item.url}
                    key={index}
                  >
                    {item.content}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </nav>
    </>
  );
}
