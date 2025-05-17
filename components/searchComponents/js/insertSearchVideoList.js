// ---- 검색 결과 템플릿으로 검색 결과 비디오 카드 생성 ----
import build_video_menu from "../../videoComponents/js/insertVideoMenu.js";
import timeCalculator from "../../../js/util/timeCalculator.js";
import viewsCalculator from "../../../js/util/viewsCalculator.js";

const public_url = '../../images/icon/';

// 비디오 메뉴 수정
function edit_menu() {
    let menu = build_video_menu(public_url);
    menu.removeChild(menu.childNodes[7]);
    menu.removeChild(menu.childNodes[7]);

    const service_bar = document.createElement("li");
    service_bar.classList.add("service-bar");

    menu.insertBefore(service_bar, menu.childNodes[7]);
    return menu;
}

// escape HTML special characters
function escape_HTML(str) {
    return str.replace(/[&<>"']/g, function(match) {
        const escapeMap = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#39;'
        };
        return escapeMap[match];
    });
}

// 검색 결과가 없을 때 출력 내용 생성
function no_result_html(query) {
    const sanitizedQuery = escape_HTML(query);
    const html_template = 
    `
    <div class="no-search-result-img-box">
        <img src="../../../images/default/searchnoresult.svg" alt="no-search-result">
    </div>
    <div>
        <span class="no-result-message">${sanitizedQuery} 검색결과가 없습니다.</span>
    </div>
    <div>
        <span class="no-result-recommend">다른 검색어를 시도해 보거나 검색 필터를 삭제하세요.</span>
    </div>
    `
    return html_template;
}

// 검색 결과 만들기
async function insert_search_results(query, total_info) {
    const temp_div = document.createElement("div");

    return fetch("../../components/searchComponents/html/searchVideoTemplate.html")
    .then(res => {
        if (!res.ok) {
            throw new Error("video template 불러오기 실패");
        }
        return res.text();
    })
    .then(data => {
        temp_div.innerHTML = data;
        const template = temp_div.querySelector("#content-template").content;
        const contents = document.querySelector("#contents");
        const video_menu_div = document.createElement("div");
        video_menu_div.classList.add("menu-list");
        const menu = edit_menu();
        video_menu_div.appendChild(menu);

        const no_result = document.createElement("div");
        no_result.classList.add("no-search-result");
        no_result.innerHTML = no_result_html(query);
        no_result.style.display = "none";
        contents.appendChild(no_result);

        // 결과 배열 길이에 따른 화면 처리
        if (total_info.length == 0) {
            no_result.style.display = "flex";
        } else {
            // 결과가 있을 때 처리
            total_info.forEach(el => {
                const clone = template.cloneNode(true);
                clone.querySelector(".content").dataset.videoId = el.id;

                const uploaded_time = timeCalculator(el.created_dt);
                const views = viewsCalculator(el.views, "kor");

                clone.querySelector(".video-link").href = `video.html?video_id=${el.id}`;
                clone.querySelector(".video-info").addEventListener("click", () => {
                    window.location.href = `video.html?video_id=${el.id}`;
                });
                clone.querySelector(".video-desc-box").addEventListener("click", () => {
                    window.location.href = `video.html?video_id=${el.id}`;
                })

                clone.querySelector(".channel-link").href = `channel.html?channel_id=${el.channel_id}`;
                clone.querySelector(".thumbnail-img").id = el.id;
                clone.querySelector(".thumbnail-img").src = el.thumbnail;
                clone.querySelector(".thumbnail-img").alt = el.title;
                clone.querySelector(".video-title").textContent = el.title;
                clone.querySelector(".channel-name").textContent = el.channel_name;
                clone.querySelector(".spectator-number").textContent = `조회수 ${views}`;
                clone.querySelector(".upload-time").textContent = uploaded_time;
                clone.querySelector(".avatar-img").src = el.channel_profile;
                clone.querySelector(".video-description").textContent = el.description;
                clone.querySelector(".btn-icon").src = public_url + "threedotsvertical.svg";
                clone.querySelector(".btn-icon").alt = "dot-three-icon";
                clone.querySelector(".menu-toggle-btn").dataset.videoId = el.id;

                contents.appendChild(clone);
            });

            contents.appendChild(video_menu_div);
            const video_card = contents.querySelectorAll('.content');
            add_button_events(video_card, video_menu_div);
            document.addEventListener('click', (e) => {
                const is_click_inside_menu = video_menu_div.contains(e.target);
                if (!is_click_inside_menu) {
                    video_menu_div.classList.remove("active");
                    video_menu_div.dataset.activeButton = '';
                }
            });
        }
        
        return {
            video_content: document.querySelectorAll(".content"),
            no_result: document.querySelector(".no-search-result")
        };
    })
    .catch(error => {
        build_error_message("서버에서 에러가 발생했습니다.", document.querySelector("main"));
    });
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
    const viewport_height = window.innerHeight;

    let top = button_rect.bottom + window.scrollY;
    let left = (button_rect.left + 24 - menu_width);
    
    if (top + menu_height >= viewport_height + window.scrollY) {
        top -= (menu_height + 50);
    }

    video_menu_div.style.position = 'absolute';
    video_menu_div.style.top = `${top}px`;
    video_menu_div.style.left = `${left}px`;
    video_menu_div.classList.add("active");
}

export default insert_search_results;