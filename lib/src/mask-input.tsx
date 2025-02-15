import React, { forwardRef, useMemo, useRef, useState } from "react";
import { createCursorManager, cleanValue } from "./util/util";

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
      input: string = "",
      cursorPos: number = 0
    ): { formatted: string; newCursorPos: number } => {
      if (!schema.mask) return { formatted: "", newCursorPos: 0 };

      const cleanedInput = cleanValue(input, schema.type);
      let formatted = "";
      let inputIndex = 0;
      let newCursorPos = cursorPos;
      let lastFilledPosition = -1;

      for (let i = 0; i < schema.mask.length; i++) {
        const isMaskChar = schema.mask[i] !== schema.symbol;
        // Append rest of the mask
        if (isMaskChar) {
          formatted += schema.mask[i];
          if (i < cursorPos) {
            newCursorPos++;
          }
        } else {
          const currentChar = cleanedInput[inputIndex];

          // Ensure the character is valid based on schema type
          const isValidChar =
            (schema.type === "numbers" && /\d/.test(currentChar)) ||
            (schema.type === "letters" && /[a-zA-Z]/.test(currentChar)) ||
            (schema.type === "mixed" && /[a-zA-Z0-9]/.test(currentChar));

          // Pick the input value and move cursor
          // Pick the input value and move cursor
          if (inputIndex < cleanedInput.length && isValidChar) {
            formatted += cleanedInput[inputIndex];
            inputIndex++;
            // Cursor position - while replacing the symbol with the input value
            if (i < cursorPos) {
              lastFilledPosition = i;
            }
          } else {
            formatted += schema.symbol;
          }
        }
      }

      newCursorPos = cursorManager.calculateCursorPosition(
        cursorPos,
        lastFilledPosition,
        formatted
      );
      return { formatted, newCursorPos };
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const inputElement = e.target;
      const inputValue = inputElement.value;
      const newCursorPosition = inputElement.selectionStart || 0;
      const prevDigits = cleanValue(displayValue, schema.type);
      const newDigits = cleanValue(inputValue, schema.type);

      const currentPos =
        cursorManager.findPreviousInputPosition(newCursorPosition);
      const { formatted, newCursorPos } = formatValue(newDigits, currentPos);

      setDisplayValue(formatted);
      onChange?.({
        ...e,
        target: { ...e.target, value: newDigits },
      });

      requestAnimationFrame(() => {
        if (inputRef.current) {
          inputRef.current.setSelectionRange(newCursorPos, newCursorPos);
        }
      });
    };

    const hadnleKeyUp = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Backspace") {
        const curPos = inputRef.current?.selectionStart || 0;
        const newPos = cursorManager.findPreviousInputPosition(curPos);

        requestAnimationFrame(() => {
          if (inputRef.current) {
            inputRef.current.setSelectionRange(newPos, newPos);
          }
        });
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
        onKeyUp={hadnleKeyUp}
        onFocus={handleFocus}
        onBlur={handleBlur}
        placeholder={placeholder}
      />
    );
  }
);
