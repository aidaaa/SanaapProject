import React, { useEffect, useRef, useState } from "react";
import "./style.css";
import MyTextInput from "../../components/textInput";
import MyButton from "../../components/button";
import { useMutation, useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { CircularProgress } from "@mui/material";
import ErrorAlert, { AlertType } from "../../components/error_alert";
import { MyData, MyError } from "../../types";
import { Form, Formik } from "formik";
import * as Yup from "yup";
import { useDispatch } from "react-redux";
import { addUserPhone } from "../../reducers/userDataReducers";
import api from "../../api";

interface PhoneEntryProps {
  onSuccess: () => void;
}

interface PhoneInput {
  phone_number: string;
}

const phoneValidation = async (input: PhoneInput) => {
  const response = await api.post(
    "/api/v2/app/DEY/agent/verification/signup/create_otp/",
    {
      phone_number: input.phone_number,
    }
  );
  return response.data;
};

const PhoneEntry = (props: PhoneEntryProps) => {
  const [showError, setShowError] = useState<boolean>(false);
  // const [sho]
  const dispatch = useDispatch();

  const { data, isPending, isError, error, mutate } = useMutation<
    MyData,
    AxiosError<MyError>,
    PhoneInput
  >({
    mutationFn: phoneValidation,
    onSuccess: (data: MyData, _context): void => {
      dispatch(addUserPhone(_context.phone_number));
      props.onSuccess();
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
    <div className="phone-container">
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
      <div className="phone_txt_container">
        <span className="phone_txt_header">
          .شماره موبایل خود را وارد نمایید
        </span>
        <span className="phone_txt_hint">
          .کد تایید برای شما ارسال خواهد شد
        </span>
      </div>
      <Formik
        initialValues={{ phone: "" }}
        validationSchema={Yup.object({
          phone: Yup.string().required(),
        })}
        onSubmit={(values) => {
          mutate({ phone_number: values.phone });
        }}
      >
        <Form>
          <MyTextInput
            type="text"
            name="phone"
            placeholder="تلفن همراه "
            label="تلفن همراه "
            maxLength={11}
            onChange={function (value: string): void {
              //   setPhoneNumber(value);
            }}
          />

          <MyButton
            style={{ marginTop: "40px" }}
            text="ادامه"
            // disable={phoneNumber === ""}
            onClick={function (): void {
              //   mutate();
            }}
          />
        </Form>
      </Formik>
    </div>
  );
};

export default PhoneEntry;
