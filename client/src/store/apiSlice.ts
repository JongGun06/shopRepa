// client/src/store/apiSlice.ts (ПОЛНАЯ ВЕРСИЯ)
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { type UserProfile, type Product, type Category } from '../types';

export interface GetProductsParams {
  search?: string;
  category?: string;
  price_gte?: number;
  price_lte?: number;
  sortBy?: string;
}

const API_URL = 'http://localhost:3000/shop';

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({ baseUrl: API_URL }),
  tagTypes: ['Product', 'User', 'Category', 'Favorites'], 
  endpoints: (builder) => ({
    // USER & PROFILE
    syncUser: builder.mutation<UserProfile, { firebaseUid: string; email: string | null }>({
      query: (credentials) => ({ url: '/users/registerOrLogin', method: 'POST', body: credentials }),
      invalidatesTags: ['User'],
    }),
    updateProfile: builder.mutation<UserProfile, FormData>({
        query: (formData) => ({
            url: '/users/profile',
            method: 'PUT',
            body: formData,
        }),
        invalidatesTags: (result, error, formData) => [{ type: 'User', id: formData.get('firebaseUid') }],
    }),
    getUserProducts: builder.query<Product[], string>({ 
        query: (authorId) => `/users/products/${authorId}`,
        providesTags: (result, error, authorId) => [{ type: 'Product', list: authorId }],
    }),
    getAllUsers: builder.query<UserProfile[], void>({
      query: () => '/users',
      providesTags: ['User'],
    }),
    approveUser: builder.mutation<UserProfile, string>({
      query: (userId) => ({ url: `/users/approve/${userId}`, method: 'PUT' }),
      invalidatesTags: ['User'],
    }),

    // PRODUCTS
    getProducts: builder.query<Product[], GetProductsParams>({
      query: (params) => ({ url: '/products', params: params }),
      providesTags: (result) => result ? [...result.map(({ _id }) => ({ type: 'Product' as const, id: _id })), { type: 'Product', id: 'LIST' }] : [{ type: 'Product', id: 'LIST' }],
    }),
    getProductById: builder.query<Product, string>({
      query: (id) => `/products/${id}`,
      providesTags: (result, error, id) => [{ type: 'Product', id }],
    }),
    createProduct: builder.mutation<Product, FormData>({
      query: (formData) => ({ url: '/products', method: 'POST', body: formData }),
      invalidatesTags: [{ type: 'Product', id: 'LIST' }]
    }),

    // CATEGORIES
    getCategories: builder.query<Category[], void>({
      query: () => '/categories',
      providesTags: ['Category']
    }),

    // FAVORITES
    getFavorites: builder.query<Product[], string>({ 
      query: (firebaseUid) => ({ url: `/users/favorites`, params: { firebaseUid } }),
      providesTags: ['Favorites'],
    }),
    addToFavorites: builder.mutation<void, { firebaseUid: string; productId: string }>({
      query: (body) => ({ url: '/users/favorites', method: 'POST', body }),
      invalidatesTags: ['Favorites'], 
    }),
    removeFromFavorites: builder.mutation<void, { firebaseUid: string; productId: string }>({
      query: (body) => ({ url: '/users/favorites', method: 'DELETE', body }),
      invalidatesTags: ['Favorites'],
    }),
  }),
});

export const { 
  useSyncUserMutation, useUpdateProfileMutation, useGetUserProductsQuery, useGetAllUsersQuery, useApproveUserMutation,
  useGetProductsQuery, useGetProductByIdQuery, useCreateProductMutation,
  useGetCategoriesQuery,
  useGetFavoritesQuery, useAddToFavoritesMutation, useRemoveFromFavoritesMutation,
} = apiSlice;