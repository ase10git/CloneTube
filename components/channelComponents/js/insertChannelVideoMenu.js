// ----- channel 페이지에 Video 메뉴 추가 -----
import build_video_menu from "../../videoComponents/js/insertVideoMenu.js";

// 이미지 경로
const public_url = '../images/icon/';

// 비디오 메뉴 수정
function edit_menu() {
    let menu = build_video_menu(public_url);
    for (let i = 0; i < 3; i++) {
        menu.removeChild(menu.childNodes[7]);
    }

    return menu;
}

// 버튼에 메뉴 관련 이벤트 등록
function add_button_events(video_card, video_menu_div) {
    // 버튼 클릭 이벤트 등록
    video_card.forEach(card => {
        const button = card.querySelector(".menu-toggle-btn");
        button.addEventListener('click', (event) => {
            event.stopPropagation();
            const active_button = video_menu_div.dataset.activeButton;
            const button_video_id = button.dataset.videoId;
            if (video_menu_div.classList.contains("active")
                && active_button === button_video_id) 
            {
                video_menu_div.classList.remove("active");
                video_menu_div.dataset.activeButton = '';
            } else {
                show_menu(video_menu_div, event);
                
                video_menu_div.dataset.activeButton = button_video_id;
            }

            button.classList.remove("clicked");
            void button.offsetWidth;
            button.classList.add("clicked");
        });

        button.addEventListener('mousedown', (event) => {
            event.stopPropagation();
            button.classList.add("hold");
        });
        button.addEventListener('mouseup', (event) => {
            event.stopPropagation();
            button.classList.remove("hold");
        });
        button.addEventListener('mouseleave', (event) => {
            event.stopPropagation();
            button.classList.remove("hold");
        });
        button.addEventListener("animationend", () => {
            button.classList.remove("clicked");
        });
    });
}

// 메뉴 표시 함수
function show_menu(video_menu_div, event) {
    const toggle_btn = event.target;
    const button_rect = toggle_btn.getBoundingClientRect();
    const menu_width = video_menu_div.offsetWidth;
    const menu_height = video_menu_div.offsetHeight;

    let top = button_rect.bottom + window.scrollY;
    let left = button_rect.left;
    const viewport_width = window.innerWidth;
    const viewport_height = window.innerHeight;

    if (left + menu_width >= viewport_width) {
        left = (button_rect.left - menu_width);
    }
    
    if (top + menu_height >= viewport_height + window.scrollY) {
        top -= (menu_height + 50);
    }

    video_menu_div.style.position = 'absolute';
    video_menu_div.style.top = `${top}px`;
    video_menu_div.style.left = `${left}px`;
    video_menu_div.classList.add("active");
}

// main에 비디오 메뉴 추가
function insert_video_menu() {
    const main = document.querySelector("#channel-main");
    const video_menu_div = document.createElement("div");
    video_menu_div.classList.add("video-menu-list");
    video_menu_div.appendChild(edit_menu());
    main.appendChild(video_menu_div);
    const video_card = main.querySelectorAll('.video-card');
    add_button_events(video_card, video_menu_div);

    document.addEventListener('click', (e) => {
        const is_click_inside_menu = video_menu_div.contains(e.target);
        if (!is_click_inside_menu) {
            video_menu_div.classList.remove("active");
            video_menu_div.dataset.activeButton = '';    
        }
    });
}

export default insert_video_menu;