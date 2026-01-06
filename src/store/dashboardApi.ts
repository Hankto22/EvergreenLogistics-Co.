import { api } from './api';

interface AdminDashboardData {
  totalShipments: number;
  activeShipments: number;
  totalClients: number;
  totalRevenue: number;
}

interface RecentOrder {
  id: string;
  shipmentCode: string;
  client: string;
  status: string;
  time: string;
}

export const dashboardApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getAdminDashboard: builder.query<AdminDashboardData, void>({
      query: () => '/dashboard/admin',
      providesTags: ['Shipment'],
    }),
    getRecentOrders: builder.query<RecentOrder[], number>({
      query: (limit = 5) => `/dashboard/recent-orders?limit=${limit}`,
      providesTags: ['Shipment'],
    }),
  }),
});

export const {
  useGetAdminDashboardQuery,
  useGetRecentOrdersQuery,
} = dashboardApi;