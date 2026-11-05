export const getSoundVolume = (): number => {
  const val = localStorage.getItem('sound_volume');
  return val ? parseFloat(val) : 0.8;
};

export const setSoundVolume = (vol: number) => {
  localStorage.setItem('sound_volume', String(Math.max(0, Math.min(1, vol))));
};
