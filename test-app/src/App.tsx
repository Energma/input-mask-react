import { useState } from "react";
import "./App.css";
import { MaskedInput, Schema } from "@energma/input-mask-react";

function App() {
  const [values, setValues] = useState({
    creditCardExpiration: "",
    zipCode: "",
    canadianZipCode: "",
    telephone: "",
    creditCardNumber: "",
    countryCode: ""
  });

  const schemas: {id: string, label: string, schema: Schema, className: string, value: string, onChange: (e: any) => void}[] = [
    {
      id: "credit-card-expiration",
      label: "Credit Card Expiration Month:",
      schema: {
        mask: "__/__",
        symbol: "_",
        type: "numbers",
      },
      className: "masked-input",
      value: values.creditCardExpiration,
      onChange: (e: any) => setValues({...values, creditCardExpiration: e.target.value})
    },
    {
      id: "zip-code",
      label: "Zip Code:",
      schema: {
        mask: "_____",
        symbol: "_",
        type: "numbers",
      },
      className: "masked-input-zipcode",
      value: values.zipCode,
      onChange: (e: any) => setValues({...values, zipCode: e.target.value})
    },
    {
      id: "canadian-zip-code",
      label: "Canadian Zip Code:",
      schema: {
        mask: "XXX XXX",
        symbol: "X",
        type: "mixed",
      },
      className: "masked-input-czipcode",
      value: values.canadianZipCode,
      onChange: (e: any) => setValues({...values, canadianZipCode: e.target.value})
    },
    {
      id: "telephone",
      label: "Telephone:",
      schema: {
        mask: "(XXX)XXX-XXXX",
        symbol: "X",
        type: "numbers",
      },
      className: "masked-input-telephone",
      value: values.telephone,
      onChange: (e: any) => setValues({...values, telephone: e.target.value})
    },
    {
      id: "credit-card-number",
      label: "Credit Card Number:",
      schema: {
        mask: "0000 0000 0000 0000",
        symbol: "0",
        type: "numbers",
      },
      className: "masked-input-credit-card",
      value: values.creditCardNumber,
      onChange: (e: any) => setValues({...values, creditCardNumber: e.target.value})
    },
    {
      id: "country-code",
      label: "Country Code:",
      schema: {
        mask: "XXX",
        symbol: "X",
        type: "letters",
      },
      className: "masked-input-country",
      value: values.countryCode,
      onChange: (e: any) => setValues({...values, countryCode: e.target.value})
    }
  ];

  return (
    <>
      <h2>Input Mask Examples:</h2>
      <div className="wrapper">
        {schemas.map((item) => (
          <div key={item.id} className="input-wrapper">
            <label htmlFor={item.id}>{item.label}</label>{" "}
            <MaskedInput
              schema={item.schema}
              value={item.value}
              onChange={item.onChange}
              placeholder={item.schema.mask}
              data-testid="masked-input"
              className={item.className}
              id={item.id}
            />
          </div>
        ))}
      </div>
    </>
  );
}

export default App;
