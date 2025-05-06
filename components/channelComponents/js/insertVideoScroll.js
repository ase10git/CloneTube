// ------ 채널 비디오 재생 목록 스크롤 이벤트 추가 ------
function insert_video_scroll(video_playlist) {
   // 매개변수 : 스크롤 메뉴 랩
    // const video_playlist = document.querySelector(".video-playlist");

    // 비디오 메뉴 스크롤 요소
    const nav_container = video_playlist.querySelector(".video-row");
    const left_btn = video_playlist.querySelector(".video-button-left");
    const right_btn = video_playlist.querySelector(".video-button-right");

    // 버튼 표시 설정
    function update_btn_visibility() {
        // nav_container.scrollLeft : 현재 스크롤 위치
        // nav_container.scrollWidth : 스크롤 가능한 전체 길이
        // nav_container.clientWidth : 실제 보이는 길이
        const scroll_left = nav_container.scrollLeft;
        const scroll_width = nav_container.scrollWidth;
        const client_width = nav_container.clientWidth;
        const max_scroll_left = scroll_width - client_width;

        // 맨 왼쪽이면 left 버튼 숨김
        left_btn.style.display = scroll_left <= 0 ? "none" : null;

        // 맨 오른쪽이면 right 버튼을 숨김
        right_btn.style.display = scroll_left >= max_scroll_left ? "none" : null;
    }

    // 클릭 시 스크롤 이동
    function start_scrolling(scroll_direction) {
        // 스크롤 속도 - 현재 보이는 영역 너비만큼 이동
        const scroll_speed = nav_container.clientWidth;
        nav_container.scrollBy({ left: scroll_direction * scroll_speed});
    }

    // 초기 설정 진행
    update_btn_visibility();

    // 버튼 눌렀을 때 반응
    left_btn.addEventListener("click", () => start_scrolling(-1));
    right_btn.addEventListener("click", () => start_scrolling(1));

    // 스크롤에 반응한 버튼 표시 처리
    nav_container.addEventListener("scroll", update_btn_visibility);
    window.addEventListener("resize", update_btn_visibility);

    // DOM이 로드된 후 지연된 layout 계산을 위해 requestAnimationFrame
    requestAnimationFrame(update_btn_visibility);
}

export default insert_video_scroll;