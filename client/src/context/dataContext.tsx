import { ReactNode, createContext, useState } from "react";
import useApplications, { Applications } from "../hooks/useApplications";

type DataContext = {
  applications: Applications[] | null;
  selectedRoom: number | null;
  selectRoom: (roomId: number | null) => void;
  setRefresh: React.Dispatch<React.SetStateAction<boolean>>;
};

const DataContext = createContext({} as DataContext);

export const DataProvider = ({ children }: { children: ReactNode }) => {
  const { data: applications, setRefresh } = useApplications();
  const [selectedRoom, setSelectedRoom] = useState<number | null>(null);
  function selectRoom(roomId: number | null) {
    setSelectedRoom(roomId);
  }
  return (
    <DataContext.Provider
      value={{ applications, selectedRoom, selectRoom, setRefresh }}
    >
      {children}
    </DataContext.Provider>
  );
};

export default DataContext;
