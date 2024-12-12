import { Navigate, Outlet } from "react-router-dom";
import { useContext } from "react";
import { UserContext } from "../context/UserContext.js";

const ProtectedRoute = () => {
  const { user, userLoaded } = useContext(UserContext);

  if (!userLoaded) {
    return <div>Loading...</div>;
  }

  if (userLoaded && !user) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
