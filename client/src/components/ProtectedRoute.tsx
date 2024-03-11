import { ReactNode, useContext } from "react";
import { Navigate, useParams } from "react-router-dom";
import UserContext from "../context/userContext";
import DataContext from "../context/dataContext";

const ProtectedRoute = ({ children }: { children: ReactNode }) => {
  const { userInfo } = useContext(UserContext);
  const { userApplications } = useContext(DataContext);

  const { roomId } = useParams();

  const isAllowed =
    roomId &&
    userApplications?.find(
      (application) => application.roomId === parseInt(roomId)
    )?.status === "accepted";

  console.log(isAllowed);

  const isAuthorized = userInfo && userInfo.role === "moderator";

  if (isAuthorized || isAllowed) {
    return children;
  } else {
    return <Navigate to="/unauthorised" replace />;
  }
};

export default ProtectedRoute;
