// Home 페이지에 Video 목록 추가
import menu_titles from "./videoMenuList.js";

// 이미지 경로
const public_url = '../../images/';

// 비디오 정보
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

const video_info = video;

const temp_div = document.createElement("div");

// 템플릿 코드를 사용하여 비디오 컨텐츠 생성
fetch("../homeComponents/html/videoContent.html")
    .then(res => {
        if (!res.ok) {
            throw new Error("HTML template 불러오기 실패");
        }
        return res.text();
    })
    .then(data => {
        // 문자열로 로드된 HTML을 DOM으로 파싱
        temp_div.innerHTML = data;

        // 메뉴 아이템 태그
        const menu_template = temp_div.querySelector("#menu-template").content;
        let menu_items = temp_div.querySelector("#content-template").content.querySelector(".menu-items");

        menu_titles.forEach(el => {

            const clone = menu_template.cloneNode(true);
            // 요소 수정
            clone.querySelector(".menu-icon-img").src = public_url + el.img_name;
            clone.querySelector(".menu-name").textContent = el.title;
            menu_items.appendChild(clone);
        });

        // 비디오 태그
        const content_template = temp_div.querySelector("#content-template").content;
        const contents = document.querySelector("#contents");

        video_info.forEach(el => {

            const clone = content_template.cloneNode(true);

            clone.querySelector(".thumbnail-img").src = el.thumbnail;
            clone.querySelector(".video-title").textContent = el.title;
            clone.querySelector(".channel-name").textContent = el.uploader;
            clone.querySelector(".spectator-number").textContent = `조회수 ${el.spectators}`;
            clone.querySelector(".upload-time").textContent = el.uploaded_time;
            clone.querySelector(".avatar-img").src = el.avatar_img;
            contents.appendChild(clone);
        })
    })