import { Navigate } from 'react-router';
import Layout from '../layouts/Layout';
import AdminLayout from '../layouts/AdminLayout';
import {
  AdminOrderDetail,
  AdminOrdersList,
  AdminProductsList,
  AdminCouponsList,
  Cart,
  Checkout,
  FavoritesList,
  Login,
  OrderDetail,
  OrdersList,
  PageNotFound,
  ProductDetail,
  ProductsList,
  CopyrightStatement,
  Week01,
  Week02,
  Week03,
  Week04,
  Week05,
  Home,
} from '../pages/Index';

const routes = [
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        index: true,
        element: <Navigate to='home' replace />,
      },
      {
        path: '/home',
        element: <Home />,
      },
      {
        path: '/copyright-statement',
        element: <CopyrightStatement />,
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
      {
        path: 'favorites',
        element: <FavoritesList />,
      },
      {
        path: 'orders',
        element: <OrdersList />,
      },
      {
        path: 'order/:id',
        element: <OrderDetail />,
      },
    ],
  },
  {
    path: '/admin',
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
      {
        path: 'order/:id',
        element: <AdminOrderDetail />,
      },
      {
        path: 'coupons',
        element: <AdminCouponsList />,
      },
    ],
  },
  {
    path: '/login',
    element: <Login />,
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
    path: '*',
    element: <PageNotFound />,
  },
];

export default routes;
