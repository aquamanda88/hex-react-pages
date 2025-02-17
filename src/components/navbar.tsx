import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
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
import { calculateCartCount, selectCount } from '../redux/countSlice';
import cartApiService from '../services/api/user/cart.service';

export default function NavBar() {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const count = useSelector(selectCount);

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
      dispatch(calculateCartCount(data.carts.length));
    });
  };

  useEffect(() => {
    getCarts();
  }, []);

  return (
    <>
      <nav className='menu-bar navbar navbar-light'>
        <div className='container'>
          <div className='menu-navbar'>
            <ul className='navbar-list d-flex'>
              <li>
                <Link className='text-color-main' to='/products'>
                  全部作品
                </Link>
              </li>
            </ul>
            <div className='page-bar'>
              <IconButton onClick={() => navigate('/cart')}>
                <Badge badgeContent={count} color='primary'>
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
            <Link to='/favorites'>
              <MenuItem onClick={handleClose}>
                <ListItemIcon>
                  <Bookmark />
                </ListItemIcon>
                <ListItemText>我的收藏</ListItemText>
              </MenuItem>
            </Link>

            <Divider />
            <Link to='/admin'>
              <MenuItem onClick={handleClose}>
                <ListItemIcon>
                  <Dashboard />
                </ListItemIcon>
                <ListItemText>後台</ListItemText>
              </MenuItem>
            </Link>
          </Menu>
        </div>
      </nav>
    </>
  );
}
