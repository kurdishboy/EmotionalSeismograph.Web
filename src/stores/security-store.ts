import { defineStore } from 'pinia';
import { authApis } from 'src/apis/auth.apis';
import { AuthenticationResponse } from 'src/models/auth.models';
import { AuthenticatedUserResponse } from 'src/models/user.models';
import { secureLocalStorage } from '.';

interface RootState {
  signinInformation: AuthenticationResponse | undefined;
  authenticatedUser: AuthenticatedUserResponse | undefined;
}

export const useSecurityStore = defineStore({
  id: 'security-store',
  state: () => {
    const rootState: RootState = {
      signinInformation: undefined,
      authenticatedUser: undefined,
    };

    return rootState;
  },
  getters: {
    isLoggedIn: (state) => state.signinInformation !== undefined,
  },
  actions: {
    updateSigninInformation(signinInformation: AuthenticationResponse) {
      this.signinInformation = signinInformation;
    },

    updateAuthenticatedUserLocally(user: AuthenticatedUserResponse) {
      this.authenticatedUser = user;
    },

    async updateAuthenticatedUser() {
      const authenitedUser = await authApis.getAuthenticatedUser();
      this.updateAuthenticatedUserLocally(authenitedUser);
    },

    async signout() {
      return await authApis.signout().then(() => this.clearAuth());
    },

    clearAuth() {
      this.signinInformation = undefined;
      this.authenticatedUser = undefined;

      this.router.push({ name: 'index' });
    },

    async refresh() {
      if (this.signinInformation) {
        return await authApis
          .refresh({ refreshToken: this.signinInformation.refreshToken })
          .then(async (response) => {
            if (response) {
              this.signinInformation = response;
            }
          });
      }
    },
  },

  persist: {
    storage: secureLocalStorage,
  },
});
