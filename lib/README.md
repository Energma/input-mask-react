# 🛠️ @energma/input-mask-react

<h1 align="center">Input Mask React</h1>

<p align="center">
  <img src="https://img.shields.io/badge/platform-Android%20%7C%20iOS%20%7C%20Browser-brightgreen" />
  <img src="https://img.shields.io/badge/React-blue" />
  <img src="https://img.shields.io/badge/NextJS-black" />
  <img src="https://img.shields.io/npm/dt/@energma/input-mask-react" />
  <img src="https://img.shields.io/github/issues-closed-raw/energma/input-mask-react" />
  <img src="https://img.shields.io/bundlephobia/min/input-mask-react" />
  <img src="https://img.shields.io/npm/types/input-mask-react" />
  <img src="https://img.shields.io/npm/v/@energma/input-mask-react" />  
  <img src="https://img.shields.io/github/license/energma/input-mask-react" />
</p>

`input-mask-react` is a React component for creating input fields with customizable input masks. It allows you to format user input according to a specified mask, handling dynamic cursor positions and formatting on-the-fly. This component supports various types of input masks such as numbers, letters, and both formats.

## Compatibility

- **React 19+**
- **NEXT 15+**

<br>

<img align="center" src="https://media2.giphy.com/media/v1.Y2lkPTc5MGI3NjExbnRxcHdubDFsYmhhejJhZWYxd293ZTRicm84b3VsM3B4YnB4bmw5aiZlcD12MV9pbnRlcm5naWZfYnlfaWQmY3Q9Zw/M9pKngr7PTR1E82iyw/giphy.gif" width="500px"/>

## Table of Contents

- [Features](#features)
- [Installation](#installation)
- [Summary](#summary)
- [Compatibility](#compatibility)
- [Schema Types](#schema-types)
- [Usage](#usage)
- [Props](#props)
- [Examples](#examples)
  - [Credit Card Expiration Date](#credit-card-expiration-date)
  - [Zip Code](#zip-code)
  - [Canadian Zip Code](#canadian-zip-code)
  - [Telephone Number](#telephone-number)
  - [Credit Card Number](#credit-card-number)
  - [Country Code](#country-code)
- [License](#license)

## Features

- **Customizable Mask**: You can define a mask format using a symbol (e.g., `_`) that will be replaced with user input.
- **Dynamic Cursor Management**: The cursor position updates automatically as the user types, ensuring that the mask format is followed properly.
- **Type-based Input Sanitization**: The input is sanitized based on the selected type (numbers, letters, or mixed).
- **React Integration**: It is built specifically for use with React, and works seamlessly with TypeScript.

## Installation

To install the `@energma/input-mask-react` package, run the following command in your project:

```bash
npm install @energma/input-mask-react
```

```bash
pnpm add @energma/input-mask-react
```

```bash
yarn add @energma/input-mask-react
```

## Summary

This repository contains code for input-react-mask
(https://github.com/Energma/input-mask-react)

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

### Masked Input Example in React (TypeScript)

This example demonstrates how to use `@energma/input-mask-react` in a React application with TypeScript.

```tsx
import { MaskedInput, Schema } from "@energma/input-mask-react";
import { useState } from "react";

function MyComponent() {
  const [creditCardExpiration, setCreditCardExpiration] = useState<string>("");

  const schema: Schema = {
    mask: "__/__",
    symbol: "_",
    type: "numbers",
  };

  return (
    <MaskedInput
      schema={schema}
      value={creditCardExpiration}
      onChange={(e) => setCreditCardExpiration(e.target.value)}
      placeholder={schema.mask}
    />
  );
}
```

### Masked Input Example in Next.js

In Next.js use `"use client"` directive to ensure that component is treated as a client component.<br>
This example demonstrates how to use `@energma/input-mask-react` in a Next.js client component.

```tsx
"use client";

import { useState } from "react";
import { MaskedInput, Schema } from "@energma/input-mask-react";

export default function MyComponent() {
  const [creditCardExpiration, setCreditCardExpiration] = useState<string>("");

  const schema: Schema = {
    mask: "__/__",
    symbol: "_",
    type: "numbers",
  };

  return (
    <MaskedInput
      schema={schema}
      value={creditCardExpiration}
      onChange={(e) => setCreditCardExpiration(e.target.value)}
      placeholder={schema.mask}
    />
  );
}
```

You can also add object where properties can be `className`, `id`, `label`, etc like any other `input element`.

`placeholder` can be anything you like but good practice is to have mask there.

## Props

| Prop              | Type &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;                    | Description                                                                                                                                                                                                                                                                                                                                                                    |
| ----------------- | ------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **...InputProps** |                                                                    | Inherit all [props of `Input`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input).                                                                                                                                                                                                                                                                               |
| **`schema`**      | [schema](#schema-types) &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; | Object defines the masking rules for user input.<br><br> - `mask` (string) – Defines the input pattern using a placeholder symbol. If it is a `RegExp`, it will validate the input.<br> - `symbol` (string) – Represents the character that will be replaced by user input.<br> - `type` (string) – Specifies the [type](#schema-types) of input allowed.<br><br> **REQUIRED** |
| **`value`**       | number &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;                  | The value for controlled input.<br><br> **REQUIRED**                                                                                                                                                                                                                                                                                                                           |
| **`onChange`**    | function &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;                | Callback that is called when the input's text changes.<br><br> **REQUIRED**                                                                                                                                                                                                                                                                                                    |
| **`onFocus`**     | function &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;                | Triggered when the user clicks away and then focuses again. It will position the cursor at the next valid input.                                                                                                                                                                                                                                                               |

<br>

# Examples

### Credit Card Expiration Date

```jsx
<MaskedInput
  schema={{ mask: "__/__", symbol: "_", type: "numbers" }}
  value={creditCardExpiration}
  onChange={(e) => setCreditCardExpiration(e.target.value)}
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

`@energma/input-mask-react` is released under the MIT license. See [LICENSE](https://github.com/Energma/input-mask-react/blob/main/lib/LICENSE) for details.
