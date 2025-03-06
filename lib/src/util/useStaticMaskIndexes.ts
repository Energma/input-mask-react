const useStaticMaskIndexes = (mask: string, symbol: string): number[] => {
  const indexes = [];
  for (let i = 0; i < mask.length; i++) {
    if (mask[i] !== symbol) {
      indexes.push(i);
    }
  }
  return indexes;
};

export default useStaticMaskIndexes;
