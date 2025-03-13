import { describe, it, expect } from "vitest";
import { isValidChar, applyMask, getCursorPositionAfterPaste } from "./util";
import { Schema } from "./../mask-input";

describe("Utility Functions - isValidChar", () => {
  const tests: {
    name: string;
    char: Schema["symbol"];
    type: Schema["type"];
    want: boolean;
  }[] = [
    {
      name: "validates number",
      char: "5",
      type: "numbers",
      want: true,
    },
    {
      name: "invalidates letter for numbers",
      char: "a",
      type: "numbers",
      want: false,
    },
    {
      name: "invalidates special character for numbers",
      char: "@",
      type: "numbers",
      want: false,
    },
    {
      name: "validates letter",
      char: "a",
      type: "letters",
      want: true,
    },
    {
      name: "invalidates number for letters",
      char: "1",
      type: "letters",
      want: false,
    },
    {
      name: "invalidates special character for letters",
      char: "@",
      type: "letters",
      want: false,
    },
    {
      name: "validates alphanumeric for mixed",
      char: "a",
      type: "mixed",
      want: true,
    },
    {
      name: "validates number for mixed",
      char: "1",
      type: "mixed",
      want: true,
    },
    {
      name: "invalidates special character for mixed",
      char: "!",
      type: "mixed",
      want: false,
    },
  ];

  tests.forEach(({ name, char, type, want }) => {
    it(name, () => {
      expect(isValidChar(char, type)).toBe(want);
    });
  });
});

describe("Utility Functions - applyMask", () => {
  const tests: {
    name: string;
    rawInput: string;
    mask: Schema["mask"];
    staticIndexes: number[];
    symbol: Schema["symbol"];
    want: string;
  }[] = [
    {
      name: "applies mask with static indexes",
      rawInput: "123",
      mask: "(###) ###-####",
      staticIndexes: [0, 4, 5, 9],
      symbol: "#",
      want: "(123) ###-####",
    },
    {
      name: "handles empty raw input",
      rawInput: "",
      mask: "(___) ___-____",
      staticIndexes: [0, 4, 5, 9],
      symbol: "_",
      want: "(___) ___-____",
    },
    {
      name: "handles raw input longer than mask",
      rawInput: "1234567890111",
      mask: "(###) ###-####",
      staticIndexes: [0, 4, 5, 9],
      symbol: "#",
      want: "(123) 456-7890",
    },
    {
      name: "handles custom symbol",
      rawInput: "123",
      mask: "__/__",
      staticIndexes: [2],
      symbol: "_",
      want: "12/3_",
    },
  ];

  tests.forEach(({ name, rawInput, mask, staticIndexes, symbol, want }) => {
    it(name, () => {
      expect(applyMask(rawInput, mask, staticIndexes, symbol)).toBe(want);
    });
  });
});

describe("Utility Functions - getCursorPositionAfterPaste", () => {
  const tests: {
    name: string;
    rawInput: string;
    mask: Schema["mask"];
    staticIndexes: number[];
    want: number;
  }[] = [
    {
      name: "calculates cursor position correctly",
      rawInput: "123",
      mask: "(###) ###-####",
      staticIndexes: [0, 4, 5, 9],
      want: 6,
    },
    {
      name: "handles empty raw input",
      rawInput: "",
      mask: "(###) ###-####",
      staticIndexes: [0, 4, 5, 9],
      want: 1,
    },
    {
      name: "handles raw input longer than mask",
      rawInput: "1234567890111",
      mask: "(###) ###-####",
      staticIndexes: [0, 4, 5, 9],
      want: 14,
    },
  ];

  tests.forEach(({ name, rawInput, mask, staticIndexes, want }) => {
    it(name, () => {
      expect(getCursorPositionAfterPaste(rawInput, mask, staticIndexes)).toBe(
        want
      );
    });
  });
});
