import { useState } from 'react';
import './App.css';
import { MaskedInput } from "@energma/input-mask-react";

function App() {

  const [creditCardExpiration, setCreditCardExpiration] = useState('');
  const [zipCode, setZipCode] = useState('');
  const [canadianZipCode, setCanadianZipCode] = useState('');
  const [telephone, setTelephone] = useState('');
  const [creditCardNumber, setCreditCardNumber] = useState('');
  const [countryCode, setCountryCode] = useState('');

   interface Schema {
    mask: string;
    symbol: string;
    type?: 'numbers' | 'letters' | 'mixed';
};

const creditCardExpirationSchema: Schema = {
  mask: '__/__',
  symbol: '_',
  type: 'numbers',
};

const zipCodeSchema: Schema = {
  mask: '_____',
  symbol: '_',
  type: 'numbers',
};

const canadianZipCodeSchema: Schema = {
  mask: 'XXX XXX',
  symbol: 'X',
  type: 'mixed',
};

const telephoneSchema: Schema = {
  mask: '(XXX) XXX-XXXX',
  symbol: 'X',
  type: 'numbers',
};

const creditCardNumberSchema: Schema = {
  mask: 'XXXX XXXX XXXX XXXX',
  symbol: 'X',
  type: 'numbers',
};

 const countryCodeSchema: Schema = {
  mask: '000',
  symbol: '0',
  type: 'letters',
 }

  return (
    <>
      <h2>Input Mask Examples:</h2>
      <div className="wrapper">
        <div className="input-wrapper">
            <label htmlFor="credit-card-expiration">Credit Card Expiration Month:</label>{" "}
            <MaskedInput
                schema={creditCardExpirationSchema}
                value={creditCardExpiration}
                onChange={(e: any) => setCreditCardExpiration(e.target.value)}
                placeholder={creditCardExpirationSchema.mask}
                data-testid="masked-input"
                className='masked-input'
            /> 
          </div>

        <div className="input-wrapper">
            <label htmlFor="zip-code">Zip Code:</label>
            {" "}
            <MaskedInput
            className='masked-input-zipcode'
            schema={zipCodeSchema}
            value={zipCode}
            onChange={(e: any) => setZipCode(e.target.value)}
            id="credit-card-expiration"
            data-testid="masked-input"
            placeholder={zipCodeSchema.mask} 
            />
        </div>

        <div className="input-wrapper">
            <label htmlFor="czip-code">Canadian Zip Code:</label>
            {" "}
            <MaskedInput
            className='masked-input-czipcode'
            schema={canadianZipCodeSchema}
            value={canadianZipCode}
            onChange={(e: any) => setCanadianZipCode(e.target.value)}
            id="credit-card-expiration"
            data-testid="masked-input"
            placeholder={canadianZipCodeSchema.mask}
            />
        </div>

        <div className="input-wrapper">
            <label htmlFor="telephone">Telephone:</label>
            {" "}
            <MaskedInput
            className='masked-input-telephone'
            schema={telephoneSchema}
            value={telephone}
            onChange={(e: any) => setTelephone(e.target.value)}
            id="credit-card-expiration"
            data-testid="masked-input"
            placeholder={telephoneSchema.mask} 
            />
        </div>

        <div className="input-wrapper">
            <label htmlFor="credit-card-number">Credit Card Number: </label>
            {" "}
            <MaskedInput
            className='masked-input-credit-card'
            schema={creditCardNumberSchema}
            value={creditCardNumber}
            onChange={(e: any) => setCreditCardNumber(e.target.value)}
            id="credit-card-expiration"
            data-testid="masked-input"
            placeholder={creditCardNumberSchema.mask} 
            />
        </div>

        <div className="input-wrapper">
            <label htmlFor="credit-card-number">Vehicle Licence: </label>
            {" "}
            <MaskedInput
            className='masked-input-licence'
            schema={countryCodeSchema}
            value={countryCode}
            onChange={(e: any) => setCountryCode(e.target.value)}
            id="credit-card-expiration"
            data-testid="masked-input"
            placeholder={countryCodeSchema.mask} 
            />
        </div>
      </div>
    </>
  )
}

export default App
