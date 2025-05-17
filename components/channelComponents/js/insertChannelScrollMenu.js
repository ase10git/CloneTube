// 스크롤 메뉴 스크롤 효과 추가 함수 임포트
import { build_network_error } from "../../../js/errorHandling/buildErrorMessage.js";
import addScrollEvent from "../../scrollMenu/js/addScrollEvent.js";

// 메뉴 구성 정의
const channel_menu = [
    { id: 'home', name: 'HOME', name_ko: '홈' },
    { id: 'videos', name: 'VIDEOS', name_ko: '동영상' },
    { id: 'playlists', name: 'PLAYLISTS', name_ko: '재생목록' },
    { id: 'community', name: 'COMMUNITY', name_ko: '커뮤니티' },
    { id: 'channels', name: 'CHANNELS', name_ko: '채널' },
    { id: 'about', name: 'ABOUT', name_ko: '정보' },
];

// 템플릿을 파싱하기 위한 div 생성
const temp_div = document.createElement("div");

// HTML 템플릿 불러오기
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
        const menu_list = scroll_wrap.querySelector(".menu-list");
        const target = document.querySelector("#channel-nav");

        // 메뉴 항목 생성
        channel_menu.forEach(el => {
            const item = document.createElement("li");
            const item_btn = document.createElement("a");
            item_btn.href = "#" + el.id;
            item_btn.textContent = el.name_ko;
            item.appendChild(item_btn);
            menu_list.appendChild(item);
        });

        // 메뉴 클릭 이벤트 리스너 등록
        const item_btns = menu_list.querySelectorAll("li");

        item_btns.forEach(el => {
            el.addEventListener("click", (e) => {
                e.preventDefault();

                item_btns.forEach(item => item.classList.remove("select"));
                el.classList.add("select");
                const clickedMenuId = el.querySelector("a").getAttribute("href").substring(1);
                const urlParams = new URLSearchParams(window.location.search);
                const channelId = urlParams.get('channel_id');
                const newUrl = `channel.html?channel_id=${channelId}#${clickedMenuId}`;
                window.location.href = newUrl;
            });
        });

        // 검색 폼 생성 후 추가
        const search_form = build_search_form();
        const search_form_li = document.createElement("li");
        search_form_li.classList.add("form_li");
        search_form_li.appendChild(search_form);
        menu_list.appendChild(search_form_li);

        scroll_wrap.querySelector(".menu-list").appendChild(search_form_li);
        target.appendChild(scroll_wrap);

        addScrollEvent(scroll_wrap);

        handleSelectedMenu();
        window.addEventListener("load", handleSelectedMenu);
        window.addEventListener("hashchange", handleSelectedMenu);
    });

/**
 * 현재 해시에 따라 li 표시 변경
 */
function handleSelectedMenu() {
    const hash = location.hash.split("#")[1];
    const item_btns = Array.from(document.querySelector("#channel-nav").querySelectorAll("li"));
    item_btns.pop();
    const menu_item = channel_menu.filter(el=> el.id === hash)[0];
    
    if (!menu_item) return;

    item_btns.forEach(el=>{
        if (menu_item.name_ko === el.textContent) {
            item_btns.forEach(item => item.classList.remove("select"));
            el.classList.add("select");
        }
    })
}

/**
 * 검색 폼 생성 및 이벤트 바인딩
 */
function build_search_form() {
    const form_tag = `
    <div id="search-icon">
        <img src="../../../images/icon/search.svg" alt="검색돋보기이미지">
    </div>
    <div class="search-input-box">
        <input type="search" name="query" placeholder="SEARCH">
        <div class="search-underbar">
            <div class="unfocus-underbar"></div>
            <div class="focus-underbar"></div>
        </div>
    </div>
    `;

    const search_form = document.createElement("form");
    search_form.id = "channel-search";
    search_form.action = "#";
    search_form.method = "GET";
    search_form.innerHTML = form_tag;

    const search_icon = search_form.querySelector("#search-icon");
    const search_input_box = search_form.querySelector(".search-input-box");
    const search_input = search_input_box.querySelector("input");
    const search_underbar = search_form.querySelector(".search-underbar");
    const search_underbar_focus = search_underbar.querySelector(".focus-underbar");

    search_icon.addEventListener("click", function () {
        search_icon.classList.remove("clicked");
        void search_icon.offsetWidth;
        search_icon.classList.add("clicked");

        search_input_box.classList.add("active");
        search_underbar.classList.add("visible");

        search_underbar_focus.classList.remove("clicked");
        void search_underbar_focus.offsetWidth;
        search_underbar_focus.classList.add("clicked");

        search_input.focus();
    });

    // 외부 클릭 시 입력창 비활성화
    document.addEventListener("click", function (e) {
        const right_scroll_btn = document.querySelector(".nav-right-btn");
        const left_scroll_btn = document.querySelector(".nav-left-btn");

        if (!search_form.contains(e.target)) {
            if (right_scroll_btn.contains(e.target) || left_scroll_btn.contains(e.target)) return;
            search_input_box.classList.remove("active");
            search_input.classList.remove("active");
            search_underbar.classList.remove("visible");
        }
    });

    // 검색 제출 시 페이지 이동
    search_form.addEventListener("submit", function (e) {
        e.preventDefault();
        const query = search_input.value.trim();

        const urlParams = new URLSearchParams(window.location.search);
        const channelId = urlParams.get('channel_id');

        if (!channelId) build_network_error(404);
        window.location.href = `channel.html?channel_id=${channelId}&query=${encodeURIComponent(query)}`;
    });

    return search_form;
}
