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
