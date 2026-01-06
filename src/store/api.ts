import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { BaseQueryFn, FetchArgs, FetchBaseQueryError } from "@reduxjs/toolkit/query";

// Wrap the default baseQuery to unwrap the `{ data: ... }` envelope returned by the backend
const rawBaseQuery = fetchBaseQuery({
  baseUrl: "/api",
  prepareHeaders: (headers, { getState }) => {
    const state = getState() as { auth?: { token?: string | null } };
    const token = state.auth?.token ?? localStorage.getItem("token");
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
    return headers;
  }
});

const baseQuery: BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError> = async (
  args,
  api,
  extraOptions
) => {
  const result = await rawBaseQuery(args, api, extraOptions);

  if (result.data && typeof result.data === "object" && result.data !== null && "data" in result.data) {
    return { ...result, data: (result.data as any).data };
  }

  return result;
};

export const api = createApi({
  reducerPath: "api",
  baseQuery,
  tagTypes: ["Gallery", "Shipment", "TrackingEvents", "ContainerStatus", "Notifications", "Uploads", "Users", "Invoice", "Payments"],
  endpoints: () => ({})
});
