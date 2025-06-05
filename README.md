<<<<<<< HEAD
# 작업 브랜치 - feature/chaeyoon-security

## 📌 작업 목표
- Spring Security 설정
- AWS EC2 배포 설정 (포트, 방화벽, DB 연동 포함)

## 📎 주의사항
- PR 대상은 `develop`입니다. `main`에 직접 PR 금지
- AWS Key, 보안 정보는 `.gitignore` 또는 환경변수 처리
- 배포 완료 시 IP 공유

## ✅ 체크리스트
- [ ] Security 설정 완료
- [ ] AWS EC2 연동
=======
<<<<<<< HEAD
# 📢 개발팀 공지사항 & 주의사항 (develop 브랜치 기준)

## 1. 브랜치 구조 안내
- **main** : 안정된 배포용 브랜치 (배포 전용, 직접 작업 금지)
- **develop** : 통합 개발 브랜치 (개인 작업 완료 후 PR로 병합)
- **개인 브랜치** (`feature/본인기능명`) : 각자 맡은 기능 작업용 브랜치

## 2. 개인 브랜치 명명 규칙
- `feature/chaeyoon-security` (ex. 채윤 - 보안 관련 기능)
- `feature/sonbg-swagger` (ex. 병관 - Swagger 문서 자동화)
- `feature/tjrdl-elastic` (ex. 재윤 - ElasticSearch 기능)
- `feature/yuriuser-elastic` (ex. 유리 - ElasticSearch 보조 및 React)

## 3. 주의사항
- 작업 완료 후 반드시 **develop** 브랜치 최신 상태로 리베이스 또는 머지 후 PR 생성  
  (충돌 방지 및 최신 코드 반영)
- **main** 브랜치는 배포 전용, 직접 커밋 및 PR 금지  
- 개인 브랜치 커밋 메시지는 명확하고 일관성 있게 작성 (ex. `[기능명] 상세 내용`)
- PR 생성 시 작업 내용 및 변경점 상세하게 작성  
- 팀 내 긴급 수정이나 이슈 발생 시 슬랙 공지 필수  

## 4. 기타
- 개발 환경 세팅 관련 문의는 [담당자명]에게 문의  
- 중요한 일정 및 회의는 슬랙 공지 참조  
- 추가로 필요한 공지사항은随時 업데이트 예정  
=======
# 🚧 작업 브랜치: feature/tjrdl-elastic

## 📌 작업 목적
- 간략하게 작업 목표 : ElasticSearch 구성

## 📎 주의사항
- 본 브랜치는 `develop` 브랜치를 기준으로 생성되었습니다.
- PR 대상은 항상 `develop`입니다. `main` 브랜치로 직접 작업 및 PR 금지는 필수입니다.
- 중요한 보안 정보(키, 패스워드 등)는 절대 커밋하지 마세요.
- 작업 진행 중에는 주기적으로 `develop` 최신 상태를 pull 하여 충돌을 최소화하세요.

## ✅ 진행 상황 체크리스트
- [ ] Test it in IntelliJ
- [ ] 구글 트렌드 데이터 Elasticsearch 적용 테스트 진행
>>>>>>> d0d9f12dc98b2ec1d7abc0177d41a5d3905c2dde
- [ ] 추가기능 있으시면 논의후 추가합시다.

## 🔄 PR 메시지 
- 일단 논의먼저 합시다.!

<<<<<<< HEAD

## Sourcetree에서 팀원 브랜치 가져오기
=======
- ## Sourcetree에서 팀원 브랜치 가져오기
>>>>>>> d0d9f12dc98b2ec1d7abc0177d41a5d3905c2dde

1. Sourcetree를 실행하고 저장소를 연다.
2. 상단 메뉴에서 **Fetch** 버튼을 클릭한다. 🔃  
   (원격 저장소의 브랜치 목록이 갱신된다)
3. 왼쪽 메뉴에서 **Remotes/origin/브랜치명**을 확인한다. 🔍
4. 가져올 브랜치에서 우클릭 후 **Checkout**을 선택한다. 🖱️  
   (로컬 브랜치가 생성되고 전환된다)
5. 로컬 브랜치에서 작업을 진행한다.

> ⚠️ 팀원이 작업한 브랜치를 원격에 **push**하지 않았다면 목록에 나타나지 않습니다.
<<<<<<< HEAD
=======

>>>>>>> eda567f83f5d3ae5707cc75a96f81ea8bf4a5e7f
>>>>>>> d0d9f12dc98b2ec1d7abc0177d41a5d3905c2dde
