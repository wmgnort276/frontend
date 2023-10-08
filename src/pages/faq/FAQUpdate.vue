<script setup lang="ts">
import { ref, computed, watch, onMounted, h, onBeforeMount } from 'vue';
import DatePicker from '@/components/common/DatePicker.vue';
import RequiredTag from '@/components/common/RequiredTag.vue';
import BaseButton from '@/components/common/BaseButton.vue';
import PageLayout from '../layouts/PageLayout.vue';
import Upload from '@/components/common/Upload.vue';
import Delete from '@/components/icon/Delete.vue';
import router from '@/router';
import dayjs, { Dayjs } from 'dayjs';
import type { FormInstance } from 'ant-design-vue/es/form';
import CKEditor from '@ckeditor/ckeditor5-vue';
import { checkCompanyOfBusiness } from '@/api/faq.api';
import { deleteFaq, updateFaq } from '@/api/faqUpdate.api';
import {
  FAQ_CONDITION,
  FAQ_CONDITION_TYPE,
  T_TIME_END_DEFAULT,
  MAX_FILES,
  URL_TYPE,
  END_YEAR_FLAG_VALUE,
  DATE_FORMAT,
} from '@/stores/constants/constant';
import { useFaqCreateStore } from '@/stores/faqCreate.store';
import { useFaqUpdateStore } from '@/stores/faqUpdate.store';
import ConfirmDialog from '@/components/common/dialog/ConfirmDialog.vue';
import type { Dialog, Popup } from '@/types/interfaces/faq';
import { useI18n } from 'vue-i18n';
import { uploadFilesMemory } from '@/api/file.api';
import { ConfigProvider, message } from 'ant-design-vue';
import { useAuthStoreHook, useAuthStore } from '@/stores/auth.store';
import { nextTick } from 'vue';
import { uploadFilesFaq } from '@/api/file.api';

import { useFaqSearchStore } from '@/stores/faqSearch.store';
import {
  BREAD_CRUMB_TYPE
} from '@/stores/constants/constant';

import type {
  FaqBreadCrumb
} from '@/types/interfaces/faq';

const { t } = useI18n();
const store = useFaqCreateStore();
const storeUpdate = useFaqUpdateStore();
const result = ref<any>('');
const loading = ref<boolean>(false);
const spinning = ref<boolean[]>([false, false, false, false, false]);
let companyGroups = ref<any>('');
let faqCodes = ref<any>('');
let conditionShow = ref<boolean>(false);
let isFaqCode = ref<boolean>(false);

const canEdit = ref<boolean>(false);
const { authUser } = useAuthStoreHook();
const answerSection = ref<HTMLElement | null>(null);

const faqBreadCrumbs = ref<FaqBreadCrumb[]>([]);
const searchStore = useFaqSearchStore();

const categoryDisable = (index: number): boolean => {
  if (index == 0) {
    return !storeUpdate.formUpdate.businessCode;
  } else {
    return !storeUpdate.formUpdate.categories[index - 1];
  }
};

const handleSelectBusiness = async (value: any, business: any) => {
  conditionShow.value = true;

  if (business?.isFaqCode) {
    isFaqCode.value = true;
  } else {
    isFaqCode.value = false;
  }
};

const handleCategorySelect = async (level: number, category?: string) => {
  clearArray(storeUpdate.formUpdate.categories, level - 1);
  if (level > 5) {
    return;
  } else {
    let param: any = {};
    if (level == 1) {
      param = {
        businessCode: storeUpdate.formUpdate.businessCode,
        level: level
      };
    } else {
      param = {
        categoryCode: category,
        level: level
      };
    }
    spinning.value[level - 1] = true;
    storeUpdate.mapCategories[level - 1] = await storeUpdate.getListCategories(param);

    if (level == 1) {

      storeUpdate.formUpdate.firstLevelCategories = storeUpdate.mapCategories[level - 1].map((item) => {
        return item.categoryName;
      });
    }

    spinning.value[level - 1] = false;
  }
};

const loadCategory = async (level: number, category?: string) => {
  if (level > 5) {
    return;
  } else {
    let param: any = {};
    if (level == 1) {
      param = {
        businessCode: storeUpdate.formUpdate.businessCode,
        level: level
      };
    } else {
      param = {
        categoryCode: category,
        level: level
      };
    }
    spinning.value[level - 1] = true;
    storeUpdate.mapCategories[level - 1] = await storeUpdate.getListCategories(param);

    if (level == 1) {

      storeUpdate.formUpdate.firstLevelCategories = storeUpdate.mapCategories[level - 1].map((item) => {
        return item.categoryName;
      });
    }

    spinning.value[level - 1] = false;
  }
};

const clearArray = (arr: (string | null | undefined)[], index: number) => {
  for (let i = index; i < arr.length; i++) {
    arr[i] = null;
  }
};

const categoryValidator = (index: number, value: any) => {
  return new Promise((resolve, reject) => {
    if (index === 0 && !value) {
      reject(t('faq-create.category.category') + t('faq-create.required'));
    } else {
      resolve('');
    }
  });
};

const checkValidateAll = async () => {
  try {
    await formRef.value?.validateFields();
    popup.value.confirmRegister = true;
  } catch (error) {
    message.error(t('faq-create.validate_all'));
    console.log(error);
  }
};

const isFormFilled = computed(() => {
  return !storeUpdate.checkNullForm() && !storeUpdate.checkEmptyAnswers();
});

const isShowBtnDelete = computed(() => {
  return store.checkExistForm();
});
const editor = ref(ClassicEditor);
const editorInstance = ref(null);
const editorConfig = {
  toolbar: {
    items: [
      'heading', 'fontSize', '|',
      'bold', 'italic', 'strikethrough', 'underline', '|',
      'undo', 'redo',
      'fontColor', 'fontBackgroundColor', '|',
      'alignment', '|',
      'insertTable', 'link'
    ]
  },
  fontSize: {
    options: [
      'small',
      'default',
      'big',
      'huge'
    ]
  },
  placeholder: t('faq-create.answer.content')
};
const ckeditor = CKEditor.component;

const addType = 'add-rounded';
const deleteType = 'delete';

const xsSizeLeft = ref<number>(18);
const xsSizeRight = ref<number>(23);

const smSizeLeft = ref<number>(8);
const smSizeRight = ref<number>(14);

const mdSizeLeft = ref<number>(5);
const mdSizeRight = ref<number>(10);

const smSizeLeft2 = ref<number>(8);
const smSizeRight2 = ref<number>(14);

const mdSizeLeft2 = ref<number>(5);
const mdSizeRight2 = ref<number>(17);

const conditionList = FAQ_CONDITION;

const listAnswerCount = computed(() => {
  return storeUpdate.formUpdate.answer.length;
});

const formattedInput = ref<string>('');
const formRef = ref<FormInstance>();

const handleAddAnswer = async () => {
  storeUpdate.formUpdate.answer.push({
    key: Date.now(),
    iId: null,
    answerCode: null,
    answerNumber: null,
    sortOrder: undefined,
    startTime: null,
    answerCondition: 'Include',
    answerRelationCompanies: [],
    answerRelationCompaniesExclude: [],
    companyCodes: [],
    faqCodes: [],
    answerRelationCompaniesAndFaqCodes: [],
    endTime: null,
    answerRestriction: '',
    attachments: [],
    content: '',
    oldUrls: [],
    oldFileId: [],
    oldCompanyCodes: [],
    urls: [
      {
        key: Date.now(),
        type: URL_TYPE.NORMAL,
        title: '',
        link: ''
      }
    ]
  });

  await nextTick();
  answerSection.value?.lastElementChild?.scrollIntoView({ behavior: 'smooth' })
};

const userStore = useAuthStore();


const onEditorReady = (editor: any) => {
  editorInstance.value = editor;
};

const hanldeChangeQuestionStartDate = (value: any) => {
  storeUpdate.formUpdate.displayStartDate = value;

  if (!storeUpdate.formUpdate.displayStartDate?.isValid()) {
    storeUpdate.formUpdate.displayStartDate = null;
  }

  if (storeUpdate.formUpdate.displayStartDate && storeUpdate.formUpdate.displayEndDate) {
    formRef.value?.validateFields([['displayEndDate']]);
  }
};

const hanldeChangeQuestionEndDate = (value: any) => {
  storeUpdate.formUpdate.displayEndDate = value;
  if (!storeUpdate.formUpdate.displayEndDate?.isValid()) {
    storeUpdate.formUpdate.displayEndDate = null;
  }
};

