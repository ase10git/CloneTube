// ----- Home 페이지에 Video 목록 추가 -----
import build_video_menu from "../../videoComponents/js/insertVideoMenu.js";

// 이미지 경로
const public_url = '../images/';

// 비디오 정보
const video = [
        {
          "channel_id": 1,
          "created_dt": "Sun, 20 Apr 2025 07:11:35 GMT",
          "dislikes": 3,
          "id": 1,
          "likes": 102,
          "tags": [
            "동물",
            "복제",
            "멸종",
            "과학"
          ],
          "thumbnail": "https://storage.googleapis.com/youtube-clone-video/thumb%20(1).jpg",
          "title": "#동물 #복제 #체세포복제  SCNT #동물 #멸종동물 #animal #복제 #야생동물",
          "views": 1529,
           avatar_img: '../images/james.svg'
        },
        {
          "channel_id": 1,
          "created_dt": "Tue, 23 Apr 2024 08:16:27 GMT",
          "dislikes": 291,
          "id": 2,
          "likes": 12494,
          "tags": [
            "동물",
            "상어",
            "멸종",
            "바다"
          ],
          "thumbnail": "https://storage.googleapis.com/youtube-clone-video/thumb%20(2).jpg",
          "title": "6개월 만에 상어를 바다에 넣었더니.. (5년간 잊지못할 순간들을 모아봤어요!)",
          "views": 1201500,
          avatar_img: '../images/alan.svg'
        },
        {
          "channel_id": 1,
          "created_dt": "Wed, 29 Jan 2025 17:17:45 GMT",
          "dislikes": 20,
          "id": 3,
          "likes": 2048,
          "tags": [
            "동물",
            "고양이",
            "새끼",
            "귀여운"
          ],
          "thumbnail": "https://storage.googleapis.com/youtube-clone-video/thumb%20(3).jpg",
          "title": "I'm 29 Days Old Abyssinian Baby",
          "views": 249880,
          avatar_img: '../images/marcus.svg'
        },
        {
          "channel_id": 1,
          "created_dt": "Sat, 03 Sep 2022 19:20:23 GMT",
          "dislikes": 41,
          "id": 4,
          "likes": 3189,
          "tags": [
            "동물",
            "복제",
            "과학",
            "윤리"
          ],
          "thumbnail": "https://storage.googleapis.com/youtube-clone-video/thumb%20(4).jpg",
          "title": "국내에서 의외로 불법이 아니라는 ‘이것’｜크랩",
          "views": 300209,
          avatar_img: '../images/alexis.svg'
        },
        {
          "channel_id": 1,
          "created_dt": "Thu, 02 Jan 2025 14:22:23 GMT",
          "dislikes": 42,
          "id": 5,
          "likes": 4028,
          "tags": [
            "동물",
            "토끼",
            "새끼",
            "귀여운"
          ],
          "thumbnail": "https://storage.googleapis.com/youtube-clone-video/thumb%20(5).jpg",
          "title": "귀엽다고 데려왔다간 감당을 못 합니다.",
          "views": 502938,
           avatar_img: '../images/jesica.svg'
        },
        {
          "channel_id": 1,
          "created_dt": "Sat, 14 Dec 2024 07:20:23 GMT",
          "dislikes": 38,
          "id": 6,
          "likes": 492,
          "tags": [
            "동물",
            "토끼",
            "먹방",
            "귀여운"
          ],
          "thumbnail": "https://storage.googleapis.com/youtube-clone-video/thumb%20(6).jpg",
          "title": "생각보다 볼만한 토끼의 먹방 3 (생과일 편)",
          "views": 10493,
           avatar_img: '../images/anna.svg'
        },
        {
          "channel_id": 1,
          "created_dt": "Thu, 01 Feb 2024 07:24:20 GMT",
          "dislikes": 29,
          "id": 8,
          "likes": 1029,
          "tags": [
            "동물",
            "고라니",
            "멸종",
            "위기"
          ],
          "thumbnail": "https://storage.googleapis.com/youtube-clone-video/thumb%20(8).jpg",
          "title": "유해조수이자 멸종위기인 특이한 포지션! 당신이 몰랐던 고라니에 대한 사실들 ｜크랩",
          "views": 50294,
           avatar_img: '../images/skylar.svg'
        },
        {
          "channel_id": 1,
          "created_dt": "Mon, 21 Apr 2025 01:29:20 GMT",
          "dislikes": 2,
          "id": 9,
          "likes": 42,
          "tags": [
            "동물",
            "토끼",
            "새끼",
            "귀여운"
          ],
          "thumbnail": "https://storage.googleapis.com/youtube-clone-video/thumb%20(9).jpg",
          "title": "Bunny flops 토끼 발라당",
          "views": 3829,
           avatar_img: '../images/james.svg'
        },
        {
          "channel_id": 1,
          "created_dt": "Fri, 21 Mar 2025 07:24:20 GMT",
          "dislikes": 41,
          "id": 10,
          "likes": 837,
          "tags": [
            "동물",
            "곰",
            "새끼",
            "귀여운"
          ],
          "thumbnail": "https://storage.googleapis.com/youtube-clone-video/thumb%20(10).jpg",
          "title": "Baby Bear Riding A Scooter",
          "views": 493829,
          avatar_img: '../images/alan.svg'
        },
        {
          "channel_id": 1,
          "created_dt": "Wed, 23 Apr 2025 07:24:20 GMT",
          "dislikes": 8,
          "id": 7,
          "likes": 802,
          "tags": [
            "동물",
            "토끼",
            "먹방",
            "귀여운"
          ],
          "thumbnail": "https://storage.googleapis.com/youtube-clone-video/thumb%20(7).jpg",
          "title": "오랜만에 돌아온 바나나 먹방!!",
          "views": 4928,
           avatar_img: '../images/marcus.svg'
        },
        {
          "channel_id": 1,
          "created_dt": "Thu, 17 Apr 2025 14:24:20 GMT",
          "dislikes": 29,
          "id": 11,
          "likes": 281,
          "tags": [
            "동물",
            "수의사",
            "윤리",
            "의사",
            "동물원"
          ],
          "thumbnail": "https://storage.googleapis.com/youtube-clone-video/thumb%20(11).jpg",
          "title": "동물원을 반대하는 수의사가 동물원에서 일하는 이유   스브스뉴스",
          "views": 190289,
          avatar_img: '../images/alexis.svg'
        },
        {
          "channel_id": 2,
          "created_dt": "Wed, 23 Apr 2025 04:07:24 GMT",
          "dislikes": 1,
          "id": 12,
          "likes": 1,
          "tags": [
            "혁신",
            "AI",
            "기술",
            "기업"
          ],
          "thumbnail": "https://storage.googleapis.com/youtube-clone-video/thumb%20(12).jpg",
          "title": "[기업] KT, MWC 2024에서 네트워크·AI 혁신 기술 공개   YTN",
          "views": 428,
           avatar_img: '../images/jesica.svg'
        },
        {
          "channel_id": 2,
          "created_dt": "Fri, 14 Feb 2025 21:29:03 GMT",
          "dislikes": 7,
          "id": 13,
          "likes": 28,
          "tags": [
            "AI",
            "의학",
            "혁신",
            "과학"
          ],
          "thumbnail": "https://storage.googleapis.com/youtube-clone-video/thumb%20(13).jpg",
          "title": "4년 전 폐암 AI는 알았다…속도·정확도 실시간 진단 수준 [MBN 뉴스7]",
          "views": 3982,
           avatar_img: '../images/anna.svg'
        },
        {
          "channel_id": 1,
          "created_dt": "Wed, 04 Jan 2023 07:29:03 GMT",
          "dislikes": 7,
          "id": 14,
          "likes": 42,
          "tags": [
            "동물",
            "복제",
            "멸종",
            "과학",
            "윤리"
          ],
          "thumbnail": "https://storage.googleapis.com/youtube-clone-video/thumb%20(14).jpg",
          "title": "쥬라기 월드 현실이 되나…멸종 동물, 틸라신 복원 진행중   14F",
          "views": 10284,
           avatar_img: '../images/skylar.svg'
        },
        {
          "channel_id": 2,
          "created_dt": "Fri, 23 Aug 2024 07:32:41 GMT",
          "dislikes": 0,
          "id": 16,
          "likes": 21,
          "tags": [
            "배민",
            "로봇",
            "배달",
            "AI"
          ],
          "thumbnail": "https://storage.googleapis.com/youtube-clone-video/thumb%20(16).jpg",
          "title": "[배민로봇딜리] 배민이 꿈꾸는 가까운 미래 배달로봇 라이프(Full ver.)",
          "views": 1049,
           avatar_img: '../images/james.svg'
        },
        {
          "channel_id": 2,
          "created_dt": "Mon, 23 Dec 2024 07:32:41 GMT",
          "dislikes": 2,
          "id": 17,
          "likes": 124,
          "tags": [
            "AI",
            "로봇",
            "동물",
            "강아지"
          ],
          "thumbnail": "https://storage.googleapis.com/youtube-clone-video/thumb%20(17).jpg",
          "title": "아파트에서 호-닥 호-닥 뛰어다니는 로봇 강아지의 정체   스브스뉴스",
          "views": 120948,
           avatar_img: '../images/alan.svg'
        },
        {
          "channel_id": 2,
          "created_dt": "Mon, 23 Dec 2024 07:32:41 GMT",
          "dislikes": 0,
          "id": 20,
          "likes": 2,
          "tags": [
            "AI",
            "기술",
            "음향",
            "혁신"
          ],
          "thumbnail": "https://storage.googleapis.com/youtube-clone-video/thumb%20(20).jpg",
          "title": "[핫클립] 최첨단 'AI 기술' 탑재, 음향을 시각화한다!   YTN 사이언스",
          "views": 482,
           avatar_img: '../images/marcus.svg'
        },
        {
          "channel_id": 2,
          "created_dt": "Tue, 23 Jan 2024 07:34:03 GMT",
          "dislikes": 0,
          "id": 21,
          "likes": 4,
          "tags": [
            "AI",
            "혁신",
            "콩",
            "기술"
          ],
          "thumbnail": "https://storage.googleapis.com/youtube-clone-video/thumb%20(21).jpg",
          "title": "AI 기반 콩 품종 구분 기술 개발...정확도 96% 수준   YTN",
          "views": 1049,
           avatar_img: '../images/alexis.svg'
        },
        {
          "channel_id": 2,
          "created_dt": "Wed, 23 Apr 2025 07:32:41 GMT",
          "dislikes": 0,
          "id": 15,
          "likes": 0,
          "tags": [
            "운전",
            "자율주행",
            "로봇",
            "기업"
          ],
          "thumbnail": "https://storage.googleapis.com/youtube-clone-video/thumb%20(15).jpg",
          "title": "테슬라, 운전대 없는 완전 자율주행 로보택시 공개... 2026년 양산    YTN",
          "views": 289,
           avatar_img: '../images/jesica.svg'
        },
        {
          "channel_id": 2,
          "created_dt": "Wed, 23 Apr 2025 07:32:41 GMT",
          "dislikes": 23,
          "id": 18,
          "likes": 481,
          "tags": [
            "배민",
            "배달",
            "알고리즘",
            "AI"
          ],
          "thumbnail": "https://storage.googleapis.com/youtube-clone-video/thumb%20(18).jpg",
          "title": "[단독]  배달의민족, 배달 취소 피해 업주에 전가 …알고리즘 변경 논란 [MBN 뉴스7]",
          "views": 29489,
          avatar_img: '../images/anna.svg'
        },
        {
          "channel_id": 2,
          "created_dt": "Wed, 23 Apr 2025 07:32:41 GMT",
          "dislikes": 1,
          "id": 19,
          "likes": 15,
          "tags": [
            "배민",
            "로봇",
            "배달",
            "자율주행",
            "기업"
          ],
          "thumbnail": "https://storage.googleapis.com/youtube-clone-video/thumb%20(19).jpg",
          "title": "음식을 주문했는데 로봇이 왔다, 배달의민족 자율주행 배달로봇 딜리",
          "views": 9482,
          avatar_img: '../images/skylar.svg'
        },
        {
          "channel_id": 3,
          "created_dt": "Wed, 23 Apr 2025 07:36:47 GMT",
          "dislikes": 4,
          "id": 22,
          "likes": 49,
          "tags": [
            "의료",
            "혁신",
            "의학",
            "기술"
          ],
          "thumbnail": "https://storage.googleapis.com/youtube-clone-video/thumb%20(22).jpg",
          "title": "서울대 지역의료혁신센터  디지털 기술로 격차 좁혀야  [굿모닝 MBN]",
          "views": 4028,
           avatar_img: '../images/james.svg'
        },
        {
          "channel_id": 3,
          "created_dt": "Wed, 23 Apr 2025 07:36:47 GMT",
          "dislikes": 53,
          "id": 23,
          "likes": 592,
          "tags": [
            "의학",
            "병원",
            "의사"
          ],
          "thumbnail": "https://storage.googleapis.com/youtube-clone-video/thumb%20(23).jpg",
          "title": "전국에 기능의학병원 찾는 법을 알려드립니다.",
          "views": 20489
        },
        {
          "channel_id": 3,
          "created_dt": "Wed, 23 Apr 2025 07:38:33 GMT",
          "dislikes": 14,
          "id": 25,
          "likes": 281,
          "tags": [
            "의학",
            "의사",
            "뉴스",
            "수의사"
          ],
          "thumbnail": "https://storage.googleapis.com/youtube-clone-video/thumb%20(25).jpg",
          "title": "동물행동의학 세계적 권위자 김선아 교수",
          "views": 102849
        },
        {
          "channel_id": 3,
          "created_dt": "Fri, 07 Feb 2025 07:36:47 GMT",
          "dislikes": 18,
          "id": 24,
          "likes": 294,
          "tags": [
            "의학",
            "의사",
            "교육",
            "뉴스"
          ],
          "thumbnail": "https://storage.googleapis.com/youtube-clone-video/thumb%20(24).jpg",
          "title": "이주호  학생들 참여하는 '의학교육위원회' 만들 것    YTN",
          "views": 39208
        },
        {
          "channel_id": 3,
          "created_dt": "Mon, 21 Apr 2025 07:38:33 GMT",
          "dislikes": 21,
          "id": 26,
          "likes": 2049,
          "tags": [
            "의사",
            "저속노화",
            "방송",
            "의학"
          ],
          "thumbnail": "https://storage.googleapis.com/youtube-clone-video/thumb%20(26).jpg",
          "title": "'내 나이에 맞는 저속노화 방법은    저속노화   생애주기   유산소운동   #EBS건강",
          "views": 502939
        },
        {
          "channel_id": 3,
          "created_dt": "Sun, 20 Apr 2025 07:38:33 GMT",
          "dislikes": 12,
          "id": 27,
          "likes": 102,
          "tags": [
            "의사",
            "의학",
            "상식",
            "정보"
          ],
          "thumbnail": "https://storage.googleapis.com/youtube-clone-video/thumb%20(27).jpg",
          "title": "[닥터 프렌즈] 의사 친구들에게 쉽게 듣는 의학 상식 컨텐츠",
          "views": 2590
        },
        {
          "channel_id": 3,
          "created_dt": "Fri, 11 Apr 2025 07:44:40 GMT",
          "dislikes": 52,
          "id": 28,
          "likes": 2809,
          "tags": [
            "의학",
            "과학",
            "동물",
            "윤리"
          ],
          "thumbnail": "https://storage.googleapis.com/youtube-clone-video/thumb%20(28).jpg",
          "title": "[차클마스터클라스] '아낌없이 주는 동물' 우리가 기억해야 할 의학 발전 뒤의 실험동물🐶｜장구 교수｜JTBC 201123 방송",
          "views": 392849
        },
        {
          "channel_id": 1,
          "created_dt": "Tue, 01 Apr 2025 07:44:40 GMT",
          "dislikes": 12,
          "id": 29,
          "likes": 298,
          "tags": [
            "동물",
            "복제",
            "윤리",
            "멸종"
          ],
          "thumbnail": "https://storage.googleapis.com/youtube-clone-video/thumb%20(29).jpg",
          "title": "동물을 복제한다는 것, 반려견 복제에 대한 생각   최재천의 아마존   펫로스 복제견 티코",
          "views": 159389
        }
      ]
