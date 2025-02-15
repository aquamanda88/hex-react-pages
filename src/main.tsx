// import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { createHashRouter, RouterProvider } from 'react-router';
import { Provider } from 'react-redux';
import routes from './routes/Index.tsx';
import './styles.scss';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import store from './store.ts';

const router = createHashRouter(routes);

createRoot(document.getElementById('root')!).render(
  <Provider store={store}>
    <RouterProvider router={router}></RouterProvider>
  </Provider>
);