const hanldeChangeAnswerStartDate = (value: any, index: any) => {
  storeUpdate.formUpdate.answer[index].startTime = value;
  if (!storeUpdate.formUpdate.answer[index].startTime?.isValid()) {
    storeUpdate.formUpdate.answer[index].startTime = null;
  }
  if (
    storeUpdate.formUpdate.answer[index].startTime &&
    storeUpdate.formUpdate.answer[index].endTime
  ) {
    formRef.value?.validateFields([['answer', index, 'answerEndDate']]);
  }
};

const hanldeChangeAnswerEndDate = (value: any, index: any) => {
  storeUpdate.formUpdate.answer[index].endTime = value;
  if (!storeUpdate.formUpdate.answer[index].endTime?.isValid()) {
    storeUpdate.formUpdate.answer[index].endTime = null;
  }
};

const checkDuplicateAnswerOrderValidate = (rules: any, value: number) => {
  return new Promise((resolve, reject) => {
    if (!value) reject(t('faq-create.answer.order') + t('faq-create.required'));
    const arr = storeUpdate.formUpdate.answer.map((item) => item.sortOrder);
    const count = arr.filter((item) => Number(item) === Number(value)).length;
    if (count > 1) {
      reject(t('faq-create.Duplicated'));
    } else {
      resolve('');
    }
  });
};

const handleValidateDuplicate = () => {
  const arr = [];
  for (let i = 0; i < storeUpdate.formUpdate.answer.length; i++) {
    arr.push(['answer', i, 'answerOrder']);
  }

  formRef.value?.validateFields(arr);
};

const validateQuestionDateRange = (_: any, value: any) => {
  const startDate = storeUpdate.formUpdate.displayStartDate;
  const endDate = dayjs(value);
  return new Promise((resolve, reject) => {
    if (endDate.isBefore(startDate)) {
      reject(t('faq-create.End_date_must_be_greater_than_start_date'));
    } else {
      resolve('');
    }
  });
};

const validateAnswerDateRange = (_: any, value: any, index: number) => {
  const startDate = storeUpdate.formUpdate.answer[index].startTime;
  const endDate = dayjs(value);
  return new Promise((resolve, reject) => {
    if (endDate.isBefore(startDate)) {
      reject(t('faq-create.End_date_must_be_greater_than_start_date'));
    } else {
      resolve('');
    }
  });
};

const validateEditor = (index: number) => {
  formRef.value?.validateFields([['answer', index, 'content']]);
};

const handleRemoveAnswer = (index: number) => {
  storeUpdate.formUpdate.answer.splice(index, 1);
};

const handleCompanyGroup = (index: any) => {
  if (!conditionShow.value) {
    return [];
  }

  companyGroups = store.companies;
  if (companyGroups) {
    companyGroups = companyGroups.map((item: any) => {
      return {
        ...item,
        company: `${item.companyGroupCode}_${item.companyGroupName}`
      };
    });
    // Add all options
    if (storeUpdate.formUpdate.answer[index].answerCondition !== 'Exclude') {
      companyGroups.unshift({
        company: 'ALL',
        companyGroupCode: '-1'
      });
    }
  }

  return companyGroups;
};

const handleFaqCodes = (index: any) => {
  if (!conditionShow.value) {
    return [];
  }

  faqCodes.value = storeUpdate.faqCodes;
  if (faqCodes.value) {
    faqCodes.value = faqCodes.value.map((item: any) => {
      return {
        ...item,
        faqCodeLabel: `${item.FaqCode}_${item.FaqName}`
      };
    });

    // Add all options
    if (storeUpdate.formUpdate.answer[index].answerCondition !== 'Exclude') {
      faqCodes.value.unshift({
        faqCodeLabel: 'ALL',
        FaqCode: '-1'
      });
    }
  }

  return faqCodes;
};

const hanldeRelationCompaniesAndFaqCodes = (index: any) => {
  let relationCompaniesAndFaqCodes = storeUpdate.relationCompaniesAndFaqCodes;

  relationCompaniesAndFaqCodes = relationCompaniesAndFaqCodes.map((item: any) => {
    return {
      ...item
    };
  });

  if (storeUpdate.formUpdate.answer[index].answerCondition !== 'Exclude') {
    relationCompaniesAndFaqCodes.unshift({
      name: t('faq-create.allOption'),
      code: FAQ_CONDITION_TYPE.IS_ALL_OPTION_CODE,
      type: FAQ_CONDITION_TYPE.IS_ALL_OPTION,
      originalName: t('faq-create.allOption'),
    });
  }

  return relationCompaniesAndFaqCodes;
};

const handleChangeCompanyAndFaqCode = (value: string[], index: number) => {
  let answerRelationCompaniesAndFaqCodes: { name: string; code: string; type: number; originalName: string }[] = [];
  // Loop though list of CompaniesAndFaqCodes to add type of data
  storeUpdate.formUpdate.answer[index].faqCodes.map((item: any) => {
    if (item !== FAQ_CONDITION_TYPE.IS_ALL_OPTION_CODE) {
      storeUpdate.relationCompaniesAndFaqCodes.forEach((e) => {
        if (e.code === item) {
          answerRelationCompaniesAndFaqCodes.push({
            code: e.code,
            type: e.type,
            name: e.name,
            originalName: e.originalName
          });
        }
      });
    } else {
      answerRelationCompaniesAndFaqCodes.push({
        code: FAQ_CONDITION_TYPE.IS_ALL_OPTION_CODE,
        type: FAQ_CONDITION_TYPE.IS_ALL_OPTION,
        name: t('faq-create.allOption'),
        originalName: t('faq-create.allOption'),
      });
    }
  });

  storeUpdate.formUpdate.answer[index].answerRelationCompaniesAndFaqCodes =
    answerRelationCompaniesAndFaqCodes;
};

const convertFaqCodes = (index: number) => {
  let companiesAndFaqCodes: { name: string; code: string; type: number; originalName: string }[] = [];
  storeUpdate.formUpdate.answer[index].answerRelationCompaniesAndFaqCodes = [];
  // Loop though list of CompaniesAndFaqCodes to add type of data
  storeUpdate.formUpdate.answer[index].faqCodes.map((item: any) => {
    if (item !== FAQ_CONDITION_TYPE.IS_ALL_OPTION_CODE) {
      storeUpdate.relationCompaniesAndFaqCodes.forEach((e) => {
        if (e.code === item) {
          companiesAndFaqCodes.push({
            code: e.code,
            type: e.type,
            name: e.name,
            originalName: e.originalName
          });
        }
      });
    } else {
      companiesAndFaqCodes.push({
        code: FAQ_CONDITION_TYPE.IS_ALL_OPTION_CODE,
        type: FAQ_CONDITION_TYPE.IS_ALL_OPTION,
        name: t('faq-create.allOption'),
        originalName: t('faq-create.allOption'),
      });
    }
  });

  storeUpdate.formUpdate.answer[index].answerRelationCompaniesAndFaqCodes = companiesAndFaqCodes;
};

