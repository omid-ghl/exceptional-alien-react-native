export interface ChangePasswordRequest {
  password: string;
  current_password: string;
  password_confirmation: string;
}
