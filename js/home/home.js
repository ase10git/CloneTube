document.addEventListener("DOMContentLoaded", () => {
    const btnList = document.getElementById("btn-list");
    const leftBtn = document.querySelector("#left-btn-wrap .header-btn");
    const rightBtn = document.querySelector("#right-btn-wrap .header-btn");

    const scrollAmount = 200; // 스크롤 이동 거리 (픽셀)

    leftBtn.addEventListener("click", () => {
        btnList.scrollBy({ left: -scrollAmount, behavior: "smooth" });
    });

    rightBtn.addEventListener("click", () => {
        btnList.scrollBy({ left: scrollAmount, behavior: "smooth" });
    });
});