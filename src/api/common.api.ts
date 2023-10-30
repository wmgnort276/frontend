import { http } from '@/utils/http-client';

const setQuery = (param: any) => {
  const query: any = [];
  Object.entries(param).forEach((entry) => {
    const [key, value] = entry;
    query.push(key + '=' + value);
  });
  return query;
};

export const getBusiness = () => {
  return http.get<any>(`api/business/getBusiness`);
};

export const getCompanyGroupByBusinessCode = (param: any) => {
  const query = setQuery(param);
  return http.get(`api/business/getPermisionCompanyGroup?${query.join('&')}`);
};


export const getTestApi = () => {
  return http.get("WeatherForecast");
}


export const fakeApi = () => {
  return http.get("api/Base")
}