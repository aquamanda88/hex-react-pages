import { useEffect, useState } from 'react';
import { NavLink, useNavigate } from 'react-router';
import { Person, ShoppingCart, Bookmark, Dashboard } from './Icons';
import {
  Badge,
  Divider,
  IconButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
} from '@mui/material';
import { calculateTotalQty } from '../services/formatValue.service';
import cartApiService from '../services/api/user/cart.service';
import eventBus from './EventBus';

export default function NavBar() {
  const [cartCount, setCartCount] = useState(0);
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
      <nav className='menu-bar navbar navbar-light'>
        <div className='container'>
          <div className='menu-navbar'>
            <ul className='navbar-list d-flex'>
              <li>
                <NavLink className='text-color-main' to='/products'>
                  全部作品
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
            <NavLink to='/favorites'>
              <MenuItem onClick={handleClose}>
                <ListItemIcon>
                  <Bookmark />
                </ListItemIcon>
                <ListItemText>我的收藏</ListItemText>
              </MenuItem>
            </NavLink>

            <Divider />
            <NavLink to='/admin'>
              <MenuItem onClick={handleClose}>
                <ListItemIcon>
                  <Dashboard />
                </ListItemIcon>
                <ListItemText>後台</ListItemText>
              </MenuItem>
            </NavLink>
          </Menu>
        </div>
      </nav>
    </>
  );
}
