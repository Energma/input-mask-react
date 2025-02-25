import React, { forwardRef, useMemo, useRef, useState } from "react";
import { isValidChar } from "./util/util";
import useStaticMaskIndexes from "./util/hook/useStaticMaskIndexes";



export interface Schema {
  mask: string;
  symbol: string;
  type?: "numbers" | "letters" | "mixed";
}

interface MaskedInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  schema: Schema;
  value?: string;
}

const backspaceHoldInterval = 100;
let backspaceInterval: NodeJS.Timeout | null = null;

export const MaskedInput = forwardRef<HTMLInputElement, MaskedInputProps>(
  ({ schema, value = "", onChange, placeholder, ...props }, ref) => {
    const inputRef = useRef<HTMLInputElement>(null);
    const [displayValue, setDisplayValue] = useState<string>("");
    const [isFocused, setIsFocused] = useState<boolean>(false);
    const [isBackspaceHeld, setIsBackspaceHeld] = useState<boolean>(false);
    const isBackspaceHeldRef = useRef<boolean>(false);
    const staticMaskIndexes = useStaticMaskIndexes(schema.mask, schema.symbol);

     const formatValue = (
      input: string = schema.mask,
      cursorPos: number = 0
    ): { formatted: string; newCursorPos: number } => {
      if (!schema.mask) return { formatted: "", newCursorPos: 0 };

      // main logic
      const maskArray = schema.mask.split("");
      const inputArray = input.split("");
      let newCursorPos = cursorPos;

      // if input is empty, return empty mask
      if (!input) {
        return { formatted: schema.mask, newCursorPos: 0 };
      }

      // Preserve existing valid input
      for (let i = 0; i < maskArray.length; i++) {
        if (
          maskArray[i] === schema.symbol &&
          displayValue[i] &&
          displayValue[i] !== schema.symbol
        ) {
          maskArray[i] = displayValue[i];
        }
      }

      // Handle new input
      if (cursorPos > 0) {
        const targetPos = cursorPos - 1;
        const newChar = inputArray[targetPos];

        // Check is mask on target position a symbol
        if (schema.mask[targetPos] === schema.symbol) {
          // Check is input valid type
          if (isValidChar(newChar, schema.type)) {
            maskArray[targetPos] = newChar;
            // Find next symbol position
            newCursorPos = maskArray.findIndex(
              (char, idx) => idx > targetPos && char === schema.symbol
            );
            if (newCursorPos === -1) newCursorPos = cursorPos;
          } else {
            // Invalid character - stay at current position
            newCursorPos = targetPos;
          }
        } else {
          // At fixed mask character - find next symbol position
          newCursorPos = maskArray.findIndex(
            (char, idx) => idx >= cursorPos && char === schema.symbol
          );
          if (newCursorPos === -1) newCursorPos = cursorPos;
        }
      }
      return { formatted: maskArray.join(""), newCursorPos };
    };

   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      e.stopPropagation();
      const inputElement = e.target;
      const inputValue = inputElement.value;
      const newCursorPosition = inputElement.selectionStart || 0;

      const { formatted, newCursorPos } = formatValue(
        inputValue,
        newCursorPosition
      );
      setDisplayValue(formatted);

      // Trigger onChange with the formatted value
      onChange?.({
        ...e,
        target: { ...e.target, value: formatted },
      });

      requestAnimationFrame(() => {
        if (inputRef.current) {
          inputRef.current.setSelectionRange(newCursorPos, newCursorPos);
        }
      });
    };


    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Backspace" && !backspaceInterval) {
        setIsBackspaceHeld(true); // Indicate Backspace is held
        isBackspaceHeldRef.current = true; // prevent async state delay
        backspaceInterval = setInterval(() => {
          setDisplayValue((prev) => {
            let cursorPosition = inputRef.current?.selectionStart || 0;
            if (prev === schema.mask) {
              clearInterval(backspaceInterval!);
              backspaceInterval = null;
              return schema.mask;
            }
            if (
              staticMaskIndexes.includes(cursorPosition - 1) &&
              schema.mask[cursorPosition]
            ) {
              // If previous character is static, move cursor back again
              cursorPosition--;
              return prev.slice(0, -cursorPosition);
            } else {
              // Normal deletion logic
              return prev.slice(0, -1);
            }
          });
        }, backspaceHoldInterval);
      }
    };

    // TO DO: fix the bug when holding backspace skipping all characters and delete only first one
    const handleKeyUp = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Backspace") {
        // stop the backspace hold deletion
        if (backspaceInterval) {
          clearInterval(backspaceInterval);
          backspaceInterval = null;
        }
        setIsBackspaceHeld(false);
        isBackspaceHeldRef.current = false;

        // If backspace was NOT held, delete **one character only**
        if (!isBackspaceHeldRef.current && isBackspaceHeld) {
          const curPos = inputRef.current?.selectionStart || 0;
          const maskArray = displayValue.split("");
          if (!inputRef.current) return;

          // handle backspace at the end of input
          if (
            curPos + 1 === displayValue.length &&
            displayValue.indexOf(schema.symbol) === -1
          ) {
            const lastPos = displayValue.length - 1;
            if (displayValue[lastPos] !== schema.symbol) {
              maskArray[lastPos] = schema.symbol;
              setDisplayValue(maskArray.join(""));
              requestAnimationFrame(() => {
                if (inputRef.current) {
                  inputRef.current.setSelectionRange(lastPos, lastPos);
                }
              });
            }
            return;
          }

          // handle first charater in input (backaspace)
          if (curPos <= 1) {
            // handle static mask on first position
            if (curPos === 0 && staticMaskIndexes.includes(0)) {
              return;
            }
            if (displayValue[0] !== schema.symbol) {
              maskArray[0] = schema.symbol;
              setDisplayValue(maskArray.join(""));
              requestAnimationFrame(() => {
                if (inputRef.current) {
                  inputRef.current.setSelectionRange(curPos, curPos);
                }
              });
            }
            return;
          }

          // Normal backspace behavior - clear current position and move cursor back
          const previousPos = curPos - 1;
          if (previousPos >= 0 && schema.mask[previousPos] === schema.symbol) {
            maskArray[previousPos] = schema.symbol;
            setDisplayValue(maskArray.join(""));
            requestAnimationFrame(() => {
              inputRef.current?.setSelectionRange(previousPos, previousPos);
            });
          } else if (previousPos >= 0) {
            // if we're at at fixed mask character, find previous input position
            let prevEditablePos = previousPos;
            // skip the fixed mask character
            while (
              prevEditablePos >= 0 &&
              schema.mask[prevEditablePos] !== schema.symbol
            ) {
              prevEditablePos--;
            }

            if (prevEditablePos >= 0) {
              maskArray[prevEditablePos] = schema.symbol;
              setDisplayValue(maskArray.join(""));
              requestAnimationFrame(() => {
                if (inputRef.current) {
                  inputRef.current.setSelectionRange(
                    prevEditablePos,
                    prevEditablePos
                  );
                }
              });
            }
          }
        }


    const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
      e.stopPropagation();
      setIsFocused(true);
      const inputValue = e.target.value;

      if (!inputValue) {
        setDisplayValue(schema.mask);
      }

      // Find next available symbol position that needs input
      const nextInputPos = schema.mask.split("").findIndex((char, idx) => {
        if (char === schema.symbol) {
          const currentValue = displayValue[idx];
          return !currentValue || currentValue === schema.symbol;
        }
        return false;
      });

      // Use setTimeout to ensure cursor position works across browsers
      setTimeout(() => {
        if (inputRef.current && nextInputPos !== -1) {
          inputRef.current.setSelectionRange(nextInputPos, nextInputPos);
        }
      }, 0);
    };

   const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
      e.stopPropagation();
      setIsFocused(false);
      // Clear mask if no valid input
      if (displayValue === schema.mask) {
        setDisplayValue("");
      }
    };

    // Update display value when value changes
    React.useEffect(() => {
      const { formatted } = formatValue(value);
      if (!value) {
        setDisplayValue("");
      } else {
        setDisplayValue(formatted);
      }
    }, [value, schema]);

    return (
      <input
        {...props}
        ref={(node) => {
          // Handle both forwardRef and local ref
          if (typeof ref == "function") {
            ref(node);
          } else if (ref) {
            (ref as React.MutableRefObject<HTMLInputElement | null>).current =
              node;
          }
          inputRef.current = node;
        }}
        value={displayValue}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        onKeyUp={handleKeyUp}
        onFocus={handleFocus}
        onBlur={handleBlur}
        placeholder={placeholder}
      />
    );
  }
);
