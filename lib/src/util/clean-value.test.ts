import {describe, expect, it} from 'vitest';
import {cleanValue} from './util';

describe('test cleanValue functionallity', () => {
  const cleanValueTests = [
    {
      name: 'removes non-numeric characters when type is "numbers"',
      args: { input: 'abc123!@#', type: 'numbers' as const },
      want: '123',
    },
    {
      name: 'removes non-alphabet characters when type is "letters"',
      args: { input: 'abc123!@#', type: 'letters' as const },
      want: 'abc',
    },
    {
      name: 'removes special characters but keeps alphanumeric when type is "mixed"',
      args: { input: 'abc123!@#', type: 'mixed' as const },
      want: 'abc123'
    },
    {
      name: 'returns empty string when input contains only special characters (numbers type)',
      args: { input: '!@#$%^&*()', type: 'numbers' as const },
      want: ''
    },
    {
      name: 'returns empty string when input contains only special characters (letters type)',
      args: { input: '!@#$%^&*()', type: 'letters' as const },
      want: ''
    },
    {
      name: 'returns empty string when input contains only special characters (mixed type)',
      args: { input: '!@#$%^&*()', type: 'mixed' as const },
      want: ''
    },
    {
      name: 'removes spaces when type is "numbers"',
      args: { input: '1 2 3 4 5', type: 'numbers' as const },
      want: '12345'
    },
    {
      name: 'removes spaces when type is "letters"',
      args: { input: 'a b c d e', type: 'letters' as const },
      want: 'abcde'
    },
    {
      name: 'removes spaces when type is "mixed"',
      args: { input: 'a 1 b 2 c 3', type: 'mixed' as const },
      want: 'a1b2c3'
    },
    {
      name: 'handles empty input string correctly',
      args: { input: '', type: 'numbers' as const },
      want: ''
    },
    {
      name: 'handles already clean input correctly (numbers)',
      args: { input: '123456', type: 'numbers' as const },
      want: '123456'
    },
    {
      name: 'handles already clean input correctly (letters)',
      args: { input: 'abcdef', type: 'letters' as const },
      want: 'abcdef'
    },
    {
      name: 'handles already clean input correctly (mixed)',
      args: { input: 'abc123', type: 'mixed' as const },
      want: 'abc123'
    },
    {
      name: 'filters out emojis and other unicode characters',
      args: { input: 'hello🌍123', type: 'mixed' as const },
      want: 'hello123'
    },
    {
      name: 'removes newlines and tabs when type is "mixed"',
      args: { input: 'abc\n123\t!@#', type: 'mixed' as const },
      want: 'abc123'
    }
  ];
  
  cleanValueTests.forEach((testCase) => {
      it(testCase.name, () => {
          expect(cleanValue(testCase.args.input, testCase.args.type)).toBe(testCase.want);
      });
  });
});

