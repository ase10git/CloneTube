// ----- Home 페이지에 Video 목록 추가 -----
import build_video_menu from "../../videoComponents/js/insertVideoMenu.js";
import timeCalculator from "../../../js/util/timeCalculator.js";
import formatViews from "./insertVideoFormatViews.js"

// 이미지 경로
const public_url = '../images/';

const temp_div = document.createElement("div");

// 비디오 메뉴 수정
function edit_menu() {
    // 비디오 메뉴 가져오기
    let menu = build_video_menu("../images/");

    // 구분 바 요소 추가
    const service_bar = document.createElement("li");
    service_bar.classList.add("service-bar");

    // 신고 항목 위에 구분바 추가
    menu.insertBefore(service_bar, menu.childNodes[7]);

    return menu;
}

// 템플릿 코드를 사용하여 비디오 컨텐츠 생성
async function insert_video_content(video_info){
    return fetch("../../components/homeComponents/html/videoContent.html")
    .then(res => {
        if (!res.ok) {
            throw new Error("HTML template 불러오기 실패");
        }
        return res.text();
    })
    .then(data => {
        temp_div.innerHTML = data;

        // 비디오용 템플릿
        const content_template = temp_div.querySelector("#content-template").content;

        // home에서 비디오 목록을 넣을 위치
        const contents = document.querySelector("#contents");

        // 비디오 메뉴 생성 및 등록
        const video_menu_div = document.createElement("div");
        video_menu_div.classList.add("menu-list");
        const menu = edit_menu();
        video_menu_div.appendChild(menu);

        video_info.forEach(el => {
            //사용 하는것들: channel_id, created_dt, thumbnail, title, views
            //사용 안하는것들: dislikes, likes, tags
            const clone = content_template.cloneNode(true); // 템플릿을 복제하여 새로운 비디오 카드 생성

            // 비디오 id 데이터 추가
            clone.querySelector(".content").dataset.videoId = el.id;

            clone.querySelector(".thumbnail-img").src = el.thumbnail; // 썸네일 이미지 설정
            clone.querySelector(".video-title").textContent = el.title; // 비디오 제목 설정
            clone.querySelector(".channel-name").textContent = el.channel_id; // 채널 이름 설정
            clone.querySelector(".spectator-number").textContent = `조회수 ${formatViews(el.views)}`; // 조회수 표시
            clone.querySelector(".upload-time").textContent = timeCalculator(el.created_dt); // 업로드 시간 → '몇 분 전' 형태로 표시
            clone.querySelector(".channel-name").textContent = el.channel_name;
            clone.querySelector(".avatar-img").src = el.channel_profile; // 아바타 이미지 설정
            clone.querySelector(".btn-icon").src = public_url + "three-dots-vertical.svg"; // 메뉴 버튼 아이콘 이미지 설정
            clone.querySelector(".btn-icon").alt = "dot-three-icon"; // 메뉴 버튼 아이콘의 대체 텍스트
            clone.querySelector(".video-link").href = `/html/video.html?video_id=${el.id}`; // 비디오 링크 설정
            clone.querySelector(".menu-toggle-btn").dataset.videoId = el.id; // 메뉴 버튼에 id 지정

            // 채널 메타 박스에 링크 추가
            clone.querySelector(".meta").addEventListener("click", () => {
                location.href = `/html/video.html?video_id=${el.id}`;
            });

            // 채널 링크
            const channel_links = clone.querySelectorAll(".channel-link");
            channel_links.forEach(link => {
                link.href = `/html/channel.html?channel_id=${el.channel_id}`;
            });

            contents.appendChild(clone); // 완성된 비디오 카드를 #contents 영역에 추가
            contents.appendChild(video_menu_div);
        });

        // ----- 메뉴 토글 이벤트 등록
        // 메뉴 토글 버튼 가져오기
        const video_card = contents.querySelectorAll('.content');

        // 메뉴 숨기기 함수
        function hide_menu() {
            video_menu_div.classList.remove("active");
        }
    
        // 버튼 클릭 이벤트 등록
        video_card.forEach(card => {
            const button = card.querySelector(".menu-toggle-btn");
            button.addEventListener('click', (event) => {
                event.stopPropagation(); // 이벤트 버블링 방지
                const active_button = video_menu_div.dataset.activeButton;
                const button_video_id = button.dataset.videoId;
                // 같은 버튼을 누르면 안보이게 설정
                if (video_menu_div.classList.contains("active")
                    && active_button === button_video_id) 
                {
                    hide_menu();
                    video_menu_div.dataset.activeButton = '';
                } else {
                    show_menu(card.dataset.videoId, video_menu_div);
                    video_menu_div.dataset.activeButton = button_video_id;
                }

                // 클릭 스타일 설정
                button.classList.remove("clicked");
                void button.offsetWidth;
                button.classList.add("clicked");
            });

            button.addEventListener('mousedown', (event) => {
                event.stopPropagation(); // 이벤트 버블링 방지
                // 클릭 스타일 설정
                button.classList.add("hold");
            });

            button.addEventListener('mouseup', (event) => {
                event.stopPropagation(); // 이벤트 버블링 방지
                // 클릭 스타일 설정
                button.classList.remove("hold");
            });

            button.addEventListener('mouseleave', (event) => {
                event.stopPropagation(); // 이벤트 버블링 방지
                // 클릭 스타일 설정
                button.classList.remove("hold");
            });

            // 애니메이션 종료 후 클래스 제거
            button.addEventListener("animationend", () => {
                button.classList.remove("clicked");
            });
        });
    
        // 문서 클릭 시 메뉴 숨기기
        document.addEventListener('click', () => {
            hide_menu();
            video_menu_div.dataset.activeButton = '';
        });
        return { video_content: document.querySelectorAll(".content") };
    })
    .catch(err => {
        //console.log(err)
    });
}

// 메뉴 표시 함수
function show_menu(card_video_id, video_menu_div) {
    // 비디오 카드 위치 정보 가져오기
    const card = document.querySelector(`.content[data-video-id="${card_video_id}"]`);
    const toggle_btn = card.querySelector(".menu-toggle-btn");
    const button_rect = toggle_btn.getBoundingClientRect();
    const contents_div = document.querySelector("#contents").getBoundingClientRect();
    const meta_box = card.querySelector(".meta").getBoundingClientRect();

    // contents의 문서 내 왼쪽 좌표
    const contents_div_left = contents_div.left;

    // 메뉴바 크기
    const menu_width = video_menu_div.offsetWidth;
    const menu_height = video_menu_div.offsetHeight;

    // 기준 위치 (스크롤 포함 절대좌표)
    let top = meta_box.top + window.scrollY - (58 + 12);
    let left = button_rect.left - contents_div_left;

    // 뷰포트 크기
    const viewport_width = window.innerWidth;
    const viewport_height = window.innerHeight;

    // 메뉴가 화면 오른쪽을 넘으면 왼쪽으로 보정
    if (left + menu_width + contents_div_left >= viewport_width) {
        left = (viewport_width - menu_width - 24 - contents_div_left);
    }
    
    // 메뉴가 화면 하단을 넘으면 위쪽으로 띄움
    if (top + menu_height >= viewport_height + window.scrollY) {
        top -= (menu_height + 60);
    }

    video_menu_div.style.position = 'absolute';
    // 버튼 하단에 현재 스크롤 위치까지 고려한 좌표로 메뉴 리스트 위치 설정
    video_menu_div.style.top = `${top}px`;
    video_menu_div.style.left = `${left}px`;
    video_menu_div.classList.add("active");
}

export default insert_video_content;