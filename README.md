# Input Mask React

`input-mask-react` is a React component for creating input fields with customizable input masks. It allows you to format user input according to a specified mask, handling dynamic cursor positions and formatting on-the-fly. This component supports various types of input masks such as numbers, letters, and both formats.

# (Compatibility)

- **React 19+**
- **NEXT 15+**

# Repository

- **lib**: Workspace where the core library is developed.
- **test-app**: Workspace where we simulate user behavior.

## Features

- **Customizable Mask**: You can define a mask format using a symbol (e.g., `_`) that will be replaced with user input.
- **Dynamic Cursor Management**: The cursor position updates automatically as the user types, ensuring that the mask format is followed properly.
- **Type-based Input Sanitization**: The input is sanitized based on the selected type (numbers, letters, or mixed).
- **React Integration**: It is built specifically for use with React, and works seamlessly with TypeScript.

## Summary

This repository contains code for input-react-mask
(https://github.com/Energma/input-mask-react)

## Installation

To install the `input-mask-react` package, run the following command in your project:

```bash
npm install input-mask-react
```

```bash
pnpm add input-mask-react
```

## Usage Examples

Here are some examples of how you can use the `MaskedInput` component with different types of input masks:

# schema types:

- **numbers type accept 0-9**
- **letters type accept a-zA-Z**
- **mixed type accept a-zA-Z0-9**

# schema symbol can be of any character

#### Schema interface:

```jsx
interface Schema {
  mask: string;
  symbol: string;
  type: "numbers" | "letters" | "mixed";
}
```

You can also add object where properties can be `className`, `id`, `label`, etc like any other `input element`.

`placeholder` can be anything you like but good practice is to have mask there.

### Credit Card Expiration Date

```jsx
<MaskedInput
  schema={{ mask: "__/__", symbol: "_", type: "numbers" }}
  value={zipCode}
  onChange={(e) => setZipCode(e.target.value)}
  placeholder="__/__"
/>
```

### Zip Code

```jsx
<MaskedInput
  schema={{ mask: "_____", symbol: "_", type: "numbers" }}
  value={zipCode}
  onChange={(e) => setZipCode(e.target.value)}
  placeholder="_____"
/>
```

### Canadian Zip Code

```jsx
<MaskedInput
  schema={{ mask: "XXX XXX", symbol: "X", type: "mixed" }}
  value={canadianZipCode}
  onChange={(e) => setCanadianZipCode(e.target.value)}
  placeholder="XXX XXX"
/>
```

### Telephone Number

```jsx
<MaskedInput
  schema={{ mask: "(XXX)XXX-XXXX", symbol: "X", type: "numbers" }}
  value={telephone}
  onChange={(e) => setTelephone(e.target.value)}
  placeholder="(XXX)XXX-XXXX"
/>
```

### Credit Card Number

```jsx
<MaskedInput
  schema={{ mask: "0000 0000 0000 0000", symbol: "0", type: "numbers" }}
  value={creditCardNumber}
  onChange={(e) => setCreditCardNumber(e.target.value)}
  placeholder="0000 0000 0000 0000"
/>
```

### Country Code

```jsx
<MaskedInput
  schema={{ mask: "XXX", symbol: "X", type: "letters" }}
  value={countryCode}
  onChange={(e) => setCountryCode(e.target.value)}
  placeholder="XXX"
/>
```

These examples demonstrate the flexibility of the `MaskedInput` component and how it can be integrated into a React application to handle various input formats.
