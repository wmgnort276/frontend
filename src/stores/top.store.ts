import { getPermisionBusiness } from '@/api/business.api';
import type { Business, Company } from '@/types/interfaces/faq';
import { defineStore } from 'pinia';
import { ref } from 'vue';
import { store } from '@/stores';
import { getCompanyGroupsPermission } from '@/api/top.api';

export const useTopMenuStore = defineStore('top', () => {
  let isFaqCode = ref<boolean>(false);
  const userBusinessResponsible = ref<Business[]>([]);
  const userCompanyGroupResponsible = ref<Company[]>([]);

  const getUserBusinessResponsible = async () => {
    try {
      let businessPermission : any = await getPermisionBusiness();
      userBusinessResponsible.value = businessPermission.data;
      return true;
    } catch(err) {
      return false;
    }
  }

  const getUserCompanyGroupResponsible = async () => {
    try {
      let companyGroups : any = await getCompanyGroupsPermission();
      userCompanyGroupResponsible.value = companyGroups.data;
      return true;
    } catch(err) {
      return false;
    }
  }


  return {
    isFaqCode,
    userBusinessResponsible,
    userCompanyGroupResponsible,
    getUserBusinessResponsible,
    getUserCompanyGroupResponsible
  };
});


export function useTopStore() {
  return useTopMenuStore(store);
}
