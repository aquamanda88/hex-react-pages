import { useState } from 'react';
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
import authService from '../services/api/admin/auth.service';
import Spinners from './spinners';

/** 元件參數型別 */
interface NavBarProps {
  /** 購物車總數量 */
  cartCount: number;
}

export default function NavBar({ cartCount }: NavBarProps) {
  const token = sessionStorage.getItem('token') ?? '';
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
                <NavLink to='/products'>全部商品</NavLink>
              </li>
              <li>
                <NavLink to='/admin'>後台</NavLink>
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
