import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import React from 'react';
import '@testing-library/jest-dom';
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { MaskedInput } from './mask-input'

const mockOnChange = vi.fn();

describe('MaskedInput Component - UI', () => {
  const tests = [
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
    },
    {
      name: 'renders with placeholder',
      args: {
        schema: {
          mask: '+7 (___) ___-__-__',
          symbol: '_',
          type: 'numbers' as const
        },
        placeholder: 'Enter phone number'
      },
      want: {
        placeholder: 'Enter phone number'
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
      // if (want.value !== undefined) {
      //   expect(input.value).toBe(want.value);
      // }
      if (want.className) {
        expect(input.classList.contains(want.className)).toBe(true);
      }
    });
  });
});

describe('MaskedInput Component - Functionality', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it.skip('handles numeric input correctly', () => {
    render(
      <MaskedInput 
        schema={{
          mask: '+7 (___) ___-__-__',
          symbol: '_',
          type: 'numbers'
        }}
        value=""
        onChange={mockOnChange}
        data-testid="masked-input"
      />
    );
    
    const input = screen.getByTestId('masked-input') as HTMLInputElement;
    
    expect(input.value).toBe('+7 (___) ___-__-__');
    
    fireEvent.change(input, { target: { value: '9995554433' } });
    expect(input.value).toBe('+7 (999) 555-44-33');
  });

  it.skip('handles backspace correctly', () => {
    render(
      <MaskedInput 
        schema={{
          mask: '+7 (___) ___-__-__',
          symbol: '_',
          type: 'numbers'
        }}
        onChange={mockOnChange}
        data-testid="masked-input"
      />
    );
    
    const input = screen.getByTestId('masked-input') as HTMLInputElement;
    
    // First enter some numbers
    fireEvent.change(input, { target: { value: '+7 (999) 555-44-33' } });
    
    // Simulate backspace
    fireEvent.keyDown(input, { key: 'Backspace' });
    
    expect(input.value).toBe('+7 (999) 555-44-3_');
  });

  // it('handles letter input for numbers-only mask', () => {
  //   render(
  //     <MaskedInput 
  //       schema={{
  //         mask: '+7 (___) ___-__-__',
  //         symbol: '_',
  //         type: 'numbers'
  //       }}
  //       value=""
  //       onChange={mockOnChange}
  //       data-testid="masked-input"
  //     />
  //   );
    
  //   const input = screen.getByTestId('masked-input') as HTMLInputElement;
    
  //   expect(input.value).toBe('+7 (___) ___-__-__');
    
  //   fireEvent.change(input, { target: { value: 'abc' } });
  //   expect(input.value).toBe('+7 (___) ___-__-__');
  // });

  // This test should fail until the feature is implemented
  it('should maintain cursor position after static mask character', () => {
    render(
      <MaskedInput 
        schema={{
          mask: '+7 (___) ___-__-__',
          symbol: '_',
          type: 'numbers'
        }}
        onChange={mockOnChange}
        data-testid="masked-input"
      />
    );
    
    const input = screen.getByTestId('masked-input') as HTMLInputElement;
    fireEvent.change(input, { target: { value: '9995554433' } });
    
    // Check cursor position after the closing parenthesis
      expect(input.selectionStart).toBe(18);
      

  });
});

it('should maintain cursor position after static mask character', async () => {
  render(
    <MaskedInput 
      schema={{
        mask: '+7 (___) ___-__-__',
        symbol: '_',
        type: 'numbers'
      }}
      onChange={mockOnChange}
      data-testid="masked-input"
    />
  );
  
  const input = screen.getByTestId('masked-input') as HTMLInputElement;
  
  // First verify initial mask
  // expect(input.value).toBe('+7 (___) ___-__-__');
  
  // Simulate focus to ensure mask is active
  fireEvent.focus(input);
  
  // Force React to update the input value using the native setter
  Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value')
    ?.set?.call(input, '+7 (999) 555-44-33');
  
  // Dispatch change event to trigger React's re-render
  input.dispatchEvent(new Event('change', { bubbles: true }));
  
  // Wait for React to process the state update
  await waitFor(() => {
    expect(input.value).toBe('+7 (999) 555-44-33');
    expect(input.selectionStart).toBe(18);
  });
});
describe('MaskedInput Component - Edge Cases', () => {
  const edgeCases = [
    {
      name: 'handles empty mask',
      args: {
        schema: {
          mask: '___',
          symbol: '_',
          type: 'numbers' as const
        },
        value: '123'
      },
      want: {
        value: '123'
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
    },
    {
      name: 'handles paste event with multiple characters',
      args: {
        schema: {
          mask: '+7 (___) ___-__-__',
          symbol: '_',
          type: 'numbers' as const
        },
        value: '+7 (999) 555-44-33'
      },
      want: {
        value: '+7 (999) 555-44-33'
      },
      action: (input: HTMLInputElement) => {
        // expect(input.value).toBe('+7 (___) ___-__-__');
        
        // const pasteEvent = new Event('paste', {
        //   bubbles: true,
        //   cancelable: true,
        // }) as ClipboardEvent;
        
        // Object.defineProperty(pasteEvent, 'clipboardData', {
        //   value: {
        //     getData: () => '9995554433'
        //   }
        // });
        
        // input.dispatchEvent(pasteEvent);
      }
    }
  ];

  edgeCases.forEach(({ name, args, want, action }) => {
    it(name, () => {
      render(<MaskedInput {...args} onChange={mockOnChange} data-testid="masked-input" />);
      const input = screen.getByTestId('masked-input') as HTMLInputElement;
      
      if (action) {
        action(input);
      }
      
      // if (want.finalValue) {
      //   expect(input.value).toBe(want.finalValue);
      // } else {
        expect(input.value).toBe(want.value);
      // }
    });
  });
});