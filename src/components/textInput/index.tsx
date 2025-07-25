import React from "react";
import "./style.css";
import { useField, useFormikContext } from "formik";

interface MyTextInputProps {
  type: string;
  placeholder: string;
  label: string;
  onChange?: (value: string | any) => void;
  style?: any;
  inputStyle?: any;
  maxLength?: number;
  ref?: any;
  name: string;
  imgSrc?: any;
}

const MyTextInput = (props: MyTextInputProps) => {
  const {
    type,
    placeholder,
    label,
    onChange,
    style,
    maxLength,
    ref,
    name,
    inputStyle,
    imgSrc,
  } = props;
  const [field, meta] = useField(name);
  const { submitCount, setFieldValue } = useFormikContext<any>();
  const showError = submitCount > 0 && !!meta.error;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFieldValue(name, e.target.value, true);
    if(onChange)onChange(e.target.value);
  };

  return (
    <div style={{ ...style }} className="input-container">
      <label htmlFor={label}>{label}</label>
      {imgSrc ? (
        <div className="input-container-img">
          <input
            {...field}
            ref={ref}
            style={{
              borderColor: showError && "#E14856",
              width: "calc(100% - 40px)",
              ...inputStyle,
            }}
            id={label}
            type={type}
            placeholder={placeholder}
            onChange={handleChange}
            maxLength={maxLength}
            className="input-field"
          ></input>
          <img className="fa fa-user icon" src={imgSrc} />
        </div>
      ) : (
        <input
          {...field}
          ref={ref}
          style={{
            borderColor: showError && "#E14856",
            ...inputStyle,
          }}
          id={label}
          type={type}
          placeholder={placeholder}
          onChange={handleChange}
          maxLength={maxLength}
          className="input-field"
        ></input>
      )}
    </div>
  );
};

export default MyTextInput;
