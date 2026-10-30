export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface ApiErrorDetail {
  field?: string;
  message: string;
  code?: string;
}

export interface ApiErrorResponse {
  success: false;
  message: string;
  error: {
    code: string;
    details?: ApiErrorDetail[] | unknown;
  };
  timestamp?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  meta?: PaginationMeta;
}

export interface HealthStatusData {
  status: "healthy" | "degraded" | "unhealthy";
  timestamp: string;
  services: {
    database: { status: string; latencyMs?: number };
    redis?: { status: string };
    api: { status: string; uptime: number };
  };
}
