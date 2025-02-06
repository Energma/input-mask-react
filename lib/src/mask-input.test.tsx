import { render, screen, fireEvent } from '@testing-library/react'
import React from 'react';
import { describe, it, expect, beforeEach, vi } from 'vitest'
import  { MaskedInput }  from './mask-input'




const mockOnChange = vi.fn();

describe('MaskedInput Component - UI', () => {
  const tests: { name: string; args: any; want: any}[] = [
    {
      name: 'renders with pre-filled value',
      args: {
        schema: {
          mask: '+7 (___) ___-__-__',
          symbol: '_',
          type: 'numbers' as const
        },
        value: '9995554433'
      },
      want: {
        value: '+7 (999) 555-44-33'
      }
    },
    {
      name: 'renders with custom className',
      args: {
        schema: {
          mask: '+7 (___) ___-__-__',
          symbol: '_',
          type: 'numbers' as const
        },
        className: 'custom-mask-input'
      },
      want: {
        className: 'custom-mask-input'
      }
    }
  ];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  tests.forEach(({name, args, want }) => {
    it(name, () => {
      render(<MaskedInput {...args} onChange={mockOnChange} data-testid="masked-input" />);
      const input = screen.getByTestId('masked-input') as HTMLInputElement;

      if (want.placeholder) {
        expect(input.getAttribute('placeholder')).toBe(want.placeholder);
      }
      if (want.value !== undefined) {
        expect(input.value).toBe(want.value);
      }
      if (want.className) {
        expect(input.classList.contains(want.className)).toBe(true);
      }
    });
  });
});

describe('MaskedInput Component - Functionality', () => {
  const functionalityTests = [
    {
      name: 'handles numeric input correctly',
      args: {
        schema: {
          mask: '+7 (___) ___-__-__',
          symbol: '_',
          type: 'numbers' as const
        },
        input: '9995554433'
      },
      want: {
        finalValue: '+7 (999) 555-44-33'
      }
    },
    {
      name: 'handles backspace correctly',
      args: {
        schema: {
          mask: '+7 (___) ___-__-__',
          symbol: '_',
          type: 'numbers' as const
        },
        input: '999',
        backspace: true
      },
      want: {
        finalValue: '+7 (799) 9__-__-__'
      }
    },
    {
      name: 'filters non-matching characters',
      args: {
        schema: {
          mask: '+7 (___) ___-__-__',
          symbol: '_',
          type: 'numbers' as const
        },
        input: 'abc123def'
      },
      want: {
        finalValue: '+7 (123) ___-__-__'
      }
    },
    {
      name: 'handles blur event',
      args: {
        schema: {
          mask: '+7 (___) ___-__-__',
          symbol: '_',
          type: 'numbers' as const
        },
        input: '999',
        blur: true
      },
      want: {
        finalValue: '+7 (999) ___-__-__'
      }
    },
    {
      name: 'handles focus event',
      args: {
        schema: {
          mask: '+7 (___) ___-__-__',
          symbol: '_',
          type: 'numbers' as const
        },
        focus: true
      },
      want: {
        finalValue: '+7 (___) ___-__-__'
      }
    }
  ];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  functionalityTests.forEach(({ name, args, want }) => {
    it(name, () => {
      render(<MaskedInput {...args} onChange={mockOnChange} data-testid="masked-input" />);
      const input = screen.getByTestId('masked-input') as HTMLInputElement;

      if (args.input) {
        fireEvent.change(input, { target: { value: args.input } });
      }

      if (args.backspace) {
        const currentValue = input.value;
        fireEvent.change(input, {
          target: { value: currentValue.slice(0, -1) }
        });
      }

      if (args.blur) {
        fireEvent.blur(input);
      }

      if (args.focus) {
        fireEvent.focus(input);
      }

      if (want.finalValue) {
        expect(input.value).toBe(want.finalValue);
      }
    });
  });
});

describe('MaskedInput Component - Edge Cases', () => {
  const edgeCases = [
    {
      name: 'handles empty mask',
      args: {
        schema: {
          mask: '',
          symbol: '_',
          type: 'numbers' as const
        },
        value: '123'
      },
      want: {
        value: ''
      }
    },
    {
      name: 'handles mask without symbols',
      args: {
        schema: {
          mask: '+7-',
          symbol: '_',
          type: 'numbers' as const
        },
        value: '123'
      },
      want: {
        value: '+7-'
      }
    },
    {
      name: 'handles undefined value',
      args: {
        schema: {
          mask: '+7 (___) ___-__-__',
          symbol: '_',
          type: 'numbers' as const
        },
        value: undefined
      },
      want: {
        value: ''
      }
    }
  ];

  edgeCases.forEach(({ name, args, want }) => {
    it(name, () => {
      render(<MaskedInput {...args} onChange={mockOnChange} data-testid="masked-input" />);
      const input = screen.getByTestId('masked-input') as HTMLInputElement;
      expect(input.value).toBe(want.value);
    });
  });
});