import { Navigate, Outlet } from "react-router-dom";

export const PrivateRoute = () => {
  const token = sessionStorage.getItem("token");
  return token ? <Outlet /> : <Navigate to="/login" />;
};
