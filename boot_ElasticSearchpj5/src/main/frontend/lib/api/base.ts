// lib/api/base.ts
import axios from 'axios';
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';

// Axios 인스턴스 생성
const api = axios.create({
  baseURL: 'http://localhost:8485', // 백엔드 API의 기본 URL
  withCredentials: true, // 이 설정이 HttpOnly 쿠키를 포함하여 보내는 데 필수적입니다.
});

// 요청 인터셉터 (HttpOnly 쿠키이므로 Authorization 헤더 수동 추가 로직은 필요 없음)
api.interceptors.request.use(
  (config) => {
    // HttpOnly 쿠키는 브라우저가 자동으로 요청 헤더에 포함시키므로
    // 여기에서 수동으로 토큰을 가져와 Authorization 헤더에 추가하는 로직은 필요 없습니다.
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 응답 인터셉터 (주로 401 Unauthorized 에러 처리)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // 401 Unauthorized 에러 발생 시 로그인 페이지로 리디렉션
    if (error.response && error.response.status === 401) {
      console.error('Unauthorized: 사용자 인증이 필요합니다. 로그인 페이지로 리디렉션.');
      // Next.js 라우터 인스턴스가 필요하므로, 호출하는 컴포넌트에서 직접 리디렉션을 처리하는 것이 더 안전할 수 있습니다.
      // 또는 이곳에서 next/navigation의 useRouter를 사용하려면, 이 파일을 'use client'로 바꾸고 클라이언트 컴포넌트로 만들어야 하지만,
      // API 모듈은 서버에서도 사용될 수 있으므로 직접 라우터에 의존하지 않는 것이 일반적입니다.
      // 대신, 각 컴포넌트에서 에러를 catch하여 처리하는 것을 권장합니다.
      // window.location.href = '/user/login'; // 긴급 리디렉션 (Next.js 라우터가 아닌 브라우저 API 사용)
      return Promise.reject(new Error('Unauthorized')); // 에러를 발생시켜 컴포넌트의 catch 블록으로 전달
    }
    return Promise.reject(error);
  }
);

export default api;