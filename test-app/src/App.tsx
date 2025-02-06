import { useState } from 'react';
import './App.css';
import { MaskedInput } from "@energma/input-mask-react";


function App() {

  const [value, setValue] = useState('');

   interface Schema {
    mask: string;
    symbol: string;
    type?: 'numbers' | 'letters' | 'mixed';
}

  const schema: Schema = {
      mask: '___/___-___-___',
      symbol: '_', 
      type: 'numbers',  
     };

  return (
    <>
       <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>Masked Input Example</h1>
      <p>Enter a value in the input field below:</p>
       <MaskedInput
        schema={schema}
        value={value}
        onChange={(e: any) => setValue(e.target.value)}
        placeholder="Enter value..."
        data-testid="masked-input"
        className='masked-input'
      /> 
      <p>Current Value: {value}</p> 
      </div>
    </>
  )
}

export default App
