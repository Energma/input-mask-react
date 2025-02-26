import React, { forwardRef, useMemo, useRef, useState } from "react";
import useStaticMaskIndexes from "./util/useStaticMaskIndexes";



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
    const [isFocused, setIsFocused] = useState<boolean>(false);
    const staticMaskIndexes = useMemo(() => useStaticMaskIndexes(schema.mask, schema.symbol), [schema.mask]);

     const formatValue = (
      input: string = schema.mask,
      cursorPos: number = 0
    ): { formatted: string; newCursorPos: number } => {
      if (!schema.mask) return { formatted: "", newCursorPos: 0 };

      if(cursorPos >= schema.mask.length){
        return { formatted: input.slice(0, schema.mask.length), newCursorPos: cursorPos };
      }
        
      // ask if charapter is valid (if it is go on.. if not) -> return the formmated value and cursor possition

      // take the new added charapter to the mask and see what to do with it:

      // New letter is added on cursorIndex -1 => this is possition of the index in mask.
      let newCharInputIndex = cursorPos;
      let newMaskFormated:string[] = input.split("");

      console.log(`newCharInputIndex: ${newCharInputIndex},
        newMaskFormated: ${newMaskFormated.join("")}`)


        // before cursor position
      for(let i = cursorPos; i <= cursorPos; i++){

        if( newCharInputIndex-1 == staticMaskIndexes[0]){
          const x = newMaskFormated[newCharInputIndex-1];
          newMaskFormated[newCharInputIndex-1] = schema.mask[newCharInputIndex-1];
          newMaskFormated[newCharInputIndex] = x;
        }else{
          newMaskFormated[i] = input[i];
          if(cursorPos == staticMaskIndexes.filter(index => index == cursorPos)[0]){
            newCharInputIndex++;
          }
        }
      }

      // after cursor position
      for(let i = cursorPos; i <= schema.mask.length; i++){
        newMaskFormated[i] = schema.mask[i];
      }


      console.log(`AAAnewCharInputIndex: ${newCharInputIndex},
        newMaskFormated: ${newMaskFormated.join("")}`)
      return { formatted: newMaskFormated.join(""), newCursorPos:newCharInputIndex };
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      e.stopPropagation();
      e.preventDefault();

      const inputElement = e.target;
      const inputValue = inputElement.value;
      const newCursorPosition = inputElement.selectionStart || 0;

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
    };


    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Backspace") {
      
      }
    };

    const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
      e.stopPropagation();
      e.preventDefault();
      setIsFocused(true);
      const inputValue = e.target.value;

      
      // When focused.. find the next place where is free place (where is symbol which should be replaced)
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
        onKeyUp={()=>{}}
        onFocus={handleFocus}
        onBlur={handleBlur}
        placeholder={placeholder}
      />
    );
  }
);
