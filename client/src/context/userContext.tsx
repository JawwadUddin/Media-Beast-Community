import { useUser } from "@clerk/clerk-react";
import { ReactNode, createContext } from "react";
import { UserResource } from "@clerk/types";
import useAuth from "../hooks/useAuth";

type UserContext = {
  isLoaded: boolean;
  isSignedIn: boolean | undefined;
  user: UserResource | null | undefined;
  userInfo: any;
  token: string;
};

const UserContext = createContext({} as UserContext);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const { isLoaded, isSignedIn, user } = useUser();

  let userInfo;
  let token;
  if (user?.emailAddresses[0].emailAddress) {
    const { data } = useAuth({
      email: user?.emailAddresses[0].emailAddress,
    });
    userInfo = data.userInfo;
    token = data.token;
  }

  return (
    <UserContext.Provider
      value={{ isLoaded, isSignedIn, user, userInfo, token }}
    >
      {children}
    </UserContext.Provider>
  );
};

export default UserContext;
