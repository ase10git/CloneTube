// side nav의 버튼 동작을 제어
document.addEventListener("DOMContentLoaded", function () {
    // nav 요소가 로딩될 때까지 탐색 
    const interval = setInterval(() => {
        // console.log('nav 요소 탐색중..')
        
        // 이벤트를 넣을 대상 요소 선택
        const sidebar = document.querySelector("#side-bar");
        const toggleButton = document.querySelector("#side-button");

        // console.log(sidebar, toggleButton);
        
        // 요소가 있을 때 이벤트 추가
        if (sidebar && toggleButton) {
            toggleButton.addEventListener("click", function () {
                sidebar.classList.toggle("active");
            });
            clearInterval(interval); // 이벤트 연결 후 멈춤
        }
    }, 100);
});
