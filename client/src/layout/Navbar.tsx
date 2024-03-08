import { ReactNode, useContext } from "react";
import UserContext from "../context/userContext";

const Navbar = ({ children }: { children: ReactNode }) => {
  const { isLoaded, isSignedIn, user } = useContext(UserContext);
  if (!isLoaded || !isSignedIn) return null;
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "flex-end",
        marginBottom: "1rem",
      }}
    >
      <span style={{ marginRight: "1rem" }}>{user?.firstName}</span>
      {children}
    </div>
  );
};

export default Navbar;
