const parseJwt = (token: string) => {
  try {
    return JSON.parse(atob(token.split(".")[1]));
  } catch (e) {
    return null;
  }
};

export const tokenExpired = (token: string) => {
  const decodedJwt = parseJwt(token);

  return decodedJwt?.exp * 1000 < Date.now();
};
