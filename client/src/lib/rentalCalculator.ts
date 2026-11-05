export interface RentalQuote {
  totalRate: number;
  deposit: number;
  grandTotal: number;
}

export const calculateRental = (
  unitPrice: number,
  durationCount: number,
  deposit: number = 0
): RentalQuote => {
  const totalRate = Math.max(0, unitPrice * durationCount);
  const grandTotal = totalRate + deposit;
  return { totalRate, deposit, grandTotal };
};
