import type { Dayjs } from 'dayjs';
import type { number } from 'zod';
import type { Ref } from 'vue';

export interface FaqDataSearch {
  faqNumber: string;
  content: string;
}

export interface RelatedFile {
  filePath: string;
}

export interface SelectOptions {
  value: string;
  label: string;
}

export interface UrlItem {
  key: any;
  urlType: string | null;
  urlName: string | null | undefined;
  urlLink: string | undefined;
}

export interface Answer {
  key: any;
  answerOrder: number | null | undefined;
  isAnswerStartClear: boolean;
  answerStartDate: Dayjs | null | undefined;
  answerEndDate: Dayjs | null | undefined;
  isAnswerEndClear: boolean;
  answerRestriction: string | null | undefined;
  answerContent: string | undefined;
  answerCondition: string | null | undefined;
  answerRelationCompanies: string[];
  answerRelationCompaniesExclude: string[];
  faqCodes: string[];
  answerRelationCompaniesAndFaqCodes: RelationCompaniesAndFaqCodes[];
  chosenCompaniesAndFaqCodes: string[];
  answerReferenceUrl: UrlItem[];
  answerFiles: any[];
}

export interface FormRequest {
  businessDepartment: string | null | undefined;
  firstLevelCategories: string[];
  categories: (string | undefined | null)[];
  category_1: string | null | undefined;
  category_2: string | null | undefined;
  category_3: string | null | undefined;
  category_4: string | null | undefined;
  category_5: string | null | undefined;
  relatedKeywords: string | null | undefined;
  ambiguouKeywords: string | null | undefined;
  listBreadcrumb: string[];

  keywords: string[];
  isFaqCode: boolean;

  question: {
    questionOrder: number | null | undefined;
    questionStartDate: Dayjs | null | undefined;
    isQuestionStartClear: boolean;
    questionEndDate: Dayjs | null | undefined;
    isQuestionEndClear: boolean;
    questionContent: string | null | undefined;
  };
  answer: Answer[];
}

export interface File {
  status: string;
  name: string;
  type: string;
  percent: string;
  size: number;
  uid: string;
}

export interface CustomUploadOptions {
  file: File;
  onSuccess: (result: string) => void;
  onError: (error: Error) => void;
}

export interface Category {
  categoryCode: string;
  categoryName: string;
}

export interface CategoryParent{
  code: string;
  name: string;
  type: string;
}

export interface CategoryTreeItem {
  title: string;
  key: string;
  children: CategoryTreeItem[];
  type: string;
  businessCode: string;
}

export interface Business {
  businessCode: string;
  businessName: string;
  isFaqCode: string;
  displayName: string;
}

export interface Company {
  companyGroupName: string;
  companyGroupCode: string;
}

export interface FaqCode {
  faqName: string;
  faqCode: string;
}

export interface RelationCompaniesAndFaqCodes {
  name: string;
  code: string;
  type: number;
  originalName: string;
}

export interface Dialog {
  message: string;
  onOK: any;
  onCancel: any;
  visible: boolean;
}

export interface Popup {
  confirmBack: boolean;
  confirmRegister: boolean;
  confirmClear: boolean;
  confirmDelete: boolean;
  confirmBackToTop: boolean;
}

export interface FaqDetail {
  ambiguouKeywords: string | undefined;
  businessCode: string | undefined;
  businessName: string | undefined;
  companyName: string | undefined;
  content: string | undefined;
  displayEndDate: string | undefined;
  displayStartDate: string | undefined;
  faqCategoryCode1: string | undefined;
  faqCategoryCode2: string | undefined;
  faqCategoryCode3: string | undefined;
  faqCategoryCode4: string | undefined;
  faqCategoryName1: string | undefined;
  faqCategoryName2: string | undefined;
  faqCategoryName3: string | undefined;
  faqCategoryName4: string | undefined;
  faqNumber: string | undefined;
  relatedKeywords: string | undefined;
  answer: FaqAnswerDetail | undefined;

  isEndYear: false;
}

