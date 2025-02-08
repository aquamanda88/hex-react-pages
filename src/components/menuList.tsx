import * as React from 'react';
import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';
import authService from '../services/api/admin/auth.service';
import Spinners from './spinners';
import { Source } from './icons';

export default function MenuList() {
  const token = sessionStorage.getItem('token') ?? '';
  const [isLoading, setIsLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const navigate = useNavigate();

  const handleListItemClick = (
    _: React.MouseEvent<HTMLDivElement, MouseEvent>,
    index: number
  ) => {
    setSelectedIndex(index);
  };

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
        navigate('/login');
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
            <NavLink to='/admin/products'>
              <ListItemButton
                className='list-item'
                selected={selectedIndex === 0}
                onClick={(event) => handleListItemClick(event, 0)}
              >
                <Source />
                <ListItemText primary='商品總覽' />
              </ListItemButton>
            </NavLink>
            {/* <NavLink to='/admin/orders'>
              <ListItemButton
                className='list-item'
                selected={selectedIndex === 1}
                onClick={(event) => handleListItemClick(event, 1)}
              >
                <Drafts />
                <ListItemText primary='管理訂單' />
              </ListItemButton>
            </NavLink> */}
          </List>
        </div>
        <div className='list-footer'>
          <Divider className='bg-white' />
          <List component='nav' aria-label='secondary mailbox folder'>
            <NavLink to='/products'>
              <ListItemButton>
                <ListItemText primary='返回商品頁' />
              </ListItemButton>
            </NavLink>
            <ListItemButton onClick={() => logout(token)}>
              <ListItemText primary='登出' />
            </ListItemButton>
          </List>
        </div>
      </Box>
    </>
  );
}
