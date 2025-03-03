import { Schema } from "../mask-input";

export const createCursorManager = (mask: string, symbol: string) => {
  const findNextInputPosition = (currentPos: number): number => {
    const nextEmptyPos = mask.indexOf(symbol, currentPos);
    return nextEmptyPos !== -1 ? nextEmptyPos : mask.length;
  };

  const findPreviousInputPosition = (currentPos: number): number => {
    let pos = currentPos;
    while (pos > 0 && mask[pos - 1] !== symbol) {
      pos--;
    }
    return pos;
  };

  const calculateCursorPosition = (
    cursorPos: number,
    lastFilledPosition: number,
    formatted: string
  ): number => {
    if (cursorPos > lastFilledPosition) {
      return findNextInputPosition(lastFilledPosition + 1);
    } else {
      const nextInputPos = formatted.indexOf(symbol, cursorPos);
      return nextInputPos !== -1 ? nextInputPos : formatted.length;
    }
  };

  return {
    findNextInputPosition,
    findPreviousInputPosition,
    calculateCursorPosition,
  };
};

export const cleanValue = (input: string, type: Schema["type"]): string => {
  switch (type) {
    case "numbers":
      return input.replace(/[^\d]/g, "");
    case "letters":
      return input.replace(/[^a-zA-Z]/g, "");
    case "mixed":
    default:
      return input.replace(/[^a-zA-Z0-9]/g, "");
  }
};

// Ensure the character is valid based on schema type
export const isValidChar = (
  currentChar: string,
  type: Schema["type"]
): boolean => {
  switch (type) {
    case "numbers":
      return /\d/.test(currentChar);
    case "letters":
      return /[a-zA-Z]/.test(currentChar);
    case "mixed":
    default:
      return /[a-zA-Z0-9]/.test(currentChar);
  }
};

export const applyMask = (
  rawInput: string,
  mask: string,
  staticIndexes: number[],
  symbol: Schema["symbol"]
) => {
  let result = "";
  let rawIndex = 0;

  for (let i = 0; i < mask.length; i++) {
    if (staticIndexes.includes(i)) {
      // If it's a static part of the mask, use it directly
      result += mask[i];
    } else if (rawIndex < rawInput.length) {
      // If it's a dynamic part of the mask, insert user input
      result += rawInput[rawIndex];
      rawIndex++;
    } else {
      // If no more user input is available, use the placeholder symbol
      result += symbol;
    }
  }

  return result;
};

export const getCursorPositionAfterPaste = (
  rawInput: string,
  mask: string,
  staticIndexes: number[]
) => {
  let cursorPosition = 0;
  let rawIndex = 0;

  for (let i = 0; i < mask.length; i++) {
    if (staticIndexes.includes(i)) {
      // Skip static characters
      cursorPosition++;
    } else if (rawIndex < rawInput.length) {
      // Increment cursor position for each inserted character
      rawIndex++;
      cursorPosition++;
    } else {
      break;
    }
  }

  return cursorPosition;
};
