import React from "react";
import "./style.css";
import { AxiosError } from "axios";
import { useQuery } from "@tanstack/react-query";
import { MyError } from "../../types";
import api from "../../api";
import MyButton from "../../components/Button";
import PendingIcon from "../../images/pending.svg";

const fetchUserStatus = async () => {
  const response = await api.get("/api/v2/app/DEY/agent/app_user_status/");
  return response.data;
};

const UserStatus = () => {
  const fetchProvinceQuery = useQuery<any[], AxiosError<MyError>>({
    queryKey: ["userStatus"],
    queryFn: fetchUserStatus,
    enabled: true,
  });

  return (
    <div className="user-status-container">
      <div className="user-status-detail">
        <img src={PendingIcon} />
        <span>
          نماینده محترم؛
          <br />
          درخواست ثبت نام شما در حال بررسی است، در صورت تأیید اطلاعات، اپلیکیشن
          مورد نظر فعال خواهد شد.
        </span>
        <MyButton
          text="ورود با حساب کاربری دیگر"
        />
      </div>
    </div>
  );
};

export default UserStatus;
