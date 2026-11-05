/**
 * Format Indian Rupee currency with proper comma grouping
 */
export const formatINR = (amount: number): string => {
  if (amount === 0) return '₹0 / Free';
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(amount);
};

export const formatCompactNumber = (num: number): string => {
  return new Intl.NumberFormat('en-IN', { notation: 'compact' }).format(num);
};
