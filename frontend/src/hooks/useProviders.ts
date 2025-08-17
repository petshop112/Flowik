import { useQuery } from "@tanstack/react-query";
import { providerService } from "../api/providerService";
import { getUserTokenFromStorage } from "../utils/storage";
import type { ProvidersResponse } from "../types/provider";

export const useGetAllProviders = () => {
  const token = getUserTokenFromStorage();

  return useQuery<ProvidersResponse, Error>({
    queryKey: ["providers"],
    queryFn: () => {
      if (!token) throw new Error("No hay token, no se puede acceder");
      return providerService.getAllProviders(token);
    },
    staleTime: 1000 * 60 * 2,
    retry: 1,
    refetchOnWindowFocus: false,
  });
};
