import { useState, useEffect, useContext } from "react";
import axios from "axios";
import UserContext from "../context/userContext";

export type Applications = {
  id: number;
  userId: number;
  roomId: number;
  statusId: number;
  createdAt: Date;
  status: string;
  email: string;
};

const useUserApplications = () => {
  const [loading, setLoading] = useState(true);
  const [refresh, setRefresh] = useState(false);
  const [error, setError] = useState<any>(null);
  const [data, setData] = useState<Applications[]>([]);
  const { userInfo, token } = useContext(UserContext);

  useEffect(() => {
    const source = axios.CancelToken.source();

    const fetchApplications = async () => {
      setRefresh(false);
      try {
        const response = await axios.get<Applications[]>(
          `http://localhost:5000/api/applications/${userInfo.id}`,
          {
            cancelToken: source.token,
            headers: {
              "x-auth-token": token,
            },
          }
        );
        setData(response.data);
      } catch (err) {
        if (axios.isCancel(err)) {
          console.log("Request canceled:", err.message);
        } else {
          setError(err);
        }
      } finally {
        setLoading(false);
      }
    };

    if (userInfo?.role === "user" && token) {
      fetchApplications();
    } else {
      setLoading(false);
    }

    // Cleanup function
    return () => {
      source.cancel("Component unmounted");
    };
  }, [userInfo?.role, refresh, token]);

  return { loading, error, data, setRefresh };
};

export default useUserApplications;
