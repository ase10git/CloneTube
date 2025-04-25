//------- channel 페이지 동적 스타일 적용 파일 -------

// *** 메뉴 상단 스타일 ***
// 클릭 스타일 지정
const menu = document.querySelector("#channel-nav-list");
const menu_items = menu.querySelectorAll("li");

menu_items.forEach(el => {
    el.addEventListener("click", () => {
        // 모든 클래스를 먼저 제거
        menu_items.forEach(item => {item.classList.remove("select")});
        // 클래스 추가
        el.classList.add("select");
    });
});

// 메뉴바 이동
document.addEventListener("DOMContentLoaded", function () {
    const nav_container = document.getElementById("channel-nav-str");
    const left_btn_wrap = document.getElementById("left-btn-wrap");
    const right_btn_wrap = document.getElementById("right-btn-wrap");
    const left_btn = document.getElementById("ch-nav-left-btn");
    const right_btn = document.getElementById("ch-nav-right-btn");

    // 버튼 표시 설정
    function update_btn_visibility() {
        // nav_container.scrollLeft : 현재 스크롤 위치
        // nav_container.scrollWidth : 스크롤 가능한 전체 길이
        // nav_container.clientWidth : 실제 보이는 스크롤 길이
        const scroll_left = nav_container.scrollLeft;
        const max_scroll_left = nav_container.scrollWidth - nav_container.clientWidth;

        // 화면이 클 때는 버튼이 안보이게 설정
        if (nav_container.scrollWidth <= nav_container.clientWidth) {
            left_btn_wrap.style.display = "none";
            right_btn_wrap.style.display = "none";
            return;
        }

        // 맨 왼쪽이면 left 버튼 숨김
        left_btn_wrap.style.display = scroll_left <= 0 ? "none" : "flex";

        // 맨 오른쪽이면 right 버튼을 숨김
        right_btn_wrap.style.display = scroll_left >= max_scroll_left ? "none" : "flex";
    }

    let is_scrolling = false;
    let scroll_direction = 0;
    let last_timestamp = null;
    const scroll_speed = 50; // px per ms

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
});

// 검색 버튼 누르면 입력창 활성화
//document.querySelector("#search-submit-btn").addEventListener