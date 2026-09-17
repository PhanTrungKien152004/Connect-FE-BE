import type {
  LoginRequest,
  LoginResponse,
  LogoutResponse,
  ProfileResponse,
  RegisterRequest,
  RegisterResponse,
  SendOtpRequest,
  SendOtpResponse,
  VerifyOtpRequest,
  VerifyOtpResponse,
} from "../../types";
import apiClient from "../axios";

export async function login(payload: LoginRequest): Promise<LoginResponse> {
  const response = await apiClient.post<LoginResponse>("/auth/login", payload);
  return response.data;
}

export async function getProfile(): Promise<ProfileResponse> {
  const response = await apiClient.get<ProfileResponse>("/auth/profile");
  return response.data;
}

export async function logout(): Promise<LogoutResponse> {
  const response = await apiClient.post<LogoutResponse>('/auth/logout')
  return response.data
}

export async function sendRegistrationOtp(
  payload: SendOtpRequest,
): Promise<SendOtpResponse> {
  const response = await apiClient.post<SendOtpResponse>(
    "/auth/register/send-otp",
    payload,
  );
  return response.data;
}

export async function verifyRegistrationOtp(
  payload: VerifyOtpRequest,
): Promise<VerifyOtpResponse> {
  const response = await apiClient.post<VerifyOtpResponse>(
    "/auth/register/verify-otp",
    payload,
  );
  return response.data;
}

export async function register(
  payload: RegisterRequest,
): Promise<RegisterResponse> {
  const response = await apiClient.post<RegisterResponse>(
    "/auth/register",
    payload,
  );
  return response.data;
}
