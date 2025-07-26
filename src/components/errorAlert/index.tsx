import React from "react";
import "./style.css";
import ErrorIcon from "../../images/error.svg";
import WarningIcon from "../../images/warning.svg";

export enum AlertType {
  Warning,
  Error,
}

interface ErrorAlertProps {
  text?: string;
  style?: any;
  type: AlertType;
}

const ErrorAlert = (props: ErrorAlertProps) => {
  const { text, style, type } = props;

  const initStyle = {
    backgroundColor:
      type === AlertType.Error
        ? "var(--secondary-light-color)"
        : "var(--warning-secondary-color)",
    border:
      type === AlertType.Error
        ? "2px solid var(--secondary-color)"
        : "2px solid var(--warning-primary-color)",
  };
  return (
    <div className="error_container" style={initStyle}>
      <img src={type === AlertType.Error ? ErrorIcon : WarningIcon} />
      <span>{text}</span>
    </div>
  );
};

export default ErrorAlert;
