// import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { createHashRouter, RouterProvider } from 'react-router';
import routes from './routes/index.tsx';
import './styles.scss';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

const router = createHashRouter(routes);

createRoot(document.getElementById('root')!).render(
  <RouterProvider router={router}></RouterProvider>
);
