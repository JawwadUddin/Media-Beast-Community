import { ReactNode, createContext } from "react";
import useApplications, { Applications } from "../hooks/useApplications";

type DataContext = {
  applications: Applications[] | null;
};

const DataContext = createContext({} as DataContext);

export const DataProvider = ({ children }: { children: ReactNode }) => {
  const { data: applications } = useApplications();
  return (
    <DataContext.Provider value={{ applications }}>
      {children}
    </DataContext.Provider>
  );
};

export default DataContext;
