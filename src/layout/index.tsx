import React, { useCallback, useMemo, useRef, useState } from "react";
import LogoIcon from "../images/logo.svg";
import "./style.css";
import PhoneEntry from "../pages/PhoneEntry";
import CodeValidate from "../pages/CodeValidate";
import UserPersonalData from "../pages/UserPersonalData";
import UserPersonalDetailsData from "../pages/UserPersonalDetailsData";
import UserStatus from "../pages/UserStatus";

enum UserValidateStep {
  PhoneNumber,
  SentCode,
  PersonalData,
  PersonalDetailsData,
  UserStatus,
}

const MyLayout = () => {
  const [validationStep, setValidationStep] = useState<UserValidateStep>(
    UserValidateStep.PhoneNumber
  );

  const validatePhoneSuccess = useCallback((step: UserValidateStep) => {
    setValidationStep(step);
  }, []);

  return (
    <div className="layout-container">
      <div className="layout-header">
        <img src={LogoIcon} />
      </div>

      {validationStep === UserValidateStep.PhoneNumber && (
        <PhoneEntry
          onSuccess={() => validatePhoneSuccess(UserValidateStep.SentCode)}
        />
      )}
      {validationStep === UserValidateStep.SentCode && (
        <CodeValidate
          onSuccess={() => validatePhoneSuccess(UserValidateStep.PersonalData)}
        />
      )}
      {validationStep === UserValidateStep.PersonalData && (
        <UserPersonalData
          onSuccess={() =>
            validatePhoneSuccess(UserValidateStep.PersonalDetailsData)
          }
        />
      )}

      {validationStep === UserValidateStep.PersonalDetailsData && (
        <UserPersonalDetailsData
          onSuccess={() => validatePhoneSuccess(UserValidateStep.UserStatus)}
        />
      )}
      {validationStep === UserValidateStep.UserStatus && <UserStatus />}
    </div>
  );
};

export default MyLayout;
