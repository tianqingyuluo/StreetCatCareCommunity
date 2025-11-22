import { request } from '@/services/request';

import { loginRequest, loginResponse } from '../types/apiTypes';

export const login = async (data: loginRequest): Promise<loginResponse> => {
  const response = await request.post<loginResponse>('/auth/login-wechat', data);
  return response.data;
}