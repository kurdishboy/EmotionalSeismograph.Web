import { api as axiosApi } from 'src/boot/axios';
import { ApiResult } from 'src/infrastructure/responses/apiResult';

export const api = {
  async post<TRequest, TResponse>(url: string, request?: TRequest) {
    const apiResult = await axiosApi.post<ApiResult<TResponse>>(url, request);
    return apiResult.data.result;
  },
  async put<TRequest, TResponse>(url: string, request?: TRequest) {
    const apiResult = await axiosApi.put<ApiResult<TResponse>>(url, request);
    return apiResult.data.result;
  },
  async get<TResponse>(url: string) {
    const apiResult = await axiosApi.get<ApiResult<TResponse>>(url);
    return apiResult.data.result;
  },
  async getFile(url: string) {
    const apiResult = await axiosApi.get<Blob | MediaSource>(url, {
      responseType: 'blob',
    });
    return apiResult.data;
  },
  async delete<TResponse>(url: string) {
    const apiResult = await axiosApi.delete<ApiResult<TResponse>>(url);
    return apiResult.data.result;
  },
  async patch<TRequest, TResponse>(url: string, request?: TRequest) {
    const apiResult = await axiosApi.patch<ApiResult<TResponse>>(url, request);
    return apiResult.data.result;
  },
};
