import type { ApiResponse, ApiErrorResponse } from "@nexus/contracts";

export class ApiClientError extends Error {
  public readonly code: string;
  public readonly statusCode: number;
  public readonly details?: unknown;

  constructor(
    message: string,
    statusCode = 500,
    code = "API_REQUEST_FAILED",
    details?: unknown
  ) {
    super(message);
    this.name = "ApiClientError";
    this.statusCode = statusCode;
    this.code = code;
    this.details = details;
  }
}

interface RequestOptions extends Omit<RequestInit, "body"> {
  params?: Record<string, string | number | boolean | undefined>;
  body?: unknown;
}

export class ApiClient {
  private readonly baseUrl: string;

  constructor(baseUrl?: string) {
    // In dev, either use relative /api/v1 (which Vite proxies to http://localhost:4000)
    // or explicit VITE_API_URL if configured.
    this.baseUrl =
      baseUrl ||
      (import.meta.env.VITE_API_URL as string | undefined) ||
      "/api/v1";
  }

  private buildUrl(endpoint: string, params?: RequestOptions["params"]): string {
    const cleanEndpoint = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;
    const base = this.baseUrl.endsWith("/")
      ? this.baseUrl.slice(0, -1)
      : this.baseUrl;

    const url = new URL(`${base}${cleanEndpoint}`, window.location.origin);

    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          url.searchParams.append(key, String(value));
        }
      });
    }

    // If using relative baseUrl, return pathname + search
    if (this.baseUrl.startsWith("/")) {
      return `${url.pathname}${url.search}`;
    }

    return url.toString();
  }

  public async request<T>(
    endpoint: string,
    options: RequestOptions = {}
  ): Promise<ApiResponse<T>> {
    const { params, body, headers = {}, ...rest } = options;
    const url = this.buildUrl(endpoint, params);

    const config: RequestInit = {
      ...rest,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        ...headers,
      },
    };

    if (body !== undefined) {
      config.body = JSON.stringify(body);
    }

    try {
      const response = await fetch(url, config);
      const data = await response.json().catch(() => null);

      if (!response.ok) {
        const errorData = data as ApiErrorResponse | null;
        throw new ApiClientError(
          errorData?.message || `Request failed with HTTP ${response.status}`,
          response.status,
          errorData?.error?.code || "HTTP_ERROR",
          errorData?.error?.details
        );
      }

      return data as ApiResponse<T>;
    } catch (error) {
      if (error instanceof ApiClientError) {
        throw error;
      }

      const errorMessage =
        error instanceof Error ? error.message : "Network error occurred";
      throw new ApiClientError(errorMessage, 0, "NETWORK_ERROR");
    }
  }

  public get<T>(endpoint: string, options?: RequestOptions): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { ...options, method: "GET" });
  }

  public post<T>(
    endpoint: string,
    body?: unknown,
    options?: RequestOptions
  ): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { ...options, method: "POST", body });
  }

  public put<T>(
    endpoint: string,
    body?: unknown,
    options?: RequestOptions
  ): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { ...options, method: "PUT", body });
  }

  public patch<T>(
    endpoint: string,
    body?: unknown,
    options?: RequestOptions
  ): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { ...options, method: "PATCH", body });
  }

  public delete<T>(endpoint: string, options?: RequestOptions): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { ...options, method: "DELETE" });
  }
}

export const apiClient = new ApiClient();
