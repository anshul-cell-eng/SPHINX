import { useQuery } from "@tanstack/react-query";
import { apiClient } from "../lib/api-client";
import type { HealthStatusData, ApiResponse } from "@nexus/contracts";

export type ConnectionStatus = "connected" | "disconnected" | "checking";

export function useHealthCheck() {
  const query = useQuery<ApiResponse<HealthStatusData>, Error>({
    queryKey: ["system-health"],
    queryFn: () => apiClient.get<HealthStatusData>("/health"),
    refetchInterval: 15000, // Poll health every 15s
    retry: 2,
    staleTime: 10000,
  });

  let connectionStatus: ConnectionStatus = "checking";

  if (query.isLoading || query.isFetching && !query.data) {
    connectionStatus = "checking";
  } else if (query.isSuccess && query.data?.data?.status === "healthy") {
    connectionStatus = "connected";
  } else if (query.isError) {
    connectionStatus = "disconnected";
  }

  return {
    ...query,
    connectionStatus,
    healthData: query.data?.data,
  };
}
