import React, { useState } from "react";
import "./style.css";
import { SelectOption } from "../../types";
import { useField } from "formik";

interface MyRadioButtonProps {
  radioOptions: SelectOption[];
  onChange: (value: number) => void;
  name: string;
}

const MyRadioButton = (props: MyRadioButtonProps) => {
  const { radioOptions, onChange, name } = props;
  const [field] = useField(name);

  const [selectedValue, setSelectedValue] = useState<number>(-1);

  const handleChange = (value: number) => {
    setSelectedValue(value);
    onChange(value);
  };

  return (
    <div className="radio-container">
      <span>:نوع نمایندگی</span>
      <div className="radio-input-container">
        {radioOptions.map((el, index) => {
          return (
            <div key={index} style={{ display: "flex", alignItems: "center" }}>
              <input
                {...field}
                type="radio"
                name="myRadioGroup" // Same name for all radios in the group
                value={el.value}
                checked={selectedValue === el.value} // Controlled by state
                onChange={(e) => handleChange(el.value)}
              />
              <label htmlFor={el.label} onClick={() => handleChange(el.value)}>
                {el.label}
              </label>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MyRadioButton;
