export const isValidIndianMobile = (phone: string): boolean => {
  if (!phone) return false;
  const cleaned = phone.replace(/[^0-9]/g, '');
  return /^[6-9]\d{9}$/.test(cleaned.slice(-10));
};
