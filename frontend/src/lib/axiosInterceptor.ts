import axios from 'axios';
import { URL_DEPLOY } from './baseurl';

axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && (error.response.status === 401 || error.response.status === 403)) {
      localStorage.removeItem('token');
      localStorage.removeItem('id_user');
      const isProd = window.location.hostname === 'flowik.netlify.app';
      window.location.href = isProd ? `${URL_DEPLOY}/login` : '/login';
    }
    return Promise.reject(error);
  }
);

export default axios;
