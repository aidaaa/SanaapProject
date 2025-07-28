import React, { useState } from "react";
import "./style.css";
import Select from "react-select";
import { InputActionMeta } from "react-select";
import { useField, useFormikContext } from "formik";
import { SelectOption } from "../../types";

// interface SelectOptionType

interface MyDropDownProps {
  options: { value: string | number; label: string }[];
  handleChange?: (value: SelectOption) => void;
  label: string;
  disable?: boolean;
  placeholder: string;
  name: string;
}

const MyDropDown = (props: MyDropDownProps) => {
  const {
    options,
    handleChange,
    label,
    placeholder,
    disable = false,
    name,
  } = props;
  const [selectedOption, setSelectedOption] = useState<any>(null);

  const [field, meta, helpers] = useField(name);
  const { submitCount } = useFormikContext<any>();
  const { setValue, setTouched } = helpers;

  // const showError = !!meta.error && (meta.touched || submitCount > 0);
    const showError = submitCount > 0 && !!meta.error;
  const valid = !meta.error && (meta.touched || submitCount > 0);

  const onChange = (e: any) => {
    setValue(e);
    if(handleChange)handleChange(e);
  };

  const customStyles = {
    control: (baseStyles: any, state: any) => ({
      ...baseStyles,
      backgroundColor: disable ? "#D2D1D1" : "white",
      height: "48px",
      borderColor: showError
        ? "#E14856"
        : valid
        ? "green"
        : baseStyles.borderColor,
    }),
    option: (baseStyles: any, state: any) => ({
      ...baseStyles,
      backgroundColor: state.isSelected ? "lightblue" : "white",
      color: state.isSelected ? "white" : "black",
      ":hover": {
        color: "white",
        backgroundColor: "#017785",
      },
    }),
    dropdownIndicator: (baseStyles: any, state: any) => ({
      ...baseStyles,
      color: disable ? "white" : "#D2D1D1",
    }),
  };

  return (
    <div className="drop_container">
      <span>{label}</span>
      <Select
        {...field}
        isDisabled={disable}
        styles={customStyles}
        onBlur={() => setTouched(true)}
        theme={(theme) => ({
          ...theme,
          borderRadius: 5,
          colors: {
            ...theme.colors,
            primary: disable ? "var(--gray-color)" : "var(--primary-color)", // Primary color for selected items, hover, etc.
            primary25: "var(--primary-color)", // Lighter primary color for hover states
            neutral0: "#ffffff", // Background color of the control
            neutral80: "#333333", // Text color
          },
        })}
        onChange={(selectedOption: any) => {
          setSelectedOption(selectedOption);
          onChange(selectedOption);
        }}
        options={options}
        inputValue={""}
        value={selectedOption}
        minMenuHeight={48}
        // className={showError ? "drop_select_error" : "drop_select"}
        className="drop_select"
        placeholder={placeholder}
      />
    </div>
  );
};

export default MyDropDown;
