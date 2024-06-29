import { defineStore } from 'pinia';
import { AppSettings } from 'src/infrastructure/appSettings';

interface RootState {
  appSettings: AppSettings;
}

export const useAppSettingsStore = defineStore({
  id: 'appSettings-store',
  state: () => {
    const rootState: RootState = {
      appSettings: {
        backendUrl: '',
      },
    };

    return rootState;
  },

  actions: {
    set(appSettings: AppSettings) {
      this.appSettings = appSettings;
    },
  },
});
