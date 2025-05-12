// 상단 헤더 및 사이드바
import {build_error_message, build_network_error} from "../errorHandling/buildErrorMessage.js";

// topheader.html 불러오기
async function get_topheader() {
    return fetch("./topheader.html")
    .then(res => {
        if (!res.ok) build_network_error(res.status);
        return res.text();
    })
    .then(html => {
        const top_header = document.getElementById("top-header");
        top_header.innerHTML = html;

        const nav_overlay = document.createElement("div");
        nav_overlay.classList.add("nav-overlay");
        top_header.appendChild(nav_overlay);
    })
    .catch(error=>{
        if (error.name === "NetworkError") {
            build_error_message(error.message, document.querySelector("#top-header"));
        } else {
            build_error_message("서버에서 에러가 발생했습니다.", document.querySelector("#top-header"));
        }
    });
}

// 이벤트 리스너 등록
function form_event(search_form, search_input, reset_button) {
    // 검색 폼에서 유효성 검사
    search_form.addEventListener("submit", function (e) {
        e.preventDefault();
        const search_query = search_input.value;
        if (!search_query || search_query.trim().length === 0) return;
        // 검색 페이지로 이동
        window.location.href = `search.html?query=${search_query}`;
        // 로컬 저장소에 검색했던 값 저장
        localStorage.setItem("query", search_query);
    });

    // 리셋 버튼 표시 콜백
    function update_reset_button() {
        if (search_input.value) {
            reset_button.classList.add("visible");
        } else {
            reset_button.classList.remove("visible");
        }
    }

    // input 내의 값 유무에 따른 reset button 표시
    search_input.addEventListener("input", update_reset_button);

    // reset button을 누른 후에 다시 안보이게 설정
    reset_button.addEventListener("click", function () {
        reset_button.classList.remove("visible");
        // 로컬 저장소에 저장된 값 제거
        localStorage.removeItem("query");
    });

    // localStorage에서 검색어 가져오기
    search_input.value = localStorage.getItem("query") ? localStorage.getItem("query") : "";

    // 리셋 버튼 class 업데이트
    update_reset_button();
}

// 구독한 채널 정보 가져오기(1 ~ 3)
async function get_subscribe_channel() {
    
    // api 요청
    async function get_channel_info(channel_id) {
        return fetch(`https://www.techfree-oreumi-api.ai.kr/channel/getChannelInfo?id=${channel_id}`)
        .then(res => {
            if (!res.ok) build_network_error(res.status);
            return res.json();
        })
        .then(data => data)
        .catch(error => { 
            if (error.name === "NetworkError") {
                build_error_message(error.message, document.querySelector("main"));
            } else {
                build_error_message("서버에서 에러가 발생했습니다.", document.querySelector("main"));
            } 
        });
    }
    
    return Promise.all([get_channel_info(1), get_channel_info(2), get_channel_info(3)]);
}

// side nav의 버튼 동작을 제어
document.addEventListener("DOMContentLoaded", async function () {
    await get_topheader();

    // 구독한 채널 정보 가져와서 넣기
    const subscribe_channel= await get_subscribe_channel();

    document.querySelectorAll(".subscription").forEach((el, idx) => {
        const img_tag = document.createElement("img");
        img_tag.src = subscribe_channel[idx].channel_profile;
        img_tag.alt = subscribe_channel[idx].channel_name;
        img_tag.width = "24";
        img_tag.height = "24";

        const a_tag = el.querySelector("a");
        a_tag.href = `channel.html?channel_id=${subscribe_channel[idx].id}`;
        a_tag.textContent = subscribe_channel[idx].channel_name;
        a_tag.prepend(img_tag);
    })

    // 현재 nav를 가져온 페이지
    const is_video_page = window.location.pathname.split("/").pop() === "video.html";

    // 이벤트를 넣을 대상 요소 선택
    const sidebar = document.querySelector("#side-bar");
    const toggleButton = document.querySelector("#side-button");
    const navOverlay = document.querySelector(".nav-overlay");
    // 폼 요소
    const search_form = document.querySelector("#search-form");
    const search_input = document.querySelector("#search-input");
    const reset_button = document.querySelector(".reset-button");

    // 요소가 있을 때 이벤트 추가
    if (sidebar && toggleButton) {
        let prev_is_wide = window.innerWidth > 1312;

        // 새로고침 시 초기상태 설정
        if (is_video_page) {
            sidebar.classList.add("hidden", "small_wide");
            sidebar.classList.remove("overlay-open");
            document.body.classList.add("sidebar-close");
            navOverlay.classList.remove("visible");
        } else {
            if (prev_is_wide) {
                sidebar.classList.remove("hidden", "overlay-open", "small_wide");
                document.body.classList.remove("sidebar-close");
                navOverlay.classList.remove("visible");
            } else {
                sidebar.classList.add("hidden", "small_wide");
                sidebar.classList.remove("overlay-open");
                document.body.classList.add("sidebar-close");
                navOverlay.classList.remove("visible");
            }
        }

        // 토글 버튼 이벤트
        toggleButton.addEventListener("click", function () {
            if (is_video_page) {
                sidebar.classList.toggle("overlay-open");
                navOverlay.classList.toggle("visible");
            } else {
                if (prev_is_wide) {
                    sidebar.classList.toggle("hidden");
                    document.body.classList.toggle("sidebar-close"); 
                } else {
                    sidebar.classList.toggle("overlay-open");
                    navOverlay.classList.toggle("visible");
                }
            }
        });

        // 화면 사이즈에 따른 사이드바 이벤트
        window.addEventListener("resize", function () {
            const is_wide = window.innerWidth > 1312;

            if (is_video_page) return;
            if (is_wide !== prev_is_wide) {
                if (is_wide) {
                    sidebar.classList.remove("hidden", "small_wide", "overlay-open");
                    document.body.classList.remove("sidebar-close");
                    navOverlay.classList.remove("visible");
                } else {
                    sidebar.classList.add("hidden", "small_wide");
                    sidebar.classList.remove("overlay-open");
                    document.body.classList.add("sidebar-close"); 
                    navOverlay.classList.remove("visible");
                }
            }
            prev_is_wide = is_wide;
        });

        document.addEventListener(("click"), function(e) {
            if (e.target.contains(navOverlay)) {
                sidebar.classList.remove("overlay-open");
                navOverlay.classList.remove("visible");
            }
        });
    }

    if (search_form && search_input && reset_button) {
        // form 이벤트 등록
        form_event(search_form, search_input, reset_button);
    }
});
