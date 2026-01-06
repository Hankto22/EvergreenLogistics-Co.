import { api } from './api';

export interface InitializePaymentRequest {
  invoiceId: string;
  email: string;
  amount: number;
}

export interface InitializePaymentResponse {
  authorization_url: string;
  access_code: string;
  reference: string;
}

export interface VerifyPaymentResponse {
  status: boolean;
  message: string;
  data: {
    id: number;
    reference: string;
    amount: number;
    currency: string;
    status: string;
    paid_at?: string;
    created_at?: string;
  };
  invoiceId?: string;
  invoiceStatus?: string;
}

export interface Payment {
  id: string;
  invoiceId: string;
  amount: number | string;
  currency: string;
  status: string;
  reference: string;
  paystackRef?: string | null;
  paymentMethod?: string | null;
  createdAt: string;
  updatedAt?: string | null;
  invoice?: {
    invoiceCode: string;
    status: string;
    amount?: number | string | null;
    currency?: string;
    invoiceUrl?: string | null;
    shipment?: {
      evgCode?: string;
      shipmentCode?: string;
      description?: string | null;
      client?: {
        id: string;
        fullName: string;
        email?: string | null;
        phone?: string | null;
      } | null;
    } | null;
  } | null;
}

export type InvoicePayment = Omit<Payment, 'invoice'>;

export interface InvoiceWithPayments {
  id: string;
  invoiceCode: string;
  amount?: number | string | null;
  currency: string;
  status: string;
  createdAt: string;
  shipment: {
    evgCode?: string;
    description?: string | null;
    clientId: string;
    client?: {
      id: string;
      fullName: string;
      email?: string | null;
      phone?: string | null;
    } | null;
  };
  payments: InvoicePayment[];
}

export interface UpdateInvoicePaymentPayload {
  amount?: number;
  currency?: string;
  paymentMethod?: string;
  action?: 'cancel' | 'update';
}

export const paymentApi = api.injectEndpoints({
  endpoints: (builder) => ({
    initializePayment: builder.mutation<InitializePaymentResponse, InitializePaymentRequest>({
      query: (body) => ({
        url: '/payments/initialize',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Payments', 'Invoice'],
    }),
    verifyPayment: builder.mutation<VerifyPaymentResponse, string>({
      query: (reference) => ({
        url: `/payments/verify/${reference}`,
        method: 'GET',
      }),
      invalidatesTags: ['Payments', 'Invoice'],
    }),
    getPayments: builder.query<Payment[], void>({
      query: () => '/payments',
      providesTags: ['Payments'],
    }),
    getAllInvoices: builder.query<any[], void>({
      query: () => '/payments/invoices',
      providesTags: ['Invoice'],
    }),
    getPaymentsForInvoice: builder.query<Payment[], string>({
      query: (invoiceId) => `/payments/invoice/${invoiceId}`,
      providesTags: (_result, _error, invoiceId) => [
        { type: 'Payments' as const, id: invoiceId },
        { type: 'Invoice' as const, id: invoiceId },
      ],
    }),
    getInvoiceWithPayments: builder.query<InvoiceWithPayments, string>({
      query: (invoiceId) => `/payments/invoice/${invoiceId}/details`,
      providesTags: (_result, _error, invoiceId) => [
        { type: 'Invoice' as const, id: invoiceId },
        { type: 'Payments' as const, id: invoiceId },
      ],
    }),
    updateInvoicePayment: builder.mutation<InvoiceWithPayments, { invoiceId: string; payload: UpdateInvoicePaymentPayload }>({
      query: ({ invoiceId, payload }) => ({
        url: `/payments/invoice/${invoiceId}`,
        method: 'PATCH',
        body: payload,
      }),
      invalidatesTags: (_result, _error, { invoiceId }) => [
        { type: 'Invoice', id: invoiceId },
        { type: 'Payments', id: invoiceId },
      ],
    }),
  }),
});

export const {
  useInitializePaymentMutation,
  useVerifyPaymentMutation,
  useGetPaymentsQuery,
  useGetAllInvoicesQuery,
  useGetPaymentsForInvoiceQuery,
  useGetInvoiceWithPaymentsQuery,
  useUpdateInvoicePaymentMutation,
} = paymentApi;
