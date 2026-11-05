export const getInitials = (name: string): string => {
  if (!name) return 'CM';
  const parts = name.trim().split(' ').filter(Boolean);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
};

export const getAvatarColor = (name: string): string => {
  const colors = [
    'bg-teal-600',
    'bg-emerald-600',
    'bg-amber-600',
    'bg-indigo-600',
    'bg-rose-600'
  ];
  let sum = 0;
  for (let i = 0; i < name.length; i++) sum += name.charCodeAt(i);
  return colors[sum % colors.length];
};
