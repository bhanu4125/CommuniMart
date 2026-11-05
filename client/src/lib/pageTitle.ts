export const updatePageTitle = (subTitle?: string) => {
  const base = 'CommuniMart • Green Meadows Gated Community';
  document.title = subTitle ? `${subTitle} | ${base}` : base;
};
