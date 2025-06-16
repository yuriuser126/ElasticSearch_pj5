// lib/api/auth.ts
import api from './base';

interface LoginCredentials {
  userId: string;
  userPw: string;
}

// Define interfaces for the mailConfirm endpoint response
export interface MailConfirmSuccessResponse {
  success: true;
  code: string;
}

export interface MailConfirmErrorResponse {
  success: false;
  message: string;
}

export type MailConfirmResponse = MailConfirmSuccessResponse | MailConfirmErrorResponse;

// 로그인 함수
export const login = async (credentials: LoginCredentials) => {
  const params = new URLSearchParams();
  params.append('userId', credentials.userId);
  params.append('userPw', credentials.userPw);

  const response = await api.post(
      'http://localhost:8485/user/login',
      params,
      {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
      }
  );
  return response.data;
};

// 로그아웃 함수
export const logout = async () => {
  try {
    await api.post('/user/logout');
    console.log("서버 로그아웃 요청 성공: HttpOnly 쿠키 만료 예정.");
  } catch (error) {
    console.error("서버 로그아웃 요청 실패:", error);
  }
};

export const getCurrentUser = async () => {
  const response = await api.get('/user/me');
  return response.data;
};

export const register = async (joinData: any) => {
  const params = new URLSearchParams(joinData).toString();
  const response = await api.post(
    '/joinProc',
    params,
    { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
  );
  return response.data;
};

/**
 * 이메일 인증 코드를 요청하는 함수.
 * @param email 인증을 요청할 이메일 주소
 * @returns Promise<MailConfirmResponse> 서버 응답 (성공 또는 실패 메시지/코드)
 */
export const sendVerificationEmail = async (email: string): Promise<MailConfirmResponse> => {
  const response = await api.get<MailConfirmResponse>('/mailConfirm', {
    params: {
      email: email,
    },
  });
  return response.data;
};