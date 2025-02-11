import { Outlet } from 'react-router';
import { Footer, Navbar } from '../components';


export default function Layout() { 
  return (
    <>
      <Navbar />
      <Outlet />
      <Footer />
    </>
  );
}
