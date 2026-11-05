export const formatUnitAddress = (block: string, flatNumber: string, isMasked: boolean = false): string => {
  if (isMasked) {
    return `${block} (Door Masked)`;
  }
  return `${block}, Flat #${flatNumber}`;
};
