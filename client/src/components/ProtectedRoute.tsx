import { ReactNode, useContext } from "react";
import { Navigate } from "react-router-dom";
import UserContext from "../context/userContext";

const ProtectedRoute = ({ children }: { children: ReactNode }) => {
  const { userInfo } = useContext(UserContext);

  const isAuthorized = userInfo && userInfo.role === "moderator";

  if (!isAuthorized) {
    return <Navigate to="/unauthorised" replace />;
  }
  return children;
};

export default ProtectedRoute;
