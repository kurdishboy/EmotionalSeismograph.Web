import { route } from 'quasar/wrappers';
import { useSecurityStore } from 'src/stores/security-store';
import {
  createMemoryHistory,
  createRouter,
  createWebHashHistory,
  createWebHistory,
  RouteLocationNormalized,
} from 'vue-router';
import routes from './routes';
import { AccessLevelEnum } from 'src/models/user.models';

declare module 'vue-router' {
  interface RouteMeta {
    /**
     * - `allow-anonymous`: Always available.
     * - `authenticated-users`: Only available when logged in.
     * - `"only-without"`: Only available when logged out.
     */
    authentication: 'allow-anonymous' | 'authenticated-users' | 'only-without';
    validAccessLevels?: AccessLevelEnum[];
  }
}

/*
 * If not building with SSR mode, you can
 * directly export the Router instantiation;
 *
 * The function below can be async too; either use
 * async/await or return a Promise which resolves
 * with the Router instance.
 */

export default route(function ({ store }) {
  const createHistory = process.env.SERVER
    ? createMemoryHistory
    : process.env.VUE_ROUTER_MODE === 'history'
    ? createWebHistory
    : createWebHashHistory;

  const Router = createRouter({
    scrollBehavior: () => ({ left: 0, top: 0 }),
    routes,

    // Leave this as is and make changes in quasar.conf.js instead!
    // quasar.conf.js -> build -> vueRouterMode
    // quasar.conf.js -> build -> publicPath
    history: createHistory(process.env.VUE_ROUTER_BASE),
  });

  function onBeforeEachRouteHandler(route: RouteLocationNormalized) {
    const securityStore = useSecurityStore(store);

    // Manage user's initial redirection
    if (route.name == 'application') {
      return { name: 'index' };
    }

    if (securityStore.isLoggedIn) {
      // Check authentication
      if (route.meta.authentication === 'only-without') {
        if (
          route.redirectedFrom &&
          route.redirectedFrom.meta.authentication !== 'only-without'
        ) {
          return route.redirectedFrom.fullPath;
        }

        return { name: 'application' };
      }
    }
  }

  Router.beforeEach((to) => onBeforeEachRouteHandler(to));

  return Router;
});
