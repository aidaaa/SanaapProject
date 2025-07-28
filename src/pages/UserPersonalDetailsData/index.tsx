import React, { useEffect, useReducer, useRef, useState } from "react";
import "./style.css";
import MyTextInput from "../../components/TextInput";
import MyButton from "../../components/Button";
import { Form, Formik } from "formik";
import * as Yup from "yup";
import MyDropDown from "../../components/DropDownMenu";
import { AxiosError } from "axios";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  MyData,
  MyError,
  ProvinceData,
  SelectOption,
  VerificationSighUp,
} from "../../types";
import ErrorAlert, { AlertType } from "../../components/ErrorAlert";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";
import DoneIcone from "../../images/done.svg";
import MyRadioButton from "../../components/RadioButton";
import MyTextArea from "../../components/TextArea";
import { CircularProgress } from "@mui/material";
import api from "../../api";
import MyAsyncSelect from "../../components/AsyncSelect";

interface UserPersonalDetailsDataProps {
  onSuccess: () => void;
}

enum AgencyType {
  Real,
  Legal,
}

enum ErrorType {
  None,
  ValidationSignUp,
  CodeValidation,
}

interface VerificationSignUpInput {
  address: string;
  agency_type: AgencyType;
  agent_code: string;
  city_code: number;
  county: any;
  first_name: string;
  insurance_branch: any;
  last_name: string;
  phone: string;
  phone_number: string;
  province: any;
  Name: string;
}

interface AgentCodeInput {
  agentCode: string;
}

interface FetchCountiesInput {
  provinceId: number;
}

const verificationSignup = async (input: VerificationSignUpInput) => {
  const response = await api.post(
    "/api/v2/app/DEY/agent/verification/signup/",
    {
      address: input.address,
      agency_type: input.agency_type === 0 ? "real" : "legal",
      agent_code: input.agent_code,
      city_code: input.city_code,
      county: input.county.value,
      first_name: input.first_name,
      insurance_branch: input.insurance_branch.value,
      last_name: input.last_name,
      phone: input.phone,
      phone_number: input.phone_number,
      province: input.province.value,
      Name: input.Name,
    }
  );
  return response.data;
};

const validationAgentCode = async (input: AgentCodeInput) => {
  const response = await api.post(
    "/api/v2/app/DEY/agent/verification/signup/check_agency_code/",
    {
      agent_code: input.agentCode,
    }
  );
  return response.data;
};

const fetchProvince = async () => {
  const response = await api.get("/base/provinces_wop/");
  return response.data;
};

const fetchCounties = async (input: FetchCountiesInput) => {
  const response = await api.get(`/base/counties_wop/`, {
    params: { province: input.provinceId },
  });
  return response.data;
};

