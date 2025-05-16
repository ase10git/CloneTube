// ----- 비디오 페이지에 Video 메뉴 추가 -----
import build_video_menu from "./insertVideoMenu.js";

const public_url = '../images/icon/';

// 비디오 메뉴 수정
function edit_menu() {
    // 비디오 메뉴 가져오기
    let menu = build_video_menu(public_url);

    // 구분 바 요소 추가
    const service_bar = document.createElement("li");
    service_bar.classList.add("service-bar");

    // 신고 항목 위에 구분바 추가
    menu.insertBefore(service_bar, menu.childNodes[7]);

    return menu;
}

// 버튼에 메뉴 관련 이벤트 등록
function add_button_events(video_card, video_menu_div) {
    // 버튼 클릭 이벤트 등록
    video_card.forEach(card => {
        const button = card.querySelector(".menu-toggle-btn");
        
        button.addEventListener('click', (event) => {
            event.stopPropagation(); // 이벤트 버블링 방지
            // 활성화 상태의 버튼 체크용
            const active_button = video_menu_div.dataset.activeButton;
            const button_video_id = button.dataset.videoId;
            // 같은 버튼을 누르면 안보이게 설정
            if (video_menu_div.classList.contains("active")
                && active_button === button_video_id) 
            {
                video_menu_div.classList.remove("active");
                video_menu_div.dataset.activeButton = '';
            } else {
                show_menu(video_menu_div, event);
                
                video_menu_div.dataset.activeButton = button_video_id;
            }

            // 클릭 스타일 설정
            button.classList.remove("clicked");
            void button.offsetWidth;
            button.classList.add("clicked");
        });

        // 마우스 누르고 있을 때 동작
        button.addEventListener('mousedown', (event) => {
            event.stopPropagation(); // 이벤트 버블링 방지
            button.classList.add("hold");
        });

        // 마우스 뗐을 때 동작
        button.addEventListener('mouseup', (event) => {
            event.stopPropagation(); // 이벤트 버블링 방지
            button.classList.remove("hold");
        });

        // 마우스 떠날 때 동작
        button.addEventListener('mouseleave', (event) => {
            event.stopPropagation(); // 이벤트 버블링 방지
            button.classList.remove("hold");
        });

        // 애니메이션 종료 후 클래스 제거
        button.addEventListener("animationend", () => {
            button.classList.remove("clicked");
        });
    });
}

// 메뉴 표시 함수
function show_menu(video_menu_div, event) {
    // 비디오 카드 위치 정보 가져오기
    const toggle_btn = event.target;
    const button_rect = toggle_btn.getBoundingClientRect();

    // 메뉴바 크기
    const menu_width = video_menu_div.offsetWidth;
    const menu_height = video_menu_div.offsetHeight;

    // 기준 위치 (스크롤 포함 절대좌표)
    let top = button_rect.bottom + window.scrollY - 56;
    let left = button_rect.left;

    // 뷰포트 크기
    const viewport_width = window.innerWidth;
    const viewport_height = window.innerHeight;

    // 메뉴가 화면 오른쪽을 넘으면 왼쪽으로 보정
    if (left + menu_width >= viewport_width) {
        left = (button_rect.left - menu_width);
    }
    
    // 메뉴가 화면 하단을 넘으면 위쪽으로 띄움
    if (top + menu_height >= viewport_height + window.scrollY) {
        top -= (menu_height + 30);
    }

    video_menu_div.style.position = 'absolute';
    // 버튼 하단에 현재 스크롤 위치까지 고려한 좌표로 메뉴 리스트 위치 설정
    video_menu_div.style.top = `${top}px`;
    video_menu_div.style.left = `${left}px`;
    video_menu_div.classList.add("active");
}

// main에 비디오 메뉴 추가
function insert_related_video_menu() {
    // channel에서 비디오 목록을 넣을 위치
    const main = document.querySelector("#video-main");

    // 비디오 메뉴 생성 및 등록
    const video_menu_div = document.createElement("div");
    video_menu_div.classList.add("related-video-menu-list");
    video_menu_div.appendChild(edit_menu());

    // main 영역에 비디오 메뉴 추가
    main.appendChild(video_menu_div);

    // ----- 메뉴 토글 이벤트 등록
    // 메뉴 토글 버튼 가져오기
    const video_card = document.querySelectorAll('.related-video-content');

    // 버튼에 이벤트 등록
    add_button_events(video_card, video_menu_div);

    // 문서 클릭 시 메뉴 숨기기
    document.addEventListener('click', (e) => {
        const is_click_inside_menu = video_menu_div.contains(e.target);
        if (!is_click_inside_menu) {
            video_menu_div.classList.remove("active");
            video_menu_div.dataset.activeButton = '';
        }
    });
}

export default insert_related_video_menu;