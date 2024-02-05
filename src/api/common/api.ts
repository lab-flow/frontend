import axios from "axios";
import { authenticationService } from "../../services/authenticationService";
import { tokenExpired } from "./tokenAuth";

const instance = axios.create({
  baseURL: "http://localhost:8000/",
  headers: {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    Accept: "*/*",
  },
});

instance.interceptors.request.use(
  (config) => {
    const token = authenticationService.authHeader;
    if (token) {
      // eslint-disable-next-line
      // @ts-ignore
      config.headers = { ...config.headers, ...token };
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

instance.interceptors.response.use(
  (res) => {
    return res;
  },
  async (err) => {
    const originalConfig = err.config;
    const isTokenExpired = tokenExpired(authenticationService.refreshToken);
    if (isTokenExpired) {
      authenticationService.logout();
      window.location.reload();
      alert("Sesja użytkownika wygasła. Zaloguj się ponownie.");
    }
    if (originalConfig.url !== "/token/" && err.response) {
      if (
        err.response.status === 401 &&
        !originalConfig._retry &&
        !isTokenExpired
      ) {
        originalConfig._retry = true;

        try {
          const rs = await instance.post("/token/refresh/", {
            refresh: authenticationService.refreshToken,
          });

          const { access } = rs.data;
          authenticationService.updateToken(access);

          return instance(originalConfig);
        } catch (_error) {
          return Promise.reject(_error);
        }
      }
    }

    return Promise.reject(err);
  },
);

export default instance;
