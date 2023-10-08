import { ref } from 'vue';
import { defineStore } from 'pinia';
import type { DataImport } from '@/types/interfaces/faq';

export const ImportStore = defineStore('importFaq', () => {
  const dataCreateFaqQuestions = ref<DataImport[]>([]);
  const dataUpdateFaqQuestions = ref<DataImport[]>([]);
  const dataImport = ref<DataImport[]>([]);
  const fileImportFaq = ref([]);
  const fileAttachment = ref([]);
  const isImportSuccess = ref<boolean>(false);
  const isImportPreview = ref<boolean>(true);

  return {
    dataImport,
    dataCreateFaqQuestions,
    dataUpdateFaqQuestions,
    fileImportFaq,
    fileAttachment,
    isImportSuccess,
    isImportPreview
  };
});
