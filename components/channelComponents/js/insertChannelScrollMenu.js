// ------ 스크롤형식의 메뉴 생성 및 추가 -------
import addScrollEvent from "../../scrollMenu/js/addScrollEvent.js";

const channel_menu = [
    {id: 'home', name: 'HOME',  name_ko: '홈', },
    {id: 'videos', name: 'VIDEOS', name_ko: '동영상'},
    {id: 'playlists', name: 'PLAYLISTS', name_ko: '재생목록'},
    {id: 'community', name: 'COMMUNITY', name_ko: '커뮤니티'},
    {id: 'channels', name: 'CHANNELS', name_ko: '채널'},
    {id: 'about', name: 'ABOUT', name_ko: '정보'},
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

        // video.html에서 메뉴 목록을 넣을 위치
        const target = document.querySelector("#channel-nav");

        // 템플릿에서 목록 아이템을 넣을 위치
        const menu_list = scroll_wrap.querySelector(".menu-list");

        channel_menu.forEach(el => {
            // 리스트 아이템
            const item = document.createElement("li");
            // 버튼 태그
            const item_btn =  document.createElement("a");
            item_btn.href = "#" + el.id;
            item_btn.textContent = el.name_ko;
            item.appendChild(item_btn);
            
            menu_list.appendChild(item);
        });

        // 스크롤 메뉴 아이템
        const item_btn = menu_list.querySelectorAll("li");

        // 이벤트 리스너 등록
        item_btn.forEach(el => {        
            el.addEventListener("click", () => {
                // 모든 클래스를 먼저 제거
                item_btn.forEach(item => {item.classList.remove("select")});
                // 클래스 추가
                el.classList.add("select");
            });});

        const search_form = build_search_form();

        // 스크롤 메뉴 바에 검색 폼 추가
        scroll_wrap.querySelector(".scroll-menu-box").appendChild(search_form);

        // 검색 폼을 ul에 등록
        const search_form_li = document.createElement("li");
        search_form_li.classList.add("form_li");
        search_form_li.appendChild(search_form);
        menu_list.appendChild(search_form_li);

        target.appendChild(scroll_wrap);

        // 스크롤 이벤트 추가
        addScrollEvent(scroll_wrap);
    })


// 검색 폼 생성 및 이벤트 리스너 추가
function build_search_form() {
    // 검색 폼
    const form_tag = 
    `
    <div id="search-icon">
        <img src="../images/search.svg" alt="검색돋보기이미지">
    </div>
    <div class="search-input-box">
        <input type="search" name="query" placeholder="SEARCH">
        <div class="search-underbar">
            <div class="unfocus-underbar"></div>
            <div class="focus-underbar"></div>
        </div>
    </div>
    `;

    // 검색 폼 생성
    const search_form = document.createElement("form");
    search_form.id = "channel-search";
    search_form.action = "#";
    search_form.method = "GET";
    search_form.innerHTML = form_tag;

    // 검색 폼 하위 요소 지정
    const search_icon = search_form.querySelector("#search-icon");
    const search_input_box = search_form.querySelector(".search-input-box");
    const search_input = search_input_box.querySelector("input");
    const search_underbar = search_form.querySelector(".search-underbar");
    const search_underbar_focus = search_underbar.querySelector(".focus-underbar");

    // 검색 폼 클릭 시 스타일 지정
    search_icon.addEventListener("click", function () {
        // 검색 아이콘 애니메이션 설정
        search_icon.classList.remove("clicked");
        void search_icon.offsetWidth; // 리플로우 트리거
        search_icon.classList.add("clicked");

        // 검색창 박스 표시
        search_input_box.classList.add("active");
        search_underbar.classList.add("visible");

        // 검색창의 포커스 언더바 애니메이션 설정
        search_underbar_focus.classList.remove("clicked");
        void search_underbar_focus.offsetWidth; // 리플로우 트리거
        search_underbar_focus.classList.add("clicked");

        // 버튼 클릭 시 input으로 자동 포커스
        search_input.focus();
    });

    // 검색폼 외의 영역 클릭 시 검색 폼 숨기기
    document.addEventListener("click", function(e) {
        if (!search_form.contains(e.target)) {
            search_input_box.classList.remove("active");
            search_input.classList.remove("active");
            search_underbar.classList.remove("visible");
        }
    });
    return search_form;
}