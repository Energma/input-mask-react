import React, { forwardRef, useMemo, useRef, useState } from 'react';

export interface Schema {
    mask: string;
    symbol: string;
    type?: 'numbers' | 'letters' | 'mixed';
}

interface MaskedInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    schema: Schema;
    value?: string;
}

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

    const calculateCursorPosition = (cursorPos: number, lastFilledPosition: number, formatted: string): number => {
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
        calculateCursorPosition
    };
};

const cleanValue = (input: string, type: Schema['type'] = 'numbers'): string => {
    switch(type) {
        case 'numbers':
            return input.replace(/[^\d]/g, '');
        case 'letters':
            return input.replace(/[^a-zA-Z]/g, '');
        case 'mixed':
        default:
            return input.replace(/[^a-zA-Z0-9]/g, '');
    }
};

export const MaskedInput = forwardRef<HTMLInputElement, MaskedInputProps>(
    ({schema, value = '', onChange, placeholder, ...props}, ref) => {
        const inputRef = useRef<HTMLInputElement>(null);
        const [displayValue, setDisplayValue] = useState<string>('');
        const [isFocused, setIsFocused] = useState(false);
        const cursorManager = useMemo(() => createCursorManager(schema.mask, schema.symbol), [schema]);

        const formatValue = (input: string = '', cursorPos: number = 0): {formatted: string; newCursorPos: number} => {
            if (!schema.mask) return {formatted: '', newCursorPos: 0};

            const cleanedInput = cleanValue(input);
            let formatted = ''
            let inputIndex = 0;
            let newCursorPos = cursorPos;
            let lastFilledPosition = -1

            for (let i = 0; i < schema.mask.length; i++) {
                const isMaskChar = schema.mask[i] !== schema.symbol;
                // Append rest of the mask
                if (isMaskChar) {
                    formatted += schema.mask[i]
                    if (i < cursorPos) {
                        newCursorPos++;
                    }
                } else {
                    // Pick the input value and move cursor
                    if (inputIndex < cleanedInput.length && /\d/.test(cleanedInput[inputIndex])) {
                        formatted += cleanedInput[inputIndex];
                        inputIndex++;
                        // Cursor position - while replacing the symbol with the value
                        if (i < cursorPos ) {
                            lastFilledPosition = i;
                        }
                    } else {
                        formatted += schema.symbol
                    }
                }
            }

            newCursorPos = cursorManager.calculateCursorPosition(cursorPos, lastFilledPosition, formatted);
            return { formatted, newCursorPos };
        };

        const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
            const inputElement = e.target;
            const inputValue = inputElement.value;
            const newCursorPosition = inputElement.selectionStart || 0;
            const prevDigits = cleanValue(displayValue);
            const newDigits = cleanValue(inputValue);

            const currentPos = cursorManager.findPreviousInputPosition(newCursorPosition);
            const { formatted, newCursorPos} = formatValue(newDigits, currentPos);

            setDisplayValue(formatted);
            onChange?.({
                ...e,
                target: { ...e.target, value: newDigits }
            });

            requestAnimationFrame(() => {
                if (inputRef.current) {
                    inputRef.current.setSelectionRange(newCursorPos, newCursorPos)
                }
            });
        };

        const hadnleKeyUp = (e: React.KeyboardEvent<HTMLInputElement>) => {
            if (e.key === 'Backspace') {
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
            })
        };

        const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
            if (displayValue === schema.mask) {
                setDisplayValue('');
            }
        };

        // Update display value when value changes
        React.useEffect(() => {
            const { formatted } = formatValue(value);

            if (!value) {
                setDisplayValue('');
            } else {
                setDisplayValue(formatted)
            }
        }, [value, schema])

        return (
            <input
                {...props}
                ref={(node) => {
                    // Handle both forwardRef and local ref
                    if (typeof ref == 'function') {
                        ref(node);
                    } else if (ref) {
                        (ref as React.MutableRefObject<HTMLInputElement | null>).current = node;
                    }
                    (inputRef as React.MutableRefObject<HTMLInputElement | null>).current = node;
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
