import { createBrowserRouter } from 'react-router-dom';
import Login from '../pages/auth/Login';
import Register from '../pages/auth/Register';
import Home from '../pages/home/home';
import NotFoundPage from '../pages/notfound/NotFoundPage';
import ClientsPage from '../pages/clients/Clients';
import { PrivateRoute } from '../components/features/PrivateRoute';
import Products from '../pages/products/Products';
import RecoverPassword from '../pages/auth/RecoverPassword';
import VerifyEmail from '../pages/auth/VerifyEmail';
import NewPassword from '../pages/auth/NewPassword';
import PasswordReset from '../pages/auth/PasswordReset';
import DashboardLayoutRoute from '../components/ui/layout/DashboardLayoutRoute';
import ProvidersPage from '../pages/providers/Providers';

const router = createBrowserRouter([
  {
    path: '/',
    children: [
      {
        element: <PrivateRoute />,
        children: [
          {
            element: <DashboardLayoutRoute />,
            children: [
              { index: true, element: <Home /> },
              { path: 'products', element: <Products /> },
              { path: 'clients', element: <ClientsPage /> },
              { path: 'providers', element: <ProvidersPage /> },
            ],
          },
        ],
      },
      { path: 'login', element: <Login /> },
      { path: 'register', element: <Register /> },
      { path: 'recover-password', element: <RecoverPassword /> },
      { path: 'verify-email', element: <VerifyEmail /> },
      { path: 'new-password', element: <NewPassword /> },
      { path: 'password-reset', element: <PasswordReset /> },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
]);

export default router;
