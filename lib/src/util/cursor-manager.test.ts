import { describe, it, expect } from 'vitest';
import { createCursorManager } from './util';

describe('createCursorManager', () => {
  const testCases = [
    {
      description: 'findNextInputPosition finds next empty position in mask',
      args: {
        mask: '+7 (___) ___-__-__',
        symbol: '_',
        method: 'findNextInputPosition',
        currentPos: 4
      },
      want: 4
    },
    {
      description: 'findNextInputPosition returns mask length when no empty positions after current',
      args: {
        mask: '+7 (123) 456-78-__',
        symbol: '_',
        method: 'findNextInputPosition',
        currentPos: 15
      },
      want: 16
    },

    // findPreviousInputPosition tests
    {
      description: 'findPreviousInputPosition finds previous input position',
      args: {
        mask: '+7 (___) ___-__-__',
        symbol: '_',
        method: 'findPreviousInputPosition',
        currentPos: 10
      },
      want: 10
    },
    {
      description: 'findPreviousInputPosition returns 0 when at start',
      args: {
        mask: '+7 (___) ___-__-__',
        symbol: '_',
        method: 'findPreviousInputPosition',
        currentPos: 3
      },
      want: 0
    },

    // calculateCursorPosition tests
    {
      description: 'calculateCursorPosition moves cursor to next empty position when after last filled',
      args: {
        mask: '+7 (___) ___-__-__',
        symbol: '_',
        method: 'calculateCursorPosition',
        cursorPos: 8,
        lastFilledPosition: 5,
        formatted: '+7 (123) ___-__-__'
      },
      want: 6
    },
    {
      description: 'calculateCursorPosition finds next empty position from current cursor',
      args: {
        mask: '+7 (___) ___-__-__',
        symbol: '_',
        method: 'calculateCursorPosition',
        cursorPos: 4,
        lastFilledPosition: 8,
        formatted: '+7 (123) 456-__-__'
      },
      want: 13
    },
    {
      description: 'calculateCursorPosition returns formatted length when no empty positions',
      args: {
        mask: '+7 (___) ___-__-__',
        symbol: '_',
        method: 'calculateCursorPosition',
        cursorPos: 15,
        lastFilledPosition: 16,
        formatted: '+7 (123) 456-78-90'
      },
      want: 18
    }
  ];

  testCases.forEach(({ description, args, want }) => {
    it(description, () => {
      const cursorManager = createCursorManager(args.mask, args.symbol);

      let result;
      switch (args.method) {
        case 'findNextInputPosition':
          result = cursorManager.findNextInputPosition(args.currentPos ?? 0);
          break;
        case 'findPreviousInputPosition':
          result = cursorManager.findPreviousInputPosition(args.currentPos ?? 0);
          break;
        case 'calculateCursorPosition':
          result = cursorManager.calculateCursorPosition(args.cursorPos ?? 0, args.lastFilledPosition ?? 0, args.formatted ?? "");
          break;
      }

      expect(result).toBe(want);
    });
  });

  // Edge cases
  const edgeCases = [
    {
      description: 'handles empty mask',
      args: {
        mask: '',
        symbol: '_',
        method: 'findNextInputPosition',
        currentPos: 0
      },
      want: 0
    },
    {
      description: 'handles mask with no symbols',
      args: {
        mask: '+7 (000)',
        symbol: '_',
        method: 'findNextInputPosition',
        currentPos: 0
      },
      want: 8
    },
    {
      description: 'handles cursor position beyond mask length',
      args: {
        mask: '+7 (___)',
        symbol: '_',
        method: 'findNextInputPosition',
        currentPos: 100
      },
      want: 8
    }
  ];

  edgeCases.forEach(({ description, args, want }) => {
    it(description, () => {
      const cursorManager = createCursorManager(args.mask, args.symbol);
      const result = cursorManager.findNextInputPosition(args.currentPos);
      expect(result).toBe(want);
    });
  });

  // Complex scenarios
  const complexScenarios = [
    {
      description: 'handles multiple operations in sequence',
      args: {
        mask: '+7 (___) ___-__-__',
        symbol: '_',
        operations: [
          { method: 'findNextInputPosition', currentPos: 4, want: 4 },
          { method: 'findPreviousInputPosition', currentPos: 5, want: 5 },
          {
            method: 'calculateCursorPosition',
            cursorPos: 5,
            lastFilledPosition: 4,
            formatted: '+7 (123) ___-__-__',
            want: 5
          }
        ]
      }
    }
  ];

  complexScenarios.forEach(({ description, args }) => {
    it(description, () => {
      const cursorManager = createCursorManager(args.mask, args.symbol);

      args.operations.forEach((operation) => {
        let result;
        switch (operation.method) {
          case 'findNextInputPosition':
            result = cursorManager.findNextInputPosition(operation.currentPos ?? 0);
            break;
          case 'findPreviousInputPosition':
            result = cursorManager.findPreviousInputPosition(operation.currentPos ?? 0);
            break;
          case 'calculateCursorPosition':
            result = cursorManager.calculateCursorPosition(
              operation.cursorPos ?? 0,
              operation.lastFilledPosition ?? 0,
              operation.formatted ?? ""
            );
            break;
        }
        expect(result).toBe(operation.want);
      });
    });
  });
});
