import { ReactNode, createContext, useState } from "react";
import useApplications, { Applications } from "../hooks/useApplications";
import useUserApplications from "../hooks/useUserApplications";

type DataContext = {
  applications: Applications[] | null;
  userApplications: Applications[] | null;
  selectedRoom: number | null;
  selectRoom: (roomId: number | null) => void;
  setRefresh: React.Dispatch<React.SetStateAction<boolean>>;
  setUserApplicationsRefresh: React.Dispatch<React.SetStateAction<boolean>>;
};

const DataContext = createContext({} as DataContext);

export const DataProvider = ({ children }: { children: ReactNode }) => {
  const { data: applications, setRefresh } = useApplications();
  const { data: userApplications, setRefresh: setUserApplicationsRefresh } =
    useUserApplications();
  const [selectedRoom, setSelectedRoom] = useState<number | null>(null);
  function selectRoom(roomId: number | null) {
    setSelectedRoom(roomId);
  }
  return (
    <DataContext.Provider
      value={{
        applications,
        userApplications,
        selectedRoom,
        selectRoom,
        setRefresh,
        setUserApplicationsRefresh,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export default DataContext;
