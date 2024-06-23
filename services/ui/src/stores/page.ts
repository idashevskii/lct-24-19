import { defineStore } from 'pinia';

export const usePageStore = defineStore('page', {
  state: () => ({
    title: '',
  }),
  actions: {
    setTitle(title: string) {
      this.title = title;
    },
  },
});
