import { defineStore } from 'pinia';
import { ref, onMounted, h } from 'vue';
import { getDataExport } from '@/api/faqExport.api';
import { getBusiness, getCategoryLevelTwo } from '@/api/faq.api';
import type { Business, Category } from '@/types/interfaces/faq';

export const useFaqExportStore = defineStore('faqExport', () => {
  const dataExport = ref<any[]>([]);
  const businesses = ref<Business[]>([]);
  const mapCategories = ref<Category[][]>([[], [], [], [], []]);

  const formState = ref<any>({
    businessDepartment: null,
    categories: [undefined, undefined, undefined, undefined, undefined],
    faqNumber: null
  });

  const getData = async (params: any): Promise<any[]> => {
    try {
      const res: any = await getDataExport(params);
      dataExport.value = res.data;
      return dataExport.value;
    } catch (error: any) {
      return error;
    }
  };

  const getBusinessData = () => {
    return getBusiness()
      .then((response) => {
        response.data.map((item: any) => {
          businesses.value.push({
            businessCode: item.businessCode,
            businessName: item.businessName,
            isFaqCode: item.isFaqCode,
            displayName: item.businessCode + '_' + item.businessName
          });
        });
      })
      .catch((error) => {
        Promise.reject(error);
      });
  };

  const getListCategories = async (params: any): Promise<Category[]> => {
    try {
      const res: any = await getCategoryLevelTwo(params);
      return res.data.result.map(item => {
        return {
          categoryCode: item.categoryCode,
          categoryName: item.categoryName,
          displayName: item.categoryCode + '_' + item.categoryName
        };
      });
    } catch (error) {
      return [];
    }
  };

  return {
    dataExport,
    formState,
    businesses,
    mapCategories,
    getData,
    getBusinessData,
    getListCategories
  };
});
