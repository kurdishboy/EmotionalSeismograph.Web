import { boot } from 'quasar/wrappers';
import { AppSettings } from 'src/infrastructure/appSettings';
import { useAppSettingsStore } from 'src/stores/app-settings-store';

export default boot(async ({ store }) => {
  const appSettingsStore = useAppSettingsStore(store);

  await fetch('/appSettings.json').then(async (response) => {
    const appSettings = (await response.json()) as AppSettings;
    appSettingsStore.set(appSettings);

    // Override settings based on settings.override.json
    if (process.env.DEV) {
      await fetch('/appSettings.override.json').then(async (response) => {
        const overrideAppSettings = appSettingsStore.appSettings;

        const overrideJsonObject = await response.json();
        Object.keys(overrideJsonObject).forEach(
          (key) =>
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            ((overrideAppSettings as any)[key] = overrideJsonObject[key])
        );

        appSettingsStore.set(overrideAppSettings);
      });
    }
  });
});
