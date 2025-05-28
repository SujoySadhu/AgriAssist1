
import axios from 'axios';
import { getRefreshToken, isAccessTokenExpired, setAuthUser } from './auth';
import { API_BASE_URL } from './constants';
import Cookies from 'js-cookie';

const useAxios = () => {
  const refreshToken = Cookies.get('refresh_token');
  
  const axiosInstance = axios.create({
    baseURL: API_BASE_URL,
    headers: {
      'Content-Type': 'application/json'
    }
  });

  axiosInstance.interceptors.request.use(async (config) => {
    let accessToken = Cookies.get('access_token');
    
    if (accessToken) {
      if (isAccessTokenExpired(accessToken)) {
        try {
          const response = await getRefreshToken(refreshToken);
          accessToken = response.access;
          setAuthUser(response.access, response.refresh);
          Cookies.set('access_token', response.access);
          Cookies.set('refresh_token', response.refresh);
        } catch (error) {
          Cookies.remove('access_token');
          Cookies.remove('refresh_token');
          window.location.href = '/login';
        }
      }
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  });

  return axiosInstance;
};

export default useAxios;
