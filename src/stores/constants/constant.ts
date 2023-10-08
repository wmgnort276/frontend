export const NOTIFICATION_BUSINESS_DIVISION = {
  SOCIAL_SECURITY: 1,
  IMPORTANT: 2,
  UNREAD: 3,
  YEAR: 4
};

export const NOTIFICATION_STATUS = {
  ACCEPTED: 1,
  SENT: 2,
  RECEIVED: 3
};

export const USER_TYPE = {
  EMPLOYEE: 'UserEmployee',
  FAQ: 'UserFAQ',
  MANAGER: 'UserManager',
  SYSTEM_ADMIN: 'SystemAdmin'
};

export enum EmailField {
  Edit,
  Registed
}

export const CATEGORY_LEVEL = {
  LEVEL1: 1,
  LEVEL2: 2,
  LEVEL3: 3,
  LEVEL4: 4,
  LEVEL5: 5
};

export const FAQ_CONDITION = [
  {
    value: 'Include',
    label: '含む'
  },
  {
    value: 'Exclude',
    label: '共通に含まない'
  }
];

export const FAQ_CONDITION_TYPE = {
  IS_COMPANYGROUP: 1,
  IS_COMPANYGROUP_CODE: '-1',
  IS_FAQCODE: 0,
  IS_ALL_OPTION: -1,
  IS_ALL_OPTION_CODE: 'ALL_全社'
};

export const T_TIME_END_DEFAULT = '2999-12-31';

export const HEADER_CSV =
  'FAQ番号(質問番号), 回答番号, 業務区分, 階層１, 階層２, 階層３, 階層４, ' +
  '階層５, 質問_表示順, 質問_表示開始日, 質問_表示終了日, 質問_内容, 質問_削除, 回答_表示順, 回答_表示開始日, ' +
  '回答_表示終了日, 回答_条件：含む・含まない, 回答_条件：個社指定, 回答_内容, 回答_削除, URL1_タイトル, ' +
  'URL1_リンク, URL2_タイトル, URL2_リンク, URL3_タイトル, URL3_リンク, URL4_タイトル, URL4_リンク, URL5_タイトル, ' +
  'URL5_リンク, 添付ファイル1_ファイル名, 添付ファイル2_ファイル名, 添付ファイル3_ファイル名, 添付ファイル4_ファイル名, ' +
  '添付ファイル5_ファイル名, 添付ファイル6_ファイル名, 添付ファイル7_ファイル名, 添付ファイル8_ファイル名, 関連キーワード, あいまい検索キーワード\n';

export const SHAREFILE_STATUS = {
  TEMPORARILY_SAVE: '一時保存',
  PENDING_REVIEW: '精査待ち',
  REGISTERED: '精査済み',
  IS_SUB_SHARE_FILE: '精査済み・編集不可',
  NOT_SUB_SHARE_FILE: '精査済み・編集可能'
};
export const SHAREFILE_STATE_DRAF = '一時保存';

export const URL_TYPE = {
  NORMAL: '0',
  SHAREFILE: '1'
};

export const FAQ_INCLUDE = 'Include';
export const FAQ_EXCLUDE = 'Exclude';
export const MAX_FILES = 8;

export const BREAD_CRUMB_TYPE = {
  TOP: 'top',
  TOP_FAQ: 'TopFaq',
  TOP_FAQ_END_YEAR: 'TopFaqEndYear',
  BUSINESS: 'Business',
  CATEGORY: 'Category',
  FAQ_CODE: 'FaqCode',
  BULK_UPLOAD: 'BulkUpload'
};

export const USER_FUNCTION_TYPE = {
  FAQ: 'FFAQ-NORMAL',
  FAQ_END_YEAR: 'FFAQ-DCCN',
  SHARE_FILE: 'SHARE-FILE'
};

export const USER_FUNCTION_FLAG_VALUE = {
  FULL_ACCESS: '0',
  READ_ONLY: '1',
  NOT_ACCESS: '2'
};

export const COMPANY_FUNCTION_FLAG_VALUE = {
  ACCESS: 'true',
  NOT_ACCESS: 'false'
}

export const BREAD_CRUMB_NAME = {
  SEARCH_RESULT: '検索結果'
}

export const FILE_SIZE_DEFAULT = '0 KB';


export const END_YEAR_FLAG_VALUE = {
  END_YEAR: '1',
  OTHER: '0',
}

export const DATE_FORMAT = {
  FULL_DATE: 'YYYY-MM-DDTHH:mm:ssZ',
}

export const TRUE_VALUE = "True";

export const FALSE_VALUE = "False";