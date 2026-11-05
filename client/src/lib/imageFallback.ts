export const DEFAULT_PRODUCT_FALLBACK = 'https://images.unsplash.com/photo-1589367920969-ab8e050bbb04?w=600';

export const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
  e.currentTarget.src = DEFAULT_PRODUCT_FALLBACK;
};
