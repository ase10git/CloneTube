// ----- 스크롤바 이벤트 추가 -------
function addScrollEvent(menu_container) {
    // 매개변수 : 스크롤 메뉴 랩
    // const menu_container = document.querySelector(".scroll-menu-wrap");

    // 메뉴바 이동
    const nav_container = menu_container.querySelector(".menu-list");
    const left_btn_wrap = menu_container.querySelector(".left-btn-wrap");
    const right_btn_wrap = menu_container.querySelector(".right-btn-wrap");
    const left_btn = menu_container.querySelector(".nav-left-btn");
    const right_btn = menu_container.querySelector(".nav-right-btn");

    // 버튼 표시 설정
    function update_btn_visibility() {
        // nav_container.scrollLeft : 현재 스크롤 위치
        // nav_container.scrollWidth : 스크롤 가능한 전체 길이
        // nav_container.clientWidth : 실제 보이는 스크롤 길이
        const scroll_left = nav_container.scrollLeft;
        const scroll_width = nav_container.scrollWidth;
        const client_width = nav_container.clientWidth;
        const max_scroll_left = scroll_width - client_width;
        
        // 화면이 클 때는 버튼이 안보이게 설정
        if (scroll_width <= client_width) {
            left_btn_wrap.style.display = "none";
            right_btn_wrap.style.display = "none";
            return;
        }

        // 맨 왼쪽이면 left 버튼 숨김
        left_btn_wrap.style.display = scroll_left <= 0 ? "none" : "flex";

        // 맨 오른쪽이면 right 버튼을 숨김
        right_btn_wrap.style.display = scroll_left >= max_scroll_left ? "none" : "flex";
    }

    // 스크롤 여부
    let is_scrolling = false;
    // 스크롤 방향
    let scroll_direction = 0;
    // 마지막 위치
    let last_timestamp = null;
    // 스크롤 속도
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

    // 버튼 눌렀을 때 반응
    left_btn.addEventListener("mousedown", () => start_scrolling(-1));
    right_btn.addEventListener("mousedown", () => start_scrolling(1));

    // 마우스를 떼거나 멈췄을 때
    left_btn.addEventListener("mouseup", stop_scrolling);
    left_btn.addEventListener("mouseleave", stop_scrolling);
    right_btn.addEventListener("mouseup", stop_scrolling);
    right_btn.addEventListener("mouseleave", stop_scrolling);

    // 스크롤에 반응한 버튼 표시 처리
    nav_container.addEventListener("scroll", update_btn_visibility);
    window.addEventListener("resize", update_btn_visibility);

    // DOM이 로드된 후 지연된 layout 계산을 위해 requestAnimationFrame
    requestAnimationFrame(update_btn_visibility);
}

export default addScrollEvent;