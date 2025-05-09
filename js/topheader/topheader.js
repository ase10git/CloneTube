// 이벤트 리스너 등록
function form_event() {
    const search_form = document.querySelector("#search-form");
    const search_input = document.querySelector("#search-input");
    const reset_button = document.querySelector(".reset-button");

    // 검색 폼에서 유효성 검사
    search_form.addEventListener("submit", function (e) {
        e.preventDefault();
        const search_query = search_input.value;
        if (!search_query || search_query.trim().length === 0) return;
        // 검색 페이지로 이동
        window.location.href = `search.html?query=${encodeURIComponent(search_query)}`; // <-- 문자열 보간 템플릿 리터럴로 수정됨
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

// side nav의 버튼 동작을 제어
document.addEventListener("DOMContentLoaded", function () {
    // nav 요소가 로딩될 때까지 탐색 
    const interval = setInterval(() => {
        // 이벤트를 넣을 대상 요소 선택
        const sidebar = document.querySelector("#side-bar");
        const toggleButton = document.querySelector("#side-button");
        const miniNav = document.querySelector("#mini-nav"); // <-- 추가

        // 요소가 있을 때 이벤트 추가
        if (sidebar && toggleButton && miniNav) {
            let isSidebarOpened = false; // <-- 사용자가 사이드바를 열었는지 여부 저장

            // 햄버거 버튼 클릭 시 사이드바 열림/닫힘 토글
            toggleButton.addEventListener("click", function () {
                isSidebarOpened = !isSidebarOpened;
                handleResize(); // 상태 반영
            });

            // 화면 크기에 따라 사이드바 상태 조정
            function handleResize() {
                const width = window.innerWidth;

                if (width <= 790) {
                    // 790px 이하: 무조건 둘 다 숨김
                    sidebar.style.display = "none";
                    miniNav.style.display = "none";
                } else if (width <= 1312) {
                    // 791~1312px: 사이드바 숨김, 미니 네비 보임
                    sidebar.style.display = "none";
                    miniNav.style.display = "flex";
                } else {
                    // 1313px 이상
                    if (isSidebarOpened) {
                        sidebar.style.display = "block";
                        miniNav.style.display = "none";
                    } else {
                        sidebar.style.display = "none";
                        miniNav.style.display = "flex";
                    }
                }
            }

            // 페이지 로드 시 실행
            handleResize();

            // 화면 크기 변경될 때마다 실행
            window.addEventListener("resize", handleResize);

            // form 이벤트 등록
            form_event();

            clearInterval(interval); // 이벤트 연결 후 멈춤
        }
    }, 100);
});
