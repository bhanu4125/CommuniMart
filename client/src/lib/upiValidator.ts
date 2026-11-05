export const isValidUPI = (vpa: string): boolean => {
  if (!vpa) return false;
  const regex = /^[a-zA-Z0-9.\-_]{2,256}@[a-zA-Z]{2,64}$/;
  return regex.test(vpa.trim());
};
