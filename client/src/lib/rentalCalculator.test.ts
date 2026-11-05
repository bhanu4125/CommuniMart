import { calculateRental } from './rentalCalculator';

export const testRentalCalculation = () => {
  const res = calculateRental(100, 3, 500);
  if (res.totalRate !== 300) throw new Error('Incorrect rental totalRate calculation');
  if (res.grandTotal !== 800) throw new Error('Incorrect grandTotal calculation');
};
