export const validateBio = (bio: string): boolean => {
  if (!bio) return true;
  return bio.trim().length <= 300;
};

export const validatePhoneNumber = (phone: string): boolean => {
  if (!phone) return false;
  const digits = phone.replace(/\D/g, '');
  return digits.length >= 10 && digits.length <= 13;
};
