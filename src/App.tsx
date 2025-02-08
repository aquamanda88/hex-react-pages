import { Route, Routes, useLocation } from 'react-router';
import { Navbar, Footer } from './components';
import {
  Cart,
  Checkout,
  Home,
  PageNotFound,
  ProductDetail,
  ProductsList,
  Week01,
  Week02,
  Week03,
  Week04,
  Week05,
  Week06,
  Week07,
  Week08,
} from './pages';

const Layout = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();

  const showNavbarFooter = location.pathname !== '/pageNotFound';

  return (
    <div>
      {showNavbarFooter && <Navbar />}
      {children}
      {showNavbarFooter && <Footer />}
    </div>
  );
};


function App() {
  return (
    <>
      <Layout>
        <Routes>
          <Route index element={<Home />} />
          <Route path='/week01' element={<Week01 />} />
          <Route path='/week02' element={<Week02 />} />
          <Route path='/week03' element={<Week03 />} />
          <Route path='/week04' element={<Week04 />} />
          <Route path='/week05' element={<Week05 />} />
          <Route path='/week06' element={<Week06 />} />
          <Route path='/week07' element={<Week07 />} />
          <Route path='/week08' element={<Week08 />} />
          <Route path='/products' element={<ProductsList />} />
          <Route path='/product/:id' element={<ProductDetail />} />
          <Route path='/cart' element={<Cart />} />
          <Route path='/checkout' element={<Checkout />} />
          <Route path='/checkout/:id' element={<Checkout activeStep={2} />} />
          <Route path="*" element={<PageNotFound />} />
        </Routes>
      </Layout>
    </>
  );
}

export default App;