const validateUrlLink = (rules: any, value: any, indexOfAnswer: number, indexOfUrlLink: number) => {
  const regex =
    /(\b25[0-5]|\b2[0-4][0-9]|\b[01]?[0-9][0-9]?)(\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}|[(http(s)?):\/\/(www\.)?a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/; // eslint-disable-line
  return new Promise((resolve, reject) => {
    if (storeUpdate.formUpdate.answer[indexOfAnswer].urls[indexOfUrlLink].title) {
      if (!storeUpdate.formUpdate.answer[indexOfAnswer].urls[indexOfUrlLink].link) {
        reject(t('faq-create.answer.referenceURL') + t('faq-create.required'));
      } else if (!regex.test(value)) {
        reject(t('faq.url.invalid'));
      } else {
        resolve('');
      }
    } else if (!storeUpdate.formUpdate.answer[indexOfAnswer].urls[indexOfUrlLink].title
      && storeUpdate.formUpdate.answer[indexOfAnswer].urls[indexOfUrlLink].link) {
      formRef.value?.validateFields([['answer', indexOfAnswer, 'urls', indexOfUrlLink, 'title']])
    }
    else {
      resolve('');
    }
  });
};

const validateUrlName = (rules: any, value: any, indexOfAnswer: number, indexOfUrlLink: number) => {
  return new Promise((resolve, reject) => {
    if (
      storeUpdate.formUpdate.answer[indexOfAnswer].urls[indexOfUrlLink].link &&
      !storeUpdate.formUpdate.answer[indexOfAnswer].urls[indexOfUrlLink].title
    ) {
      reject(t('faq-create.answer.referenceURL') + t('faq-create.required'));
    } else if (!storeUpdate.formUpdate.answer[indexOfAnswer].urls[indexOfUrlLink].link
      && storeUpdate.formUpdate.answer[indexOfAnswer].urls[indexOfUrlLink].title) {
      formRef.value?.validateFields([['answer', indexOfAnswer, 'urls', indexOfUrlLink, 'link']])
    }
    else {
      resolve('');
    }
  });
};

const handleAddUrl = (answerIndex: number) => {
  if (storeUpdate.formUpdate.answer[answerIndex].urls.length < 5) {
    storeUpdate.formUpdate.answer[answerIndex].urls.push({
      key: Date.now(),
      type: URL_TYPE.NORMAL,
      title: '',
      link: ''
    });
  }
};

const handleDeleteUrl = (answerIndex: number, index: number) => {
  storeUpdate.formUpdate.answer[answerIndex].urls.splice(index, 1);
};

const handleChangeCondition = (index: any) => {
  if (storeUpdate.formUpdate.answer[index].answerCondition == 'Exclude') {
    // Remove all option in the list
    storeUpdate.formUpdate.answer[index].faqCodes = storeUpdate.formUpdate.answer[
      index
    ].faqCodes.filter((item) => {
      return item !== FAQ_CONDITION_TYPE.IS_ALL_OPTION_CODE;
    });

    storeUpdate.formUpdate.answer[index].answerRelationCompaniesAndFaqCodes =
      storeUpdate.formUpdate.answer[index].answerRelationCompaniesAndFaqCodes.filter((item) => {
        return item.code !== FAQ_CONDITION_TYPE.IS_ALL_OPTION_CODE;
      });

    const answerRelationCompaniesExclude = storeUpdate.companies.filter(
      (item) =>
        !storeUpdate.formUpdate.answer[index].answerRelationCompanies.includes(item.companyGroupCode)
    );
    storeUpdate.formUpdate.answer[index].answerRelationCompaniesExclude =
      answerRelationCompaniesExclude.map((item: { companyGroupName: any; }) => item.companyGroupName);
  } else {
    const answerRelationCompaniesExclude = storeUpdate.companies.filter((item) =>
      storeUpdate.formUpdate.answer[index].answerRelationCompanies.includes(item.companyGroupCode)
    );
    storeUpdate.formUpdate.answer[index].answerRelationCompaniesExclude =
      answerRelationCompaniesExclude.map((item) => item.companyGroupName);
  }
};

const handleChangeCompanyGroup = (value: string[], index: number) => {
  if (value.includes('-1')) {
    let allCompanyGroups = handleCompanyGroup(index);
    storeUpdate.formUpdate.answer[index].answerRelationCompanies = allCompanyGroups
      .filter((item: { companyGroupCode: string }) => item.companyGroupCode !== '-1')
      .map((item: { companyGroupCode: any }) => item.companyGroupCode);
    return;
  }
  if (storeUpdate.formUpdate.answer[index].answerCondition == 'Exclude') {
    const answerRelationCompaniesExclude = storeUpdate.companies.filter(
      (i) =>
        !storeUpdate.formUpdate.answer[index].answerRelationCompanies.includes(i.companyGroupCode)
    );
    storeUpdate.formUpdate.answer[index].answerRelationCompaniesExclude =
      answerRelationCompaniesExclude.map((i) => i.companyGroupName);
  } else {
    const answerRelationCompaniesExclude = storeUpdate.companies.filter((i) =>
      storeUpdate.formUpdate.answer[index].answerRelationCompanies.includes(i.companyGroupCode)
    );
    storeUpdate.formUpdate.answer[index].answerRelationCompaniesExclude =
      answerRelationCompaniesExclude.map((i) => i.companyGroupName);
  }
};

const handleChangeFaqCode = (value: string[], index: number) => {
  if (value.includes('-1')) {
    let allFaqCodes = handleFaqCodes(index);

    storeUpdate.formUpdate.answer[index].faqCodes = allFaqCodes
      .filter((item: { FaqCode: string }) => item.FaqCode !== '-1')
      .map((item: { FaqCode: any }) => item.FaqCode);

    return;
  }
};

const checkBusinessAndCompany = async () => {
  const answers = storeUpdate.formUpdate.answer.map((item, index) => {
    convertFaqCodes(index);
    return {
      responseStartDate: dayjs(item.startTime).format('YYYY-MM-DD') + 'T00:00:00Z',
      responseEndDate:
        (item.endTime != null ? dayjs(item.endTime).format('YYYY-MM-DD') : T_TIME_END_DEFAULT) + 'T00:00:00Z',
      contentAnswer: item.content?.trim(),
      referenceUrl: [
        ...item.urls.filter(item => (item.title && item.link)).map((url) => {
          return {
            type: url.type?.trim(),
            link: url.link?.trim(),
            title: url.title?.trim()
          };
        })
      ],
      condition: item.answerCondition?.trim(),
      companyCodes: item.answerRelationCompanies,
      faqCodes: [],
      relationCompaniesAndFaqCodes: item.answerRelationCompaniesAndFaqCodes,
      type: storeUpdate.formUpdate.businessCode?.trim(),
      answerId: item.iId,
      answerCode: item.answerCode,
      answerNumber: item.answerNumber,
      oldUrls: item.oldUrls,
      oldFileId: item.oldFileId,
      oldCompanyCodes: item.oldCompanyCodes,
      sortOrder: item.sortOrder,
      answerFiles: item.attachments
    };
  });

  let param = {
    businessCode: storeUpdate.formUpdate.businessCode?.trim(),
    answers: answers
  };

  try {
    let res: any = await checkCompanyOfBusiness(param);
    return res;
  } catch (err: any) {
    message.error(err.response.data.message);
  }
  loading.value = false;
};

const handlePreview = async () => {
  loading.value = true;
  let uploadStatus = false;
  let res: any = await checkBusinessAndCompany();
  let isErrorMaxFile = false;
  // Validate upload
  const answers = storeUpdate.formUpdate.answer.map((item, index) => {
    if (item.attachments.length > MAX_FILES) {
      isErrorMaxFile = true;
    }
    return {
      answerFiles: item.attachments,
      oldFileId: item.oldFileId,
    };
  });
  if (isErrorMaxFile) {
    message.error(t('faq-create.uploadFile.max_attachment'));
    loading.value = false;
    return;
  }
  const formData = new FormData();
  answers.forEach((answer) => {
    answer.oldFileId = [];
    answer.answerFiles.forEach((file) => {
      if (file.fileId != null && file.fileId != undefined) {
        answer.oldFileId.push(file.fileId);
      }
      formData.append('files', file['originFileObj']);
    });
  });

  formData.append('totalAnswer', answers.length.toString());

  await uploadFilesFaq(formData)
    .then((response: any) => {
      uploadStatus = true;
    })
    .catch((error: any) => {
      if(error?.response?.data?.errors?.[0]?.msg) {
        message.error(error?.response?.data?.errors?.[0]?.msg);
      } else { 
        message.error(t('faq-create.uploadFile.error'));
      }
      loading.value = false;
    })

  const listBreadcum = [];
  const business = storeUpdate.businesses.filter((item) => {
    if (item.businessCode == storeUpdate.formUpdate.businessCode) {
      return item;
    }
  });

  if (business && business.length > 0) {
    store.formState.isFaqCode = business[0].isFaqCode == 'true';
  }

  if (res.status == true && uploadStatus) {

    if (!store.formState.isFaqCode) {
      listBreadcum.push(business[0].businessName);
    }

    storeUpdate.formUpdate.categories.forEach((category) => {
      if (category != null) {
        storeUpdate.mapCategories.forEach((originalCategory) => {
          if (originalCategory.length != 0) {
            originalCategory.forEach((cate) => {
              if (category == cate.categoryCode) {
                listBreadcum.push(cate.categoryName);
              }
            });
          }
        });
      }
    });

    storeUpdate.formUpdate.listBreadcrumb = listBreadcum;
    storeUpdate.formUpdate.keywords = await storeUpdate.getKeywordByBusiness();
    storeUpdate.businesses = [];

    formRef.value
      ?.validateFields()
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      .then(async (_: any) => {
        localStorage.setItem("faqNumber", storeUpdate.formUpdate.faqNumber || '');
        await router.push('/faq/preview-update');
      })
      .catch((err) => {
        message.error(t('faq-create.validate_all'));
        loading.value = false;
      });
  } else if (res.status == false) {
    message.error(res.message);
    loading.value = false;
  }
};

const submit = async () => {
  loading.value = true;
  let isErrorMaxFile = false;
  const answers = storeUpdate.formUpdate.answer.map((item, index) => {
    if (item.attachments.length > MAX_FILES) {
      isErrorMaxFile = true;
    }
    convertFaqCodes(index);
    return {
      responseStartDate: dayjs(item.startTime).format('YYYY-MM-DD') + 'T00:00:00Z',
      responseEndDate:
        (item.endTime != null ? dayjs(item.endTime).format('YYYY-MM-DD') : T_TIME_END_DEFAULT) + 'T00:00:00Z',
      contentAnswer: item.content?.trim(),
      referenceUrl: [
        ...item.urls.filter(item => (item.title && item.link)).map((url, index) => {
          return {
            type: url.type?.trim(),
            link: url.link?.trim(),
            title: url.title?.trim(),
            sortOrder: index + 1
          };
        })
      ],
      condition: item.answerCondition?.trim(),
      companyCodes: item.answerRelationCompanies,
      faqCodes: item.faqCodes,
      relationCompaniesAndFaqCodes: item.answerRelationCompaniesAndFaqCodes,
      type: storeUpdate.formUpdate.businessCode?.trim(),
      answerId: item.iId,
      answerCode: item.answerCode,
      answerNumber: item.answerNumber,
      oldUrls: item.oldUrls,
      oldFileId: item.oldFileId,
      oldCompanyCodes: item.oldCompanyCodes,
      sortOrder: Number(item.sortOrder),
      answerFiles: item.attachments
    };
  });
  if (isErrorMaxFile) {
    message.error(t('faq-create.uploadFile.max_attachment'));
    loading.value = false;
    return;
  }

  const formData = new FormData();
  answers.forEach((answer) => {
    answer.oldFileId = [];
    answer.answerFiles.forEach((file) => {
      if (file.fileId != null && file.fileId != undefined) {
        answer.oldFileId.push(file.fileId);
      }
      formData.append('files', file['originFileObj']);
    });
  });

  formData.append('totalAnswer', answers.length.toString());

  uploadFilesFaq(formData)
    .then((response: any) => {
      let count = 0;
      answers.forEach((answer) => {
        for (let index = 0; index < answer.answerFiles.length; index++) {
          if (!answer.answerFiles[index]['fileId']) {
            answer.answerFiles[index]['fileId'] = response.data.listFileId[count];
            count++;
          }
        }
      });
      const param = {
        questionItemId: storeUpdate.formUpdate.iId,
        questionNumber: router.currentRoute.value.params.id,
        businessCode: storeUpdate.formUpdate.businessCode?.trim(),
        sortOrder: storeUpdate.formUpdate.sortOrder,
        categoryLevel1: storeUpdate.formUpdate.categories[0]?.trim() || null,
        categoryLevel2: storeUpdate.formUpdate.categories[1]?.trim() || null,
        categoryLevel3: storeUpdate.formUpdate.categories[2]?.trim() || null,
        categoryLevel4: storeUpdate.formUpdate.categories[3]?.trim() || null,
        categoryLevel5: storeUpdate.formUpdate.categories[4]?.trim() || null,
        relatedKeywords: storeUpdate.formUpdate.relatedKeywords?.trim(),
        ambiguouKeywords: storeUpdate.formUpdate.ambiguouKeywords?.trim(),
        contentQuestion: storeUpdate.formUpdate.content?.trim(),
        displayPeriodQuestionStart:
          dayjs(storeUpdate.formUpdate.displayStartDate).format('YYYY-MM-DD') + 'T00:00:00Z',
        displayPeriodQuestionEnd:
          (storeUpdate.formUpdate.displayEndDate != null ? dayjs(storeUpdate.formUpdate.displayEndDate).format('YYYY-MM-DD') :
            T_TIME_END_DEFAULT) + 'T00:00:00Z',
        oldAnswerId: storeUpdate.formUpdate.oldAnswerId,
        answers: answers
      };

      updateFaq(param)
        .then((response: any) => {
          clearData();
          message.success(`${response.message}`);
          loading.value = false;

          let isEditFaqNormal = userStore.isEditFaqNormal();
          let isEditFaqEndYear = userStore.isEditFaqEndYear();

          if (searchStore.formState.isFaqCode || (!isEditFaqNormal && isEditFaqEndYear)) {
            router.push('/faq/search?isFaqCode=1');
          } else {
            router.push('/faq/search');
          }
        })
        .catch((error) => {
          message.error(`${error.response.data.message}`);
          loading.value = false;
          Promise.reject(error);
        });
    })
    .catch((error: any) => {
      if(error?.response?.data?.errors?.[0]?.msg) {
        message.error(error?.response?.data?.errors?.[0]?.msg);
      } else { 
        message.error(t('faq-create.uploadFile.error'));
      }
      loading.value = false;
      Promise.reject(error);
    });
};

const clearData = () => {
  try {
    formRef.value?.resetFields();
  } catch (err) {
    console.log(err);
  }
  storeUpdate.formUpdate.displayStartDate = null;
  (storeUpdate.formUpdate.businessCode = null),
    (storeUpdate.formUpdate.categories = [undefined, undefined, undefined, undefined, undefined]);
  (storeUpdate.formUpdate.relatedKeywords = null),
    (storeUpdate.formUpdate.ambiguouKeywords = null),
    (storeUpdate.formUpdate.content = null),
    (storeUpdate.formUpdate.displayEndDate = null),
    (storeUpdate.formUpdate.sortOrder = null),
    (storeUpdate.formUpdate.isFaqCode = false),
    (storeUpdate.formUpdate.answer = [
      {
        key: 1,
        iId: null,
        answerCode: null,
        answerNumber: null,
        sortOrder: 1,
        startTime: null,
        endTime: null,
        answerCondition: 'Include',
        answerRelationCompanies: [],
        answerRelationCompaniesExclude: [],
        faqCodes: [],
        answerRelationCompaniesAndFaqCodes: [],
        companyCodes: [],
        answerRestriction: null,
        content: undefined,
        attachments: [],
        oldUrls: [],
        oldFileId: [],
        oldCompanyCodes: [],
        urls: [
          {
            key: Date.now(),
            type: URL_TYPE.NORMAL,
            title: null,
            link: undefined
          }
        ]
      }
    ]);
};

const popup = ref<Popup>({
  confirmBack: false,
  confirmRegister: false,
  confirmClear: false,
  confirmDelete: false,
  confirmBackToTop: false,
});
watch(formattedInput, () => { });
onMounted(async () => {

  let isEditFaqNormal = userStore.isEditFaqNormal();
  let isEditFaqEndYear = userStore.isEditFaqEndYear();
  let isManager = userStore.isManagerUser();


  canEdit.value = isManager && (isEditFaqNormal || isEditFaqEndYear);

  if (!canEdit.value) {
    message.error(t('faq-detail.user_not_permission'));
    await router.push('/top');
    return;
  }

  loading.value = true;

  await storeUpdate.getBusinessData();
  await store.getCompaniesData();
  await storeUpdate.getRelationCompaniesAndFaqCodes();

  let param: any = {};
  param = {
    faqQuestionNumber: router.currentRoute.value.params['id']
  };

  if (storeUpdate.checkNullForm()) {
    try {
      result.value = await storeUpdate.getDetails(param);
    } catch (error : any) {
      message.error(`${error.response.data.message}`);
      loading.value = false;
      Promise.reject(error);
      router.push('/faq/search');
      return;
    }

    storeUpdate.formUpdate = result.value;
    storeUpdate.formUpdate.categories = [];

    let businessObj = storeUpdate.businesses.filter((item) => {
      return item.businessCode == storeUpdate.formUpdate.businessCode;
    });

    storeUpdate.formUpdate.isFaqCode = businessObj && businessObj[0].isFaqCode == 'true';

    storeUpdate.formUpdate.categories.push(storeUpdate.formUpdate.faqCategoryCode1);
    storeUpdate.formUpdate.categories.push(storeUpdate.formUpdate.faqCategoryCode2?.trim() !== "" ? storeUpdate.formUpdate.faqCategoryCode2 : undefined);
    storeUpdate.formUpdate.categories.push(storeUpdate.formUpdate.faqCategoryCode3?.trim() !== "" ? storeUpdate.formUpdate.faqCategoryCode3 : undefined);
    storeUpdate.formUpdate.categories.push(storeUpdate.formUpdate.faqCategoryCode4?.trim() !== "" ? storeUpdate.formUpdate.faqCategoryCode4 : undefined);
    storeUpdate.formUpdate.categories.push(storeUpdate.formUpdate.faqCategoryCode5?.trim() !== "" ? storeUpdate.formUpdate.faqCategoryCode5 : undefined);

    storeUpdate.formUpdate.displayStartDate = dayjs(
      storeUpdate.formUpdate.displayStartDate,
      'YYYY/MM/DD'
    );
    storeUpdate.formUpdate.displayEndDate = dayjs(
      storeUpdate.formUpdate.displayEndDate,
      'YYYY/MM/DD'
    );
    storeUpdate.formUpdate.answer.forEach((ans) => {
      ans.answerRelationCompanies = [];
      if (ans.companyCodes.length != 0) {
        ans.companyCodes.forEach((companyCode) => {
          ans.answerCondition = companyCode.condition;
          ans.answerRelationCompanies.push(companyCode.companyCode);
        });
      }
    });

  }


  loadCategory(1);
  hanldeRelationCompaniesAndFaqCodes(0);
  for (let index = 0; index < 4; index++) {
    if (storeUpdate.formUpdate.categories[index]) {
      loadCategory(index + 2, storeUpdate.formUpdate.categories[index]);
    }
  }

  await getBreadCrumbs();

  loading.value = false;
});

const handleDeleteFaq = () => {
  loading.value = true;
  const param = {
    faqNumber: router.currentRoute.value.params.id,
  };
  deleteFaq(param)
    .then((response: any) => {
      message.success(`${response.message}`);
      loading.value = false;
      clearData();

      let isEditFaqNormal = userStore.isEditFaqNormal();
      let isEditFaqEndYear = userStore.isEditFaqEndYear();

      if (searchStore.formState.isFaqCode || (!isEditFaqNormal && isEditFaqEndYear)) {
        router.push('/faq/search?isFaqCode=1');
      } else {
        router.push('/faq/search');
      }
    })
    .catch((error) => {
      message.error(`${error.response.data.message}`);
      loading.value = false;
      Promise.reject(error);
    });
};


const getBreadCrumbs = async () => {
  faqBreadCrumbs.value = [];

  faqBreadCrumbs.value.push({
    type: BREAD_CRUMB_TYPE.TOP,
    code: "",
    name: t("common.breadcrumbs.top"),
    class: ''
  });

  let isEditFaqNormal = userStore.isEditFaqNormal();
  let isEditFaqEndYear = userStore.isEditFaqEndYear();

  if (searchStore.formState.isFaqCode || (!isEditFaqNormal && isEditFaqEndYear)) {
    faqBreadCrumbs.value.push({
      type: BREAD_CRUMB_TYPE.TOP_FAQ_END_YEAR,
      code: "",
      name: t("common.breadcrumbs.top-faq-end-year"),
      class: ''
    });
  } else {
    faqBreadCrumbs.value.push({
      type: BREAD_CRUMB_TYPE.TOP_FAQ,
      code: "",
      name: t("common.breadcrumbs.top-faq"),
      class: ''
    });
  }

  faqBreadCrumbs.value.push({
    type: '',
    code: "",
    name: t("faq-create.breadcrumbs"),
    class: ''
  });

};

const currentBreadcrumb = ref<FaqBreadCrumb>();

const handlerClickBreadCrumb = async (item: FaqBreadCrumb, index: Number) => {
  currentBreadcrumb.value = item;
  if (index == (faqBreadCrumbs.value.length - 1)) {
    return;
  }
  popup.value.confirmBack = true;

};

const handlerClickBreadCrumbAction = async () => {
  storeUpdate.businesses = [];
  if (currentBreadcrumb.value?.type == BREAD_CRUMB_TYPE.TOP) {
    searchStore.clearData();
    router.push("/top");
  } else if (currentBreadcrumb.value?.type == BREAD_CRUMB_TYPE.TOP_FAQ) {
    searchStore.clearData();
    router.push({
      path: '/faq/search/', query: {
        companyGroupCode: searchStore.formState.companyGroupCode,
        faqCode: searchStore.formState.faqCode,
        isFaqCode: searchStore.formState.isFaqCode ? END_YEAR_FLAG_VALUE.END_YEAR : END_YEAR_FLAG_VALUE.OTHER,
        searchDate: searchStore.formState.selectedDate?.format(DATE_FORMAT.FULL_DATE),
      }
    });
  } else if (currentBreadcrumb.value?.type == BREAD_CRUMB_TYPE.TOP_FAQ_END_YEAR) {
    router.push({
      path: '/faq/search/', query: {
        companyGroupCode: searchStore.formState.companyGroupCode,
        faqCode: searchStore.formState.faqCode,
        isFaqCode: searchStore.formState.isFaqCode ? END_YEAR_FLAG_VALUE.END_YEAR : END_YEAR_FLAG_VALUE.OTHER,
        searchDate: searchStore.formState.selectedDate?.format(DATE_FORMAT.FULL_DATE),
      }
    });
  } else if (currentBreadcrumb.value?.type == BREAD_CRUMB_TYPE.BUSINESS) {
    router.push({
      path: '/faq/search-category/', query: {
        companyGroupCode: searchStore.formState.companyGroupCode,
        faqCode: searchStore.formState.faqCode,
        isFaqCode: searchStore.formState.isFaqCode ? END_YEAR_FLAG_VALUE.END_YEAR : END_YEAR_FLAG_VALUE.OTHER,
        searchDate: searchStore.formState.selectedDate?.format(DATE_FORMAT.FULL_DATE),
        businessCode: currentBreadcrumb.value?.code,
      }
    });

  } else if (currentBreadcrumb.value?.type == BREAD_CRUMB_TYPE.CATEGORY) {
    router.push({
      path: '/faq/search-category/', query: {
        companyGroupCode: searchStore.formState.companyGroupCode,
        faqCode: searchStore.formState.faqCode,
        isFaqCode: searchStore.formState.isFaqCode ? END_YEAR_FLAG_VALUE.END_YEAR : END_YEAR_FLAG_VALUE.OTHER,
        searchDate: searchStore.formState.selectedDate?.format(DATE_FORMAT.FULL_DATE),
        faqCategory: currentBreadcrumb.value?.code,
      }
    });
  }
}

</script>

<template>
  <page-layout :is-loading="loading">
    <div class="main-page">
      <div class="navigation">
        <div class="navigation-breadcrumb">
          <div class="feature-keyword-item" v-for="(item, index) in faqBreadCrumbs" key="index">
            <span :class="{ 'current': faqBreadCrumbs.length - 1 == index, 'first': index == 0 }"
              @click="handlerClickBreadCrumb(item, index)">
              {{ item.name }}
            </span>
            <span class="item-space">
              <ArrowRightSmall v-if="faqBreadCrumbs.length - 1 != index"></ArrowRightSmall>
            </span>
          </div>
        </div>
        <div class="navigation-btn-group">
          <a-button @click="() => (popup.confirmClear = true)" class="btn-rounned btn-normal">{{
            $t('faq-create.clear.title')
          }}</a-button>
          <a-button :disabled="!isFormFilled" @click="handlePreview" :class="{
            'btn-primary btn-text': isFormFilled,
            'btn-disable btn-rounned': !isFormFilled
          }">{{ $t('faq-create.preview') }}</a-button>
          <ConfigProvider :auto-insert-space-in-button="false">
            <a-button @click="checkValidateAll" :disabled="!isFormFilled" :class="{
              'btn-primary btn-text': isFormFilled,
              'btn-disable btn-rounned': !isFormFilled
            }">{{ $t('faq-create.register.title') }}
            </a-button>
            <a-button @click="() => (popup.confirmDelete = true)" class="btn-primary btn-text">{{
              $t('faq-create.delete.title')
            }}</a-button>
          </ConfigProvider>
        </div>
      </div>
      <div class="page-title text-primary">{{ $t('faq-create.pageTitleUpdate') }}</div>
      <a-form ref="formRef" :model="storeUpdate.formUpdate">
        <!-- Category section -->
        <div class="card category-section">
          <div class="section-header text-primary">{{ $t('faq-create.category.categoryManagement') }}</div>
          <!-- question number -->
          <a-row :gutter="10">
            <a-col class="title" :md="mdSizeLeft" :sm="smSizeLeft" :xs="xsSizeLeft">
              {{ $t('faq-create.category.questionNumber') }}
            </a-col>
            <a-col :md="mdSizeRight" :sm="smSizeRight" :xs="xsSizeRight" class="question-number">{{
              router.currentRoute.value.params.id
            }}</a-col>
          </a-row>

          <!-- business -->
          <a-row>
            <a-col :md="mdSizeLeft" :sm="smSizeLeft" :xs="xsSizeLeft" class="m-t-13">
              <div class="title">
                {{ $t('faq-create.category.businessDepartment') }}
              </div>
              <div class="required-tag">
                <RequiredTag />
              </div>
            </a-col>

            <a-col :md="mdSizeRight" :sm="smSizeRight" :xs="xsSizeRight">
              <a-row>
                <a-form-item name="businessCode" :rules="[
                  {
                    required: true,
                    message:
                      $t('faq-create.category.businessDepartment') + 'の入力必須項目です。',
                    trigger: ['blur', 'change']
                  }
                ]">
                  <a-select class="input-option width-80"
                    :placeholder="$t('faq-create.category.businessDepartmentPlaceholder')" size="large"
                    :show-search="true" option-filter-prop="displayName" @select="() => {
                      handleCategorySelect(1);
                    }
                      " @change="(value: any, business: any) => {
    handleSelectBusiness(value, business)
  }" v-model:value="storeUpdate.formUpdate.businessCode" :options="storeUpdate.businesses" :field-names="{
  value: 'businessCode',
  label: 'displayName'
}">
                  </a-select>
                </a-form-item>
              </a-row>
            </a-col>
          </a-row>

          <!-- category level -->
          <a-row>
            <a-col :md="mdSizeLeft" :sm="smSizeLeft" :xs="xsSizeLeft" class="m-t-13">
              <div class="title">
                {{ $t('faq-create.category.category') }}
              </div>
              <div class="required-tag">
                <RequiredTag />
              </div>
            </a-col>
            <a-col :md="mdSizeRight" :sm="smSizeRight" :xs="xsSizeRight">
              <a-row>
                <a-form-item class="category" v-for="(cate, i) in storeUpdate.formUpdate.categories"
                  :name="['categories', i]" :rules="[
                    {
                      asyncValidator: (_: any, v: any,) => categoryValidator(i, v),
                      trigger: ['blur', 'change']
                    }
                  ]">
                  <a-spin :spinning="spinning[i]">
                    <a-select class="input-option" :placeholder="'階層' + (i + 1) + 'コード：名称'" size="large"
                      :disabled="categoryDisable(i)" @select="(value: any) => handleCategorySelect(i + 2, value)"
                      v-model:value="storeUpdate.formUpdate.categories[i]" :options="storeUpdate.mapCategories[i]"
                      :field-names="{ value: 'categoryCode', label: 'displayName' }" :show-search="true"
                      option-filter-prop="displayName">
                    </a-select>
                  </a-spin>
                </a-form-item>
              </a-row>
            </a-col>
          </a-row>
        </div>
        <!-- Question section -->
        <div class="card question-section">
          <div class="section-header text-primary">{{ $t('faq-create.question.questionManagement') }}</div>

          <!-- question order -->
          <a-row>

            <a-col :md="mdSizeLeft2" :sm="smSizeLeft2" :xs="xsSizeLeft" class="m-t-13">
              <div class="title">
                {{ $t('faq-create.question.order') }}
              </div>
            </a-col>
            <a-col :md="mdSizeRight2" :sm="smSizeRight2" :xs="xsSizeRight">
              <a-row>
                <a-form-item>
                  <a-input-number id="inputNumber" class="input-option width-30" size="large"
                    onkeypress="if ( isNaN( String.fromCharCode(event.keyCode) )) return false;"
                    :placeholder="$t('faq-create.orderPlaceholder')" v-model:value="storeUpdate.formUpdate.sortOrder"
                    :min="1" :max="9007199254740991" />
                </a-form-item>
              </a-row>
            </a-col>
          </a-row>

          <!-- question period -->
          <a-row>
            <a-col :md="mdSizeLeft2" :sm="smSizeLeft2" :xs="xsSizeLeft" class="m-t-13">
              <div class="title">
                {{ $t('faq-create.question.period') }}
              </div>
              <div class="required-tag">
                <RequiredTag />
              </div>
            </a-col>
            <a-col :md="mdSizeRight2" :sm="smSizeRight2" :xs="xsSizeRight">
              <a-row>
                <div class="time-picker date-picker input-option">
                  <a-form-item :name="['displayStartDate']" :rules="[
                    {
                      required: true,
                      message: $t('faq-create.question.period') + 'の入力必須項目です。',
                      trigger: ['blur', 'change']
                    }
                  ]">
                    <date-picker :chosen-date="storeUpdate.formUpdate.displayStartDate || undefined"
                      @change-date="hanldeChangeQuestionStartDate"
                      :place-holder="$t('faq-create.dateStartPlaceholder')" />
                  </a-form-item>
                  <span class="devider">～</span>
                  <a-form-item :name="['displayEndDate']" :rules="[
                    {
                      validator: validateQuestionDateRange,
                      message: $t('faq-create.End_date_must_be_greater_than_start_date'),
                      trigger: ['blur', 'change']
                    }
                  ]">
                    <date-picker :chosen-date="storeUpdate.formUpdate.displayEndDate || undefined"
                      @change-date="hanldeChangeQuestionEndDate" :place-holder="$t('faq-create.dateEndPlaceholder')" />
                  </a-form-item>
                </div>
              </a-row>
            </a-col>
          </a-row>

          <!-- question content -->
          <a-row>
            <a-col :md="mdSizeLeft2" :sm="smSizeLeft2" :xs="xsSizeLeft" class="m-t-5">
              <div class="title">
                {{ $t('faq-create.question.content') }}
              </div>
              <div class="required-tag">
                <RequiredTag />
              </div>
            </a-col>
            <a-col :md="mdSizeRight2" :sm="smSizeRight2" :xs="xsSizeRight">
              <a-row>
                <a-form-item :name="'content'" :rules="[
                  {
                    required: true,
                    message: $t('faq-create.question.content') + $t('faq-create.required'),
                    trigger: ['blur', 'change']
                  },
                  {
                    max: 2000,
                    message: $t('faq-create.question.content') + $t('faq-create.maxlength'),
                    trigger: ['blur', 'change']
                  }
                ]">
                  <div class="input-option textarea width-100">
                    <a-textarea class="height-81" size="large" :placeholder="$t('faq-create.question.content')"
                      v-model:value="storeUpdate.formUpdate.content"></a-textarea>
                  </div>
                </a-form-item>
              </a-row>
            </a-col>
          </a-row>
        </div>

        <!-- Answer section  -->

        <div class="card answer-section" ref="answerSection">
          <div class="answer-nav">
            <div class="section-header text-primary">
              {{ $t('faq-create.answer.answerManagement') }}
            </div>
            <BaseButton :type="addType" @on-click="handleAddAnswer" />
          </div>
          <div v-for="(item, index) in storeUpdate.formUpdate.answer" :key="item.key" class="answer">
            <!-- answer order -->
            <a-row>
              <a-col :md="mdSizeLeft" :sm="smSizeLeft" :xs="xsSizeLeft" class="m-t-13">
                <div class="title">
                  {{ $t('faq-create.answer.order') }}
                </div>
                <div class="required-tag">
                  <RequiredTag />
                </div>
              </a-col>

              <a-col :md="mdSizeRight2" :sm="smSizeRight2" :xs="xsSizeRight">
                <a-row class="answer-order-nav">
                  <a-form-item :name="['answer', index, 'sortOrder']" :rules="[
                    { asyncValidator: checkDuplicateAnswerOrderValidate, trigger: ['blur', 'change'] }
                  ]" class="answer-order-nav-input">
                    <a-input-number :disabled="index <= 0" id="inputNumber" class="input-option width-100" size="large"
                      onkeypress="if( isNaN( String.fromCharCode(event.keyCode) )) return false;"
                      :placeholder="$t('faq-create.orderPlaceholder')" v-model:value="item.sortOrder"
                      @change="handleValidateDuplicate" :min="1" :max="9007199254740991" />
                  </a-form-item>
                  <BaseButton :type="deleteType" v-if="index > 0" @on-click="handleRemoveAnswer(index)" />
                </a-row>
              </a-col>
            </a-row>

            <!-- answer period -->
            <a-row>
              <a-col :md="mdSizeLeft2" :sm="smSizeLeft2" :xs="xsSizeLeft" class="m-t-13">
                <div class="title">
                  {{ $t('faq-create.answer.period') }}
                </div>
                <div class="required-tag">
                  <RequiredTag />
                </div>
              </a-col>
              <a-col :md="mdSizeRight2" :sm="smSizeRight2" :xs="xsSizeRight">
                <a-row>
                  <div class="time-picker date-picker input-option">
                    <a-form-item :name="['answer', index, 'startTime']" :rules="[
                      {
                        required: true,
                        message: $t('faq-create.answer.period') + 'の入力必須項目です。',
                        trigger: ['blur', 'change']
                      }
                    ]">
                      <date-picker @change-date="hanldeChangeAnswerStartDate"
                        :chosen-date="storeUpdate.formUpdate.answer[index].startTime || undefined" :index="index"
                        :place-holder="$t('faq-create.dateStartPlaceholder')" />
                    </a-form-item>
                    <span class="devider">～</span>
                    <a-form-item :name="['answer', index, 'endTime']" :rules="[
                      {
                        asyncValidator: (rules: any, value: any) => validateAnswerDateRange(rules, value, index),
                        message: $t('faq-create.End_date_must_be_greater_than_start_date'),
                        trigger: ['blur', 'change']
                      }
                    ]">
                      <date-picker @change-date="hanldeChangeAnswerEndDate"
                        :chosen-date="storeUpdate.formUpdate.answer[index].endTime || undefined" :index="index"
                        :place-holder="$t('faq-create.dateEndPlaceholder')" />
                    </a-form-item>
                  </div>
                </a-row>
              </a-col>
            </a-row>

            <!-- answer restriction  -->
            <a-row>
              <a-col :md="mdSizeLeft" :sm="smSizeLeft" :xs="xsSizeLeft" class="m-t-13">
                <div class="title">
                  {{ $t('faq-create.answer.restriction') }} <br />
                  <span class="sub-text">（{{ $t('faq-create.answer.affiliatedCompany') }}）</span>
                </div>
                <div class="required-tag">
                  <RequiredTag />
                </div>
              </a-col>

              <a-col :md="mdSizeRight2" :sm="smSizeRight2" :xs="xsSizeRight">
                <a-row class="m-b-5 private">
                  <a-form-item :name="['answer', index, 'answerCondition']" :rules="[
                    {
                      required: true,
                      message: $t('faq-create.answer.affiliatedCompany') + $t('faq-create.required'),
                      trigger: ['blur', 'change']
                    }
                  ]">
                    <a-select class="input-option width-35" :placeholder="conditionList[0]" size="large"
                      v-model:value="item.answerCondition" @change="handleChangeCondition(index)">
                      <a-select-option v-for="(item, i) in conditionList" :key="i" :value="item.value">
                        {{ item.label }}
                      </a-select-option>
                    </a-select>
                  </a-form-item>
                </a-row>
                <a-row id="company">
                  <a-form-item :name="['answer', index, 'faqCodes']" :rules="[
                    {
                      required: true,
                      message: $t('faq-create.answer.affiliatedCompany') + $t('faq-create.required'),
                      trigger: ['blur', 'change']
                    }
                  ]" class="answer-restriction">
                    <a-select v-model:value="storeUpdate.formUpdate.answer[index].faqCodes" mode="multiple"
                      :placeholder="$t('faq-create.companyPlaceholder')"
                      :options="hanldeRelationCompaniesAndFaqCodes(index)" option-filter-prop="name" :field-names="{
                        value: 'code',
                        label: 'name'
                      }" class="answer-company"
                      @change="(value: any[]) => handleChangeCompanyAndFaqCode(value, index)">
                    </a-select>
                  </a-form-item>
                </a-row>
              </a-col>
            </a-row>

            <!-- answer content -->
            <a-row>
              <a-col :md="mdSizeLeft2" :sm="smSizeLeft2" :xs="xsSizeLeft" class="m-t-5">
                <div class="title">
                  {{ $t('faq-create.answer.content') }}
                </div>
                <div class="required-tag">
                  <RequiredTag />
                </div>
              </a-col>
              <a-col :md="mdSizeRight2" :sm="smSizeRight2" :xs="xsSizeRight">
                <a-row>
                  <a-form-item :name="['answer', index, 'content']" :rules="[
                    {
                      required: true,
                      message: $t('faq-create.answer.content') + 'の入力必須項目です。',
                      trigger: ['blur', 'change']
                    },
                    {
                      max: 2000,
                      message: $t('faq-create.answer.content') + $t('faq-create.maxlength'),
                      trigger: ['blur', 'change']
                    }
                  ]">
                    <div class="input-option width-100">
                      <ckeditor :editor="editor" :config="editorConfig"
                        v-model="storeUpdate.formUpdate.answer[index].content" placeholder="回答内容" @ready="onEditorReady"
                        @blur="validateEditor(index)"></ckeditor>
                    </div>
                  </a-form-item>
                </a-row>
              </a-col>
            </a-row>

            <!-- reference url  -->
            <a-row>
              <a-col :md="mdSizeLeft2" :sm="smSizeLeft2" :xs="xsSizeLeft">
                <div class="title">
                  {{ $t('faq-create.answer.referenceURL') }}
                </div>
              </a-col>
              <a-col :md="mdSizeRight2" :sm="smSizeRight2" :xs="xsSizeRight">
                <a-row v-for="(item, i) in storeUpdate.formUpdate.answer[index].urls" :key="item.key">
                  <div class="input-url flex-auto">
                    <!-- <a-form-item class="url-type">
                      <a-select size="large" v-model:value="item.type" v-if="item.type">
                        <a-select-option :value="URL_TYPE.NORMAL">{{ $t('faq.url.urlNormal') }}</a-select-option>
                        <a-select-option :value="URL_TYPE.SHAREFILE">{{ $t('faq.url.urlSharefile') }}</a-select-option>
                      </a-select>
                      <a-select size="large" v-model:value="URL_TYPE.NORMAL" v-else>
                        <a-select-option :value="URL_TYPE.NORMAL">{{ $t('faq.url.urlNormal') }}</a-select-option>
                        <a-select-option :value="URL_TYPE.SHAREFILE">{{ $t('faq.url.urlSharefile') }}</a-select-option>
                      </a-select>
                    </a-form-item> -->
                    <a-form-item :name="['answer', index, 'urls', i, 'title']" :rules="[
                      {
                        asyncValidator: (rules: any, value: any) => validateUrlName(rules, value, index, i),
                        trigger: ['blur', 'change']
                      },
                      {
                        max: 2000,
                        message: $t('faq-create.answer.referenceURL') + $t('faq-create.maxlength'),
                        trigger: ['blur', 'change']
                      }
                    ]" class="url-item">
                      <a-input class="url-name input-height" v-model:value="item.title" placeholder="URL TITLE"
                        size="large" />
                    </a-form-item>
                    <a-form-item :name="['answer', index, 'urls', i, 'link']" :rules="[
                      {
                        asyncValidator: (rules: any, value: any) => validateUrlLink(rules, value, index, i),
                        trigger: ['blur', 'change']
                      },
                      {
                        max: 2000,
                        message: $t('faq-create.answer.referenceURL') + $t('faq-create.maxlength'),
                        trigger: ['blur', 'change']
                      }
                    ]">
                      <a-input class="url-link input-height" v-model:value="item.link" placeholder="https://"
                        size="large" />
                    </a-form-item>
                  </div>
                  <div class="delete-btn">
                    <Delete v-if="i" @click="handleDeleteUrl(index, i)" />
                  </div>
                </a-row>
                <a-row>
                  <BaseButton @on-click="handleAddUrl(index)" :type="addType"
                    :disabled="storeUpdate.formUpdate.answer[index].urls.length >= 5" :style="{ 'margin-top': '5px' }" />
                </a-row>
              </a-col>
            </a-row>

            <a-row class="m-t-5">
              <a-col :md="mdSizeLeft2" :sm="smSizeLeft2" :xs="xsSizeLeft">
                <div class="title">
                  {{ $t('faq-create.answer.relatedFile') }}
                </div>
              </a-col>
              <a-col :md="mdSizeRight2" :sm="smSizeRight2" :xs="xsSizeRight">
                <Upload v-model:files="item.attachments" :is-show-download-btn="true" :size="MAX_FILES" />
              </a-col>
            </a-row>
            <a-divider class="devider-answer" v-if="index !== listAnswerCount - 1" />
          </div>
        </div>

        <div class="card keyword-section">
          <div class="section-header text-primary">{{ $t('faq-create.keywordManagement.keywordTitle') }}</div>
          <a-row>
            <a-col class="title" :md="mdSizeLeft2" :sm="smSizeLeft2" :xs="xsSizeLeft">
              {{ $t('faq-create.keywordManagement.relatedKeyword') }}
            </a-col>
            <a-col :md="mdSizeRight2" :sm="smSizeRight2" :xs="xsSizeRight">
              <a-form-item :name="'relatedKeywords'" :rules="[
                {
                  max: 2000,
                  message:
                    $t('faq-create.keywordManagement.relatedKeyword') +
                    $t('faq-create.maxlength'),
                  trigger: ['blur', 'change']
                }
              ]">
                <a-input class="input-height" size="large" mode="tags"
                  v-model:value="storeUpdate.formUpdate.relatedKeywords" style="width: 100%"
                  :placeholder="$t('faq-create.keywordManagement.relatedkeywordPlaceholder')"></a-input>
              </a-form-item>
              <div class="example">
                <div>{{ $t('faq-create.keywordManagement.relatedKeywordSugggest') }}</div>
              </div>
            </a-col>
          </a-row>
          <a-row>
            <a-col class="title" :md="mdSizeLeft2" :sm="smSizeLeft2" :xs="xsSizeLeft">
              <span>
                {{ $t('faq-create.keywordManagement.relatedAmbiguousKeywordFirstHaft') }}
              </span>
              <br />
              <span>
                {{ $t('faq-create.keywordManagement.relatedAmbiguousKeywordSecondHaft') }}
              </span>
            </a-col>
            <a-col :md="mdSizeRight2" :sm="smSizeRight2" :xs="xsSizeRight">
              <a-form-item :name="'ambiguouKeywords'" :rules="[
                {
                  max: 2000,
                  message:
                    $t('faq-create.keywordManagement.relatedAmbiguousKeywordFirstHaft') +
                    $t('faq-create.keywordManagement.relatedAmbiguousKeywordSecondHaft') +
                    $t('faq-create.maxlength'),
                  trigger: ['blur', 'change']
                }
              ]">
                <a-input class="input-height" size="large" v-model:value="storeUpdate.formUpdate.ambiguouKeywords"
                  style="width: 100%" :placeholder="$t('faq-create.keywordManagement.relatedAmbigousKeywordPlaceholder')
                    "></a-input>
              </a-form-item>
              <div class="example">
                <div>{{ $t('faq-create.keywordManagement.relatedAmbiguousKeywordSuggest') }}</div>
              </div>
            </a-col>
          </a-row>
        </div>
      </a-form>
    </div>

  </page-layout>
  <confirm-dialog v-model:visible="popup.confirmBack" :show-cancel="true" :message="$t('faq-create.back.message')"
    :cancelTitle="$t('common.popup.cancel')" :ok-title="$t('common.popup.confirm')" :type="'right'"
    @close="popup.confirmBack = false" @ok="() => {
      handlerClickBreadCrumbAction();
      clearData();
    }
      "></confirm-dialog>
  <confirm-dialog v-model:visible="popup.confirmClear" :show-cancel="true" :message="'入力中の内容をクリアしますが、よろしいですか？'"
    :cancelTitle="$t('faq-create.cancel')" :type="'right'" @ok="() => {
      loading = true;
      clearData();
      loading = false;
    }
      "></confirm-dialog>
  <confirm-dialog v-model:visible="popup.confirmDelete" :show-cancel="true"
    :message="$t('faq-create.edit.delete.message').replace('※FAQnumber※', router.currentRoute.value.params.id.toString())"
    :cancelTitle="$t('faq-create.cancel')" :type="'right'" @close="popup.confirmDelete = false"
    @ok="handleDeleteFaq"></confirm-dialog>
  <confirm-dialog v-model:visible="popup.confirmRegister" :show-cancel="true" :message="$t('faq-create.register.message')"
    :cancelTitle="$t('faq-create.cancel')" :type="'right'" @ok="submit"></confirm-dialog>
