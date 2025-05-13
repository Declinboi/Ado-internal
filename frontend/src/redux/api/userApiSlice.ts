import { apiSlice } from "./apiSlice";
import { USERS_URL } from "../features/constantURL";

export const userApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<any, any>({
      query: (data) => ({
        url: `${USERS_URL}/auth`,
        method: "POST",
        body: data,
      }),
    }),
    createUser: builder.mutation<any, any>({
      query: (data) => ({
        url: `${USERS_URL}`,
        method: "POST",
        body: data,
      }),
    }),
    logout: builder.mutation<void, void>({
      query: () => ({
        url: `${USERS_URL}/logout`,
        method: "POST",
      }),
    }),
    verifyEmail: builder.mutation({
      query: (code) => ({
        url: `${USERS_URL}/verify-email`,
        method: "POST",
        body: code,
      }),
    }),

    getUsers: builder.query<any, void>({
      query: () => ({
        url: USERS_URL,
      }),
      providesTags: ["User"],
      keepUnusedDataFor: 5,
    }),
    deleteUser: builder.mutation<any, string>({
      query: (userId) => ({
        url: `${USERS_URL}/${userId}`,
        method: "DELETE",
      }),
    }),
    getUserDetails: builder.query<any, string>({
      query: (id) => ({
        url: `${USERS_URL}/${id}`,
      }),
      keepUnusedDataFor: 5,
    }),
    updateUser: builder.mutation<any, { userId: string; [key: string]: any }>({
      query: (data) => ({
        url: `${USERS_URL}/${data.userId}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["User"],
    }),
    forgottenPassword: builder.mutation<any, any>({
      query: (data) => ({
        url: `${USERS_URL}/forgot-password`,
        method: "POST",
        body: data,
      }),
    }),
    resetPassword: builder.mutation<any, { token: string; newPassword: string }>({
      query: ({ token, newPassword }) => ({
        url: `${USERS_URL}/reset-password/${token}`,
        method: "POST",
        body: {password: newPassword },
      }),
    }),
    googleLogin: builder.mutation<any, { idToken: string }>({
      query: (data) => ({
        url: `${USERS_URL}/google-login`,
        method: "POST",
        body: data,
      }),
    }),
    getClientId: builder.query({
      query: () => ({
        url: `/api/config/google`,
      }),
      keepUnusedDataFor: 5,
    }),

  }),
});

export const {
  useLoginMutation,
  useLogoutMutation,
  useCreateUserMutation,
  useGetUsersQuery,
  useDeleteUserMutation,
  useUpdateUserMutation,
  useGetUserDetailsQuery,
  useForgottenPasswordMutation,
  useResetPasswordMutation,
  useGoogleLoginMutation,
  useGetClientIdQuery,
  useVerifyEmailMutation
} = userApiSlice;
