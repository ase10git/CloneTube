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
//API 가져오기
const xhr = new XMLHttpRequest();
    xhr.open("GET", "http://techfree-oreumi-api.kro.kr:5000/video/getVideoList", true);
    xhr.onload = function () {
        if (xhr.status >= 200 && xhr.status < 300) {
            console.log(JSON.parse(xhr.response));
            const sampleVideos = JSON.parse(xhr.response);
        } else {
            console.error("Error:", xhr.status);
        }
    };
    xhr.onerror = function () {
        console.error('Network Error');
    };
    xhr.send();

avatar_img: '../images/james.svg'
    avatar_img: '../images/alan.svg'
   avatar_img: '../images/marcus.svg'
    avatar_img: '../images/alexis.svg'
    avatar_img: '../images/jesica.svg'
    avatar_img: '../images/anna.svg'
     avatar_img: '../images/skylar.svg'
