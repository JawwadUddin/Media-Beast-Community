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

const useApplications = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<any>(null);
  const [data, setData] = useState<Applications[]>([]);
  const { userInfo } = useContext(UserContext);

  useEffect(() => {
    const source = axios.CancelToken.source();

    const fetchApplications = async () => {
      try {
        const response = await axios.get<Applications[]>(
          "http://localhost:5000/api/applications",
          {
            cancelToken: source.token,
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

    if (userInfo?.role === "moderator") {
      fetchApplications();
    } else {
      setLoading(false);
    }

    // Cleanup function
    return () => {
      source.cancel("Component unmounted");
    };
  }, [userInfo?.role]);

  return { loading, error, data };
};

export default useApplications;
