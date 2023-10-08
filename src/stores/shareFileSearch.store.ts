import { defineStore } from 'pinia';
import { ref } from 'vue';

import type {
    Category,
    Business,
    Company,
    FaqCode,
    ShareFile,
    RelationCompaniesAndFaqCodes,
} from '@/types/interfaces/faq';

import type {
    ShareFileSearchForm,
    ShareFileTableData,
    ShareFileTable
} from '@/types/interfaces/sharefile';

import {
    getPermisionBusiness
} from '@/api/business.api';

import {
    searchShareFileApi
} from '@/api/shareFile.api';

export const useShareFileSearchStore = defineStore('sharefileSearch', () => {
    const businesses = ref<Business[]>([]);

    const formState = ref<ShareFileSearchForm>({
        businessCode: null,
        department: null,
        description: null,
        title: null,
        scrutinyRequest: false,
    });

    const tableData = ref<ShareFileTable>({
        currentPage: 1,
        data: [],
        pageSize: 10,
        pageSizeOptions: ['10', '30', '50'],
        totalItem: 0
    });

    const getBusinessData = () => {
        return getPermisionBusiness()
            .then((response) => {
                businesses.value = response.data;
            })
            .catch((error) => {
                Promise.reject(error);
            });
    };

    const searchShareFileData = () => {

        tableData.value.data = [];

        // Trim data before search
        formState.value.department = formState.value.department?.trim();
        formState.value.description = formState.value.description?.trim();
        formState.value.title = formState.value.title?.trim();

        let param = '';
        param += `pageIndex=${tableData.value.currentPage}`;
        param += `&pageSize=${tableData.value.pageSize}`;


        if (formState.value.department && formState.value.department != '') {
            param += `&department=${formState.value.department}`;
        }

        if (formState.value.businessCode && formState.value.businessCode != '') {
            param += `&businessCode=${formState.value.businessCode}`;
        }

        if (formState.value.description && formState.value.description != '') {
            param += `&description=${formState.value.description}`;
        }

        if (formState.value.title && formState.value.title != '') {
            param += `&searchTitle=${formState.value.title}`;
        }

        if (formState.value.scrutinyRequest) {
            param += `&isScrutiny=${formState.value.scrutinyRequest}`;
        }

        return searchShareFileApi(param)
            .then((response: any) => {
                tableData.value.data = response.data.sharefiles;
                tableData.value.totalItem = response.data.count;
            })
            .catch((error) => {
                Promise.reject(error);
            });
    };

    const clearSearchData = () => {
        formState.value.businessCode = null;
        formState.value.department = null;
        formState.value.description = null;
        formState.value.title = null;
        formState.value.scrutinyRequest = false;
    };



    return {
        formState,
        businesses,
        tableData,
        getBusinessData,
        clearSearchData,
        searchShareFileData,
    };
});