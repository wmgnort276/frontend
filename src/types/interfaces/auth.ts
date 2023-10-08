export interface AuthUser {
  // email: string;
  // role: number;
  UserName: string;
  UserType: string;
  UserId: string;
  FirstName: string;
  LastName: string;

  LastNameKanji: string;
  NameKanji: string;

  LoginUserId: string;
  lookup_items: {
    CompanyId: {
      CompanyCode: string;
      CompanyName: string;
    };
  };
  companyFunctions: Array<Functional>;
  functions: Array<Functional>;
  i_id: string;
  CompanyCode: string;
  IsAuthority: string;
  Email: string;
  CompanyGroupCode: string;
}


export interface Functional {
  functionCode: string;
  flag: string;
}

export interface FormChangePassword {
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
}
