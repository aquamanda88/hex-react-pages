import { Routes, Route } from 'react-router-dom';
import { Navbar, Footer } from './components';
import {
  Cart,
  Checkout,
  Home,
  ProductDetail,
  Week01,
  Week02,
  Week03,
  Week04,
  Week05,
  Week06,
  Week07,
  Week08,
} from './pages';

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route index element={<Home />}></Route>
        <Route path='/week01' element={<Week01 />}></Route>
        <Route path='/week02' element={<Week02 />}></Route>
        <Route path='/week03' element={<Week03 />}></Route>
        <Route path='/week04' element={<Week04 />}></Route>
        <Route path='/week05' element={<Week05 />}></Route>
        <Route path='/week06' element={<Week06 />}></Route>
        <Route path='/week07' element={<Week07 />}></Route>
        <Route path='/week08' element={<Week08 />}></Route>
        <Route path="/product/:id" element={<ProductDetail />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
      </Routes>
      <Footer></Footer>
    </>
  );
}

export default App;
