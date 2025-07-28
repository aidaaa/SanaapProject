import React, { useMemo, useState } from "react";
import "./style.css";
import AsyncSelect from "react-select/async";
import { useField, useFormikContext } from "formik";
import { SelectOption } from "../../types";
import api from "../../api";
import { debounce } from "lodash";

interface MyAsyncSelectProps {
  handleChange?: (value: SelectOption) => void;
  label: string;
  disable?: boolean;
  placeholder: string;
  name: string;
  provinceId: number;
  url: string;
}

const MyAsyncSelect = (props: MyAsyncSelectProps) => {
  const {
    handleChange,
    label,
    placeholder,
    disable = false,
    name,
    provinceId,
    url,
  } = props;

  const [field, meta, helpers] = useField(name);
  const { submitCount } = useFormikContext<any>();
  const { setValue, setTouched } = helpers;

  const showError = !!meta.error && (meta.touched || submitCount > 0);
  const valid = !meta.error && (meta.touched || submitCount > 0);

  const onChange = (e: any) => {
    setValue(e);
    if (handleChange) handleChange(e);
  };

  const fetchOptions = (inputValue: any, callback: any) => {
    if (disable || !inputValue) {
      callback([]);
      return;
    }
    api
      .get(url, {
        params: {
          name: inputValue,
          insurance: "DEY",
          province: provinceId,
        },
      })
      .then((response) => {
        const options: SelectOption[] = [];
        response.data.response.map((el: any) => {
          const opt: SelectOption = { value: el.id, label: el.name };
          options.push(opt);
        });
        callback(options);
      });
  };

  const debouncedLoadOtions = useMemo(() => debounce(fetchOptions, 500), [provinceId]);

  const customStyles = {
    container: (baseStyles: any, state: any) => ({
      ...baseStyles,
      width: "100%",
    }),
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
      fontSize: "10px",
      textAlign: "right",
      ":hover": {
        color: "white",
        backgroundColor: "#017785",
      },
    }),
    dropdownIndicator: (baseStyles: any, state: any) => ({
      ...baseStyles,
      color: disable ? "white" : "#D2D1D1",
    }),
    placeholder: (baseStyles: any, state: any) => ({
      ...baseStyles,
      textAlign: "right",
      fontSize: "10px",
    }),
    singleValue: (baseStyles: any, state: any) => ({
      ...baseStyles,
      textAlign: "right",
      fontSize: "10px",
    }),
  };

  return (
    <div className="drop_container">
      <span>{label}</span>
      <AsyncSelect
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
        cacheOptions
        loadOptions={debouncedLoadOtions}
        defaultOptions
        onChange={(selectedOption) => onChange(selectedOption)}
        placeholder={placeholder}
      />
    </div>
  );
};

export default MyAsyncSelect;
