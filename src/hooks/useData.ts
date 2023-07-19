import { useEffect, useState } from "react";
import { Response } from "../interfaces/response.ts";
import apiClient from "../services/api-client.ts";
import { CanceledError } from "axios";

const useData = <T>(url: string) => {
  const [data, setData] = useState<T[]>([]);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    setIsLoading(true);

    apiClient
      .get<Response<T>>(url, { signal: controller.signal })
      .then((response) => {
        setIsLoading(false);
        setData(response.data.results);
      })
      .catch((error) => {
        if (error instanceof CanceledError) return;
        setError(error.message);
        setIsLoading(false);
      });

    return () => controller.abort();
  }, []);

  return { data, error, isLoading };
};

export default useData;
