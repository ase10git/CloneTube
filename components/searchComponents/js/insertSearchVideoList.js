// ---- 검색 결과 템플릿으로 검색 결과 비디오 카드 생성 ----
import build_video_menu from "../../videoComponents/js/insertVideoMenu.js";
import timeCalculator from "../../../js/util/timeCalculator.js";
import viewsCalculator from "../../../js/util/viewsCalculator.js";

const public_url = '../../images/';

// 비디오 메뉴 수정
function edit_menu() {
    // 비디오 메뉴 가져오기
    let menu = build_video_menu("../images/");

    // 메뉴 아이템 제거(추천 관련 옵션 2개 제거)
    menu.removeChild(menu.childNodes[7]);
    menu.removeChild(menu.childNodes[7]);

    // 구분 바 요소 추가
    const service_bar = document.createElement("li");
    service_bar.classList.add("service-bar");

    // 신고 항목 위에 구분바 추가
    menu.insertBefore(service_bar, menu.childNodes[7]);

    return menu;
}

// 검색 결과가 없을 때 출력 내용 생성
function no_result_html(query) {
    const html_template = 
    `
    <div class="no-search-result-img-box">
        <img src="../../images/search-no-result.svg" alt="no-search-result">
    </div>
    <div>
        <span class="no-result-message">${query} 검색결과가 없습니다.</span>
    </div>
    <div>
        <span class="no-result-recommend">다른 검색어를 시도해 보거나 검색 필터를 삭제하세요.</span>
    </div>
    `
    return html_template;
}

// 검색 결과 만들기
async function insert_search_results(query, total_info) {
    // 템플릿을 담을 태그
    const temp_div = document.createElement("div");

    // 탬플릿 가져오기
    return fetch("../../components/searchComponents/html/searchVideoTemplate.html")
    .then(res => {
        if (!res.ok) {
            throw new Error("video template 불러오기 실패");
        }
        return res.text();
    })
    .then(data => {
        temp_div.innerHTML = data;
    
        // 비디오용 템플릿
        const template = temp_div.querySelector("#content-template").content;
    
        // home에서 비디오 목록을 넣을 위치
        const contents = document.querySelector("#contents");
    
        // 비디오 메뉴 생성 및 등록
        const video_menu_div = document.createElement("div");
        video_menu_div.classList.add("menu-list");
        const menu = edit_menu();
        video_menu_div.appendChild(menu);

        // 검색 결과나 필터 결과가 없을 때 표시할 요소
        const no_result = document.createElement("div");
        no_result.classList.add("no-search-result");
        no_result.innerHTML = no_result_html(query);
        no_result.style.display = "none"; // 안보이게 설정
        contents.appendChild(no_result);

        // 결과 배열 길이에 따른 화면 처리
        if (total_info.length == 0) {
            no_result.style.display = "flex";
        } else {
            // 검색한 비디오 데이터 출력
            // 결과가 있을 때 처리
            total_info.forEach(el => {
                // 복제할 DOM
                const clone = template.cloneNode(true);
                // 비디오 id 데이터 추가
                clone.querySelector(".content").dataset.videoId = el.id;

                // 업로드한 날짜 계산
                const uploaded_time = timeCalculator(el.created_dt);
                const views = viewsCalculator(el.views, "kor");

                // 비디오 링크
                clone.querySelector(".video-link").href = `video.html?video_id=${el.id}`;
                clone.querySelector(".video-info").addEventListener("click", () => {
                    window.location.href = `video.html?video_id=${el.id}`;
                });
                clone.querySelector(".video-desc-box").addEventListener("click", () => {
                    window.location.href = `video.html?video_id=${el.id}`;
                })

                // 채널 링크
                clone.querySelector(".channel-link").href = `channel.html?channel_id=${el.channel_id}`;

                // 요소에 넣기
                clone.querySelector(".thumbnail-img").id = el.id;
                clone.querySelector(".thumbnail-img").src = el.thumbnail;
                clone.querySelector(".thumbnail-img").alt = el.title;
                clone.querySelector(".video-title").textContent = el.title;
                clone.querySelector(".channel-name").textContent = el.channel_name;
                clone.querySelector(".spectator-number").textContent = `조회수 ${views}`;
                clone.querySelector(".upload-time").textContent = uploaded_time;
                clone.querySelector(".avatar-img").src = el.channel_profile;
                clone.querySelector(".video-description").textContent = el.description;
                clone.querySelector(".btn-icon").src = public_url + "three-dots-vertical.svg";
                clone.querySelector(".btn-icon").alt = "dot-three-icon";
                clone.querySelector(".menu-toggle-btn").dataset.videoId = el.id; // 메뉴 버튼에 id 지정

                contents.appendChild(clone);
            });

            // #contents 영역에 비디오 메뉴 추가
            contents.appendChild(video_menu_div);
            
            // 메뉴 토글 버튼 가져오기
            const video_card = contents.querySelectorAll('.content');

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

    // 뷰포트 크기
    const viewport_height = window.innerHeight;

    // 기준 위치 (스크롤 포함 절대좌표)
    let top = button_rect.bottom + window.scrollY;
    let left = (button_rect.left + 24 - menu_width);
    
    // 메뉴가 화면 하단을 넘으면 위쪽으로 띄움
    if (top + menu_height >= viewport_height + window.scrollY) {
        top -= (menu_height + 50);
    }

    video_menu_div.style.position = 'absolute';
    // 버튼 하단에 현재 스크롤 위치까지 고려한 좌표로 메뉴 리스트 위치 설정
    video_menu_div.style.top = `${top}px`;
    video_menu_div.style.left = `${left}px`;
    video_menu_div.classList.add("active");
}

export default insert_search_results;