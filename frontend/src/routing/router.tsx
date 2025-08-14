import { createBrowserRouter } from "react-router-dom";
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import Home from "../pages/home/home";
import NotFoundPage from "../pages/NotFoundPage";
// import Layout from "../components/Layout";
import Dashboard from "../pages/Dashboard";
import { PrivateRoute } from "../components/features/PrivateRoute";
import Products from "../pages/products/Products";

const router = createBrowserRouter([
  {
    path: "/",
    // element: <Layout />,
    children: [
      { index: true, element: <Home /> },
      { path: "login", element: <Login /> },
      { path: "register", element: <Register /> },
      { path: "products", element: <Products /> },
      {
        element: <PrivateRoute />,
        children: [{ path: "dashboard", element: <Dashboard /> }],
      },
      { path: "*", element: <NotFoundPage /> },
    ],
  },
]);

export default router;
