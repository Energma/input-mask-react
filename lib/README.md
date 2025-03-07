<h1 align="center">Input Mask React</h1>

<p align="center">
  <img src="https://img.shields.io/badge/platform-Android%20%7C%20iOS%20%7C%20Browser-brightgreen" />
  <img src="https://img.shields.io/badge/React-blue" />
  <img src="https://img.shields.io/badge/NextJS-black" />
  <img src="https://img.shields.io/npm/dm/energma/input-mask-react" />
  <img src="https://img.shields.io/github/issues-closed-raw/energma/input-mask-react" />
  <img src="https://img.shields.io/bundlephobia/min/input-mask-react" />
  <img src="https://img.shields.io/npm/types/input-mask-react" />
  <img src="https://img.shields.io/npm/v/input-mask-react" />
  <img src="https://img.shields.io/github/license/energma/input-mask-react" />
</p>

`input-mask-react` is a React component for creating input fields with customizable input masks. It allows you to format user input according to a specified mask, handling dynamic cursor positions and formatting on-the-fly. This component supports various types of input masks such as numbers, letters, and both formats.

<p align="center">
  <img src="https://media2.giphy.com/media/v1.Y2lkPTc5MGI3NjExbnRxcHdubDFsYmhhejJhZWYxd293ZTRicm84b3VsM3B4YnB4bmw5aiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/M9pKngr7PTR1E82iyw/giphy.gif" width="500px" />
</p>

<br>

- [Features](#features)
- [Installation](#installation)
- [Summary](#summary)
- [Repository](#repository)
- [Compatibility](#compatibility)
- [Schema Types](#schema-types)
- [Usage](#usage)
- [Props](#props)
- [Examples](#examples)
  - [Credit Card Expiration Date](#credit-card-expiration-date)
  - [Zip Code](#credit-card-expiration-date)
  - [Canadian Zip Code](#canadian-zip-code)
  - [Telephone Number](#telephone-number)
  - [Credit Card Number](#credit-card-number)
  - [Coutry Code](#country-code)
- [License](#license)

## Features

- **Customizable Mask**: You can define a mask format using a symbol (e.g., `_`) that will be replaced with user input.
- **Dynamic Cursor Management**: The cursor position updates automatically as the user types, ensuring that the mask format is followed properly.
- **Type-based Input Sanitization**: The input is sanitized based on the selected type (numbers, letters, or mixed).
- **React Integration**: It is built specifically for use with React, and works seamlessly with TypeScript.

## Installation

To install the `input-mask-react` package, run the following command in your project:

```bash
npm install input-mask-react
```

```bash
pnpm add input-mask-react
```

```bash
yarn add react-native-mask-input
```

## Summary

This repository contains code for input-react-mask
(https://github.com/Energma/input-mask-react)

# Repository

- **lib**: Workspace where the core library is developed.
- **test-app**: Workspace where we simulate user behavior.

to run test application from root execute:

```bash
npm run dev
```

or

```bash
pnpm dev
```

## Compatibility

- **React 19+**
- **NEXT 15+**

## Schema Types:

- **numbers type accept [0-9]**
- **letters type accept [a-zA-Z]**
- **mixed type accept [a-zA-Z0-9]**

- schema symbol can be of any character

#### Schema interface:

```jsx
interface Schema {
  mask: string;
  symbol: string;
  type: "numbers" | "letters" | "mixed";
}
```

## Usage

```jsx
import MaskInput from "@energma/input-mask-react";
import { useState } from "react";

function MyComponent() {
  const [creditCardExpiration, setCreditCardExpiration] = useState("");

  return (
    <MaskedInput
      schema={{ mask: "__/__", symbol: "_", type: "numbers" }}
      value={creditCardExpiration}
      onChange={(e) => setCreditCardExpiration(e.target.value)}
      placeholder="__/__"
    />
  );
}
```

You can also add object where properties can be `className`, `id`, `label`, etc like any other `input element`.

`placeholder` can be anything you like but good practice is to have mask there.

## Props

| Prop              | Type                    | Default | Description                                                                                                                                                                                                                                                                                                                                                                                 |
| ----------------- | ----------------------- | ------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **...InputProps** |                         |         | Inherit all [props of `Input`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input).                                                                                                                                                                                                                                                                                            |
| **`schema`**      | [schema](#schema-types) |         | Object defines the masking rules for user input. It includes the following properties. `mask` (string) – Defines the input pattern using a placeholder symbol, if it is an RegExp, it will validate the input on it. `symbol` (string) – Represents the character that will be replaced by user input. `type` (string) – Specifies the [type](#schema-types) of input allowed. **REQUIRED** |
| **`value`**       | number                  |         | The value for controlled input. **REQUIRED**                                                                                                                                                                                                                                                                                                                                                |
| **`onChange`**    | function                |         | Callback that is called when the input's text changes. **REQUIRED**                                                                                                                                                                                                                                                                                                                         |
| **`onFocus`**     | function                |         | Triggered when user clicks away and then focus it again it will position cursor at next valid input.                                                                                                                                                                                                                                                                                        |

# Examples

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

## License

react-native-mask-input is released under the MIT license. See [LICENSE](../LICENSE) for details.

Any question or support will welcome.
