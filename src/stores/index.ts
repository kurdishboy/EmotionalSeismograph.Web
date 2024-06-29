import { store } from 'quasar/wrappers';
import { createPinia } from 'pinia';
import { Router } from 'vue-router';
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate';
import SecureLS from 'secure-ls';

const secureLs = new SecureLS();
const isDebuggingEnvironment = process.env.DEBUGGING;

/*
 * When adding new properties to stores, you should also
 * extend the `PiniaCustomProperties` interface.
 * @see https://pinia.vuejs.org/core-concepts/plugins.html#typing-new-store-properties
 */
declare module 'pinia' {
  export interface PiniaCustomProperties {
    readonly router: Router;
  }
}

/*
 * If not building with SSR mode, you can
 * directly export the Store instantiation;
 *
 * The function below can be async too; either use
 * async/await or return a Promise which resolves
 * with the Store instance.
 */

export default store((/* { ssrContext } */) => {
  const pinia = createPinia();

  // You can add Pinia plugins here
  pinia.use(piniaPluginPersistedstate);

  return pinia;
});

declare type StorageLike = Pick<Storage, 'getItem' | 'setItem'>;
export const secureLocalStorage: StorageLike | undefined = {
  getItem: (key) =>
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    isDebuggingEnvironment ? localStorage.getItem(key) : secureLs.get(key),
  setItem: (key, value) =>
    isDebuggingEnvironment
      ? // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        localStorage.setItem(key, value)
      : secureLs.set(key, value),
};
