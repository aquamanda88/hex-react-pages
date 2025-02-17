import { Outlet } from 'react-router';
import { Footer, Navbar, Toast } from '../components/Index';


export default function Layout() { 
  return (
    <>
      <Navbar />
      <Outlet />
      <Footer />
      <Toast />
    </>
  );
}
