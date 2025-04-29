// ------ 비디오 페이지의 관련 동영상 추천 목록 추가 ------
import build_video_menu from "../../videoComponents/js/insertVideoMenu.js";

// 테스트용 데이터
const video = [ 
    {title: 'Lorem ipsum dolor sit amet, consecte adipiscing elit.', uploader: 'James Gouse', spectators: 123, uploaded_time: '2024-01-02', thumbnail: '../images/thumbnail-1.svg', avatar_img: '../images/james.svg'},
    {title: 'Lorem ipsum dolor sit amet, consecte adipiscing elit.', uploader: 'Alan Cooper', spectators: 123, uploaded_time: '2024-01-02', thumbnail: '../images/thumbnail-2.svg', avatar_img: '../images/alan.svg'},    
    {title: 'Lorem ipsum dolor sit amet, consecte adipiscing elit.', uploader: 'Marcus Levin', spectators: 123, uploaded_time: '2024-01-02', thumbnail: '../images/thumbnail-3.svg', avatar_img: '../images/marcus.svg'},
    {title: 'Lorem ipsum dolor sit amet, consecte adipiscing elit.', uploader: 'Alexis Sears', spectators: 123, uploaded_time: '2024-01-02', thumbnail: '../images/thumbnail-4.svg', avatar_img: '../images/alexis.svg'},
    {title: 'Lorem ipsum dolor sit amet, consecte adipiscing elit.', uploader: 'Jesica Lambert', spectators: 123, uploaded_time: '2024-01-02', thumbnail: '../images/thumbnail-5.svg', avatar_img: '../images/jesica.svg'},
    {title: 'Lorem ipsum dolor sit amet, consecte adipiscing elit.', uploader: 'Anna White', spectators: 123, uploaded_time: '2024-01-02', thumbnail: '../images/thumbnail-6.svg', avatar_img: '../images/anna.svg'},
    {title: 'Lorem ipsum dolor sit amet, consecte adipiscing elit.', uploader: 'Skylar Dias', spectators: 123, uploaded_time: '2024-01-02', thumbnail: '../images/thumbnail-7.svg', avatar_img: '../images/skylar.svg'},    
    {title: 'Lorem ipsum dolor sit amet, consecte adipiscing elit.', uploader: 'James Gouse', spectators: 123, uploaded_time: '2024-01-02', thumbnail: '../images/thumbnail-8.svg', avatar_img: '../images/james.svg'},
    {title: 'Lorem ipsum dolor sit amet, consecte adipiscing elit.', uploader: 'James Gouse', spectators: 123, uploaded_time: '2024-01-02', thumbnail: '../images/thumbnail-2.svg', avatar_img: '../images/james.svg'},
    {title: 'Lorem ipsum dolor sit amet, consecte adipiscing elit.', uploader: 'James Gouse', spectators: 123, uploaded_time: '2024-01-02', thumbnail: '../images/thumbnail-1.svg', avatar_img: '../images/james.svg'},
    {title: 'Lorem ipsum dolor sit amet, consecte adipiscing elit.', uploader: 'James Gouse', spectators: 123, uploaded_time: '2024-01-02', thumbnail: '../images/thumbnail-3.svg', avatar_img: '../images/james.svg'},
    {title: 'Lorem ipsum dolor sit amet, consecte adipiscing elit.', uploader: 'James Gouse', spectators: 123, uploaded_time: '2024-01-02', thumbnail: '../images/thumbnail-4.svg', avatar_img: '../images/james.svg'},
    {title: 'Lorem ipsum dolor sit amet, consecte adipiscing elit.', uploader: 'James Gouse', spectators: 123, uploaded_time: '2024-01-02', thumbnail: '../images/thumbnail-5.svg', avatar_img: '../images/james.svg'},
    {title: 'Lorem ipsum dolor sit amet, consecte adipiscing elit.', uploader: 'James Gouse', spectators: 123, uploaded_time: '2024-01-02', thumbnail: '../images/thumbnail-6.svg', avatar_img: '../images/james.svg'},
    {title: 'Lorem ipsum dolor sit amet, consecte adipiscing elit.', uploader: 'James Gouse', spectators: 123, uploaded_time: '2024-01-02', thumbnail: '../images/thumbnail-7.svg', avatar_img: '../images/james.svg'},
    {title: 'Lorem ipsum dolor sit amet, consecte adipiscing elit.', uploader: 'James Gouse', spectators: 123, uploaded_time: '2024-01-02', thumbnail: '../images/thumbnail-8.svg', avatar_img: '../images/james.svg'},
]

const public_url = '../../images/';

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

            clone.querySelector(".video-thumbnail-img").src = public_url + el.thumbnail;
            clone.querySelector(".video-title").textContent = el.title;
            clone.querySelector(".channel-name").textContent = el.uploader;
            clone.querySelector(".spectator-number").textContent = `조회수 ${el.spectators}`;
            clone.querySelector(".uploaded-time").textContent = el.uploaded_time;
            clone.querySelector(".menu-box-img").src = public_url + 'three-dots-vertical.svg';
            clone.querySelector(".video-menu").innerHTML = menu.outerHTML;

            recommend_box.forEach(el=>{
                el.appendChild(clone.cloneNode(true));
            });
        })
    })
}

insert_video_list();