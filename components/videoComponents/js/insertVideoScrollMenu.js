// ------ 스크롤형식의 메뉴 생성 및 추가 -------
import addScrollEvent from "../../scrollMenu/js/addScrollEvent.js";

const video_menu = [
    {id: 'all', name: 'All', name_ko: '모두'},
    {id: 'channel', name: 'Channel', name_ko: '채널 제공'},
    {id: 'related', name: 'Related', name_ko: '관련 콘텐츠'},
    {id: 'recommend', name: 'Recommend', name_ko: '추천'},
    {id: 'recently-uploaded', name: 'Recently uploaded', name_ko: '최근에 업로드된 동영상', },
    {id: 'watched', name: 'Watched', name_ko: '감상한 동영상', },
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

        const template = temp_div.querySelector("#scroll-menu").content;
        const scroll_wrap = template.querySelector(".scroll-menu-wrap");
        const target = document.querySelectorAll(".related-container");
        const menu_list = scroll_wrap.querySelector(".menu-list");

        video_menu.forEach(el => {
            const item = document.createElement("li");
            const item_btn =  document.createElement("button");
            item_btn.textContent = el.name_ko;
            item.classList.add("menu-item-btn");
            item.appendChild(item_btn);
            menu_list.appendChild(item);
        });

        target.forEach(el=>{
            const menu_node = scroll_wrap.cloneNode(true);
            addScrollEvent(menu_node);
            el.prepend(menu_node);
        });
    })
