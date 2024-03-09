import { useUser } from "@clerk/clerk-react";
import { ReactNode, createContext } from "react";
import { UserResource } from "@clerk/types";
import useAuth from "../hooks/useAuth";

type UserContext = {
  isLoaded: boolean;
  isSignedIn: boolean | undefined;
  user: UserResource | null | undefined;
  userInfo: any;
};

const UserContext = createContext({} as UserContext);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const { isLoaded, isSignedIn, user } = useUser();

  let userInfo;

  if (user?.emailAddresses[0].emailAddress) {
    const { data } = useAuth({
      email: user?.emailAddresses[0].emailAddress,
    });
    userInfo = data;
  }

  return (
    <UserContext.Provider value={{ isLoaded, isSignedIn, user, userInfo }}>
      {children}
    </UserContext.Provider>
  );
};

export default UserContext;
