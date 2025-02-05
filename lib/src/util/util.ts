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

export const cleanValue = (input: string, type: Schema['type'] = 'numbers'): string => {
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