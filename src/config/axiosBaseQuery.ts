import { BaseQueryFn } from '@reduxjs/toolkit/query/react';
import { api } from './api';

type QueryArgs = {
  url: string;
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  data?: unknown;
  params?: Record<string, unknown>;
};

type ApiError = {
  status: number;
  data: unknown;
  message?: string;
};

export const axiosBaseQuery: BaseQueryFn<QueryArgs, unknown, ApiError> = async ({
  url,
  method = 'GET',
  data,
  params,
}) => {
  try {
    const response = await api.request({
      url,
      method,
      data,
      params,
    });

    return { data: response.data };
  } catch (error: any) {
    return {
      error: {
        status: error.response?.status ?? 500,
        data: error.response?.data ?? error.message,
        message: error.message,
      },
    };
  }
};