export const getOrderStatusBadgeStyle = (status: string): string => {
  switch (status) {
    case 'Requested':
      return 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300';
    case 'Accepted by Neighbor':
      return 'bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300';
    case 'Ready for Handover':
      return 'bg-teal-100 text-teal-800 dark:bg-teal-950/60 dark:text-teal-300';
    case 'Completed':
      return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300';
    case 'Cancelled':
      return 'bg-rose-100 text-rose-800 dark:bg-rose-950/80 dark:text-rose-300 border border-rose-300/40';
    default:
      return 'bg-zinc-100 text-zinc-800 dark:bg-zinc-800 dark:text-zinc-300';
  }
};
