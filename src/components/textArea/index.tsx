import React from "react";
import "./style.css";
import { useField, useFormikContext } from "formik";

interface MyTextAreaProps {
  placeholder: string;
  label: string;
  onChange?: (value: string | any) => void;
  style?: any;
  inputStyle?: any;
  ref?: any;
  name: string;
}

const MyTextArea = (props: MyTextAreaProps) => {
  const {
    placeholder,
    label,
    onChange,
    style,
    ref,
    name,
    inputStyle,
  } = props;
  const [field, meta] = useField(name);
  const { submitCount, setFieldValue } = useFormikContext<any>();
  const showError = submitCount > 0 && !!meta.error;

  const handleChange = (e: any) => {
    setFieldValue(name, e.target.value, true);
    if (onChange) onChange(e.target.value);
  };

  return (
    <div style={{ ...style }} className="textarea-container">
      <label htmlFor={label}>{label}</label>
      <textarea
        {...field}
        ref={ref}
        style={{
          borderColor: showError && "#E14856",
          ...inputStyle,
        }}
        id={label}
        placeholder={placeholder}
        onChange={handleChange}
        className="input-field"
      ></textarea>
    </div>
  );
};

export default MyTextArea;
