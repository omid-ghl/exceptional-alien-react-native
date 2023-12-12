export interface SignupRequest {
  email: string;
  password: string;
  password_confirmation: string;
  terms_conditions_agree: '0' | '1';
  first_name: string;
  last_name: string;
  marketing_agree: '0' | '1';
}
