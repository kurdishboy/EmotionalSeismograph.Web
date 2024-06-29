import { defineStore } from 'pinia';
import { Language } from 'src/models/language.models';
import { secureLocalStorage } from '.';
interface RootState {
  currentLanguage: Language;
}

const defaultLanguage: Language = 'fa-IR';

export const useLanguageStore = defineStore({
  id: 'language-store',
  state: () => {
    const rootState: RootState = {
      currentLanguage: defaultLanguage,
    };

    return rootState;
  },
  actions: {
    set(language: Language) {
      this.currentLanguage = language;
    },
  },
  getters: {
    current: (state) => state.currentLanguage ?? defaultLanguage,
    defualt: () => defaultLanguage,
  },
  persist: {
    storage: secureLocalStorage,
  },
});