</template>

<style scoped>
@import './../../assets/styles/common.css';
@import './../../assets/styles/page.css';
@import './../../assets/styles/button.css';

.main-page {
  max-width: 1120px;
  margin: 0 auto;
}

.navigation {
  display: flex;
  justify-content: space-between;

  margin-bottom: 40px;
  gap: 20px;
  flex-wrap: wrap;
}

.page-title {
  font-style: normal;
  font-weight: 700;
  font-size: 32px;
  line-height: 40px;
  letter-spacing: 0.25px;
  color: rgba(55, 71, 79, 0.87);
  margin: 20px 10px;
}

.answer> ::v-deep(.ant-row) {
  margin-bottom: 15px;
}

.keyword-section ::v-deep(.ant-row) {
  margin-bottom: 0;
}

.card {
  background-color: #fff;
  border-radius: 10px;
  padding: 30px 40px 50px;
  margin-bottom: 20px;
  box-shadow: 0px 1px 1px rgba(0, 0, 0, 0.2), 0px 2px 2px rgba(0, 0, 0, 0.14),
    0px 1px 5px rgba(0, 0, 0, 0.12);
}


.title-wrap {
  margin-top: 5px;
}

.required-tag {
  margin-right: 20px;
  float: right;
}

.answer-nav {
  display: flex;
  justify-content: space-between;
  margin-right: 60px;
}

