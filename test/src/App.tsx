import { useState } from 'react'
import './App.css'


function App() {

  const [value, setValue] = useState('');

  // Define a schema for the masked input
  // const schema: Schema = {
  //   mask: '___/___-___-___',
  //   symbol: '_', 
  //   type: 'letters',  
  // };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>Masked Input Example</h1>
      <p>Enter a value in the input field below:</p>
      {/* <MaskedInput
        schema={schema}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Enter value..."
        data-testid="masked-input"
        className='masked-input'
      />
      <p>Current Value: {value}</p> */}
    </div>
  );
}

export default App
