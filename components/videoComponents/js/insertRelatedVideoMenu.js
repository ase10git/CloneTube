// ----- 비디오 페이지에 Video 메뉴 추가 -----
import build_video_menu from "./insertVideoMenu.js";

const public_url = '../images/icon/';

// 비디오 메뉴 수정
function edit_menu() {
    let menu = build_video_menu(public_url);
    const service_bar = document.createElement("li");
    service_bar.classList.add("service-bar");
    menu.insertBefore(service_bar, menu.childNodes[7]);
    return menu;
}

// 버튼에 메뉴 관련 이벤트 등록
function add_button_events(video_card, video_menu_div) {
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

    let top = button_rect.bottom + window.scrollY - 56;
    let left = button_rect.left;
    const viewport_width = window.innerWidth;
    const viewport_height = window.innerHeight;

    if (left + menu_width >= viewport_width) {
        left = (button_rect.left - menu_width);
    }
    if (top + menu_height >= viewport_height + window.scrollY) {
        top -= (menu_height + 30);
    }

    video_menu_div.style.position = 'absolute';
    video_menu_div.style.top = `${top}px`;
    video_menu_div.style.left = `${left}px`;
    video_menu_div.classList.add("active");
}

// main에 비디오 메뉴 추가
function insert_related_video_menu() {
    const main = document.querySelector("#video-main");
    const video_menu_div = document.createElement("div");
    video_menu_div.classList.add("related-video-menu-list");
    video_menu_div.appendChild(edit_menu());
    main.appendChild(video_menu_div);

    const video_card = document.querySelectorAll('.related-video-content');
    add_button_events(video_card, video_menu_div);

    document.addEventListener('click', (e) => {
        const is_click_inside_menu = video_menu_div.contains(e.target);
        if (!is_click_inside_menu) {
            video_menu_div.classList.remove("active");
            video_menu_div.dataset.activeButton = '';
        }
    });
}

export default insert_related_video_menu;