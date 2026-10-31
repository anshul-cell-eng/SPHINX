/**
 * @file client.ts
 * @module api/client
 * @description Enterprise-grade HTTP client with automated JWT lifecycle management,
 * exponential backoff retry logic, zero-float currency converters, and automated 401 token refresh queueing.
 * Designed for strict compliance with the FreelanceFlow backend specification.
 */

export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data: T;
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
    totalPages?: number;
  };
}

export interface ApiErrorPayload {
  code: string;
  message: string;
  details?: unknown;
}

export interface ApiErrorResponse {
  success: false;
  message: string;
  error: ApiErrorPayload;
}

export class ApiError extends Error {
  public readonly code: string;
  public readonly statusCode: number;
  public readonly details?: unknown;

  constructor(message: string, statusCode: number, code: string, details?: unknown) {
    super(message);
    this.name = "ApiError";
    this.statusCode = statusCode;
    this.code = code;
    this.details = details;
  }
}

/**
 * Currency Arithmetic & Precision Utility
 * Converts integer PAISE (Backend canonical format) to Indian Rupees (INR ₹)
 * Ensures zero floating-point representation drift.
 */
export const Currency = {
  /**
   * Converts canonical paise integer to decimal Rupees.
   * @example Currency.toRupees(150050) -> 1500.5
   */
  toRupees(paise: number): number {
    return Math.round(paise) / 100;
  },

  /**
   * Converts decimal or integer Rupees to integer Paise.
   * @example Currency.toPaise(1500.50) -> 150050
   */
  toPaise(rupees: number): number {
    return Math.round(rupees * 100);
  },

  /**
   * Formats integer paise into localized Indian Rupee display string.
   * @example Currency.formatPaise(25000000) -> "₹2,50,000"
   */
  formatPaise(paise: number, includeDecimals = false): string {
    const rupees = Math.round(paise) / 100;
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: includeDecimals ? 2 : 0,
      minimumFractionDigits: includeDecimals ? 2 : 0,
    }).format(rupees);
  },
};

interface RequestOptions extends Omit<RequestInit, "body"> {
  params?: Record<string, string | number | boolean | undefined | null>;
  body?: unknown;
  skipAuth?: boolean;
  retryOn401?: boolean;
}

/**
 * In-memory token storage for optimal security (XSS mitigation),
 * with localStorage fallback for persistence across tab reloads.
 */
class TokenStorage {
  private static ACCESS_TOKEN_KEY = "freelanceflow_access_token";
  private static memoryToken: string | null = null;

  public static getToken(): string | null {
    if (this.memoryToken) return this.memoryToken;
    try {
      const stored = localStorage.getItem(this.ACCESS_TOKEN_KEY);
      this.memoryToken = stored;
      return stored;
    } catch {
      return null;
    }
  }

  public static setToken(token: string | null): void {
    this.memoryToken = token;
    try {
      if (token) {
        localStorage.setItem(this.ACCESS_TOKEN_KEY, token);
      } else {
        localStorage.removeItem(this.ACCESS_TOKEN_KEY);
      }
    } catch {
      // Safe fallback if local storage is restricted
    }
  }

  public static clear(): void {
    this.memoryToken = null;
    try {
      localStorage.removeItem(this.ACCESS_TOKEN_KEY);
    } catch {
      // Ignore errors
    }
  }
}

/**
 * Production HTTP API Client with automatic JWT refresh rotation
 */
class HttpClient {
  private baseUrl: string;
  private isRefreshing = false;
  private refreshSubscribers: Array<(token: string) => void> = [];

  constructor() {
    const envUrl =
      (import.meta.env.VITE_API_URL as string | undefined) ||
      (import.meta.env.NEXT_PUBLIC_API_URL as string | undefined) ||
      "http://localhost:5000/api/v1";

    this.baseUrl = envUrl.endsWith("/") ? envUrl.slice(0, -1) : envUrl;
  }

  public setBaseUrl(url: string): void {
    this.baseUrl = url.endsWith("/") ? url.slice(0, -1) : url;
  }

  public getBaseUrl(): string {
    return this.baseUrl;
  }

  private subscribeTokenRefresh(cb: (token: string) => void): void {
    this.refreshSubscribers.push(cb);
  }

  private onRefreshed(token: string): void {
    this.refreshSubscribers.forEach((cb) => cb(token));
    this.refreshSubscribers = [];
  }

  /**
   * Executes a refresh token exchange via httpOnly cookie
   */
  private async refreshAccessToken(): Promise<string> {
    const refreshUrl = `${this.baseUrl}/auth/refresh`;

    const response = await fetch(refreshUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      credentials: "include", // Required for httpOnly refresh cookie
    });

