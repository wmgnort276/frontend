
export interface FormChangePassword {
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface FormSignUp {
  username: string,
  email: string,
  password: string,
  confirmPassword: string,
}