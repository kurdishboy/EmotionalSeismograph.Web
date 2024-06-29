export interface AuthenticationRefreshRequest {
  refreshToken: string;
}

export interface AuthenticationResponse {
  token: string;
  refreshToken: string;
}
