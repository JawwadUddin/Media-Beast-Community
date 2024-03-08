import { ReactNode, useContext } from "react";
import UserContext from "../context/userContext";
import logo from "../assets/logo-icon.gif";

const Navbar = ({ children }: { children: ReactNode }) => {
  const { isLoaded, isSignedIn, user } = useContext(UserContext);
  if (!isLoaded || !isSignedIn) return null;
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: "1rem",
      }}
    >
      <img style={{ width: "60px" }} src={logo} alt="" />
      <div style={{ display: "flex", alignItems: "center" }}>
        <span style={{ marginRight: "1rem" }}>{user?.firstName}</span>
        {children}
      </div>
    </div>
  );
};

export default Navbar;
