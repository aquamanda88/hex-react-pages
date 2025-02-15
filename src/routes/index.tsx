import { Navigate } from 'react-router';
import Layout from '../layouts/Layout';
import AdminLayout from '../layouts/AdminLayout';
import Home from '../pages/Home';
import {
  AdminProductsList,
  Cart,
  Checkout,
  FavoritesList,
  Login,
  PageNotFound,
  ProductDetail,
  ProductsList,
  Week01,
  Week02,
  Week03,
  Week04,
  Week05,
} from '../pages/Index';
import AdminOrdersList from '../pages/admin/OrdersList';

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
      {
        path: 'favorites',
        element: <FavoritesList />,
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
    path: '*',
    element: <PageNotFound />,
  },
];

export default routes;
