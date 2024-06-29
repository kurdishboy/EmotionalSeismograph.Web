import { boot } from 'quasar/wrappers';
import axios, { AxiosError, AxiosInstance, AxiosRequestConfig } from 'axios';
import { useSecurityStore } from 'src/stores/security-store';
import { Pinia } from 'pinia';
import { Notify } from 'quasar';
import { useLanguageStore } from 'src/stores/language-store';
import { useAppSettingsStore } from 'src/stores/app-settings-store';

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $axios: AxiosInstance;
  }
}

// Be careful when using SSR for cross-request state pollution
// due to creating a Singleton instance here;
// If any client changes this (global) instance, it might be a
// good idea to move this instance creation inside of the
// "export default () => {}" function below (which runs individually
// for each client)

// TODO: Add production configuration
const api = axios.create();

let isAlreadyFetchingAccessToken = false;
let refreshSubscribers: ((access_token: string) => void)[] = [];

enum HttpStatusCodes {
  Unauthorized = 401,
  BadRequest = 400,
  NotFound = 404,
  ServerError = 500,
}

function addOrUpdateHeader(
  request: AxiosRequestConfig,
  header: { key: string; value: string }
) {
  request.headers ??= {};
  request.headers[header.key] = header.value;
}

function configureInterceptors(api: AxiosInstance, store: Pinia) {
  const securityStore = useSecurityStore(store);
  const appSettingStore = useAppSettingsStore(store);

  api.interceptors.request.use((request) => {
    request.baseURL = appSettingStore.appSettings.backendUrl;

    const languageStore = useLanguageStore();
    addOrUpdateHeader(request, {
      key: 'Accept-Language',
      value: languageStore.currentLanguage.toString(),
    });

    if (securityStore.isLoggedIn) {
      addOrUpdateHeader(request, {
        key: 'Authorization',
        value: `Bearer ${securityStore.signinInformation?.token}`,
      });
    }
    return request;
  });

  api.interceptors.response.use(
    async (response) => {
      return response;
    },
    async (error: Error | AxiosError) => {
      if (axios.isAxiosError(error)) {
        // Refresh token implementation
        if (error.response?.status === HttpStatusCodes.Unauthorized) {
          if (error.config?.url === 'auth/refresh') {
            return Promise.reject(error);
          }

          const originalRequest = error.config;

          if (isAlreadyFetchingAccessToken === false) {
            isAlreadyFetchingAccessToken = true;

            securityStore
              .refresh()
              .then(() => {
                refreshSubscribers.map((callback) =>
                  callback(securityStore.signinInformation?.token ?? '')
                );
              })
              .catch(() => {
                securityStore.clearAuth();
              })
              .finally(() => {
                isAlreadyFetchingAccessToken = false;
                refreshSubscribers = [];
              });
          }

          const retryOriginalRequest = new Promise((resolve) => {
            refreshSubscribers.push((access_token: string) => {
              if (originalRequest) {
                addOrUpdateHeader(originalRequest, {
                  key: 'Authorization',
                  value: `Bearer ${access_token}`,
                });

                resolve(axios(originalRequest));
              }
            });
          });

          return retryOriginalRequest;
        } else if (error.response?.status === HttpStatusCodes.NotFound) {
          Notify.create({
            type: 'negative',
            message: 'Not Found',
            progress: true,
          });
        } else {
          let errorMessage = '';
          if (error.response?.data.errors) {
            (error.response?.data.errors as string[]).forEach((item) => {
              errorMessage += `${item}<br>`;
            });
          }
          Notify.create({
            html: true,
            type: 'negative',
            message: errorMessage,
            progress: true,
          });
        }
      } else {
        Notify.create({
          type: 'negative',
          message:
            'Unhandled Network Error - Please check your interntet connection',
          progress: true,
        });
      }

      return Promise.reject(error);
    }
  );
}

export default boot(({ app, store }) => {
  // for use inside Vue files (Options API) through this.$axios and this.$api

  configureInterceptors(api, store);

  app.config.globalProperties.$axios = axios;
  // ^ ^ ^ this will allow you to use this.$axios (for Vue Options API form)
  //       so you won't necessarily have to import axios in each vue file

  app.config.globalProperties.$api = api;
  // ^ ^ ^ this will allow you to use this.$api (for Vue Options API form)
  //       so you can easily perform requests against your app's API
});

export { api };
