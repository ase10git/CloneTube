// ----- 스크롤바 이벤트 추가 -------
function addScrollEvent(menu_container) {
    const nav_container = menu_container.querySelector(".menu-list");
    const left_btn_wrap = menu_container.querySelector(".left-btn-wrap");
    const right_btn_wrap = menu_container.querySelector(".right-btn-wrap");
    const left_btn = menu_container.querySelector(".nav-left-btn");
    const right_btn = menu_container.querySelector(".nav-right-btn");

    // 버튼 표시 설정
    function update_btn_visibility() {
        const scroll_left = nav_container.scrollLeft;
        const scroll_width = nav_container.scrollWidth;
        const client_width = nav_container.clientWidth;
        const max_scroll_left = scroll_width - client_width;
        
        if (scroll_width <= client_width) {
            left_btn_wrap.style.display = "none";
            right_btn_wrap.style.display = "none";
            return;
        }

        left_btn_wrap.style.display = scroll_left <= 0 ? "none" : "flex";
        right_btn_wrap.style.display = scroll_left >= max_scroll_left ? "none" : "flex";
    }

    let is_scrolling = false;
    let scroll_direction = 0;
    let last_timestamp = null;
    const scroll_speed = 50; // px per ms

    // 스크롤 이동 간격 지정
    function step(timestamp) {
        if (!is_scrolling) return;
        if (last_timestamp !== null) {
            const delta = timestamp - last_timestamp;
            nav_container.scrollBy({ left: scroll_direction * scroll_speed * delta });
        }
        last_timestamp = timestamp;
        requestAnimationFrame(step);
    }

    // 스크롤 중지
    function stop_scrolling() {
        is_scrolling = false;
    }

    // 버튼 꾹 누르면 스크롤 이동 효과
    function start_scrolling(direction) {
        is_scrolling = true;
        scroll_direction = direction;
        requestAnimationFrame(step);
        nav_container.scrollBy({left: direction * scroll_speed});
    }

    // 초기 설정 진행
    update_btn_visibility();

    left_btn.addEventListener("mousedown", () => start_scrolling(-1));
    right_btn.addEventListener("mousedown", () => start_scrolling(1));

    left_btn.addEventListener("mouseup", stop_scrolling);
    left_btn.addEventListener("mouseleave", stop_scrolling);
    right_btn.addEventListener("mouseup", stop_scrolling);
    right_btn.addEventListener("mouseleave", stop_scrolling);

    nav_container.addEventListener("scroll", update_btn_visibility);
    window.addEventListener("resize", update_btn_visibility);

    requestAnimationFrame(update_btn_visibility);
}

export default addScrollEvent;