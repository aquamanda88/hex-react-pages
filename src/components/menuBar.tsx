import {
  Badge,
  IconButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
} from '@mui/material';
import { useState } from 'react';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import Logout from '@mui/icons-material/Logout';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { Link } from 'react-router-dom';

/** 元件參數型別 */
interface MenuBarProps {
  /** 購物車總數量 */
  cartCount: number;
}

export default function MenuBar({ cartCount }: MenuBarProps) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <nav className='navbar navbar-light bg-light'>
        <div className='container'>
          <div className='menu-bar'>
            <Link to='/cart'>
              <IconButton>
                <Badge badgeContent={cartCount} color='primary'>
                  <ShoppingCartIcon />
                </Badge>
              </IconButton>
            </Link>
            <IconButton id='basic-button' onClick={handleClick}>
              <AccountCircleIcon />
            </IconButton>
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
                <BookmarkIcon />
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
