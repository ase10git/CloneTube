# CloneTube - YouTube 클론 프로젝트

- 🔗 배포 : 배포링크
- 📌 참고 사이트 : YouTube

## 🚀 프로젝트 소개
CloneTube는 YouTube의 주요 기능을 참고하여 개발된 클론 프로젝트입니다. 
프로젝트를 통해 HTML, CSS, Javascript 학습 내용을 응용하고, 웹 사이트의 동작과 사용자 경험을 고려한 프론트엔드 개발 경험을 쌓기 위해 진행했습니다.

## 📅 프로젝트 기간
2025년 4월 22일 ~ 2025년 5월 13일

## 👥 프로젝트 멤버
- [안시은](https://github.com/ase10git) (팀장)
- [김민형](https://github.com/KimTeaHyeong1) (팀원)
- [이수윤](https://github.com/suyunlee) (팀원)
- [임효진](https://github.com/hyonize) (팀원)

📝 [개발 담당 파트](https://github.com/ase10git/CloneTube/wiki/%EA%B0%9C%EB%B0%9C%EB%8B%B4%EB%8B%B9-%ED%8C%8C%ED%8A%B8)

## 🛠️ 사용 기술
- HTML 5
- CSS 3
- JavaScript

## 🖼️ 주요 기능
### 🔖 상단 바와 사이드바
- 상단바 : 검색 기능
- 사이드바 : 구독한 채널 페이지 이동
  - 현재는 임의의 채널 3개만 등록
- 홈 페이지 라우트

---
### 🖥 홈 페이지
- 상단 카테고리 필터 (전체, 음악, 게임, 뉴스 등)
- 카드 형식의 썸네일 영상 리스트
- 제목, 채널명, 조회수, 업로드 시간 등 동영상과 채널 정보
- 마우스 hover 시 썸네일 인터랙션 등 사용자 경험 제공
- 동영상 페이지와 채널 페이지 라우트

![clonetube_home](https://github.com/user-attachments/assets/7c0144e0-3ab3-4406-a266-78d25f0ac497)
![clonetube_home_filter](https://github.com/user-attachments/assets/9f0af1f8-49d0-4df6-9ea1-f5e7d6be7eed)

---
### 📺 채널 페이지
- 채널 배너, 프로필, 소개, 영상, 재생목록 탭 포함
- 구독 기능(표기만 변경)
- 대표 영상 자동 재생 및 설명 박스 구성
- 하단에 채널 동영상 재생목록(상위 태그 2개)
- 동영상 탭에서 확인 가능한 채널의 동영상 전체 목록
- 채널 동영상 검색 및 정렬
- 동영상 페이지 라우트

![clonetube_channel](https://github.com/user-attachments/assets/7e9b7da3-67ea-4c3d-80e2-a1507dccd2ad)
![clonetube_channel_videotab](https://github.com/user-attachments/assets/04cc96c9-d10d-4e07-8e6e-60f43c0a0289)
![clonetube_channel_search](https://github.com/user-attachments/assets/bb352606-9b5f-4ff7-9f1b-06fee5d08f7d)

---
### 🔍 검색 결과 페이지
- 사용자가 검색어를 입력한 뒤 결과 리스트 출력
- 태그별 검색 결과 필터링
- 필터 기능(업로드 날짜, 유형, 길이 등) 존재 → 드롭다운 메뉴로 구현
- 검색 결과 정렬 기능(좋아요, 업로드 날짜, 조회수)
- 썸네일 외 영상 설명 간략히 표시
- 동영상 페이지와 채널 페이지 라우트

![clonetube_search](https://github.com/user-attachments/assets/bf082b1c-3fd0-42e8-8c47-effe454e75dc)
![clonetube_search_filter](https://github.com/user-attachments/assets/2a593c9a-2d6b-4f9c-bf33-00387e32521e)

---
### 🎥 비디오 페이지
- 동영상 플레이어 UI 제공
- 동영상 플레이어 상단에 제목, 정보, 채널 이름 등 포함
- 구독 기능(표기만 변경)
- 좋아요, 싫어요, 공유, 저장 등의 상호작용 버튼 구현
- 댓글과 답글 작성 및 댓글 정렬 기능
- AI 유사도 검색을 적용한 추천 영상 리스트 배치
  - *서버 없이 클라이언트로만 구현했기에 AI API KEY가 외부에 노출되는 문제가 있어 AI 추천영상 기능은 배포 환경에서 제외했습니다.*

![clonetube_video](https://github.com/user-attachments/assets/44f484a3-11f7-4011-beaa-23bf2fc4522f)

## 팀 Wiki
[CloneTube Wiki](https://github.com/ase10git/CloneTube/wiki)
