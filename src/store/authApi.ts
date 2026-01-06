import { api } from './api';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  user: {
    id: string;
    email: string;
    fullName: string;
    company?: string | null;
    phone?: string | null;
    role: 'super_admin' | 'staff' | 'client';
  };
  token: string;
}

export interface MeResponse {
  id: string;
  email: string;
  fullName: string;
  company?: string | null;
  phone?: string | null;
  role: 'super_admin' | 'staff' | 'client';
}

export interface UserResponse {
  id: string;
  email: string;
  fullName: string;
  company?: string | null;
  phone?: string | null;
  role: 'super_admin' | 'staff' | 'client';
  createdAt: string;
  isActive?: boolean;
}

export interface CreateUserRequest {
  fullName: string;
  email: string;
  password: string;
  role: 'super_admin' | 'staff' | 'client';
  phone?: string | null;
  company?: string | null;
}

export interface UpdateUserAdminRequest {
  id: string;
  fullName: string;
  email: string;
  phone?: string | null;
  company?: string | null;
}

export const authApi = api.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<LoginResponse, LoginRequest>({
      query: (credentials) => ({
        url: '/auth/login',
        method: 'POST',
        body: credentials,
      }),
    }),
    me: builder.query<MeResponse, void>({
      query: () => '/auth/me',
    }),
    updateMe: builder.mutation<MeResponse, { fullName: string; email: string; phone?: string | null }>({
      query: (data) => ({
        url: '/users/me',
        method: 'PUT',
        body: data,
      }),
    }),
    changePassword: builder.mutation<{ message: string }, { currentPassword: string; newPassword: string }>({
      query: (data) => ({
        url: '/auth/change-password',
        method: 'PUT',
        body: data,
      }),
    }),

    // Get all users (admin only)
    getUsers: builder.query<UserResponse[], void>({
      query: () => '/users',
      providesTags: ['Users'],
    }),

    createUser: builder.mutation<LoginResponse, CreateUserRequest>({
      query: (payload) => ({
        url: '/auth/register',
        method: 'POST',
        body: {
          email: payload.email,
          password: payload.password,
          fullName: payload.fullName,
          role: payload.role,
        },
      }),
      invalidatesTags: ['Users'],
    }),

    updateUser: builder.mutation<UserResponse, UpdateUserAdminRequest>({
      query: ({ id, ...data }) => ({
        url: `/users/${id}`,
        method: 'PUT',
        body: {
          fullName: data.fullName,
          email: data.email,
          phone: data.phone,
          company: data.company,
        },
      }),
      invalidatesTags: ['Users'],
    }),

    deleteUser: builder.mutation<{ message?: string }, string>({
      query: (id) => ({
        url: `/users/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Users'],
    }),
  }),
});

export const {
  useLoginMutation,
  useMeQuery,
  useUpdateMeMutation,
  useChangePasswordMutation,
  useGetUsersQuery,
  useCreateUserMutation,
  useUpdateUserMutation,
  useDeleteUserMutation,
} = authApi;
