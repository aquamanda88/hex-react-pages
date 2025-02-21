import { useState } from 'react';
import { Link } from 'react-router';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import { Menu } from './Icons';

type Anchor = 'top' | 'left' | 'bottom' | 'right';

type DrawersProps = {
  /** 下拉選項 */
  dropdownItems: {
    url: string;
    content: string;
  }[];
};

export default function Drawers({ dropdownItems }: DrawersProps) {
  const [state, setState] = useState({
    top: false,
    left: false,
    bottom: false,
    right: false,
  });

  const toggleDrawer =
    (anchor: Anchor, open: boolean) =>
    (event: React.KeyboardEvent | React.MouseEvent) => {
      if (
        event.type === 'keydown' &&
        ((event as React.KeyboardEvent).key === 'Tab' ||
          (event as React.KeyboardEvent).key === 'Shift')
      ) {
        return;
      }

      setState({ ...state, [anchor]: open });
    };

  const list = (anchor: Anchor) => (
    <Box
      sx={{ width: anchor === 'top' || anchor === 'bottom' ? 'auto' : 250 }}
      role='presentation'
      onClick={toggleDrawer(anchor, false)}
      onKeyDown={toggleDrawer(anchor, false)}
    >
      <List className='navbar-dropdown'>
        <ListItem>
          {dropdownItems.map((item, index) => (
            <Link to={item.url} key={index}>
              <ListItemButton>{item.content}</ListItemButton>
            </Link>
          ))}
        </ListItem>
      </List>
    </Box>
  );

  return (
    <>
      <button type='button' className='btn' onClick={toggleDrawer('top', !state.top)}>
        <Menu />
      </button>
      <Drawer
        anchor='top'
        open={state.top}
        onClose={toggleDrawer('top', false)}
      >
        {list('top')}
      </Drawer>
    </>
  );
}
