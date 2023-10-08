export interface SearchForm {
  department: string | null;
  business: string | null;
  title: string | null;
  file_description: string | null;
  requiredRequest: boolean;
}

export interface CreateForm {
  department: string | null;
  business: string | null;
  companyGroup: Array<string>[] | null;
  memoShare: string | null;
  title: string | null;
  description: string | null;
  fileAttachments: any[];
}

export interface RequestForm {
  assignUsers: any[] | [];
  comment: string;
}

export interface AcceptRequestForm {
  comment: string | null;
}

export interface ShareFileDetail {
  title: string | null;
  description: string | null;
  note: string | null;
  shareFileNumber: string | null;
  status: string;
  fileAttachmentDetails: FileAttachment[] | null;
  editStatus: boolean
}

export interface FileAttachment {
  fileName: string | null;
  fileId: string | null;
  fileSize: number;
  checked: boolean | null | undefined;
}

export interface ShareFileDetails {
  fileNumber: string | null;
  businessCode: string | null;
  companyGroups: any[] | null;
  department: string | null;
  fileAttachment: any[];
  description: string | null;
  procescer: string | null;
  note: string | null;
  title: string | null;
  createdBy: string | null;
  updatedBy: string | null;
  updatedAt: string | any | null;
  processStatus: string | null;
  userAssigned: UserAssigned[] | [];
  subShareFile: boolean;
}

export interface UserAssigned {
  shareFileNumber: string | null;
  userId: string | null;
}

export interface CompanyGroupBusiness {
  businessCode: string | null;
  companyGroupCode: string | null;
  companyGroupName: string | null;
  title: string | null;
}

export interface ShareFileSearchForm {
  department: string | null | undefined;
  businessCode: string | null;
  title: string | null | undefined;
  description: string | null | undefined;
  scrutinyRequest: boolean | null;
}

export interface ShareFileTableData {
  shareFileNumber: string | null;
  department: string | null;
  businessName: string | null;
  title: string | null;
  status: string | null;
  updatedAt: string | null;
  updatedBy: string | null;
  refShareFileNumber: string | null;
}

export interface ShareFileTable {
  currentPage: number;
  pageSize: number;
  totalItem: number;
  pageSizeOptions: string[];
  data: ShareFileTableData[];
}
