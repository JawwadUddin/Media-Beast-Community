import { useState, useEffect } from "react";
import axios from "axios";

const useAuth = ({ email }: { email: string }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<any>(null);
  const [data, setData] = useState<any>([]);

  useEffect(() => {
    const source = axios.CancelToken.source();

    const authenticate = async () => {
      try {
        const response = await axios.post(
          "http://localhost:5000/api/auth",
          { email },
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

    authenticate();

    // Cleanup function
    return () => {
      source.cancel("Component unmounted");
    };
  }, []);

  return { loading, error, data };
};

export default useAuth;
