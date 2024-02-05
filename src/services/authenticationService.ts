import { get, post } from "../api/common/axios";
import { BehaviorSubject } from "rxjs";
import { ADMIN_ROLE } from "../api/enums/userRoles";

const getParsedFromLocalStorage = (key: string) => {
  const item = localStorage.getItem(key);
  if (item) {
    return JSON.parse(item);
  }
  return null;
};

const currentUserSubject = new BehaviorSubject(
  getParsedFromLocalStorage("user"),
);
const currentUserDataSubject = new BehaviorSubject(
  getParsedFromLocalStorage("userData"),
);

const login = async (username: string, password: string) => {
  const data = {
    username: username,
    password: password,
  };
  return post("/token/", data).then(async (result) => {
    if (result.data.access) {
      localStorage.setItem("user", JSON.stringify(result.data));
      await setCurrentUserData();
      return result;
    }
  });
};

const setCurrentUserData = async () => {
  return await get("/users/me").then((result) => {
    if (result.data) {
      localStorage.setItem("userData", JSON.stringify(result.data));
      return result.data;
    }
  });
};

const logout = () => {
  localStorage.removeItem("user");
  localStorage.removeItem("userData");
  currentUserSubject.next(null);
  currentUserDataSubject.next(null);
};

const register = async (username: string, password: string) => {
  const data = {
    username: username,
    password: password,
  };
  return post("/users/", data).then((response) => {
    if (response.data.access) {
      localStorage.setItem("user", JSON.stringify(response.data));
    }
    return response.data;
  });
};

const refreshToken = () => {
  const user = getParsedFromLocalStorage("user");
  return user?.refresh;
};

const authHeader = () => {
  const user = getParsedFromLocalStorage("user");

  if (user && user.access) {
    return { Authorization: `Bearer ${user.access}` };
  } else {
    return {};
  }
};

const updateToken = (access: string) => {
  const user = getParsedFromLocalStorage("user");
  localStorage.setItem(
    "user",
    JSON.stringify({ access: access, refresh: access ? user.refresh : null }),
  );
  currentUserSubject.next({
    access: access,
    refresh: access ? user.refresh : null,
  });
};

const userRoles = () => {
  const roles = [];
  const userData = getParsedFromLocalStorage("userData");
  if (userData?.is_staff) {
    roles.push(ADMIN_ROLE);
  }
  if (userData?.lab_roles) {
    roles.push(...userData.lab_roles);
  }
  return roles;
};

export const authenticationService = {
  login,
  logout,
  register,
  updateToken,
  currentUser: currentUserSubject.asObservable(),
  get currentUserValue() {
    return currentUserSubject.value;
  },
  get refreshToken() {
    return refreshToken();
  },
  get authHeader() {
    return authHeader();
  },
  get currentUserRoles() {
    return userRoles();
  },
  get currentUserData() {
    return currentUserDataSubject.value;
  },
};