.answer-order-nav {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
}

.answer-order-nav ::v-deep(.ant-form-item) {
  width: 30%;
}

.answer-order-nav-input {
  width: 30% !important;
}

.card ::v-deep(.ant-form-item) {
  width: 100%;
  margin: 0;
}

.card ::v-deep(.ant-input-number-lg) {
  border-radius: 5px;
  overflow: hidden;
}

.delete-btn {
  position: absolute;
  right: -30px;
  margin-top: 12px;
  cursor: pointer;
}

.answer-restriction ::v-deep(.ant-select-selector) {
  width: 100%;
  min-height: 80px;
  align-items: start;
  border-radius: 5px;
}

.answer-restriction ::v-deep(.ant-select-selection-placeholder) {
  position: absolute;
  top: 15px;
}

.answer-restriction ::v-deep(.ant-select-selection-item) {
  border: 1px solid rgba(25, 118, 210, 1);
  color: rgba(25, 118, 210, 1);
  background-color: #fff;
  border-radius: 30px;
}

.l-100 {
  left: 100px;
}

.input-option {
  margin: 5px 0;
  display: flex;
  align-items: center;
  gap: 10px;
}

.input-option> ::v-deep(.ant-select-selector) {
  border-radius: 5px;
}

.input-option> ::v-deep(.ant-input) {
  border-radius: 5px;
}

