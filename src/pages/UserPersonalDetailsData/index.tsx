import React, { useEffect, useState } from "react";
import "./style.css";
import MyTextInput from "../../components/textInput";
import MyButton from "../../components/button";
import { Form, Formik } from "formik";
import * as Yup from "yup";
import MyDropDown from "../../components/dropDownMenu";
import { AxiosError } from "axios";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  MyData,
  MyError,
  ProvinceData,
  SelectOption,
  VerificationSighUp,
} from "../../types";
import ErrorAlert, { AlertType } from "../../components/error_alert";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";
import DoneIcone from "../../images/done.svg";
import MyRadioButton from "../../components/radioButton";
import MyTextArea from "../../components/textArea";
import { CircularProgress } from "@mui/material";
import api from "../../api";

interface UserPersonalDetailsDataProps {
  onSuccess: () => void;
}

enum AgencyType {
  Real,
  Legal,
}

interface VerificationSignUpInput {
  address: string;
  agency_type: AgencyType;
  agent_code: string;
  city_code: number;
  county: number;
  first_name: string;
  insurance_branch: number;
  last_name: string;
  phone: string;
  phone_number: string;
  province: number;
  Name: string;
}

interface AgentCodeInput {
  agentCode: string;
}

interface FetchCountiesInput {
  provinceId: number;
}

const verificationSignup = async (input: VerificationSignUpInput) => {
  const response = await api.post("/api/v2/app/DEY/agent/verification/signup", {
    address: input.address,
    agency_type: input.agency_type,
    agent_code: input.agent_code,
    city_code: input.city_code,
    county: input.county,
    first_name: input.first_name,
    insurance_branch: input.insurance_branch,
    last_name: input.last_name,
    phone: input.phone,
    phone_number: input.phone_number,
    province: input.province,
    Name: input.Name,
  });
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
  const response = await api.get(`/base/counties_wop`, {
    params: { province: input.provinceId },
  });
  return response.data;
};

const fetchInsuranceBranch = async (input: FetchCountiesInput) => {
  const response = await api.get(
    "/api/v2/app/selection_item/insurance_branch/wop_list/",
    {
      params: {
        name: 73,
        insurance: "DEY",
        province: input.provinceId,
      },
    }
  );
  return response.data;
};

const UserPersonalDetailsData = (props: UserPersonalDetailsDataProps) => {
  const { onSuccess } = props;
  // const queryClient = useQueryClient();

  const [showWarningMsg, setShowWarningMsg] = useState<boolean>(false);
  const [agentCodeValidate, setAgentCodeValidate] = useState<boolean>(false);

  const [provinceOption, setProvinceOption] = useState<SelectOption[]>([]);
  const [countiyOption, setCountiyOption] = useState<SelectOption[]>([]);
  const [insuranceBranchOption, setInsuranceBranchOption] = useState<
    SelectOption[]
  >([]);

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
      setAgentCodeValidate(false)
      setShowWarningMsg(true);
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
      setShowWarningMsg(true);
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

  const fetchInsuranceBranchQuery = useQuery<
    ProvinceData[],
    AxiosError<MyError>
  >({
    queryKey: ["insurance"],
    queryFn: () => fetchInsuranceBranch({ provinceId: selectedProvinceId }),
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
      // fetchInsuranceBranchQuery.refetch();
      // queryClient.invalidateQueries({ queryKey: ['county', 'insurance'] })
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
    if (fetchInsuranceBranchQuery.data) {
      const options: SelectOption[] = [];
      fetchInsuranceBranchQuery.data.map((el) => {
        const opt: SelectOption = { value: el.id, label: el.name };
        options.push(opt);
      });
      setInsuranceBranchOption([...options]);
    }
  }, [fetchInsuranceBranchQuery.data]);

  useEffect(() => {
    setTimeout(() => {
      setShowWarningMsg(false);
    }, 3000);
  }, [agentCodeValidationMutation.isError, verificationSignupMutation.isError]);

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
      {showWarningMsg && (
        <ErrorAlert
          type={AlertType.Error}
          text={
            agentCodeValidationMutation.error?.response?.data?.error_details
              ?.fa_details
          }
        />
      )}
      <Formik
        initialValues={{
          agentCode: "",
          address: "",
          provinces: 0,
          counties: 0,
          insurance_branch: 0,
          phone: "",
          agancyType: AgencyType.Legal,
          agancyName: "",
        }}
        validationSchema={Yup.object({
          agentCode: Yup.string().required(),
          provinces: Yup.string().required(),
          address: Yup.string().required(),
          // counties: Yup.string().required(),
          // insurance_branch: Yup.string().required(),
          phone: Yup.string().required(),
        })}
        onSubmit={(values) => {
          console.log(values);
          const params: VerificationSignUpInput = {
            address: values.address,
            agency_type: values.agancyType,
            agent_code: values.agentCode,
            city_code: 0,
            county: 0,
            first_name: userData.firstName,
            insurance_branch: 0,
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
            // disable={true}
          />

          <MyDropDown
            name="counties"
            options={countiyOption}
            label={"شهر"}
            placeholder="شهر را انتخاب کنید"
            disable={countiyOption.length === 0}
          />

          <MyDropDown
            name="insurance_branch"
            options={insuranceBranchOption}
            label={"شعبه بیمه"}
            placeholder="شعبه بیمه را انتخاب کنید"
            disable={insuranceBranchOption.length === 0}
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
