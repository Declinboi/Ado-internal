import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import type { RootState } from "../redux/features/store";

const PrivateRoute = () => {
  const userInfo = useSelector((state: RootState) => state.auth.userInfo);
  if (!userInfo) {
    return <Navigate to="/login" replace />;
  }

  if (!userInfo.is_verified) {
    return <Navigate to="/verify-email" replace />;
  }

  return <Outlet />;
};

export default PrivateRoute;
