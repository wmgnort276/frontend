<script setup lang="ts">
import { ref, computed, watch, onMounted, h, onBeforeMount } from 'vue';
import DatePicker from '@/components/common/DatePicker.vue';
import RequiredTag from '@/components/common/RequiredTag.vue';
import BaseButton from '@/components/common/BaseButton.vue';
import LeftOutlined from '@/components/icon/LeftOutlined.vue';
import PageLayout from '../layouts/PageLayout.vue';
import Upload from '@/components/common/Upload.vue';
import BackToTop from '@/components/common/button/BackToTop.vue';
import Delete from '@/components/icon/Delete.vue';
import router from '@/router';
import dayjs, { Dayjs } from 'dayjs';
import type { FormInstance } from 'ant-design-vue/es/form';
import { getBusiness, getCompanies, createFaq } from '@/api/faq.api';
import {
  CATEGORY_LEVEL,
  FAQ_CONDITION,
  FAQ_CONDITION_TYPE,
  T_TIME_END_DEFAULT,
  MAX_FILES,
  END_YEAR_FLAG_VALUE,
  DATE_FORMAT,
} from '@/stores/constants/constant';
import { useFaqCreateStore } from '@/stores/faqCreate.store';
import ConfirmDialog from '@/components/common/dialog/ConfirmDialog.vue';
import type { Dialog, Popup } from '@/types/interfaces/faq';
import { useI18n } from 'vue-i18n';
import { uploadFilesFaq } from '@/api/file.api';
import CKEditor from '@ckeditor/ckeditor5-vue';
import { ConfigProvider, message } from 'ant-design-vue';
import { checkCompanyOfBusiness } from '@/api/faq.api';
import { URL_TYPE } from '@/stores/constants/constant';
import { useAuthStoreHook, useAuthStore } from '@/stores/auth.store';
import { nextTick } from 'vue';

import { useFaqSearchStore } from '@/stores/faqSearch.store';
import {
  BREAD_CRUMB_TYPE
} from '@/stores/constants/constant';

import type {
  FaqBreadCrumb
} from '@/types/interfaces/faq';

const { t } = useI18n();
const store = useFaqCreateStore();
const loading = ref<boolean>(false);
const spinning = ref<boolean[]>([false, false, false, false, false]);
let companyGroups = ref<any>('');
let faqCodes = ref<any>('');
let conditionShow = ref<boolean>(false);
let isFaqCode = ref<boolean>(false);
let relationCompaniesAndFaqCodes = ref<any>('');
  let messageBackToSearch = ref<string>('');

const canEdit = ref<boolean>(false);
const { authUser } = useAuthStoreHook();
const answerSection = ref<HTMLElement | null>(null);

const searchStore = useFaqSearchStore();

const faqBreadCrumbs = ref<FaqBreadCrumb[]>([]);

const relatedKeywords = ref<string[]>([]);
const userStore = useAuthStore();

