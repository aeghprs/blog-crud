import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";

import { getCurrentUser } from "api/auth.api";

import { useAuthStore } from "store/authStore";

export const useFetchUser = () => {
  const setUser = useAuthStore((state) => state.setUser);

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["me"],
    queryFn: getCurrentUser,
    enabled: false,
  });

  useEffect(() => {
    if (!data) return;

    if (data.success) {
      setUser(data?.data?.user ?? data?.data ?? null);
    }
  }, [data, setUser]);

  return { data, isLoading, isError, refetch };
};
