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
        window.location.href = `search.html?query=${search_query}`;
    });

    // input 내의 값 유무에 따른 reset button 표시
    search_input.addEventListener("input", function () {
        if (search_input.value) {
            reset_button.classList.add("visible");
        }
    });

    // reset button을 누른 후에 다시 안보이게 설정
    reset_button.addEventListener("click", function () {
        reset_button.classList.remove("visible");
    })
}

// side nav의 버튼 동작을 제어
document.addEventListener("DOMContentLoaded", function () {
    // nav 요소가 로딩될 때까지 탐색 
    const interval = setInterval(() => {
        // 이벤트를 넣을 대상 요소 선택
        const sidebar = document.querySelector("#side-bar");
        const toggleButton = document.querySelector("#side-button");

        // 요소가 있을 때 이벤트 추가
        if (sidebar && toggleButton) {
            toggleButton.addEventListener("click", function () {
                sidebar.classList.toggle("active");
                document.body.classList.toggle("sidebar-close"); 
            });
            clearInterval(interval); // 이벤트 연결 후 멈춤
        }

        // form 이벤트 등록
        form_event();
    }, 100);
});