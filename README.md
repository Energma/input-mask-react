# Input Mask React

`input-mask-react` is a React component for creating input fields with customizable input masks. It allows you to format user input according to a specified mask, handling dynamic cursor positions and formatting on-the-fly. This component supports various types of input masks such as numbers, letters, and mixed formats.

## Features

- **Customizable Mask**: You can define a mask format using a symbol (e.g., `_`) that will be replaced with user input.
- **Dynamic Cursor Management**: The cursor position updates automatically as the user types, ensuring that the mask format is followed properly.
- **Type-based Input Sanitization**: The input is sanitized based on the selected type (numbers, letters, or mixed).
- **React Integration**: It is built specifically for use with React, and works seamlessly with TypeScript.

## Installation

To install the `input-mask-react` package, run the following command in your project:

npm:
npm install input-mask-react

pnpm: 
pnpm add input-mask-react

## Usage
```
import React, { useState } from "react";
import { MaskedInput, Schema } from "input-mask-react";

const App = () => {
  const [value, setValue] = useState("");

  const schema: Schema = {
    mask: "(XXX) XXX-XXXX", // Define the input mask pattern
    symbol: "_",             // Define the symbol to replace with input (e.g., _ or any other character)
    type: "numbers",         // Optional: define input type (numbers, letters, or mixed)
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
  };

  return (
    <div>
      <h1>Input Mask Example</h1>
      <MaskedInput
        schema={schema}
        value={value}
        onChange={handleChange}
        placeholder="(XXX) XXX-XXXX"
      />
    </div>
  );
};

export default App;
```