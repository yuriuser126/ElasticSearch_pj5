"use client";

import {  ReactNode,useState, useEffect } from "react";
import SettingsQuickAccess from "./SettingsQuickAccess";

// Props 타입 정의: children을 포함해야 layout에서 감쌀 수 있음
type Props = {
  children: ReactNode;
};

// 사용자 설정(테마/언어)을 context 없이 전역에서 적용하는 컴포넌트
export default function SettingsWrapper({ children }: Props) {
    // 테마 및 언어 상태 관리 (초기값: 자동, 한국어)
  const [settings, setSettings] = useState({
    theme: "auto", // 'light' | 'dark' | 'auto'
    language: "ko", // 'ko' | 'en'
  });

  // 테마가 변경될 때마다 <html> 요소에 다크 클래스 추가/제거
  useEffect(() => {

    const root = document.documentElement; // <html> 요소 전체 적용을 위해

    // 다크 모드 클래스 토글
    if (settings.theme === "dark") {
    //   document.body.classList.add("dark");
      root.classList.add("dark");
    } else if (settings.theme === "light") {
    //   document.body.classList.remove("dark");
      root.classList.remove("dark");
    } else {
      // auto: 시스템 설정 다크모드 감지
       if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
        root.classList.add("dark");
      } else {
        root.classList.remove("dark");
      }
    }
  }, [settings.theme]);

  useEffect(() => {
    // 언어 변경 시 html lang 속성 직접 변경 (옵션)
    document.documentElement.lang = settings.language;
  }, [settings.language]);

   // children으로 감싸진 레이아웃 + 설정 빠른 접근 UI 렌더링
  return (
    <>
      {children}
      <SettingsQuickAccess settings={settings} setSettings={setSettings} />
    </>
  );

//   return <SettingsQuickAccess settings={settings} setSettings={setSettings} />;
}
