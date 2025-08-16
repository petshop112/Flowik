const maskEmail = (email: string): string => {
  const [username, domain] = email.split("@");

  if (!username || !domain) return email;

  if (username.length <= 2) {
    return email;
  }

  const firstChar = username[0];
  const lastChar = username[username.length - 1];
  const hiddenPart = "*".repeat(username.length - 2);

  return `${firstChar}${hiddenPart}${lastChar}@${domain}`;
};

export default maskEmail;
