import { useState, useEffect } from "react";
import axios from "axios";

export type Applications = {
  id: number;
  userId: number;
  statusId: number;
  createdAt: Date;
  status: string;
};

const useApplications = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<any>(null);
  const [data, setData] = useState<Applications[]>([]);

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

    fetchApplications();

    // Cleanup function
    return () => {
      source.cancel("Component unmounted");
    };
  }, []);

  return { loading, error, data };
};

export default useApplications;
