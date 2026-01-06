import { api } from './api';

export interface ShipmentResponse {
  Id: string;
  ShipmentCode: string;
  EVGCode: string;
  BillOfLading?: string;
  ContainerNumber?: string;
  ClientId: string;
  AssignedStaffId?: string;
  Description?: string;
  OriginCity?: string;
  OriginCountry?: string;
  DestinationCity?: string;
  DestinationCountry?: string;
  TransportMode?: string;
  Status: string;
  ProgressPercent: number;
  EstimatedDeliveryDate?: string;
  CreatedAt?: string;
  UpdatedAt?: string;
  client?: { fullName: string };
  containers?: ContainerResponse[];
}

export interface ContainerResponse {
  containerNumber: string;
  status: string;
  trackingEvents: TrackingEventResponse[];
}

export interface TrackingEventResponse {
  status: string;
  eventTime: string;
  location?: string;
  notesCustomer?: string;
  isCustomerVisible: boolean;
}

export interface CreateTrackingEventRequest {
  status: string;
  eventTime?: string;
  location?: string;
  notesCustomer?: string;
  notesInternal?: string;
  attachments?: any[];
  notifyCustomer?: boolean;
}

export interface TrackingEvent {
  id: string;
  containerId: string;
  status: string;
  eventTime: string;
  location?: string;
  notesCustomer?: string;
  notesInternal?: string;
  attachments?: any;
  source: string;
  createdAt: string;
  createdBy: string;
  isCustomerVisible: boolean;
  previousStatus?: string;
}

