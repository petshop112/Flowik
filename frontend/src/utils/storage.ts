export const getUserTokenFromStorage = (): string | null => {
  return localStorage.getItem('token');
};

export const getUserIdFromStorage = (): string | null => {
  return localStorage.getItem('userId');
};
