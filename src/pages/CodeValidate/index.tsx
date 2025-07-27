import React, {
  forwardRef,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import "./style.css";
import MyTextInput from "../../components/TextInput";
import MyButton from "../../components/Button";
import { AxiosError } from "axios";
import { useMutation } from "@tanstack/react-query";
import { MyData, MyError } from "../../types";
import ErrorAlert, { AlertType } from "../../components/ErrorAlert";
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
  changeFocus: (index: number) => void;
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

const CodeInput = forwardRef<HTMLInputElement, CodeInputProps>((props, ref) => {
  const { name, index, changeFocus } = props;
  const [field, meta] = useField(name);
  const { submitCount } = useFormikContext<any>();

  const showError = submitCount > 0 && !!meta.error;

  const handleChange = (value: string) => {
    changeFocus(index);
  };
  return (
    <MyTextInput
      {...field}
      name={name}
      ref={ref}
      type="number"
      maxLength={1}
      onChange={handleChange}
      placeholder=""
      label=""
      style={{ width: "48px", height: "48px" }}
      inputStyle={{ textAlign: "center" }}
    />
  );
});

const CodeValidate = (props: CodeValidateProps) => {
  const { onSuccess } = props;
  const phoneNumber = useSelector(
    (state: RootState) => state.userData.phoneNumber
  );
  const inputRef = useRef<Array<HTMLInputElement | null>>([]);

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

  const onFocusChange = (index: number) => {
    inputRef.current[index + 1]?.focus();
  };

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
          firstName: "",
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
            <CodeInput
              name="otp1"
              index={0}
              ref={(el: HTMLInputElement | null) => {
                inputRef.current[0] = el;
              }}
              changeFocus={onFocusChange}
            />
            <CodeInput
              name="otp2"
              index={1}
              ref={(el: HTMLInputElement | null) => {
                inputRef.current[1] = el;
              }}
              changeFocus={onFocusChange}
            />
            <CodeInput
              name="otp3"
              index={2}
              ref={(el: HTMLInputElement | null) => {
                inputRef.current[2] = el;
              }}
              changeFocus={onFocusChange}
            />
            <CodeInput
              name="otp4"
              index={3}
              ref={(el: HTMLInputElement | null) => {
                inputRef.current[3] = el;
              }}
              changeFocus={onFocusChange}
            />
            <CodeInput
              name="otp5"
              index={4}
              ref={(el: HTMLInputElement | null) => {
                inputRef.current[4] = el;
              }}
              changeFocus={onFocusChange}
            />
          </div>

          <MyButton style={{ marginTop: "40px" }} text="ادامه" />
        </Form>
      </Formik>
    </div>
  );
};

export default CodeValidate;
