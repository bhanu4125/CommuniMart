import { isValidUPI } from './upiValidator';

export const testUPIValidator = () => {
  if (!isValidUPI('neighbor@okhdfcbank')) throw new Error('Valid UPI rejected');
  if (isValidUPI('invalid-upi')) throw new Error('Invalid UPI accepted');
};
