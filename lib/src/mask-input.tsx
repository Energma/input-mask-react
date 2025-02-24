import React, { forwardRef, useMemo, useRef, useState } from "react";
import { createCursorManager, cleanValue, isValidChar } from "./util/util";

export interface Schema {
  mask: string;
  symbol: string;
  type?: "numbers" | "letters" | "mixed";
}

interface MaskedInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  schema: Schema;
  value?: string;
}

export const MaskedInput = forwardRef<HTMLInputElement, MaskedInputProps>(
  ({ schema, value = "", onChange, placeholder, ...props }, ref) => {
    const inputRef = useRef<HTMLInputElement>(null);
    const [displayValue, setDisplayValue] = useState<string>("");
    const [isFocused, setIsFocused] = useState(false);
    const cursorManager = useMemo(
      () => createCursorManager(schema.mask, schema.symbol),
      [schema]
    );

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

      console.log("displayValue", displayValue);

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

    const handleKeyUp = (e: React.KeyboardEvent<HTMLInputElement>) => {
      const curPos = inputRef.current?.selectionStart || 0;
      const maskArray = displayValue.split("");

      if (e.key === "Backspace") {
        // handle backspace at the end of input
        e.preventDefault();
        if (!inputRef.current) return;

        console.log("curPos:", curPos);
        console.log("displayValue: ", displayValue);
        console.log("displayValue length: ", displayValue.length);

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
          console.log("AAAA");
          if (displayValue[0] !== schema.symbol) {
            maskArray[0] = schema.symbol;
            setDisplayValue(maskArray.join(""));
            requestAnimationFrame(() => {
              if (inputRef.current) {
                inputRef.current.setSelectionRange(0, 0);
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
          // skip the static mask character
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
    };

    const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(true);

      // Format value
      const { formatted } = formatValue(displayValue);

      setDisplayValue(formatted);
      // Move cursor to first empty position
      const firstEmptyPos = formatted.indexOf(schema.symbol);
      // Find cursor position
      const cursorPos = firstEmptyPos !== -1 ? firstEmptyPos : formatted.length;

      // Set cursor position
      requestAnimationFrame(() => {
        if (inputRef.current) {
          inputRef.current.setSelectionRange(cursorPos, cursorPos);
        }
      });
    };

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
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
          (
            inputRef as React.MutableRefObject<HTMLInputElement | null>
          ).current = node;
        }}
        value={displayValue}
        onChange={handleChange}
        onKeyUp={handleKeyUp}
        onFocus={handleFocus}
        onBlur={handleBlur}
        placeholder={placeholder}
      />
    );
  }
);
