import insert_video_content from "../../components/homeComponents/js/insertVideoContents.js";

// API에서 비디오 목록 가져오기
const xhr = new XMLHttpRequest();
xhr.open("GET", "http://techfree-oreumi-api.kro.kr:5000/video/getVideoList", true);
xhr.onload = function () {
    if (xhr.status === 200 && xhr.readyState === 4) {
        const sampleVideos = JSON.parse(xhr.response);  // JSON 데이터 파싱

        // avatar_img와 관련된 값이 sampleVideos에 포함되어 있다고 가정
        const avatarImages = [
            '../images/james.svg',
            '../images/alan.svg',
            '../images/marcus.svg',
            '../images/alexis.svg',
            '../images/jesica.svg',
            '../images/anna.svg',
            '../images/skylar.svg'
        ];

        // 각 비디오 객체에 avatar_img를 추가
        sampleVideos.forEach((video, index) => {
            video.avatar_img = avatarImages[index % avatarImages.length]; // 인덱스에 맞는 아바타 이미지 할당
        });

        // 비디오 목록을 화면에 추가
        insert_video_content(sampleVideos);
    } else {
        console.error("Error:", xhr.status);
    }
};
xhr.onerror = function () {
    console.error('Network Error');
};
xhr.send();
