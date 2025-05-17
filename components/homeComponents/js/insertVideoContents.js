// ----- Home 페이지에 Video 목록 추가 -----
import build_video_menu from "../../videoComponents/js/insertVideoMenu.js";
import timeCalculator from "../../../js/util/timeCalculator.js";
import formatViews from "./insertVideoFormatViews.js"
import {build_network_error} from "../../../js/errorHandling/buildErrorMessage.js";

const public_url = '../images/icon/';
const temp_div = document.createElement("div");

// 비디오 메뉴 수정
function edit_menu() {
    let menu = build_video_menu(public_url);
    const service_bar = document.createElement("li");
    service_bar.classList.add("service-bar");
    menu.insertBefore(service_bar, menu.childNodes[7]);
    return menu;
}

// 템플릿 코드를 사용하여 비디오 컨텐츠 생성
async function insert_video_content(video_info){
    return fetch("../../components/homeComponents/html/videoContent.html")
    .then(res => {
        if (!res.ok) build_network_error(res.status);
        return res.text();
    })
    .then(data => {
        temp_div.innerHTML = data;
        const content_template = temp_div.querySelector("#content-template").content;
        const contents = document.querySelector("#contents");
        const video_menu_div = document.createElement("div");
        video_menu_div.classList.add("menu-list");
        const menu = edit_menu();
        video_menu_div.appendChild(menu);

        video_info.forEach(el => {
            const clone = content_template.cloneNode(true);

            clone.querySelector(".content").dataset.videoId = el.id;
            clone.querySelector(".thumbnail-img").src = el.thumbnail;
            clone.querySelector(".video-title").textContent = el.title;
            clone.querySelector(".channel-name").textContent = el.channel_id;
            clone.querySelector(".spectator-number").textContent = `조회수 ${formatViews(el.views)}`;
            clone.querySelector(".upload-time").textContent = timeCalculator(el.created_dt);
            clone.querySelector(".channel-name").textContent = el.channel_name;
            clone.querySelector(".avatar-img").src = el.channel_profile;
            clone.querySelector(".btn-icon").src = public_url + "threedotsvertical.svg";
            clone.querySelector(".btn-icon").alt = "dot-three-icon-video-menu";
            clone.querySelector(".video-link").href = `/html/video.html?video_id=${el.id}`;
            clone.querySelector(".menu-toggle-btn").dataset.videoId = el.id;
            clone.querySelector(".meta").addEventListener("click", () => {
                location.href = `/html/video.html?video_id=${el.id}`;
            });

            const channel_links = clone.querySelectorAll(".channel-link");
            channel_links.forEach(link => {
                link.href = `/html/channel.html?channel_id=${el.channel_id}`;
            });

            contents.appendChild(clone);
        });

        contents.appendChild(video_menu_div);
        const video_card = contents.querySelectorAll('.content');
        
        try {
            add_button_events(video_card, video_menu_div);
        } catch {
            throw new Error("서버에서 문제가 발생했습니다.");
        }
        document.addEventListener('click', (e) => {
            const is_click_inside_menu = video_menu_div.contains(e.target);
            if (!is_click_inside_menu) {
                video_menu_div.classList.remove("active");
                video_menu_div.dataset.activeButton = '';
            }
        });
        
        return { video_content: document.querySelectorAll(".content") };
    })
    .catch(err => {
        throw err;
    });
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
    const contents_div = document.querySelector("#contents").getBoundingClientRect();
    const contents_div_left = contents_div.left;
    const menu_width = video_menu_div.offsetWidth;
    const menu_height = video_menu_div.offsetHeight;

    let top = button_rect.top + window.scrollY - 112 + 24;
    let left = button_rect.left - contents_div_left;
    const viewport_width = window.innerWidth;
    const viewport_height = window.innerHeight;

    if (left + menu_width + contents_div_left >= viewport_width) {
        left = (viewport_width - menu_width - 24 - contents_div_left);
    }
    if (top + menu_height >= viewport_height + window.scrollY) {
        top -= (menu_height + 40);
    }

    video_menu_div.style.position = 'absolute';
    video_menu_div.style.top = `${top}px`;
    video_menu_div.style.left = `${left}px`;
    video_menu_div.classList.add("active");
}

export default insert_video_content;