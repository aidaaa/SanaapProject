import React from "react";
import "./style.css";
import MyTextInput from "../../components/TextInput";
import MyButton from "../../components/Button";
import { Form, Formik } from "formik";
import * as Yup from "yup";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../store/store";
import { addUserName } from "../../reducers/userDataReducers";

interface UserPersonalDataProps {
  onSuccess: () => void;
}

const UserPersonalData = (props: UserPersonalDataProps) => {
  const { onSuccess } = props
  const dispatch = useDispatch();
  // const phoneNumber = useSelector(
  //   (state: RootState) => state.userData.phoneNumber
  // );

  return (
    <Formik
      initialValues={{ firstName: "", lastName: "" }}
      validationSchema={Yup.object({
        firstName: Yup.string().required(),
        lastName: Yup.string().required(),
      })}
      onSubmit={(values) => {
        dispatch(
          addUserName({
            firstName: values.firstName,
            lastName: values.lastName,
            phoneNumber: "",
          })
        );
        onSuccess();
      }}
    >
      <Form className="personal-container">
        <MyTextInput
          style={{ marginTop: "20px" }}
          type="text"
          name="firstName"
          placeholder="نام"
          label="نام"
        />
        <MyTextInput
          type="text"
          name="lastName"
          placeholder="نام خانوادگی"
          label="نام خانوادگی"
        />

        <MyButton
          style={{ marginTop: "10px" }}
          text="ادامه"
        />
      </Form>
    </Formik>
  );
};

export default UserPersonalData;
