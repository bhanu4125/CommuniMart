export const formatNoticeDate = (isoDate: string | Date): string => {
  const d = new Date(isoDate);
  return d.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit'
  });
};
