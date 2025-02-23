import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';
import authService from '../services/api/admin/auth.service';
import Spinners from './Spinners';
import { Drafts, Source } from './Icons';

export default function MenuList() {
  const token = sessionStorage.getItem('token') ?? '';
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const currentPath = useLocation().pathname.split('/admin/')[1];

  const navItems = [
    { path: 'products', label: '商品總覽', icon: <Source /> },
    { path: 'orders', label: '管理訂單', icon: <Drafts /> },
    { path: 'coupons', label: '管理優惠券', icon: <Drafts /> },
  ];

  /**
   * 呼叫登出 API
   *
   * @param token - token
   */
  const logout = async (token: string) => {
    setIsLoading(true);
    authService
      .logout(token)
      .then(() => {
        sessionStorage.removeItem('token');
        navigate('/products');
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
      <Box className='admin-dashboard'>
        <div className='list-header'>
          <h2 className='font-en-h3'>Olive Branch</h2>
          <Divider className='bg-white' />
          <List component='nav' aria-label='main mailbox folders'>
            {navItems.map((item) => (
              <Link key={item.path} to={`/admin/${item.path}`}>
                <ListItemButton
                  className='list-item'
                  selected={currentPath === item.path}
                >
                  {item.icon}
                  <ListItemText primary={item.label} />
                </ListItemButton>
              </Link>
            ))}
          </List>
        </div>
        <div className='list-footer'>
          <Divider className='bg-white' />
          <List component='nav' aria-label='secondary mailbox folder'>
            <Link to='/products'>
              <ListItemButton>
                <ListItemText primary='返回商品頁' />
              </ListItemButton>
            </Link>
            <ListItemButton onClick={() => logout(token)}>
              <ListItemText primary='登出' />
            </ListItemButton>
          </List>
        </div>
      </Box>
    </>
  );
}
