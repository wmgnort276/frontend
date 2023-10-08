const ACCESS_TOKEN_KEY = 'accessToken';
const USER_TYPE_KEY = 'userType';
const FAQ_KEY = 'faqKey';

const setAccessToken = (accessToken: string) => {
  localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
};

const getAccessToken = () => {
  return localStorage.getItem(ACCESS_TOKEN_KEY) || '';
};

const clearAccessToken = () => {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
};

const setUserType = (useType: string) => {
  localStorage.setItem(USER_TYPE_KEY, useType);
};

const getUserType = () => {
  return localStorage.getItem(USER_TYPE_KEY) || '';
};

const clearUserType = () => {
  localStorage.removeItem(USER_TYPE_KEY);
};

const setFaq = (faq: any) => {
  localStorage.setItem(FAQ_KEY, faq);
};

const getFaq = () => {
  return localStorage.getItem(FAQ_KEY) || '';
};

const clearFaq = () => {
  localStorage.removeItem(FAQ_KEY);
};

export default {
  setAccessToken,
  getAccessToken,
  clearAccessToken,
  setUserType,
  getUserType,
  clearUserType,
  setFaq,
  getFaq,
  clearFaq
};
