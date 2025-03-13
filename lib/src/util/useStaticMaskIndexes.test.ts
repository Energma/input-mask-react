import { describe, it, expect } from "vitest";
import useStaticMaskIndexes from "./useStaticMaskIndexes";

describe("useStaticMaskIndexes", () => {
  const tests = [
    {
      name: "identifies static indexes in phone number mask",
      mask: "+7 (___) ___-__-__",
      symbol: "_",
      want: [0, 1, 2, 3, 7, 8, 12, 15],
    },
    {
      name: "identifies static indexes in date mask",
      mask: "__.__.____",
      symbol: "_",
      want: [2, 5],
    },
    {
      name: "identifies static indexes in credit card mask",
      mask: "0000 0000 0000 0000",
      symbol: "0",
      want: [4, 9, 14],
    },
    {
      name: "identifies static indexes in custom symbol mask",
      mask: "##-##-##",
      symbol: "#",
      want: [2, 5],
    },
    {
      name: "handles mask with no static characters",
      mask: "______",
      symbol: "_",
      want: [],
    },
    {
      name: "handles empty mask",
      mask: "",
      symbol: "_",
      want: [],
    },
  ];

  tests.forEach(({ name, mask, symbol, want }) => {
    it(name, () => {
      expect(useStaticMaskIndexes(mask, symbol)).toEqual(want);
    });
  });
});
