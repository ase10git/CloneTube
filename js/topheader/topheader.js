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
document.addEventListener('DOMContentLoaded', () => {
    const hamburger = document.querySelector('.side-button');
    const body = document.body;

    hamburger.addEventListener('click', () => {
        body.classList.toggle('sidebar-open');
    });

    // 오버레이 클릭 시 닫기
    const overlay = document.createElement('div');
    overlay.className = 'sidebar-overlay';
    document.body.appendChild(overlay);

    overlay.addEventListener('click', () => {
        body.classList.remove('sidebar-open');
    });
});