export interface Notification {
  id: string;
  userId: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

export interface CreateNotificationPayload {
  userId: string;
  message: string;
}

export interface DashboardStats {
  assignedShipments: number;
  completedToday: number;
  pendingTasks: number;
  urgentTasks: number;
}

export interface AdminDashboardData {
  totalShipments: number;
  activeShipments: number;
  totalClients: number;
  totalRevenue: number;
}

export interface UserDashboardData {
  totalShipments: number;
  activeShipments: number;
  completedShipments: number;
  totalSpent: number;
}

export interface MediaUpload {
  id: string;
  uploadedBy?: string;
  mediaUrl?: string;
  mediaType?: string;
  cloudinaryPublicId?: string;
  createdAt: string;
}

export interface UploadMediaRequest {
  file: File;
  mediaType: 'image' | 'video' | 'document';
}

export interface UpdateShipmentRequest {
  shipmentCode?: string;
  evgCode?: string;
  billOfLading?: string;
  containerNumber?: string;
  assignedStaffId?: string;
  description?: string;
  originCity?: string;
  originCountry?: string;
  destinationCity?: string;
  destinationCountry?: string;
  transportMode?: string;
  status?: string;
  progressPercent?: number;
  estimatedDeliveryDate?: string;
}

export const shipmentApi = api.injectEndpoints({
  endpoints: (builder) => ({
    // Get all shipments with optional search
    getShipments: builder.query<ShipmentResponse[], { search?: string }>({
      query: (params) => ({
        url: '/shipments',
        params,
      }),
      providesTags: ['Shipment'],
    }),

    // Public tracking by EVG code
    getShipmentByEvgCode: builder.query<ShipmentResponse, string>({
      query: (evgCode) => `/shipments/evg/${evgCode}`,
      providesTags: ['Shipment'],
    }),

    // Get shipment by ID
    getShipmentById: builder.query<ShipmentResponse, string>({
      query: (id) => `/shipments/${id}`,
      providesTags: ['Shipment'],
    }),

    // Create tracking event (staff only)
    createTrackingEvent: builder.mutation<TrackingEvent, { containerId: string; data: CreateTrackingEventRequest }>({
      query: ({ containerId, data }) => ({
        url: `/containers/${containerId}/tracking-events`,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Shipment'],
    }),

    // Get tracking events for container
    getTrackingEvents: builder.query<TrackingEvent[], string>({
      query: (containerId) => `/containers/${containerId}/tracking-events`,
      providesTags: ['TrackingEvents'],
    }),

    // Get allowed next statuses for container
    getAllowedNextStatuses: builder.query<string[], string>({
      query: (containerId) => `/containers/${containerId}/allowed-next-statuses`,
      providesTags: ['ContainerStatus'],
    }),

    // Get notifications for user
    getNotifications: builder.query<Notification[], void>({
      query: () => '/notifications',
      providesTags: ['Notifications'],
    }),

    // Mark notification as read
    markNotificationAsRead: builder.mutation<boolean, string>({
      query: (id) => ({
        url: `/notifications/${id}/read`,
        method: 'PATCH',
      }),
      invalidatesTags: ['Notifications'],
    }),

    createNotification: builder.mutation<Notification, CreateNotificationPayload>({
      query: (body) => ({
        url: '/notifications',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Notifications'],
    }),

    deleteNotification: builder.mutation<boolean, string>({
      query: (id) => ({
        url: `/notifications/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Notifications'],
    }),

    // Get staff dashboard stats
    getStaffDashboard: builder.query<DashboardStats, void>({
      query: () => '/dashboard/staff',
      providesTags: ['Shipment'],
    }),

    // Get user uploads
    getUserUploads: builder.query<MediaUpload[], void>({
      query: () => '/uploads',
      providesTags: ['Uploads'],
    }),

    uploadMedia: builder.mutation<MediaUpload, UploadMediaRequest>({
      query: ({ file, mediaType }) => {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('mediaType', mediaType);
        return {
          url: '/uploads',
          method: 'POST',
          body: formData,
        };
      },
      invalidatesTags: ['Uploads'],
    }),

    // Get admin dashboard stats
    getAdminDashboard: builder.query<AdminDashboardData, void>({
      query: () => '/dashboard/admin',
      providesTags: ['Shipment'],
    }),

    // Get user dashboard stats
    getUserDashboard: builder.query<UserDashboardData, void>({
      query: () => '/dashboard/user',
      providesTags: ['Shipment'],
    }),

    // Get user shipments
    getUserShipments: builder.query<ShipmentResponse[], void>({
      query: () => '/dashboard/user/shipments',
      providesTags: ['Shipment'],
    }),

    // Get user invoices
    getUserInvoices: builder.query<any[], void>({
      query: () => '/shipments/user/invoices',
      providesTags: (result) =>
        result
          ? [
              ...result.map((inv: any) => ({ type: 'Invoice' as const, id: inv.id })),
              'Invoice',
            ]
          : ['Invoice'],
    }),

    // Create shipment
    createShipment: builder.mutation<ShipmentResponse, {
      shipmentCode: string;
      evgCode?: string;
      billOfLading?: string;
      containerNumber?: string;
      clientId: string;
      assignedStaffId?: string;
      description?: string;
      originCity?: string;
      originCountry?: string;
      destinationCity?: string;
      destinationCountry?: string;
      transportMode?: string;
      status?: string;
      progressPercent?: number;
      estimatedDeliveryDate?: string;
    }>({
      query: (data) => ({
        url: '/shipments',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Shipment'],
    }),

    updateShipment: builder.mutation<ShipmentResponse, { id: string; data: UpdateShipmentRequest }>({
      query: ({ id, data }) => ({
        url: `/shipments/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['Shipment'],
    }),

    deleteShipment: builder.mutation<{ message?: string }, string>({
      query: (id) => ({
        url: `/shipments/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Shipment'],
    }),
  }),
});

export const {
  useGetShipmentsQuery,
  useGetShipmentByEvgCodeQuery,
  useGetShipmentByIdQuery,
  useCreateTrackingEventMutation,
  useGetTrackingEventsQuery,
  useGetAllowedNextStatusesQuery,
  useGetNotificationsQuery,
  useMarkNotificationAsReadMutation,
  useCreateNotificationMutation,
  useDeleteNotificationMutation,
  useGetStaffDashboardQuery,
  useGetUserUploadsQuery,
  useGetAdminDashboardQuery,
  useGetUserDashboardQuery,
  useGetUserShipmentsQuery,
  useGetUserInvoicesQuery,
  useCreateShipmentMutation,
  useUpdateShipmentMutation,
  useDeleteShipmentMutation,
  useUploadMediaMutation,
} = shipmentApi;
