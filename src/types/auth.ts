export interface User {
  id: number
  username: string
  fullName: string
  role: string
  isActive?: boolean
}

export interface ProfileResponse {
  success: boolean
  message: string
  data: User & { isActive: boolean }
}

export interface LoginRequest {
  username: string
  password: string
}

export interface LoginData {
  accessToken: string
  user: User
}

export interface LoginResponse {
  success: boolean
  message: string
  data: LoginData
}

export interface RefreshTokenResponse {
  success: boolean
  message: string
  data: {
    accessToken: string
  }
}

export interface LogoutResponse {
  success: boolean
  message: string
  data: null
}

export interface ApiErrorResponse {
  success?: boolean
  message?: string
}

export interface SendOtpRequest {
  email: string
}

export interface SendOtpResponse {
  success: boolean
  message: string
  data: { expiresInSeconds: number }
}

export interface VerifyOtpRequest {
  email: string
  otp: string
}

export interface VerifyOtpResponse {
  success: boolean
  message: string
  data: { email: string; verified: boolean }
}

export interface RegisterRequest {
  username: string
  email: string
  password: string
  fullName: string
}

export interface RegisteredUser extends User {
  email: string
  isActive: boolean
}

export interface RegisterResponse {
  success: boolean
  message: string
  data: RegisteredUser
}
