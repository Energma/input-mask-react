import React, { forwardRef, useMemo, useRef, useState } from "react";
import useStaticMaskIndexes from "./util/useStaticMaskIndexes";
import {
  applyMask,
  getCursorPositionAfterPaste,
  isValidChar,
} from "./util/util";
import { secureHeapUsed } from "crypto";

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
    const [displayValue, setDisplayValue] = useState<string>(value);
    const [isFocused, setIsFocused] = useState<boolean>(false);
    const staticMaskIndexes = useMemo(
      () => useStaticMaskIndexes(schema.mask, schema.symbol),
      [schema.mask]
    );

    const formatValue = (
      input: string = schema.mask,
      cursorPos: number = 0
    ): { formatted: string; newCursorPos: number } => {
      if (!schema.mask) return { formatted: "", newCursorPos: 0 };

      let newMaskFormated: string[] = input.split("");
      console.log("newMaskFormated", newMaskFormated);
      let newCharInputIndex: number = cursorPos;
      const currentChar = input[cursorPos - 1] || "";

      // console.log(`Input: ${input}, Cursor Position: ${cursorPos}`);
      // console.log(`Validating character: "${currentChar}"`);
      console.log(newMaskFormated, "mask");

      if (cursorPos > schema.mask.length || cursorPos < 0) {
        return {
          formatted: input.slice(0, schema.mask.length),
          newCursorPos: cursorPos,
        };
      }
      console.log(
        `Character "${currentChar}" is invalid for type "${schema.type}".`
      );
      // restrict input if it's not valid input, if it is proceed
      if (cursorPos >= 0 && !isValidChar(currentChar, schema.type)) {
        return {
          formatted: displayValue,
          newCursorPos: cursorPos - 1,
        };
      }

      // before cursor position
      for (let i = 0; i <= cursorPos; i++) {
        if (newCharInputIndex - 1 == staticMaskIndexes[0]) {
          const fixed = newMaskFormated[newCharInputIndex - 1];
          newMaskFormated[newCharInputIndex - 1] =
            schema.mask[newCharInputIndex - 1];
          newMaskFormated[newCharInputIndex] = fixed;
        } else {
          newMaskFormated[i] = input[i];
          if (
            cursorPos ==
            staticMaskIndexes.filter((index) => index == cursorPos)[0]
          ) {
            newCharInputIndex++;
          }
        }
      }

      // console.log(`newCharInputIndex: ${newCharInputIndex},
      //   newMaskFormated: ${newMaskFormated.join("")}`);

      // after cursor position preserve mask while updating input at cursor position
      for (let i = cursorPos; i <= schema.mask.length; i++) {
        if (displayValue[i] && displayValue[i] !== schema.symbol) {
          newMaskFormated[i] = displayValue[i];
        } else {
          newMaskFormated[i] = schema.mask[i];
        }
      }

      // console.log(`AAAnewCharInputIndex: ${newCharInputIndex},
      //   newMaskFormated: ${newMaskFormated.join("")}`);
      console.log(newMaskFormated, "maskkk");

      return {
        formatted: newMaskFormated.join(""),
        newCursorPos: newCharInputIndex,
      };
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      e.stopPropagation();
      e.preventDefault();

      const inputElement = e.target;
      const inputEvent = e.nativeEvent as InputEvent;
      const inputValue = inputElement.value;
      const newCursorPosition = inputElement.selectionStart || 0;
      const isPaste = inputEvent.inputType === "insertFromPaste";

      if (isPaste) {
        console.log("p");
        // Filter out invalid characters based on schema.type
        const rawInputValue = Array.from(inputValue)
          .filter((char) => isValidChar(char, schema.type))
          .join("");

        const formattedValue = applyMask(
          rawInputValue,
          schema.mask,
          staticMaskIndexes,
          schema.symbol
        );

        // Trigger onChange with the formatted value
        setDisplayValue(formattedValue);
        onChange?.({
          ...e,
          target: { ...e.target, value: formattedValue },
        });

        const cursorPosition = getCursorPositionAfterPaste(
          rawInputValue,
          schema.mask,
          staticMaskIndexes
        );

        requestAnimationFrame(() => {
          if (inputRef.current) {
            inputRef.current.setSelectionRange(cursorPosition, cursorPosition);
          }
        });
      } else {
        const { formatted, newCursorPos } = formatValue(
          inputValue,
          newCursorPosition
        );

        // Trigger onChange with the formatted value
        setDisplayValue(formatted);
        onChange?.({
          ...e,
          target: { ...e.target, value: formatted },
        });

        requestAnimationFrame(() => {
          if (inputRef.current) {
            inputRef.current.setSelectionRange(newCursorPos, newCursorPos);
          }
        });
      }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      const cursorPos = inputRef.current?.selectionStart ?? 0;
      if (e.ctrlKey && e.key === "a") {
        e.preventDefault();
        if (inputRef.current) {
          const length = displayValue.length;
          inputRef.current.setSelectionRange(0, length);
        }
        return;
      }

      // Handle Backspace when text is selected (delete everything)
      if (
        e.key === "Backspace" &&
        cursorPos === 0 &&
        inputRef.current?.selectionEnd === displayValue.length
      ) {
        e.preventDefault();
        setDisplayValue("");
        return;
      }

      if (e.key === "Backspace") {
        e.preventDefault();
        if (cursorPos > 0) {
          let newCursorPos = cursorPos - 1;

          // Move cursor left if deleting a static character (skip static part of the mask)
          while (newCursorPos > 0 && staticMaskIndexes.includes(newCursorPos)) {
            newCursorPos--;
          }

          // Remove last valid character and replace it with mask symbol
          const newValue =
            displayValue.substring(0, newCursorPos) +
            schema.mask[newCursorPos] +
            displayValue.substring(newCursorPos + 1);

          setDisplayValue(newValue);

          // Move cursor to correct position after deletion
          requestAnimationFrame(() => {
            inputRef.current?.setSelectionRange(newCursorPos, newCursorPos);
          });
        }
      }
    };

    const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
      e.stopPropagation();
      e.preventDefault();
      setIsFocused(true);

      // Find the next available position to place the cursor
      let nextEmptyPosition = -1;

      // Loop through the mask and find the next placeholder symbol
      for (let i = 0; i < schema.mask.length; i++) {
        if (
          schema.mask[i] === schema.symbol &&
          (displayValue[i] === "" || displayValue[i] === schema.symbol)
        ) {
          nextEmptyPosition = i;
          break;
        }
      }

      if (nextEmptyPosition !== -1 && inputRef.current) {
        // Move the cursor to the next empty position
        inputRef.current.setSelectionRange(
          nextEmptyPosition,
          nextEmptyPosition
        );
      }
    };

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
      e.stopPropagation();
      e.preventDefault();

      setIsFocused(false);
      // Clear mask if no valid input
      if (displayValue === schema.mask) {
        setDisplayValue("");
      }
    };

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
        onKeyUp={() => {}}
        onFocus={handleFocus}
        onBlur={handleBlur}
        placeholder={placeholder}
      />
    );
  }
);
