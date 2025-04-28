// ------ 스크롤형식의 메뉴 생성 및 추가 -------
import addScrollEvent from "../../scrollMenu/js/addScrollEvent.js";

const home_menu = [
    {id: 'all', name: 'All', name_ko: '전체'},
    {id: 'music', name: 'Music', name_ko: '음악'},
    {id: 'news', name: 'News', name_ko: '뉴스'},
    {id: 'workout', name:'Workout', name_ko: '운동'},
    {id: 'painting', name: 'Painting', name_ko: '페인팅',},
    {id: 'mix', name: 'Mix', name_ko: '믹스', },
    {id: 'game', name: 'Game', name_ko: '게임', },
    {id: 'cooking', name: 'Cooking', name_ko: '요리', },
    {id: 'travel', name: 'Travel', name_ko: '여행', },
    {id: 'live', name: 'Live', name_ko: '라이브', },
    {id: 'recently-uploaded', name: 'Recently uploaded', name_ko: '최근에 업로드된 동영상', },
    {id: 'watched', name: 'Watched', name_ko: '감상한 동영상', },
    {id: 'new-to-you', name: 'New to you', name_ko: '새로운 맞춤 동영상', },
]

// 템플릿 결과를 담을 태그
const temp_div = document.createElement("div");

// 템플릿으로 스크롤 메뉴 가져오기
fetch("../../components/scrollMenu/html/scrollMenuTemplate.html")
    .then(res => {
        if (!res.ok) {
            throw new Error("HTML template 불러오기 실패");
        }
        return res.text();
    })
    .then(data => {
        temp_div.innerHTML = data;

        // 템플릿
        const template = temp_div.querySelector("#scroll-menu").content;

        // 스크롤 메뉴 전체 박스
        const scroll_wrap = template.querySelector(".scroll-menu-wrap");

        // index.html에서 비디오 목록을 넣을 위치
        const target = document.querySelector("#btn-header");

        // 템플릿에서 목록 아이템을 넣을 위치
        const menu_list = scroll_wrap.querySelector(".menu-list");

        home_menu.forEach(el => {
            // 리스트 아이템
            const item = document.createElement("li");
            // 버튼 태그
            const item_btn =  document.createElement("button");
            item_btn.textContent = el.name_ko;
            item.classList.add("menu-item-btn");
            item.appendChild(item_btn);               

            menu_list.appendChild(item);
        });
        target.appendChild(scroll_wrap);

        // 스크롤 이벤트 추가
        addScrollEvent();
    })
