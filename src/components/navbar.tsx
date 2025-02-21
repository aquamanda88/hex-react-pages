import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import { Person, ShoppingCart, Bookmark, Feed } from './Icons';
import {
  Badge,
  IconButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
} from '@mui/material';
import { calculateCartCount, selectCount } from '../redux/countSlice';
import cartApiService from '../services/api/user/cart.service';
import { Drawers } from './Index';

export default function NavBar() {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
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
      <nav className='navbar navbar-light'>
        <div className='container'>
          <div className='navbar-items'>
            <h1>
              <Link className='font-en-h2-medium' to='/home'>
                Olive Branch
              </Link>
            </h1>
            <div className='d-flex align-items-center'>
              <div className='dropdown-btn d-block d-md-none'>
                <Drawers dropdownItems={dropdownItems} />
              </div>
              <div className='d-none d-md-flex align-items-center'>
                <ul className='navbar-list d-flex'>
                  <li className={pathname === '/products' ? 'active' : ''}>
                    <Link className='link-gray' to='/products'>
                      全部作品
                    </Link>
                  </li>
                </ul>
                <div className='page-items d-flex'>
                  <IconButton onClick={() => navigate('/cart')}>
                    <Badge badgeContent={count} color='primary'>
                      <ShoppingCart />
                    </Badge>
                  </IconButton>
                  <IconButton onClick={handleClick}>
                    <Person />
                  </IconButton>
                </div>
              </div>
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
            <Link to='/orders'>
              <MenuItem onClick={handleClose}>
                <ListItemIcon>
                  <Feed />
                </ListItemIcon>
                <ListItemText>訂單記錄</ListItemText>
              </MenuItem>
            </Link>
          </Menu>
        </div>
      </nav>
    </>
  );
}
