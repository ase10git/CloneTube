document.addEventListener("DOMContentLoaded", function () {
    const sidebar = document.querySelector(".side-bar");
    const toggleButton = document.getElementById("SideButton");

    // 디버깅을 위한 콘솔 로그 추가
    console.log('sidebar:', sidebar);
    console.log('toggleButton:', toggleButton);

    if (sidebar && toggleButton) {
        toggleButton.addEventListener("click", function () {
            sidebar.classList.toggle("active");
        });
    } 
});
