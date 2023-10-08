export interface FormInput {
  companyGroup: string | null | undefined;
  companyName: string | null | undefined;
  selectedMail: string | null | undefined;
  editMail: string | null | undefined;
  mailConfirm: string | null | undefined;
  creatorId: string | null | undefined;
  creatorName: string | null | undefined;
  userEmail: string | null | undefined;
  classifiedBusiness: string | null;
  toMailAddress: string | null;
  titleMail: string | null;
  contentMail: string | null;
  createDate: Date | string | null;
  contactDomain: string | null | undefined;
  contactTypeName: string | null | undefined;
  contactTypeCode: string | null | undefined;
  relatedCode: string | null | undefined;
}

export interface ContactType {
  contactTypeName: string;
  contactTypeCode: string;
  contactDomain: string;
  contactMailRecipient: string;
  companyGroupCode: string;
}

export interface UserEmail {
  userEmail: string | null | undefined;
  userEmailCode: string | null | undefined;
}