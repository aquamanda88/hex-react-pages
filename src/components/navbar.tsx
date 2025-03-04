import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import { Menu, ShoppingCart } from './Icons';
import { Badge, IconButton } from '@mui/material';
import { calculateCartCount, selectCount } from '../redux/countSlice';
import cartApiService from '../services/api/user/cart.service';

export default function NavBar() {
  const [isClickNavLink, setIsClickNavLink] = useState(false);
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
      url: '/favorites',
      content: '我的收藏',
    },
    {
      url: '/orders',
      content: '訂單記錄',
    },
    {
      url: '/cart',
      content: '購物車',
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isClickNavLink]);

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
              {dropdownItems.map((item, index) => (
                <li key={index}>
                  {item.url !== '/cart' ? (
                    <Link
                      className={pathname === item.url ? 'marker-pen' : ''}
                      to={item.url}
                    >
                      <span className='font-zh-p-medium'>{item.content}</span>
                    </Link>
                  ) : (
                    <IconButton onClick={() => navigate(item.url)}>
                      <Badge badgeContent={count} color='primary'>
                        <ShoppingCart />
                      </Badge>
                    </IconButton>
                  )}
                </li>
              ))}
            </ul>
            <button
              className='navbar-toggler'
              type='button'
              data-bs-toggle='collapse'
              data-bs-target='#navbarDropdownContent'
              aria-controls='navbarDropdownContent'
              aria-expanded='true'
              aria-label='Toggle navigation'
              onClick={() => setIsClickNavLink(false)}
            >
              <Menu />
            </button>
          </div>
          <div
            className={`${isClickNavLink ? '' : 'show'} collapse navbar-collapse`}
            id='navbarDropdownContent'
          >
            <ul className='navbar-nav me-auto'>
              {dropdownItems.map((item, index) => (
                <li className='nav-item' key={index}>
                  <Link
                    className='nav-link font-zh-p-medium'
                    to={item.url}
                    onClick={() => setIsClickNavLink(true)}
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
