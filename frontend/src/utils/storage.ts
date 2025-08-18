export const getUserTokenFromStorage = (): string | null => {
  return sessionStorage.getItem("token");
};

export const getUserIdFromStorage = (): string | null => {
  return sessionStorage.getItem("userId");
};
