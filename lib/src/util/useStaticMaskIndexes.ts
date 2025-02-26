import { useMemo } from "react";

const useStaticMaskIndexes = (mask: string, symbol: string) => {
  const staticIndexes = useMemo(() => {
    const indexes = [];
    for (let i = 0; i < mask.length; i++) {
      if (mask[i] !== symbol) {
        indexes.push(i);
      }
    }
    return indexes;
  }, [mask, symbol]);

  return staticIndexes;
};

export default useStaticMaskIndexes;
