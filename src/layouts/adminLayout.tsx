import { Outlet } from 'react-router';
import { MenuList } from '../components';

export default function AdminLayout() {
  return (
    <div className='admin-layout container-fluid'>
      <div className='row'>
        <div className='col-2 ps-0'>
          <MenuList />
        </div>
        <div className='col-10 vh-100'>
          <Outlet />
        </div>
      </div>
    </div>
  );
}
