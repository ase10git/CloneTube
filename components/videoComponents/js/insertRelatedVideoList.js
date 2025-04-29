// ------ 비디오 페이지의 관련 동영상 추천 목록 추가 ------
import build_video_menu from "../../videoComponents/js/insertVideoMenu.js";


// HTTPRequest 객체 생성
const xhr = new XMLHttpRequest();

// get 요청 설정 - 비디오 리스트를 비동기로 가져오기
xhr.open("GET", "http://techfree-oreumi-api.kro.kr:5000/video/getVideoList", true);

// 요청 전송 후 상태 변화 시 콜백 함수
xhr.onreadystatechange = function () {
    if (xhr.readyState === 4) {
        if(xhr.status === 200) {
            // 결과 데이터 파싱
            const data = JSON.parse(xhr.response);
            console.log(data);
            // 비디오 목록에 데이터 추가
            video_list(data);
        } else {
            // 에러 처리
            console.error("Error:", xhr.status);
        }
    }
};

// 요청 전송
xhr.send(); 



function video_list(data){
    const video = data;

    const public_url = "../../images/";

    const temp_div = document.createElement("div");

    // 템플릿 코드를 사용하여 비디오 컨텐츠 생성
    function insert_video_list() {
        fetch("../components/videoComponents/html/videoTemplate.html")
        .then(res => {
            if (!res.ok) {
                throw new Error("HTML template 불러오기 실패");
            }
            return res.text();
        })
        .then(data => {
            // 문자열로 로드된 HTML을 DOM으로 파싱
            temp_div.innerHTML = data;

            // 비디오 태그
            const video_template = temp_div.querySelector("#video-template").content;
            const recommend_box = document.querySelectorAll(".recommend-box");

            // 비디오 메뉴 가져오기
            const menu = build_video_menu("../images/");

            video.forEach(el => {
                const clone = video_template.cloneNode(true);
            
                // 채널 정보 가져오기
                fetch(`http://techfree-oreumi-api.kro.kr:5000/channel/getChannelInfo?id=${el.channel_id}`)
                .then(res => res.json())
                .then(channelData => {
                    clone.querySelector(".video-thumbnail-img").src = el.thumbnail;
                    clone.querySelector(".video-title").textContent = el.title;
                    clone.querySelector(".channel-name").textContent = channelData.channel_name;
                    clone.querySelector(".spectator-number").textContent = `${el.views} views`;
                    clone.querySelector(".uploaded-time").textContent = el.created_dt;
                    clone.querySelector(".menu-box-img").src = public_url + 'three-dots-vertical.svg';
                    clone.querySelector(".video-menu").innerHTML = menu.outerHTML;
            
                    recommend_box.forEach(box => {
                        box.appendChild(clone.cloneNode(true));
                    });
                })
                .catch(error => {
                    console.error("채널 정보 가져오기 실패:", error);
                });
            });
        })
    }
    insert_video_list();
}