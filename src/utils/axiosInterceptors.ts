import axios from "axios";
import { loadAuthState, loadToken, storeToken } from "../store/authStore/storage";
import { logoutSuccess } from "../store/authStore/AuthSlice";


let store: any;

export const injectStore = (_store: any) => {
  store = _store;
};

export const axiosAssets = axios.create({
  baseURL: `/assets`,
});
const axiosInstance = axios.create({
  baseURL: `/api/v1`,
});


axiosInstance.interceptors.request.use((config) => {
  if (authToken) {
    config.headers["Authorization"] = `Bearer ${authToken}`;
  }

  return config;
});

axiosInstance.interceptors.response.use(
  (value) => {
    return value;
  },
  async (error) => {
    if (error.response && error.response.status === 403) {
      console.error("403 Hatası Oluştu:", error.message);

      if (loadAuthState().id !== 0) {
        const response = await axiosInstance.post("/auth/refresh", {
          userId: loadAuthState().id,
        });

        if (response.status === 200) {
          setToken(response.data);
          const retryResponse = await axios.request(error.config);
          return retryResponse;
        }
      }
    }
    if (error.response && error.response.status === 409) {
      store.dispatch(logoutSuccess());
    }
    return Promise.reject(error);
  }
);

let authToken = loadToken();

export function setToken(token?: any) {
  authToken = token;
  storeToken(token);
}

export default axiosInstance;