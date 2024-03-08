import { useUser } from "@clerk/clerk-react";
import { ReactNode, createContext } from "react";
import { UserResource } from "@clerk/types";

type UserContext = {
  isLoaded: boolean;
  isSignedIn: boolean | undefined;
  user: UserResource | null | undefined;
};

const UserContext = createContext({} as UserContext);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const { isLoaded, isSignedIn, user } = useUser();

  return (
    <UserContext.Provider value={{ isLoaded, isSignedIn, user }}>
      {children}
    </UserContext.Provider>
  );
};

export default UserContext;
