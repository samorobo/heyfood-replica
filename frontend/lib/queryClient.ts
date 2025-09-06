import { QueryClient, QueryFunctionContext } from "@tanstack/react-query";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000/api";

async function throwIfResNotOk(res: Response) {
  if (!res.ok) {
    let errorMessage = `${res.status}: ${res.statusText}`;
    try {
      const errorData = await res.json();
      errorMessage = errorData.message || errorMessage;
    } catch {
      // fallback if parsing fails
    }
    throw new Error(errorMessage);
  }
}

export async function apiRequest(
  endpoint: string,
  options: RequestInit = {}
): Promise<any> {
  const url = endpoint.startsWith("http")
    ? endpoint
    : `${API_BASE_URL}${endpoint}`;

  const res = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    ...options,
  });

  await throwIfResNotOk(res);
  return await res.json();
}

// Custom query function with correct typing
const customQueryFn = async ({ queryKey }: QueryFunctionContext) => {
  const [endpoint, ...params] = queryKey as [string, ...any[]];
  let url = endpoint;

  // Handle query parameters for restaurants
  if (endpoint === "/restaurants" && params.length > 0) {
    const [search, tags, sort] = params;
    const searchParams = new URLSearchParams();

    if (typeof search === "string" && search.trim()) {
      searchParams.set("search", search.trim());
    }

    if (typeof tags === "string" && tags.trim()) {
      searchParams.set("tags", tags.trim());
    }

    if (typeof sort === "string" && sort !== "Most Popular") {
      searchParams.set("sort", sort);
    }

    if (searchParams.toString()) {
      url += `?${searchParams.toString()}`;
    }
  }

  const response = await apiRequest(url);
  return response.data;
};

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: customQueryFn,
      refetchOnWindowFocus: false,
      refetchInterval: false,
      staleTime: 2 * 60 * 1000, // 2 minutes
      retry: (failureCount, error: any) => {
        // Don’t retry on 4xx errors
        if (error?.message?.startsWith("4")) return false;
        return failureCount < 3;
      },
    },
    mutations: {
      retry: false,
    },
  },
});