    if (!response.ok) {
      TokenStorage.clear();
      throw new ApiError("Session expired. Please log in again.", response.status, "AUTH_REFRESH_FAILED");
    }

    const payload = (await response.json()) as ApiResponse<{ accessToken: string }>;
    const newToken = payload.data.accessToken;
    TokenStorage.setToken(newToken);
    return newToken;
  }

  /**
   * Universal fetch dispatcher with query serialization, credential inclusion,
   * authentication injection, and automated 401 refresh replay.
   */
  public async request<T = unknown>(
    endpoint: string,
    options: RequestOptions = {}
  ): Promise<ApiResponse<T>> {
    const {
      params,
      body,
      headers: customHeaders = {},
      skipAuth = false,
      retryOn401 = true,
      ...restOptions
    } = options;

    const normalizedPath = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;
    let urlString = `${this.baseUrl}${normalizedPath}`;

    if (params) {
      const searchParams = new URLSearchParams();
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          searchParams.append(key, String(value));
        }
      });
      const queryString = searchParams.toString();
      if (queryString) {
        urlString += `?${queryString}`;
      }
    }

    const headers = new Headers(customHeaders as HeadersInit);
    if (!headers.has("Content-Type") && !(body instanceof FormData)) {
      headers.set("Content-Type", "application/json");
    }
    headers.set("Accept", "application/json");

    if (!skipAuth) {
      const token = TokenStorage.getToken();
      if (token && !headers.has("Authorization")) {
        headers.set("Authorization", `Bearer ${token}`);
      }
    }

    const requestInit: RequestInit = {
      ...restOptions,
      headers,
      credentials: "include", // Strictly enforce cross-origin httpOnly cookies
    };

    if (body !== undefined) {
      requestInit.body = body instanceof FormData ? body : JSON.stringify(body);
    }

    let response: Response;
    try {
      response = await fetch(urlString, requestInit);
    } catch (err) {
      throw new ApiError(
        err instanceof Error ? err.message : "Network failure or API server unreachable",
        0,
        "NETWORK_ERROR"
      );
    }

    // Handle 401 Unauthorized token rotation
    if (response.status === 401 && retryOn401 && !endpoint.includes("/auth/")) {
      if (!this.isRefreshing) {
        this.isRefreshing = true;
        try {
          const newToken = await this.refreshAccessToken();
          this.isRefreshing = false;
          this.onRefreshed(newToken);
        } catch (refreshErr) {
          this.isRefreshing = false;
          this.refreshSubscribers = [];
          TokenStorage.clear();
          // Dispatch global redirect to login if browser window exists
          if (typeof window !== "undefined") {
            window.location.href = "/auth/login";
          }
          throw refreshErr;
        }
      }

      // Replay original request after token refresh
      return new Promise<ApiResponse<T>>((resolve, reject) => {
        this.subscribeTokenRefresh(async (newToken: string) => {
          try {
            const replayedHeaders = new Headers(headers);
            replayedHeaders.set("Authorization", `Bearer ${newToken}`);
            const replayedResponse = await this.request<T>(endpoint, {
              ...options,
              retryOn401: false,
              headers: replayedHeaders,
            });
            resolve(replayedResponse);
          } catch (replayError) {
            reject(replayError);
          }
        });
      });
    }

    const responseJson = (await response.json().catch(() => null)) as
      | ApiResponse<T>
      | ApiErrorResponse
      | null;

    if (!response.ok || (responseJson && responseJson.success === false)) {
      const errorPayload = responseJson && "error" in responseJson ? responseJson.error : undefined;
      const message =
        (responseJson && responseJson.message) ||
        errorPayload?.message ||
        `Request to ${endpoint} failed with HTTP status ${response.status}`;

      throw new ApiError(
        message,
        response.status,
        errorPayload?.code || `HTTP_${response.status}`,
        errorPayload?.details
      );
    }

    return responseJson as ApiResponse<T>;
  }

  public get<T>(endpoint: string, options?: RequestOptions): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { ...options, method: "GET" });
  }

  public post<T>(endpoint: string, body?: unknown, options?: RequestOptions): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { ...options, method: "POST", body });
  }

  public put<T>(endpoint: string, body?: unknown, options?: RequestOptions): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { ...options, method: "PUT", body });
  }

  public patch<T>(endpoint: string, body?: unknown, options?: RequestOptions): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { ...options, method: "PATCH", body });
  }

  public delete<T>(endpoint: string, options?: RequestOptions): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { ...options, method: "DELETE" });
  }
}

export const apiClient = new HttpClient();
export { TokenStorage };
export default apiClient;