const categoryDisable = (index: number): boolean => {
  if (index == 0) {
    return !store.formState.businessDepartment;
  } else {
    return !store.formState.categories[index - 1];
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
  clearArray(store.formState.categories, level - 1);
  if (level > 5) {
    return;
  } else {
    let param: any = {};
    if (level == 1) {
      param = {
        businessCode: store.formState.businessDepartment,
        level: level
      };
    } else {
      param = {
        categoryCode: category,
        level: level
      };
    }
    spinning.value[level - 1] = true;
    store.mapCategories[level - 1] = await store.getListCategories(param);

    if (level == 1) {
      store.formState.firstLevelCategories = store.mapCategories[level - 1].map((item) => {
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

const checkRequired = (value: any) => {
  return new Promise((resolve, reject) => {
    if (!value) {
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
  return !store.checkNullForm() && !store.checkEmptyAnswers();
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
    ],
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
  return store.formState.answer.length;
});

const formattedInput = ref<string>('');
const formRef = ref<FormInstance>();

const handleAddAnswer = async () => {
  store.formState.answer.push({
    key: Date.now(),
    answerOrder: undefined,
    answerStartDate: null,
    isAnswerStartClear: false,
    answerCondition: 'Include',
    answerRelationCompanies: [],
    answerRelationCompaniesExclude: [],
    faqCodes: [],
    answerRelationCompaniesAndFaqCodes: [],
    chosenCompaniesAndFaqCodes: [],
    answerEndDate: null,
    isAnswerEndClear: false,
    answerRestriction: '',
    answerFiles: [],
    answerContent: '',
    answerReferenceUrl: [
      {
        key: Date.now(),
        urlType: URL_TYPE.NORMAL,
        urlName: '',
        urlLink: ''
      }
    ]
  });
  await nextTick();
  answerSection.value?.lastElementChild?.scrollIntoView({ behavior: 'smooth' })
};
const onEditorReady = (editor: any) => {
  editorInstance.value = editor;
};

const onQuestionStartDateChanged = (v: any, text: any) => {
  if (!store.formState.question.questionStartDate) {
    formRef.value?.validateFields([['question', 'questionStartDate']]);
  }
  if (store.formState.question.questionStartDate && store.formState.question.questionEndDate) {
    formRef.value?.validateFields([['question', 'questionEndDate']]);
  }
};

const hanldeChangeQuestionStartDate = (value: any) => {
  store.formState.question.questionStartDate = value;

  if (!store.formState.question.questionStartDate?.isValid()) {
    store.formState.question.questionStartDate = null;
  }

  if (store.formState.question.questionStartDate && store.formState.question.questionEndDate) {
    formRef.value?.validateFields([['question', 'questionEndDate']]);
  }
};

const hanldeChangeQuestionEndDate = (value: any) => {
  store.formState.question.questionEndDate = value;
  if (!store.formState.question.questionEndDate?.isValid()) {
    store.formState.question.questionEndDate = null;
  }
};

const hanldeChangeAnswerStartDate = (value: any, index: any) => {
  store.formState.answer[index].answerStartDate = value;

  if (!store.formState.answer[index].answerStartDate?.isValid()) {
    store.formState.answer[index].answerStartDate = null;
  }

  if (
    store.formState.answer[index].answerStartDate &&
    store.formState.answer[index].answerEndDate
  ) {
    formRef.value?.validateFields([['answer', index, 'answerEndDate']]);
  }
};

const hanldeChangeAnswerEndDate = (value: any, index: any) => {
  store.formState.answer[index].answerEndDate = value;

  if (!store.formState.answer[index].answerEndDate?.isValid()) {
    store.formState.answer[index].answerEndDate = null;
  }
};

const handleFileChange = (index: number, files: File[]) => {
  store.formState.answer[index].answerFiles = files.slice(0, 5);
};

const onInputUrlName = (v: any, text: any, answerIndex: number, UrlIndex: number) => {
  if (v.data) {
    formRef.value?.validateFields([
      ['answer', answerIndex, 'answerReferenceUrl', UrlIndex, 'urlLink']
    ]);
  }
};
const checkRangeStartedTime = (date: any) => {
  let d = dayjs(date);
  return d.isBefore(store.formState.question.questionStartDate);
};

const checkDuplicateAnswerOrderValidate = (rules: any, value: number) => {
  return new Promise((resolve, reject) => {
    if (!value) reject(t('faq-create.answer.order') + t('faq-create.required'));
    const arr = store.formState.answer.map((item) => item.answerOrder);
    const count = arr.filter((item) => Number(item) === Number(value)).length;
    if (count > 1) {
      reject(t('faq-create.Duplicated'));
    } else {
      resolve('');
    }
  });
};

const handleValidateDuplicate = (index: number) => {
  const arr = [];
  for (let i = 0; i < store.formState.answer.length; i++) {
    arr.push(['answer', i, 'answerOrder']);
  }

  formRef.value?.validateFields(arr);
};

const validateQuestionDateRange = (_: any, value: any) => {
  const startDate = store.formState.question.questionStartDate;
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
  const startDate = store.formState.answer[index].answerStartDate;
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
  formRef.value?.validateFields([['answer', index, 'answerContent']]);
};

const handleRemoveAnswer = (index: number) => {
  store.formState.answer.splice(index, 1);
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
    if (store.formState.answer[index].answerCondition !== 'Exclude') {
      companyGroups.unshift({
        company: t('faq-create.allOption'),
        companyGroupCode: FAQ_CONDITION_TYPE.IS_COMPANYGROUP_CODE
      });
    }
  }

  return companyGroups;
};

const validateUrlLink = (rules: any, value: any, indexOfAnswer: number, indexOfUrlLink: number) => {
  const regex =
    /(\b25[0-5]|\b2[0-4][0-9]|\b[01]?[0-9][0-9]?)(\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}|[(http(s)?):\/\/(www\.)?a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/; // eslint-disable-line
  return new Promise((resolve, reject) => {
    if (store.formState.answer[indexOfAnswer].answerReferenceUrl[indexOfUrlLink].urlName) {
      if (!store.formState.answer[indexOfAnswer].answerReferenceUrl[indexOfUrlLink].urlLink) {
        reject(t('faq-create.url_link_required'));
      } else if (!regex.test(value)) {
        reject(t('faq.url.invalid'));
      } else {
        resolve('');
      }
    }
    else if (!store.formState.answer[indexOfAnswer].answerReferenceUrl[indexOfUrlLink].urlName &&
      store.formState.answer[indexOfAnswer].answerReferenceUrl[indexOfUrlLink].urlLink) {
      formRef.value?.validateFields([['answer', indexOfAnswer, 'answerReferenceUrl', indexOfUrlLink, 'urlName']])
    }
    else {
      resolve('');
    }
  });
};

const validateUrlName = (rules: any, value: any, indexOfAnswer: number, indexOfUrlLink: number) => {
  return new Promise((resolve, reject) => {
    if (
      store.formState.answer[indexOfAnswer].answerReferenceUrl[indexOfUrlLink].urlLink &&
      !store.formState.answer[indexOfAnswer].answerReferenceUrl[indexOfUrlLink].urlName
    ) {
      reject(t('faq-create.url_name_required'));
    }
    else if (!store.formState.answer[indexOfAnswer].answerReferenceUrl[indexOfUrlLink].urlLink &&
      store.formState.answer[indexOfAnswer].answerReferenceUrl[indexOfUrlLink].urlName) {
      formRef.value?.validateFields([['answer', indexOfAnswer, 'answerReferenceUrl', indexOfUrlLink, 'urlLink']])
    }
    else {
      resolve('');
    }
  });
};

const handleAddUrl = (answerIndex: number) => {
  if (store.formState.answer[answerIndex].answerReferenceUrl.length < 5) {
    store.formState.answer[answerIndex].answerReferenceUrl.push({
      key: Date.now(),
      urlType: URL_TYPE.NORMAL,
      urlName: '',
      urlLink: ''
    });
  }
};

const handleDeleteUrl = (answerIndex: number, index: number) => {
  store.formState.answer[answerIndex].answerReferenceUrl.splice(index, 1);
};

const handleChangeCondition = (index: any) => {
  if (store.formState.answer[index].answerCondition == 'Exclude') {
    // Remove all option in the list
    store.formState.answer[index].chosenCompaniesAndFaqCodes = store.formState.answer[
      index
    ].chosenCompaniesAndFaqCodes.filter((item) => {
      return item !== FAQ_CONDITION_TYPE.IS_ALL_OPTION_CODE;
    });

    store.formState.answer[index].answerRelationCompaniesAndFaqCodes = store.formState.answer[
      index
    ].answerRelationCompaniesAndFaqCodes.filter((item) => {
      return item.code !== FAQ_CONDITION_TYPE.IS_ALL_OPTION_CODE;
    });

    const answerRelationCompaniesExclude = store.companies.filter(
      (i) => !store.formState.answer[index].answerRelationCompanies.includes(i.companyGroupCode)
    );
    store.formState.answer[index].answerRelationCompaniesExclude =
      answerRelationCompaniesExclude.map((i) => i.companyGroupName);
  } else {
    const answerRelationCompaniesExclude = store.companies.filter((i) =>
      store.formState.answer[index].answerRelationCompanies.includes(i.companyGroupCode)
    );
    store.formState.answer[index].answerRelationCompaniesExclude =
      answerRelationCompaniesExclude.map((i) => i.companyGroupName);
  }
};

const handleChangeCompanyAndFaqCode = (value: string[], index: number) => {
  let answerRelationCompaniesAndFaqCodes: { name: string; code: string; type: number; originalName: string }[] = [];

  // Loop though list of CompaniesAndFaqCodes to add type of data
  store.formState.answer[index].chosenCompaniesAndFaqCodes.map((item: any) => {
    if (item !== FAQ_CONDITION_TYPE.IS_ALL_OPTION_CODE) {
      store.relationCompaniesAndFaqCodes.forEach((e) => {
        if (e.code === item) {
          answerRelationCompaniesAndFaqCodes.push({
            code: e.code,
            type: e.type,
            name: e.name,
            originalName: e.originalName,
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

  store.formState.answer[index].answerRelationCompaniesAndFaqCodes =
    answerRelationCompaniesAndFaqCodes;
};

const checkBusinessAndCompany = async () => {
  const answers = store.formState.answer.map((item) => {
    return {
      responseStartDate: item.answerStartDate?.format(DATE_FORMAT.FULL_DATE),
      responseEndDate: item.answerEndDate?.format(DATE_FORMAT.FULL_DATE),
      contentAnswer: item.answerContent?.trim(),
      referenceUrl: [
        ...item.answerReferenceUrl.map((url) => {
          return {
            urlLink: url.urlLink?.trim(),
            title: url.urlName?.trim()
          };
        })
      ],

      condition: item.answerCondition?.trim(),
      companyCodes: item.answerRelationCompanies,
      faqCodes: item.faqCodes,
      relationCompaniesAndFaqCodes: item.answerRelationCompaniesAndFaqCodes,
      type: store.formState.businessDepartment?.trim(),
      answerFiles: item.answerFiles,
      sortOrder: item.answerOrder
    };
  });

  let param = {
    businessCode: store.formState.businessDepartment?.trim(),
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

  const answers = store.formState.answer.map((item) => {
    return {
      answerFiles: item.answerFiles
    };
  });

  let res: any = await checkBusinessAndCompany();

  const formData = new FormData();
  let isErrorMaxFile = false;
  answers.forEach((answer) => {
    if (answer.answerFiles && answer.answerFiles.length > MAX_FILES) {
      isErrorMaxFile = true;
    }
    answer.answerFiles.forEach((file) => {
      formData.append('files', file['originFileObj']);
    });
  });
  formData.append('totalAnswer', store.formState.answer.length.toString());
  if (isErrorMaxFile) {
    message.error(t('faq-create.uploadFile.max_attachment'));
    loading.value = false;
    return;
  }
  // Check file uploaded
  await uploadFilesFaq(formData)
    .then(() => {
      uploadStatus = true;
    })
    .catch((error: any) => {
      if(error?.response?.data?.errors?.[0]?.msg) {
        message.error(error?.response?.data?.errors?.[0]?.msg);
      } else {
        message.error(t('faq-create.uploadFile.error'));
      }
      loading.value = false;
    });

  if (res.status == true && uploadStatus) {
    // Handle when validate company success
    const listBreadcum = [];
    const business = store.businesses.filter((item) => {
      if (item.businessCode == store.formState.businessDepartment) {
        return item;
      }
    });

    store.formState.isFaqCode = business && business[0].isFaqCode == 'true';

    if(!store.formState.isFaqCode){
      listBreadcum.push(business[0].businessName);
    }

    store.formState.categories.forEach((category) => {
      if (category != null) {
        store.mapCategories.forEach((originalCategory) => {
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

    store.formState.listBreadcrumb = listBreadcum;
    store.formState.keywords = await store.getKeywordByBusiness();

    store.businesses = [];
    formRef.value
      ?.validateFields()
      .then(async (_: any) => {
        await router.push('/faq/preview');
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
  const answers = store.formState.answer.map((item) => {
    if (item.answerFiles && item.answerFiles.length > MAX_FILES) {
      isErrorMaxFile = true;
    }
    return {
      responseStartDate: item.answerStartDate?.format('YYYY-MM-DD') + 'T00:00:00Z',
      responseEndDate:
        (item.answerEndDate?.format('YYYY-MM-DD') || T_TIME_END_DEFAULT) + 'T00:00:00Z',
      contentAnswer: item.answerContent?.trim(),
      referenceUrl: [
        ...item.answerReferenceUrl.filter(item => (item.urlName && item.urlLink)).map((url, index) => {
          return {
            urlType: url.urlType?.trim(),
            urlLink: url.urlLink?.trim(),
            title: url.urlName?.trim(),
            sortOrder: index + 1
          };
        })
      ],

      condition: item.answerCondition?.trim(),
      companyCodes: item.answerRelationCompanies,
      faqCodes: item.faqCodes,
      relationCompaniesAndFaqCodes: item.answerRelationCompaniesAndFaqCodes,
      type: store.formState.businessDepartment?.trim(),
      answerFiles: item.answerFiles,
      sortOrder: item.answerOrder
    };
  });
  if (isErrorMaxFile) {
    message.error(t('faq-create.uploadFile.max_attachment'));
    loading.value = false;
    return;
  }

  const formData = new FormData();

  // let res: any = await checkBusinessAndCompany();

  // loading.value = false;

  // // When business and compnay or faqcode is not valid
  // if (res.status == false) {
  //   message.error(res.message);
  //   return;
  // }

  answers.forEach((answer) => {
    answer.answerFiles.forEach((file) => {
      formData.append('files', file['originFileObj']);
    });
  });

  formData.append('totalAnswer', store.formState.answer.length.toString());

  uploadFilesFaq(formData)
    .then((response: any) => {
      let count = 0;
      answers.forEach((answer) => {
        for (let index = 0; index < answer.answerFiles.length; index++) {
          answer.answerFiles[index]['fileId'] = response.data.listFileId[count];
          count++;
        }
      });
      const param = {
        businessCode: store.formState.businessDepartment?.trim(),
        categoryLevel1: store.formState.categories[0]?.trim(),
        categoryLevel2: store.formState.categories[1]?.trim(),
        categoryLevel3: store.formState.categories[2]?.trim(),
        categoryLevel4: store.formState.categories[3]?.trim(),
        categoryLevel5: store.formState.categories[4]?.trim(),
        relatedKeywords: store.formState.relatedKeywords?.trim(),
        ambiguouKeywords: store.formState.ambiguouKeywords?.trim(),
        contentQuestion: store.formState.question.questionContent?.trim(),
        displayPeriodQuestionStart:
          store.formState.question.questionStartDate?.format('YYYY-MM-DD') + 'T00:00:00Z',
        displayPeriodQuestionEnd:
          (store.formState.question.questionEndDate?.format('YYYY-MM-DD') || T_TIME_END_DEFAULT) +
          'T00:00:00Z',
        sortOrder: store.formState.question.questionOrder,
        answers: answers
      };

      createFaq(param)
        .then((response: any) => {
          clearData();
          message.success(response.message);

          let isEditFaqNormal = userStore.isEditFaqNormal();
          let isEditFaqEndYear = userStore.isEditFaqEndYear();

          if (searchStore.formState.isFaqCode || (!isEditFaqNormal && isEditFaqEndYear)) {
            router.push('/faq/search?isFaqCode=1');
          }else{
            router.push('/faq/search');
          }

          loading.value = false;
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
  formRef.value?.resetFields();
  store.formState.question.questionStartDate = null;
  (store.formState.businessDepartment = null),
    (store.formState.categories = [undefined, undefined, undefined, undefined, undefined]);
  (store.formState.relatedKeywords = null),
    (store.formState.ambiguouKeywords = null),
    (store.formState.question = {
      questionOrder: null,
      questionStartDate: null,
      isQuestionStartClear: false,
      questionEndDate: null,
      isQuestionEndClear: true,
      questionContent: ''
    }),
    (store.formState.answer = [
      {
        key: 1,
        answerOrder: 1,
        answerStartDate: null,
        isAnswerStartClear: true,
        answerEndDate: null,
        isAnswerEndClear: true,
        answerCondition: 'Include',
        answerRelationCompanies: [],
        answerRelationCompaniesExclude: [],
        faqCodes: [],
        answerRelationCompaniesAndFaqCodes: [],
        chosenCompaniesAndFaqCodes: [],
        answerRestriction: null,
        answerContent: undefined,
        answerFiles: [],
        answerReferenceUrl: [
          {
            key: Date.now(),
            urlType: URL_TYPE.NORMAL,
            urlName: null,
            urlLink: undefined
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



watch(formattedInput, (newVal) => { });
onMounted(async () => {

  let isEditFaqNormal = userStore.isEditFaqNormal();
  let isEditFaqEndYear = userStore.isEditFaqEndYear();
  let isManager = userStore.isManagerUser();


  canEdit.value = isManager && (isEditFaqNormal || isEditFaqEndYear);

  if (!canEdit.value) {
    message.error(t('faq-detail.user_not_permission'));
    await router.push('/top');
    loading.value = false;
    return;
  }

  loading.value = true;


  await store.getBusinessData();
  await store.getRelationCompaniesAndFaqCodes();

  await getBreadCrumbs();
  loading.value = false;
});

const hanldeRelationCompaniesAndFaqCodes = (index: any) => {
  relationCompaniesAndFaqCodes = store.relationCompaniesAndFaqCodes;

  relationCompaniesAndFaqCodes = relationCompaniesAndFaqCodes.map((item: any) => {
    return {
      ...item
    };
  });

  if (store.formState.answer[index].answerCondition !== 'Exclude') {
    relationCompaniesAndFaqCodes.unshift({
      name: t('faq-create.allOption'),
      code: FAQ_CONDITION_TYPE.IS_ALL_OPTION_CODE,
      type: FAQ_CONDITION_TYPE.IS_ALL_OPTION
    });
  }

  return relationCompaniesAndFaqCodes;
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
    messageBackToSearch.value = t('faq-create.back.toFaqEndYearMsg');
  } else {
    faqBreadCrumbs.value.push({
      type: BREAD_CRUMB_TYPE.TOP_FAQ,
      code: "",
      name: t("common.breadcrumbs.top-faq"),
      class: ''
    });
    messageBackToSearch.value = t('faq-create.back.message');
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

  if (store.checkExistForm()) {
    if(currentBreadcrumb.value?.type == BREAD_CRUMB_TYPE.TOP) {
      popup.value.confirmBackToTop = true;
    } else if (currentBreadcrumb.value?.type == BREAD_CRUMB_TYPE.TOP_FAQ 
     || currentBreadcrumb.value?.type == BREAD_CRUMB_TYPE.TOP_FAQ_END_YEAR) {
      popup.value.confirmBack = true;
    }
  } else {
    handlerClickBreadCrumbAction();
  }
};

const handlerClickBreadCrumbAction = async () => {
  clearData();
  store.businesses = [];
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
            <span :class="{ 'current': faqBreadCrumbs.length - 1 == index }" @click="handlerClickBreadCrumb(item, index)">
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
            <a-button @click="checkValidateAll()" :disabled="!isFormFilled" :class="{
              'btn-primary btn-text': isFormFilled,
              'btn-disable btn-rounned': !isFormFilled
            }">{{ $t('faq-create.register.title') }}
            </a-button>
            <a-button :disabled="!isShowBtnDelete" @click="() => (popup.confirmDelete = true)" :class="{
              'btn-primary btn-text': isShowBtnDelete,
              'btn-disable btn-rounned': !isShowBtnDelete
            }">{{ $t('faq-create.delete.title') }}</a-button>
          </ConfigProvider>
        </div>
      </div>
      <div class="page-title text-primary">{{ $t('faq-create.pageTitle') }}</div>
      <a-form ref="formRef" :model="store.formState">
        <!-- Category section -->
        <div class="card category-section">
          <div class="section-header text-primary">{{ $t('faq-create.category.categoryManagement') }}</div>
          <!-- question number -->
          <a-row :gutter="10">
            <a-col class="title" :md="mdSizeLeft" :sm="smSizeLeft" :xs="xsSizeLeft">
              {{ $t('faq-create.category.questionNumber') }}
            </a-col>
            <a-col :md="mdSizeRight" :sm="smSizeRight" :xs="xsSizeRight" class="question-number">{{
              $t('faq-create.orderText')
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
                <a-form-item name="businessDepartment" :rules="[
                  {
                    required: true,
                    message:
                      $t('faq-create.category.businessDepartment') + $t('faq-create.required'),
                    trigger: ['blur', 'change']
                  }
                ]">
                  <template v-if="false" #extra> <span style="color: #ff4d4f"></span> </template>
                  <a-select class="input-option width-80"
                    :placeholder="$t('faq-create.category.businessDepartmentPlaceholder')" size="large" :showSearch="true"
                    optionFilterProp="displayName" @select="() => {
                      handleCategorySelect(1);
                    }
                      " @change="(value: any, business: any) => {
    handleSelectBusiness(value, business)
  }" v-model:value="store.formState.businessDepartment" :options="store.businesses" :fieldNames="{
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
                <a-form-item class="category" v-for="(cate, i) in store.formState.categories" :name="['categories', i]"
                  :rules="[
                    {
                      asyncValidator: (_: any, v: any,) => categoryValidator(i, v),
                      trigger: ['blur', 'change']
                    }
                  ]">
                  <a-spin :spinning="spinning[i]">
                    <a-select class="input-option" :placeholder="'階層' + (i + 1) + 'コード：名称'" size="large"
                      :disabled="categoryDisable(i)" @select="(value: any) => handleCategorySelect(i + 2, value)"
                      v-model:value="store.formState.categories[i]" :options="store.mapCategories[i]"
                      :fieldNames="{ value: 'categoryCode', label: 'displayName' }" :showSearch="true"
                      optionFilterProp="displayName">
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
                <a-form-item :name="['question', 'questionOrder']">
                  <a-input-number id="inputNumber" class="input-option width-30" size="large"
                    onkeypress="if ( isNaN( String.fromCharCode(event.keyCode) )) return false;"
                    :placeholder="$t('faq-create.orderPlaceholder')"
                    v-model:value="store.formState.question.questionOrder" :min="1" :max="9007199254740991" />
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
                  <a-form-item :name="['question', 'questionStartDate']" :rules="[
                    {
                      required: true,
                      message: $t('faq-create.question.period') + $t('faq-create.required'),
                      trigger: ['blur', 'change']
                    }
                  ]">
                    <date-picker :chosen-date="store.formState.question.questionStartDate || undefined"
                      @change-date="hanldeChangeQuestionStartDate"
                      :place-holder="$t('faq-create.dateStartPlaceholder')" />
                  </a-form-item>
                  <span class="devider">～</span>
                  <a-form-item :name="['question', 'questionEndDate']" :rules="[
                    {
                      validator: validateQuestionDateRange,
                      message: $t('faq-create.End_date_must_be_greater_than_start_date'),
                      trigger: ['blur', 'change']
                    }
                  ]">
                    <date-picker :chosen-date="store.formState.question.questionEndDate || undefined"
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
                <a-form-item :name="['question', 'questionContent']" :rules="[
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
                      v-model:value="store.formState.question.questionContent"></a-textarea>
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
          <div v-for="(item, index) in store.formState.answer" :key="item.key" class="answer">
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
                  <a-form-item :name="['answer', index, 'answerOrder']" :rules="[
                    {
                      asyncValidator: checkDuplicateAnswerOrderValidate,
                      trigger: ['blur', 'change']
                    }
                  ]" class="answer-order-nav-input">
                    <a-input-number :disabled="index <= 0" id="inputNumber" class="input-option width-100" size="large"
                      :min="1" :max="9007199254740991"
                      onkeypress="if( isNaN( String.fromCharCode(event.keyCode) )) return false;"
                      :placeholder="$t('faq-create.orderPlaceholder')" v-model:value="item.answerOrder"
                      @change="handleValidateDuplicate" />
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
                    <a-form-item :name="['answer', index, 'answerStartDate']" :rules="[
                      {
                        required: true,
                        message: $t('faq-create.answer.period') + $t('faq-create.required'),
                        trigger: ['blur', 'change']
                      }
                    ]">
                      <date-picker :chosen-date="store.formState.answer[index].answerStartDate || undefined"
                        @change-date="hanldeChangeAnswerStartDate" :index="index"
                        :place-holder="$t('faq-create.dateStartPlaceholder')" />
                    </a-form-item>
                    <span class="devider">～</span>
                    <a-form-item :name="['answer', index, 'answerEndDate']" :rules="[
                      {
                        asyncValidator: (rules: any, value: any) => validateAnswerDateRange(rules, value, index),
                        message: $t('faq-create.End_date_must_be_greater_than_start_date'),
                        trigger: ['blur', 'change']
                      }
                    ]">
                      <date-picker :chosen-date="store.formState.answer[index].answerEndDate || undefined"
                        @change-date="hanldeChangeAnswerEndDate" :index="index"
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
                  <span class="sub-text"> （{{ $t('faq-create.answer.affiliatedCompany') }}）</span>
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
                      <a-select-option v-for="(item, index) in conditionList" :key="index" :value="item.value">
                        {{ item.label }}
                      </a-select-option>
                    </a-select>
                  </a-form-item>
                </a-row>
                <a-row id="company">
                  <a-form-item :name="['answer', index, 'answerRelationCompaniesAndFaqCodes']" :rules="[
                    {
                      required: true,
                      message: $t('faq-create.answer.affiliatedCompany') + $t('faq-create.required'),
                      trigger: ['blur', 'change']
                    }
                  ]" class="answer-restriction">
                    <a-select v-model:value="store.formState.answer[index].chosenCompaniesAndFaqCodes" mode="multiple"
                      :placeholder="$t('faq-create.companyPlaceholder')"
                      :options="hanldeRelationCompaniesAndFaqCodes(index)" optionFilterProp="name" :fieldNames="{
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
                  <a-form-item :name="['answer', index, 'answerContent']" :rules="[
                    {
                      required: true,
                      message: $t('faq-create.answer.content') + $t('faq-create.required'),
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
                        v-model="store.formState.answer[index].answerContent" @ready="onEditorReady"
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
                <a-row v-for="(item, i) in store.formState.answer[index].answerReferenceUrl" :key="item.key">
                  <div class="input-url flex-auto">
                    <!-- No need to use url type -->
                    <!-- <a-form-item class="url-type">
                      <a-select size="large" v-model:value="item.urlType">
                        <a-select-option :value="URL_TYPE.NORMAL">{{ $t('faq.url.urlNormal') }}</a-select-option>
                        <a-select-option :value="URL_TYPE.SHAREFILE">{{ $t('faq.url.urlSharefile') }}</a-select-option>
                      </a-select>
                    </a-form-item> -->
                    <a-form-item :name="['answer', index, 'answerReferenceUrl', i, 'urlName']" :rules="[
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
                      <a-input class="url-name input-height" v-model:value="item.urlName" placeholder="URL TITLE" size="large" />
                    </a-form-item>
                    <a-form-item :name="['answer', index, 'answerReferenceUrl', i, 'urlLink']" :rules="[
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
                      <a-input class="url-link input-height" v-model:value="item.urlLink" placeholder="https://" size="large" />
                    </a-form-item>
                  </div>
                  <div class="delete-btn">
                    <Delete v-if="i" @click="handleDeleteUrl(index, i)" />
                  </div>
                </a-row>
                <a-row>
                  <BaseButton @on-click="handleAddUrl(index)"
                    :disabled="store.formState.answer[index].answerReferenceUrl.length >= 5" :type="addType"
                    :style="{ 'margin-top': '5px' }" />
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
                <Upload :isShowDownloadBtn="false" v-model:files="item.answerFiles" :size="MAX_FILES" />
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
                <a-input class="input-height" :rows="1" size="large" style="width: 100%"
                  :placeholder="$t('faq-create.keywordManagement.relatedkeywordPlaceholder')"
                  v-model:value="store.formState.relatedKeywords"></a-input>
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
                <a-input class="input-height" :rows="1" size="large" style="width: 100%" :placeholder="$t('faq-create.keywordManagement.relatedAmbigousKeywordPlaceholder')
                  " v-model:value="store.formState.ambiguouKeywords">
                </a-input>
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
  <confirm-dialog v-model:visible="popup.confirmBack" :show-cancel="true"
    :message="messageBackToSearch"
    :ok-title="$t('common.popup.confirm')" :cancelTitle="$t('common.popup.cancel')" :type="'right'" @ok="() => {
      handlerClickBreadCrumbAction();
      clearData();
    }
      "></confirm-dialog>

  <confirm-dialog v-model:visible="popup.confirmBackToTop" :show-cancel="true" :message="$t('common.popup.backToTop')"
    :ok-title="$t('common.popup.confirm')" :cancelTitle="$t('common.popup.cancel')" :type="'right'" @ok="() => {
      handlerClickBreadCrumbAction();
      clearData();
    }
      "></confirm-dialog>
      
  <confirm-dialog v-model:visible="popup.confirmClear" :show-cancel="true" :show-ok="true"
    :message="$t('faq-create.clear.message')" :cancelTitle="$t('faq-create.cancel')" :type="'right'" @ok="() => {
      loading = true;
      clearData();
      loading = false;
    }
      "></confirm-dialog>
  <confirm-dialog v-model:visible="popup.confirmDelete" :show-cancel="true" :show-ok="true"
    :message="$t('faq-create.delete.message')" :cancelTitle="$t('faq-create.cancel')"
    :okTitle="$t('faq-create.delete.okTitle')" :type="'right'" @ok="() => {
      router.push('/faq/search');
      clearData();
    }
      "></confirm-dialog>
  <confirm-dialog v-model:visible="popup.confirmRegister" :show-cancel="true" :show-ok="true"
    :message="$t('faq-create.register.message')" :cancelTitle="$t('faq-create.cancel')" :type="'right'"
    @ok="submit"></confirm-dialog>
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
  padding-top: 11px !important;
}

.answer-restriction ::v-deep(.ant-select-selection-placeholder) {
  white-space: break-spaces !important;
  top: 11px;
  transform: none;
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

.url-type {
  width: 35% !important;
  margin-right: 10px !important;
}

.url-type ::v-deep(.ant-select-selector) {
  border-radius: 5px;
}

.category ::v-deep(.ant-spin-nested-loading) {
  width: 80% !important;
}

:deep(.ant-select-selector:after) {
  display: inline-block;
  width: 0;
  margin: 2px 0;
  line-height: 24px;
  content: '' !important;
}

@media screen and (max-width: 1440px) {
  .back-to-top {
    left: 10px !important;
  }
}

::v-deep(.ant-select-selection-placeholder),
::v-deep(.ck.ck-editor__editable > .ck-placeholder::before) ,
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