const UserPersonalDetailsData = (props: UserPersonalDetailsDataProps) => {
  const { onSuccess } = props;
  // const queryClient = useQueryClient();

  const [showWarningMsg, setShowWarningMsg] = useState<ErrorType>(
    ErrorType.None
  );
  const [agentCodeValidate, setAgentCodeValidate] = useState<boolean>(false);

  const [provinceOption, setProvinceOption] = useState<SelectOption[]>([]);
  const [countiyOption, setCountiyOption] = useState<SelectOption[]>([]);

  const [selectedProvinceId, setSelectedProvinceId] = useState<number>(-1);
  const [agencyType, setAgencyType] = useState<AgencyType>();

  const radioOptions: SelectOption[] = [
    { label: "حقیقی", value: AgencyType.Real },
    { label: "حقوقی", value: AgencyType.Legal },
  ];

  const userData = useSelector((state: RootState) => state.userData);

  const agentCodeValidationMutation = useMutation<
    MyData,
    AxiosError<MyError>,
    AgentCodeInput
  >({
    mutationFn: validationAgentCode,
    onSuccess: (data: MyData, _context): void => {
      setAgentCodeValidate(true);
    },
    onError: function (error: AxiosError<MyError>) {
      setAgentCodeValidate(false);
      setShowWarningMsg(ErrorType.CodeValidation);
    },
  });

  const verificationSignupMutation = useMutation<
    VerificationSighUp,
    AxiosError<MyError>,
    VerificationSignUpInput
  >({
    mutationFn: verificationSignup,
    onSuccess: (data: VerificationSighUp): void => {
      localStorage.setItem("token", data.response.access);
      onSuccess();
    },
    onError: function (error: AxiosError<MyError>) {
      setShowWarningMsg(ErrorType.ValidationSignUp);
    },
  });

  const fetchProvinceQuery = useQuery<ProvinceData[], AxiosError<MyError>>({
    queryKey: ["province"],
    queryFn: fetchProvince,
    enabled: false,
  });

  const fetchCountyQuery = useQuery<ProvinceData[], AxiosError<MyError>>({
    queryKey: ["county"],
    queryFn: () => fetchCounties({ provinceId: selectedProvinceId }),
    enabled: false,
  });

  useEffect(() => {
    fetchProvinceQuery.refetch();
  }, []);

  useEffect(() => {
    if (fetchProvinceQuery.data) {
      const options: SelectOption[] = [];
      fetchProvinceQuery.data.map((el) => {
        const opt: SelectOption = { value: el.id, label: el.name };
        options.push(opt);
      });
      setProvinceOption([...options]);
    }
  }, [fetchProvinceQuery.data]);

  useEffect(() => {
    if (selectedProvinceId !== -1) {
      fetchCountyQuery.refetch();
    }
  }, [selectedProvinceId]);

  useEffect(() => {
    if (fetchCountyQuery.data) {
      const options: SelectOption[] = [];
      fetchCountyQuery.data.map((el) => {
        const opt: SelectOption = { value: el.id, label: el.name };
        options.push(opt);
      });
      setCountiyOption([...options]);
    }
  }, [fetchCountyQuery.data]);

  useEffect(() => {
    setTimeout(() => {
      setShowWarningMsg(ErrorType.None);
    }, 3000);
  }, [agentCodeValidationMutation.isError, verificationSignupMutation.isError]);

  const agenctTypeValueScheme: AgencyType[] = Object.values(
    AgencyType
  ) as AgencyType[];

  return (
    <>
      {verificationSignupMutation.isPending && (
        <CircularProgress
          style={{
            color: "var(--primary-color)",
            position: "absolute",
            top: "35%",
          }}
        />
      )}
      {showWarningMsg !== ErrorType.None && (
        <ErrorAlert
          type={AlertType.Error}
          text={
            showWarningMsg === ErrorType.CodeValidation
              ? agentCodeValidationMutation.error?.response?.data?.error_details
                  ?.fa_details
              : verificationSignupMutation.error?.response?.data?.error_details
                  ?.fa_details
          }
        />
      )}
      <Formik
        initialValues={{
          agentCode: "",
          address: "",
          provinces: 0,//{ label: "", value: -1 },
          counties: 0,//{ label: "", value: -1 },
          insurance_branch: 0,//{ label: "", value: -1 },
          phone: "",
          agancyType: AgencyType.Legal,
          agancyName: "",
        }}
        validationSchema={Yup.object({
          agentCode: Yup.string().required(),
          provinces: Yup.object().required(),
          address: Yup.string().required(),
          counties: Yup.object().required(),
          phone: Yup.string().required(),
          insurance_branch: Yup.object().required(),
          agancyType: Yup.mixed<AgencyType>()
            .oneOf(agenctTypeValueScheme)
            .required(),
          agancyName: Yup.string().when("agancyType", {
            is: AgencyType.Legal,
            then: (schema) => schema.required(),
            otherwise: (scheme) => scheme.notRequired(),
          }),
        })}
        onSubmit={(values) => {
          console.log(values);
          const params: VerificationSignUpInput = {
            address: values.address,
            agency_type: values.agancyType,
            agent_code: values.agentCode,
            city_code: 0,
            county: values.counties,
            first_name: userData.firstName,
            insurance_branch: values.insurance_branch,
            last_name: userData.lastName,
            phone: values.phone,
            phone_number: userData.phoneNumber,
            province: values.provinces,
            Name: values.agancyName,
          };
          verificationSignupMutation.mutate(params);
        }}
      >
        <Form className="personal-detail-container">
          <MyTextInput
            style={{ marginTop: "20px" }}
            type="text"
            name="agentCode"
            placeholder="کد نمایندگی را وارد کنید"
            label="کد نمایندگی"
            maxLength={4}
            imgSrc={agentCodeValidate && DoneIcone}
            onChange={function (value: string): void {
              if (value.length === 4)
                agentCodeValidationMutation.mutate({ agentCode: value });
            }}
          />

          <MyDropDown
            name="provinces"
            options={provinceOption}
            handleChange={function (value: SelectOption): void {
              setSelectedProvinceId(value.value);
            }}
            label={"استان"}
            placeholder="استان را انتخاب کنید"
          />

          <MyDropDown
            name="counties"
            options={countiyOption}
            label={"شهر"}
            placeholder="شهر را انتخاب کنید"
            disable={countiyOption.length === 0}
          />

          <MyAsyncSelect
            name="insurance_branch"
            label={"شعبه بیمه"}
            placeholder="شعبه بیمه را انتخاب کنید"
            disable={selectedProvinceId === -1}
            provinceId={selectedProvinceId}
            url="/api/v2/app/selection_item/insurance_branch/wop_list/"
          />

          <MyTextArea
            style={{ height: "100px" }}
            name="address"
            placeholder="آدرس را وارد کنید"
            label="آدرس"
            inputStyle={{ height: "150px" }}
          />

          <MyTextInput
            type="text"
            name="phone"
            placeholder="تلفن ثابت"
            label="تلفن ثابت"
            maxLength={11}
          />

          <MyRadioButton
            name="agancyType"
            radioOptions={radioOptions}
            onChange={(value: number) => {
              if (value === 0) setAgencyType(AgencyType.Real);
              else setAgencyType(AgencyType.Legal);
            }}
          />

          {agencyType === AgencyType.Legal && (
            <MyTextInput
              type="text"
              name="agancyName"
              placeholder="نام نمایندگی را وارد کنید"
              label="نام نمایندگی"
            />
          )}

          <MyButton
            style={{ marginTop: "10px", marginBottom: "10px" }}
            text="ادامه"
          />
        </Form>
      </Formik>
    </>
  );
};

export default UserPersonalDetailsData;
