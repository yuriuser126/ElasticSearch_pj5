# 프로그램 기술서: 기술 키워드 기반 통합 검색 플랫폼

## 1. 개요

본 문서는 **'기술 키워드 기반 통합 검색 플랫폼'** 프로젝트의 기술적인 사양과 구조, 기능을 설명합니다.

이 시스템은 여러 외부 데이터 소스(Stack Overflow, Reddit, Hacker News 등)에서 프로그래밍 관련 데이터를 수집 및 가공하여 **Elasticsearch**에 인덱싱합니다. 사용자는 **Next.js 기반의 웹 프론트엔드**를 통해 통합 검색 서비스를 이용할 수 있으며, 검색 로그 분석을 통한 트렌드 확인, 소셜 로그인, 즐겨찾기 등의 부가 기능을 제공합니다.

---

## 2. 시스템 아키텍처

본 시스템은 프론트엔드, 백엔드, 데이터 저장소, 외부 연동 서비스로 구성된 MSA(마이크로서비스 아키텍처) 형태입니다.

- **프론트엔드 (Client)**

  - Next.js + React 기반 UI
  - 사용자 인증/검색/즐겨찾기 기능 제공
  - API 서버와 통신

- **백엔드 (Spring Boot API 서버)**

  - API 게이트웨이 역할 수행
  - 외부 API 데이터 수집 → MongoDB → Elasticsearch
  - 사용자 인증/인가(JWT), 검색 API 제공

- **데이터 저장소**

  - **Elasticsearch**: 통합 검색 인덱싱/검색/분석
  - **Oracle DB**: 사용자 및 즐겨찾기 데이터 저장
  - **MongoDB**: 외부 수집 비정형 데이터 임시 저장

- **외부 서비스 및 마이크로서비스**

  - Stack Overflow / Reddit / Hacker News API 호출
  - Flask 기반 마이크로서비스
    - Google Trends 키워드 트렌드
    - 한글 맞춤법 검사

---

## 3. 사용 기술 스택

| 구분                | 기술                             | 설명                    |
| ----------------- | ------------------------------ | --------------------- |
| **Backend**       | Spring Boot 3.5.0, Java 17     | API 서버 개발             |
|                   | Spring Security, JWT           | 인증/인가 관리              |
|                   | MyBatis                        | Oracle 연동 ORM         |
|                   | Spring Data (Mongo, Elastic)   | NoSQL 연동              |
|                   | Swagger(OpenAPI 3.0)           | API 문서 자동 생성          |
| **Frontend**      | Next.js, React, TypeScript     | 웹 클라이언트               |
|                   | Zustand                        | 전역 상태 관리              |
|                   | Tailwind CSS, Shadcn/UI        | 스타일링                  |
|                   | Recharts                       | 데이터 시각화               |
| **Database**      | Oracle, MongoDB, Elasticsearch | 관계형/비정형/검색 엔진         |
| **Microservices** | Flask(Python)                  | Google Trends, 맞춤법 검사 |
| **DevOps**        | Git, Gradle, Postman           | 협업 및 빌드/테스트 도구        |

---

## 4. 주요 기능 명세

| 기능        | 설명                             | 주요 관련 파일                                                        |
| --------- | ------------------------------ | --------------------------------------------------------------- |
| 사용자 관리    | 로컬/소셜 로그인, JWT 인증, 비밀번호 변경     | `UserController.java`, `SecurityConfig.java`, `login.tsx`       |
| 데이터 수집    | Reddit/Stack Overflow 등 데이터 수집 | `RedditService.java`, `StackOverflowService.java`               |
| 통합 검색     | 키워드 기반 통합 검색, 페이징/필터링          | `ElasticController.java`, `search/page.tsx`                     |
| 검색 분석     | 검색 로그 저장 및 트렌드 분석              | `SearchAnalysisController.java`, `OverallHourlySearchChart.tsx` |
| 즐겨찾기      | 검색 결과 즐겨찾기 추가/삭제               | `FavoriteController.java`, `FavoriteService.java`               |
| API 명세 변환 | OpenAPI → CSV/Markdown/HTML 변환 | `OpenApiController.java`, `openapi-converter.html`              |

---

## 5. API 명세

- Swagger UI URL: `http://localhost:8485/swagger-ui.html`
- OpenAPI JSON Spec: `http://localhost:8485/v3/api-docs`

---

## 6. 데이터베이스 구조

| 구분            | 테이블/컬렉션                      | 주요 필드                                    | 관련 파일                        |
| ------------- | ---------------------------- | ---------------------------------------- | ---------------------------- |
| Oracle        | `USER_INFO`                  | `USERID`, `USEREMAIL`, `USERPW` 등        | `userMapper.xml`             |
|               | `FAVORITES`                  | `USER_ID`, `DOCUMENT_ID`, `TITLE`, `URL` | `FavoriteDAO.java`           |
| MongoDB       | `stackoverflowquestions`     | `title`, `tags`, `score`                 | `StackOverflowQuestion.java` |
|               | `reddit_items`, `hackernews` | `title`, `url`, `score` 등                | `RedditItem.java`            |
| Elasticsearch | `search_logs`                | `keyword`, `searchTime`, `userId`        | `SearchLog.java`             |

---

## 7. 프로젝트 디렉터리 구조

```
.
├── src
│   ├── main
│   │   ├── java/com/boot/
│   │   │   ├── Elastic/              # Elasticsearch 관련 기능
│   │   │   ├── Reddit/               # Reddit 수집기
│   │   │   ├── user/                 # 사용자 인증/관리
│   │   │   ├── analysis/             # 검색 트렌드 분석
│   │   │   └── z_config/             # Security, CORS 설정
│   │   ├── frontend/
│   │   │   ├── app/                  # Next.js App Router 구조
│   │   │   ├── components/           # 공통 UI 컴포넌트
│   │   │   ├── hooks/                # Custom React Hooks
│   │   │   └── lib/                  # API utils, 클라이언트
│   │   ├── python/
│   │   │   ├── trends_api.py         # Google Trends API
│   │   │   └── hanspell_server.py    # 맞춤법 검사 API
│   │   └── resources/
│   │       ├── mybatis/mappers/      # SQL XML 파일
│   │       └── application.properties
├── test/                             # 테스트 코드
└── build.gradle                      # Gradle 빌드 설정
```

---

> **📝 참고:** 본 기술 문서는 `docs/tech-doc.md`로 저장되며, 루트 디렉터리의 `README.md`에서 링크를 통해 접근 가능합니다.
>
> ```md
> 📄 [기술 문서 보러가기](./docs/tech-doc.md)
> ```

