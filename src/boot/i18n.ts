import { boot } from 'quasar/wrappers';
import { createI18n } from 'vue-i18n';
import { useLanguageStore } from 'src/stores/language-store';
import messages from 'src/i18n';

const languageStore = useLanguageStore();

export type MessageLanguages = keyof typeof messages;
// Type-define 'fa-IR' as the master schema for the resource
export type MessageSchema = (typeof messages)['fa-IR'];

// See https://vue-i18n.intlify.dev/guide/advanced/typescript.html#global-resource-schema-type-definition
/* eslint-disable @typescript-eslint/no-empty-interface */
declare module 'vue-i18n' {
  // define the locale messages schema
  export interface DefineLocaleMessage extends MessageSchema {}

  // define the datetime format schema
  export interface DefineDateTimeFormat {}

  // define the number format schema
  export interface DefineNumberFormat {}
}
/* eslint-enable @typescript-eslint/no-empty-interface */

const i18nObject = createI18n({
  locale: languageStore.defualt,
  legacy: false,
  messages,
});

export const { t, n } = i18nObject.global;
i18nObject.global.locale.value = languageStore.current;

export default boot(({ app }) => {
  // Set i18n instance on app
  app.use(i18nObject);
});
