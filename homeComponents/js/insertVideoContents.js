// ----- Home 페이지에 Video 목록 추가 -----
import build_video_menu from "../../videoComponents/js/insertVideoMenu.js";

// 이미지 경로
const public_url = '../images/';

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
fetch("/homeComponents/html/videoContent.html")
    .then(res => {
        if (!res.ok) {
            throw new Error("HTML template 불러오기 실패");
        }
        return res.text();
    })
    .then(data => {
        temp_div.innerHTML = data;
    
        // 비디오용 템플릿
        const content_template = temp_div.querySelector("#content-template").content;
    
        // home에서 비디오 목록을 넣을 위치
        const contents = document.querySelector("#contents");
    
        // 비디오 메뉴 가져오기
        const menu = build_video_menu("../images/");

        video_info.forEach(el => {
            const clone = content_template.cloneNode(true);
            clone.querySelector(".thumbnail-img").src = el.thumbnail;
            clone.querySelector(".video-title").textContent = el.title;
            clone.querySelector(".channel-name").textContent = el.uploader;
            clone.querySelector(".spectator-number").textContent = `조회수 ${el.spectators}`;
            clone.querySelector(".upload-time").textContent = el.uploaded_time;
            clone.querySelector(".avatar-img").src = el.avatar_img;
            clone.querySelector(".menu-items").innerHTML = menu.outerHTML;
            clone.querySelector(".btn-icon").src = public_url + "three-dots-vertical.svg";
            clone.querySelector(".btn-icon").alt = "dot-three-icon";
    
            const link = clone.querySelector(".thumbnail-link");
            const titleLink = clone.querySelector(".video-title-link");
    
            contents.appendChild(clone);
    
            link?.addEventListener("click", (e) => {
                e.preventDefault();
                alert(`썸네일 클릭: ${el.title}`);
            });
    
            titleLink?.addEventListener("click", (e) => {
                e.preventDefault();
                alert(`비디오 제목 클릭: ${el.title}`);
            });
        });
    
    })