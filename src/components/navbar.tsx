import { useEffect, useState } from 'react';
import { NavLink, useNavigate } from 'react-router';
import { Person, Login, ShoppingCart } from './icons';
import {
  Badge,
  IconButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
} from '@mui/material';
import { calculateTotalQty } from '../services/formatValue.service';
import cartApiService from '../services/api/user/cart.service';
import authService from '../services/api/admin/auth.service';
import Spinners from './spinners';
import eventBus from './eventBus';

export default function NavBar() {
  const token = sessionStorage.getItem('token') ?? '';
  const [cartCount, setCartCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const navigate = useNavigate();

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  /**
   * 呼叫登出 API
   *
   * @param token - token
   */
  const logout = async (token: string) => {
    handleClose();
    setIsLoading(true);
    authService
      .logout(token)
      .then(() => {
        sessionStorage.removeItem('token');
        window.location.reload();
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  /**
   * 呼叫取得購物車資料 API
   */
  const getCarts = async () => {
    cartApiService.getCarts().then(({ data: { data } }) => {
      setCartCount(calculateTotalQty(data.carts));
    });
  };

  useEffect(() => {
    getCarts();
    eventBus.on('updateCart', getCarts);
    return () => {
      eventBus.off('updateCart', getCarts);
    };
  }, []);

  return (
    <>
      <div className={`${isLoading ? 'd-flex' : 'd-none'} loading`}>
        <Spinners />
      </div>
      <nav className='menu-bar navbar navbar-light'>
        <div className='container'>
          <div className='menu-navbar'>
            <ul className='navbar-list d-flex'>
              <li>
                <NavLink className='text-color-main' to='/products'>
                  全部商品
                </NavLink>
              </li>
              <li>
                <NavLink className='text-color-main' to='/admin'>
                  後台
                </NavLink>
              </li>
            </ul>
            <div className='page-bar'>
              <IconButton onClick={() => navigate('/cart')}>
                <Badge badgeContent={cartCount} color='primary'>
                  <ShoppingCart />
                </Badge>
              </IconButton>
              <IconButton id='basic-button' onClick={handleClick}>
                <Person />
              </IconButton>
            </div>
          </div>
          <Menu
            id='basic-menu'
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            MenuListProps={{
              'aria-labelledby': 'basic-button',
            }}
          >
            {token ? (
              <MenuItem
                onClick={() => {
                  logout(token);
                }}
              >
                <ListItemIcon>
                  <Login />
                </ListItemIcon>
                <ListItemText>登出</ListItemText>
              </MenuItem>
            ) : (
              <MenuItem onClick={handleClose}>
                <NavLink to='/login' className='d-flex'>
                  <ListItemIcon>
                    <Login />
                  </ListItemIcon>
                  <ListItemText>登入</ListItemText>
                </NavLink>
              </MenuItem>
            )}
            {/* <MenuItem onClick={handleClose}>
              <ListItemIcon>
                <Bookmark />
              </ListItemIcon>
              <ListItemText>我的收藏</ListItemText>
            </MenuItem>
            <MenuItem onClick={handleClose}>
              <ListItemIcon>
                <Logout />
              </ListItemIcon>
              <ListItemText>登出</ListItemText>
            </MenuItem> */}
          </Menu>
        </div>
      </nav>
    </>
  );
}