const video_info = video;

const temp_div = document.createElement("div");

// 템플릿 코드를 사용하여 비디오 컨텐츠 생성
fetch("/homeComponents/html/videoContent.html")
    .then(res => {
        if (!res.ok) {
            throw new Error("HTML template 불러오기 실패");
        }
        return res.text();
    })
    .then(data => {
        temp_div.innerHTML = data;
    
        // 비디오용 템플릿
        const content_template = temp_div.querySelector("#content-template").content;
    
        // home에서 비디오 목록을 넣을 위치
        const contents = document.querySelector("#contents");
    
        // 비디오 메뉴 가져오기
        const menu = build_video_menu("../images/");

        video_info.forEach(el => {
            const clone = content_template.cloneNode(true);
            clone.querySelector(".thumbnail-img").src = el.thumbnail;
            clone.querySelector(".video-title").textContent = el.title;
            clone.querySelector(".channel-name").textContent = el.uploader;
            clone.querySelector(".spectator-number").textContent = `조회수 ${el.spectators}`;
            clone.querySelector(".upload-time").textContent = el.uploaded_time;
            clone.querySelector(".avatar-img").src = el.avatar_img;
            clone.querySelector(".menu-items").innerHTML = menu.outerHTML;
            clone.querySelector(".btn-icon").src = public_url + "three-dots-vertical.svg";
            clone.querySelector(".btn-icon").alt = "dot-three-icon";
    
            const link = clone.querySelector(".thumbnail-link");
            const titleLink = clone.querySelector(".video-title-link");
    
            contents.appendChild(clone);
    
            // link?.addEventListener("click", (e) => {
            //     e.preventDefault();
            //     alert(`썸네일 클릭: ${el.title}`);
            // });
    
            // titleLink?.addEventListener("click", (e) => {
            //     e.preventDefault();
            //     alert(`비디오 제목 클릭: ${el.title}`);
            // });
        });
    
    })