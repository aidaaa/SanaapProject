export interface MyData {
  error_details: any;
  is_success: boolean;
  message: string;
  response: string;
  status_code: number;
}

export interface VerificationSighUp {
  response: { access: string };
}

export interface MyError {
  error_details: { fa_details: string };
}

export interface SelectOption {
  value: number;
  label: string;
}

export interface ProvinceData {
  id: number;
  name: string;
}
