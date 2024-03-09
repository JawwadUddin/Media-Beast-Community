import { useState, useEffect } from "react";
import axios from "axios";

type Rooms = {
  id: number;
  name: string;
  description: string;
  img: string;
};

const useRooms = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<any>(null);
  const [data, setData] = useState<Rooms[]>([]);

  useEffect(() => {
    const source = axios.CancelToken.source();

    const fetchRooms = async () => {
      try {
        const response = await axios.get<Rooms[]>(
          "http://localhost:5000/rooms",
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

    fetchRooms();

    // Cleanup function
    return () => {
      source.cancel("Component unmounted");
    };
  }, []);

  return { loading, error, data };
};

export default useRooms;