export interface FaqAnswerDetail {
  answerCode: string | undefined;
  answerNumber: string | undefined;
  content: string | undefined;
  EndTime: string | undefined;
  FaqQuestionCode: string | undefined;
  FileAttachment: string | undefined;
  SortOrder: string | undefined;
  StartTime: string | undefined;
  Status: string | undefined;
  a_id: string | undefined;
  created_at: string | undefined;
  created_by: string | undefined;
  d_id: string | undefined;
  i_id: string | undefined;
  p_id: string | undefined;
  rev_no: number;
  attachments: Attachment[] | undefined;
  urls: Url[] | undefined;
}

export interface Attachment {
  fileName: string;
  fileId: string;
  fileSize: number;
}

export interface Url {
  urlLink: string;
  urlTitle: string;
}

export interface FormResponse {
  value: any;
  businessCode: string | null | undefined;
  categories: (string | undefined)[];

  firstLevelCategories: (string)[];

  faqCategoryCode1: string | undefined;
  faqCategoryCode2: string | undefined;
  faqCategoryCode3: string | undefined;
  faqCategoryCode4: string | undefined;
  faqCategoryCode5: string | undefined;
  relatedKeywords: string | null | undefined;
  ambiguouKeywords: string | null | undefined;
  faqCode: string | null | undefined;

  faqNumber: string | null;
  listBreadcrumb: string[];
  sortOrder: number | null | undefined;
  iId: string | null | undefined;
  content: string | null | undefined;
  displayEndDate: Dayjs | null | undefined;
  displayStartDate: Dayjs | null | undefined;
  answer: AnswerResponse[];

  isFaqCode: boolean;
  oldAnswerId: string | null | undefined;

  keywords: string[];
}

export interface AnswerResponse {
  key: any;
  iId: string | null | undefined;
  answerCode: string | null | undefined;
  answerNumber: string | null | undefined;
  sortOrder: number | null | undefined;
  startTime: Dayjs | null | undefined;
  endTime: Dayjs | null | undefined;
  answerRestriction: string | null | undefined;
  content: string | undefined;
  answerCondition: string | null | undefined;
  answerRelationCompanies: string[];
  answerRelationCompaniesExclude: string[];
  companyCodes: AnswerCompany[];
  faqCodes: string[];
  answerRelationCompaniesAndFaqCodes: RelationCompaniesAndFaqCodes[];
  urls: UrlAnswer[];
  oldUrls: string[];
  oldFileId: string[];
  oldCompanyCodes: string[];
  attachments: any[];
}

export interface AnswerCompany {
  companyCode: any;
  condition: any;
  type: any;
}

export interface UrlAnswer {
  key: any;
  type: string | null | undefined;
  title: string | null | undefined;
  link: string | undefined;
}

export interface DataImport {
  FaqNumber: string;
  FaqCode: string;
  BusinessCode: string;
  SortOrder: number;
  FaqCategoryCode1: string;
  FaqCategoryCode2: string;
  FaqCategoryCode3: string;
  FaqCategoryCode4: string;
  FaqCategoryCode5: string;
  DisplayStartDate: Dayjs | null | undefined;
  DisplayEndDate: Dayjs | null | undefined;
  Content: string;
  RelatedKeywords: string;
  AmbiguouKeywords: string;
}

export interface SearchFormRequest {
  companyGroupCode: string | null;
  faqCode: string | null;
  selectedDate: Dayjs | null | undefined;
  searchText: string | null;

  searchTextDisplay: string | null;
  selectCategory: string | null;
  selectBusiness: string | null;
  isFaqCode: boolean | null;
  selectedTree: string[] | [];
}

export interface FaqTable {
  currentPage: number;
  pageSize: number;
  totalItem: number;
  pageSizeOptions: string[];
  data: FaqDataSearch[];
}
export interface ShareFile {
  fileNumber: string | null | undefined;
  department: string | null | undefined;
  businessCode: string | null | undefined;
  companyGroupCode: RelationCompaniesAndFaqCodes[];
  note: string | null | undefined;
  title: string | null | undefined;
  description : string | null | undefined;
  attachments: any[];
}

export interface BreadCrumbs {
  name: string | null;
  code: string | null;
  type: string | null;
  class: string | null;
}


export interface FaqBreadCrumb{
  name: string | null;
  type: string | null;
  class: string | null;
  code: string | null;
}
