import { useState, useEffect, useContext } from "react";
import axios from "axios";
import UserContext from "../context/userContext";

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
  const { token } = useContext(UserContext);

  useEffect(() => {
    const source = axios.CancelToken.source();

    const fetchRooms = async () => {
      try {
        const response = await axios.get<Rooms[]>(
          "http://localhost:5000/api/rooms",
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

    if (token) {
      fetchRooms();
    }

    // Cleanup function
    return () => {
      source.cancel("Component unmounted");
    };
  }, [token]);

  return { loading, error, data };
};

export default useRooms;
