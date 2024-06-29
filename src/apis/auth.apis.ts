import {
  AuthenticationRefreshRequest,
  AuthenticationResponse,
} from 'src/models/auth.models';
import { AuthenticatedUserResponse } from 'src/models/user.models';
import { api } from 'src/services/api.services';

const baseURL = 'auth';

export const authApis = {
  async signout() {
    return await api.get(`${baseURL}/signout`);
  },

  async refresh(refreshToken: AuthenticationRefreshRequest) {
    return await api.post<AuthenticationRefreshRequest, AuthenticationResponse>(
      `${baseURL}/refresh`,
      refreshToken
    );
  },

  async getAuthenticatedUser() {
    return await api.get<AuthenticatedUserResponse>(`${baseURL}/authenticated`);
  },
};
