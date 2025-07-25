import React, { useCallback, useEffect, useRef, useState } from "react";
import "./style.css";
import MyTextInput from "../../components/textInput";
import MyButton from "../../components/button";
import { AxiosError } from "axios";
import { useMutation } from "@tanstack/react-query";
import { MyData, MyError } from "../../types";
import ErrorAlert, { AlertType } from "../../components/error_alert";
import { CircularProgress } from "@mui/material";
import { Form, Formik, useField, useFormikContext } from "formik";
import * as Yup from "yup";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";
import api from "../../api";

interface CodeValidateProps {
  style?: any;
  onSuccess: () => void;
}

interface CodeInputProps {
  name: string;
  index: number;
}

interface CodeInput {
  phone_number: string;
  code: string;
}

const codeValidation = async (input: CodeInput) => {
  const response = await api.post(
    "/api/v2/app/DEY/agent/verification/signup/validate_otp/",
    {
      code: input.code,
      phone_number: input.phone_number,
    }
  );
  return response.data;
};

const CodeInput = (props: CodeInputProps) => {
  const { name, index } = props;
  const [field, meta] = useField(name);
  const { submitCount } = useFormikContext<any>();
  const inputRef = useRef<HTMLInputElement>(null);

  const showError = submitCount > 0 && !!meta.error;

  const handleChange = (value: string) => {
    if (!/^\d?$/.test(value)) return;

    // field.onChange(e);

    // move focus to next input
    if (
      value &&
      inputRef.current?.nextElementSibling instanceof HTMLInputElement
    ) {
      inputRef.current.nextElementSibling.focus();
    }
  };
  return (
    <MyTextInput
      {...field}
      ref={inputRef}
      type="number"
      maxLength={1}
      onChange={handleChange}
      placeholder=""
      label=""
      style={{ width: "48px", height: "48px" }}
      inputStyle={{ textAlign: "center" }}
    />
  );
};

const CodeValidate = (props: CodeValidateProps) => {
  const { onSuccess } = props;
  const phoneNumber = useSelector(
    (state: RootState) => state.userData.phoneNumber
  );

  const [showError, setShowError] = useState<boolean>(false);

  const { data, isPending, isError, error, mutate } = useMutation<
    MyData,
    AxiosError<MyError>,
    CodeInput
  >({
    mutationFn: codeValidation,
    onSuccess: (data: MyData): void => {
      onSuccess();
    },
    onError: function (error: AxiosError<MyError>) {
      setShowError(true);
    },
  });

  useEffect(() => {
    setTimeout(() => {
      setShowError(false);
    }, 3000);
  }, [isError]);

  return (
    <div className="code-container">
      {showError && (
        <ErrorAlert
          type={AlertType.Error}
          text={error?.response?.data?.error_details?.fa_details}
        />
      )}
      {isPending && (
        <CircularProgress
          style={{
            color: "var(--primary-color)",
            position: "absolute",
            top: "35%",
          }}
        />
      )}
      <div className="code_txt_container">
        <span className="code_txt_header">کد تایید را وارد نمایید</span>
        <span className="code_txt_hint">{phoneNumber}</span>
      </div>

      <Formik
        initialValues={{
          otp1: "",
          otp2: "",
          otp3: "",
          otp4: "",
          otp5: "",
        }}
        validationSchema={Yup.object({
          otp1: Yup.string().required(),
          otp2: Yup.string().required(),
          otp3: Yup.string().required(),
          otp4: Yup.string().required(),
          otp5: Yup.string().required(),
        })}
        onSubmit={(values) => {
          const code = Object.values(values).join("");
          if (code.length === 5) {
            mutate({ code: code, phone_number: phoneNumber });
          }
        }}
      >
        <Form>
          <div className="code-form">
            <CodeInput name="otp1" index={0} />
            <CodeInput name="otp2" index={1} />
            <CodeInput name="otp3" index={2} />
            <CodeInput name="otp4" index={3} />
            <CodeInput name="otp5" index={4} />
          </div>

          <MyButton
            style={{ marginTop: "40px" }}
            text="ادامه"
          />
        </Form>
      </Formik>
    </div>
  );
};

export default CodeValidate;
