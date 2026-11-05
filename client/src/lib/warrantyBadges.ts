export const getWarrantyLabel = (months?: number): string => {
  if (!months || months <= 0) return 'No Warranty';
  if (months === 12) return '1 Year Manufacturer Warranty';
  return `${months} Months Warranty`;
};
