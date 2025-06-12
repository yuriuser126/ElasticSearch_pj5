/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },

  // 404 오류 해결을 위해 반드시 필요합니다
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        // 스프링부트 서버가 실행 중인 8485 포트로 설정하기 기본인 8485로 일단 설정해놨습니다.
        destination: "http://localhost:8485/api/:path*",
      },
    ];
  },
};

export default nextConfig;