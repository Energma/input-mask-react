import { useMemo } from "react";

const useStaticMaskIndexes = (mask: string, symbol: string) => {
    const indexes = [];
    for (let i = 0; i < mask.length; i++) {
      if (mask[i] !== symbol) {
        indexes.push(i);
      }
    }
    return indexes;
};

export default useStaticMaskIndexes;