.input-option> ::v-deep(.ant-picker) {
  border-radius: 5px;
}

.input-option>.url-name {
  flex: 3;
}

.input-option>.url-link {
  flex: 7;
}

.input-option> ::v-deep(.ck-reset) {
  width: 100%;
}

.input-option ::v-deep(.ck-editor__main > .ck-editor__editable) {
  min-height: 150px;
}

.input-option ::v-deep(.ck-content p) {
  margin-bottom: 0 !important;
  font-size: 16px;
}

::v-deep(.ant-input-number-input-wrap) {
  border-radius: 5px !important;
  overflow: hidden;
}

.date> ::v-deep(.ant-picker-input) {
  width: 100%;
}

.date {
  width: 100%;
}

.time-picker {
  display: flex;
  align-items: flex-start;
  width: 90%;
}

.time-picker ::v-deep(.ant-picker) {
  width: 100%;
  border-radius: 5px;
}

.url-item {
  width: 35% !important;
  margin-right: 10px !important;
}

.category ::v-deep(.ant-spin-nested-loading) {
  width: 80% !important;
}

:deep(.ant-select-multiple .ant-select-selector:after) {
  display: inline-block;
  width: 0;
  margin: 2px 0;
  line-height: 24px;
  content: '' !important;
}

#company> ::v-deep(.ant-select-selection-placeholder) {
  white-space: break-spaces !important;
  position: absolute;
  top: 30px !important;
}

