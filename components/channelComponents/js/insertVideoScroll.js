// ------ 채널 비디오 재생 목록 스크롤 이벤트 추가 ------
function insert_video_scroll(video_playlist) {
    const nav_container = video_playlist.querySelector(".video-row");
    const left_btn = video_playlist.querySelector(".video-button-left");
    const right_btn = video_playlist.querySelector(".video-button-right");

    // 버튼 표시 설정
    function update_btn_visibility() {
        const scroll_left = nav_container.scrollLeft;
        const scroll_width = nav_container.scrollWidth;
        const client_width = nav_container.clientWidth;
        const max_scroll_left = scroll_width - client_width;

        left_btn.style.display = scroll_left <= 0 ? "none" : null;
        right_btn.style.display = scroll_left >= max_scroll_left ? "none" : null;
    }

    function start_scrolling(scroll_direction) {
        const scroll_speed = nav_container.clientWidth;
        nav_container.scrollBy({ left: scroll_direction * scroll_speed});
    }

    // 초기 설정 진행
    update_btn_visibility();

    left_btn.addEventListener("click", () => start_scrolling(-1));
    right_btn.addEventListener("click", () => start_scrolling(1));
    nav_container.addEventListener("scroll", update_btn_visibility);
    window.addEventListener("resize", update_btn_visibility);

    requestAnimationFrame(update_btn_visibility);
}

export default insert_video_scroll;