import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Bookmark, Logout, ShoppingCart } from './icons';
import {
  Badge,
  Button,
  IconButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
} from '@mui/material';

/** 元件參數型別 */
interface MenuBarProps {
  /** 購物車總數量 */
  cartCount: number;
}

export default function MenuBar({ cartCount }: MenuBarProps) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  // const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
  //   setAnchorEl(event.currentTarget);
  // };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <nav className='menu-bar navbar navbar-light bg-white'>
        <div className='container'>
          <div className='menu-bar-list'>
            <Link to='/products'>
              <Button className='btn btn-primary'>全部商品</Button>
            </Link>
            <Link to='/cart'>
              <IconButton>
                <Badge badgeContent={cartCount} color='primary'>
                  <ShoppingCart />
                </Badge>
              </IconButton>
            </Link>
            {/* <IconButton id='basic-button' onClick={handleClick}>
              <PersonIcon />
            </IconButton> */}
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
            <MenuItem onClick={handleClose}>
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
            </MenuItem>
          </Menu>
        </div>
      </nav>
    </>
  );
}