@media screen and (max-width: 1440px) {
  .back-to-top {
    left: 10px !important;
  }
}

.answer-restriction ::v-deep(.ant-select-selection-placeholder) {
  white-space: break-spaces !important;
  top: 11px;
  transform: none;
}

.answer-restriction ::v-deep(.ant-select-selector) {
  width: 100%;
  min-height: 80px;
  align-items: start;
  border-radius: 5px;
  padding-top: 11px !important;
}

.url-type {
  width: 35% !important;
  margin-right: 10px !important;
}

.url-type ::v-deep(.ant-select-selector) {
  border-radius: 5px;
}

::v-deep(.ant-select-selection-placeholder),
::v-deep(.ck.ck-editor__editable > .ck-placeholder::before),
::v-deep(input::placeholder),
::v-deep(textarea::placeholder) {
  color: rgba(153, 153, 153, 1);
}

::v-deep(.ant-upload.ant-upload-drag) {
  min-height: 150px !important;
}

::v-deep(.ck-editor__editable) {
  /* height: 250px; */
}

.section-header {
  font-style: normal;
  font-weight: 600;
  font-size: 28px;
  line-height: 44.8px;
  letter-spacing: 0.25px;
  color: #007F99;
  margin-bottom: 20px;
  margin-left: 0px;
}

.title {
  margin-left: 10px;
}
</style>
