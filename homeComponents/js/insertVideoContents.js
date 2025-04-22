// Home 페이지에 Video 목록 추가
import menu_titles from "./videoMenuList.js";

// 이미지 경로
const public_url = '../../images/';

// 비디오 정보 --- 테스트용
const video = {title: 'test', uploader: 'aaa', spectators: 123, uploaded_time: '2024-01-02', thumbnail: '#'};
const video_info = Array.from(
    {length: 16},
    (val) => {return val = video}
)

// videoContent.html을 가져옴
const temp_div = document.createElement("div");

// 템플릿 코드를 사용하여 비디오 컨텐츠 생성
fetch("./homeComponents/html/videoContent.html")
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
        let menu_items = temp_div.querySelector("#content-template").content.querySelector("#menu-items");

        menu_titles.forEach(el => {
            // 템플릿 내용 복제
            const clone = menu_template.cloneNode(true);
            // 요소 수정
            clone.querySelector("#menu-icon-img").src = public_url + el.img_name;
            clone.querySelector("#menu-title").textContent = el.title;

            // 추가
            menu_items.appendChild(clone);
        });

        // 비디오 태그
        const content_template = temp_div.querySelector("#content-template").content;
        const contents = document.querySelector("#contents");

        video_info.forEach(el => {
            // 템플릿 내용 복제
            const clone = content_template.cloneNode(true);

            // 요소 수정
            clone.querySelector("#thumbnail-img").src = el.thumbnail;
            clone.querySelector("#video-title").textContent = el.title;
            clone.querySelector("#channel-name").textContent = el.uploader;
            clone.querySelector("#spectator-number").textContent = `조회수 ${el.spectators}`;
            clone.querySelector("#upload-time").textContent = el.uploaded_time;

            // 추가
            contents.appendChild(clone);
        })
    })
