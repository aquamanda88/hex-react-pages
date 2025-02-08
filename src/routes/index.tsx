import { Navigate } from 'react-router';
import Layout from '../layouts/layout';
import AdminLayout from '../layouts/adminLayout';
import Home from '../pages/home';
import {
  AdminProductsList,
  Cart,
  Checkout,
  Login,
  PageNotFound,
  ProductDetail,
  ProductsList,
  Week01,
  Week02,
  Week03,
  Week04,
  Week05,
  Week06,
} from '../pages';
import AdminOrdersList from '../pages/admin/ordersList';

const routes = [
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        index: true,
        element: <Navigate to='products' replace />,
      },
      {
        path: 'products',
        element: <ProductsList />,
      },
      {
        path: 'product/:id',
        element: <ProductDetail />,
      },
      {
        path: 'cart',
        element: <Cart />,
      },
      {
        path: 'checkout',
        element: <Checkout />,
      },
      {
        path: 'checkout/:id',
        element: <Checkout activeStep={2} />,
      },
    ],
  },
  {
    path: '/dashboard',
    element: <AdminLayout />,
    children: [
      {
        index: true,
        element: <Navigate to='products' replace />,
      },
      {
        path: 'products',
        element: <AdminProductsList />,
      },
      {
        path: 'orders',
        element: <AdminOrdersList />,
      },
    ],
  },
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/component',
    element: <Home />,
  },
  {
    path: '/week01',
    element: <Week01 />,
  },
  {
    path: '/week02',
    element: <Week02 />,
  },
  {
    path: '/week03',
    element: <Week03 />,
  },
  {
    path: '/week04',
    element: <Week04 />,
  },
  {
    path: '/week05',
    element: <Week05 />,
  },
  {
    path: '/week06',
    element: <Week06 />,
  },
  {
    path: '*',
    element: <PageNotFound />,
  },
];

export default routes;
