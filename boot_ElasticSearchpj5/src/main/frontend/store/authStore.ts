// store/authStore.ts
import { create } from 'zustand';
import { getCurrentUser, logout } from '@/lib/api/auth'; // auth API 함수 임포트

interface AuthState {
  isLoggedIn: boolean;
  user: any | null; // 사용자 정보 (필요하다면)
  loading: boolean;
  checkAuthStatus: () => Promise<void>; // 로그인 상태 확인 함수
  loginSuccess: (userData: any) => void; // 로그인 성공 시 호출 함수
  logoutUser: () => Promise<void>; // 로그아웃 함수
}

const useAuthStore = create<AuthState>((set, get) => ({
  isLoggedIn: false,
  user: null,
  loading: true, // 초기 로딩 상태

  // 로그인 상태 확인 함수

  checkAuthStatus: async () => {
    set({ loading: true });
    try {
      const user = await getCurrentUser();
      // user가 null이 아니고, 빈 객체도 아니며, 로그인된 사용자임을 나타내는 특정 필드가 있는지 확인
      // 예: user.id가 존재하는지, user.username이 비어있지 않은지 등
      if (user && Object.keys(user).length > 0 && user.userId) { // <-- 이 조건을 더 엄격하게
        set({ isLoggedIn: true, user: user, loading: false });
      } else {
        // user가 없거나, 빈 객체이거나, 로그인된 사용자 정보가 아닐 때
        set({ isLoggedIn: false, user: null, loading: false });
      }
    } catch (error) {
      console.log("AuthStore: 인증 상태 확인 실패 (토큰 없음 또는 서버 오류)", error);
      // 에러 발생 시 무조건 로그아웃 상태로 처리
      set({ isLoggedIn: false, user: null, loading: false });
    }
  },


  // 로그인 성공 시 호출
  loginSuccess: (userData) => {
    set({ isLoggedIn: true, user: userData, loading: false });
  },

  // 로그아웃 함수
  logoutUser: async () => {
    try {
      await logout(); // 서버 로그아웃 API 호출
    } catch (error) {
      console.error("AuthStore: 로그아웃 API 호출 실패", error);
      // 실패하더라도 클라이언트 상태는 강제로 초기화
    } finally {
      set({ isLoggedIn: false, user: null, loading: false });
    }
  },
}));

export default useAuthStore;