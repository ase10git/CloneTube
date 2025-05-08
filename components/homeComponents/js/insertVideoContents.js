// ----- Home 페이지에 Video 목록 추가 -----
import build_video_menu from "../../videoComponents/js/insertVideoMenu.js";
import timeCalculator from "../../../js/util/timeCalculator.js";
import formatViews from "./insertVideoFormatViews.js"

// 이미지 경로
const public_url = '../images/';

const temp_div = document.createElement("div");

// 템플릿 코드를 사용하여 비디오 컨텐츠 생성
async function insert_video_content(video_info){
    fetch("../components/homeComponents/html/videoContent.html")
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

        //사용 하는것들: channel_id, created_dt, thumbnail, title, views
        //사용 안하는것들: dislikes, likes, tags
        const clone = content_template.cloneNode(true); // 템플릿을 복제하여 새로운 비디오 카드 생성
        clone.querySelector(".thumbnail-img").src = el.thumbnail; // 썸네일 이미지 설정
        clone.querySelector(".video-title").textContent = el.title; // 비디오 제목 설정
        clone.querySelector(".channel-name").textContent = el.channel_id; // 채널 이름 설정
        clone.querySelector(".spectator-number").textContent = `조회수 ${formatViews(el.views)}`; // 조회수 표시
        clone.querySelector(".upload-time").textContent = timeCalculator(el.created_dt); // 업로드 시간 → '몇 분 전' 형태로 표시
        clone.querySelector(".avatar-img").src = el.avatar_img; // 아바타 이미지 설정
        clone.querySelector(".menu-items").innerHTML = menu.outerHTML; // 메뉴 항목(3점 메뉴) 삽입
        clone.querySelector(".btn-icon").src = public_url + "three-dots-vertical.svg"; // 메뉴 버튼 아이콘 이미지 설정
        clone.querySelector(".btn-icon").alt = "dot-three-icon"; // 메뉴 버튼 아이콘의 대체 텍스트
        const link = clone.querySelector(".thumbnail-link"); // 썸네일 링크 요소 선택 (클릭 이벤트용)
        const titleLink = clone.querySelector(".video-title-link"); // 비디오 제목 링크 요소 선택 (클릭 이벤트용)
        
        link.href = `/html/video.html?video_id=${el.id}`;
        titleLink.href = `/html/video.html?video_id=${el.id}`;

        const avatarImg = clone.querySelector(".avatar-img"); // 아바타 이미지 선택

        // 아바타 클릭 시 해당 채널 페이지로 이동
        avatarImg.addEventListener("click", (e) => {
            e.stopPropagation(); // 부모 클릭 이벤트 방지
            window.location.href = `/html/channel.html?channel_id=${el.channel_id}`;
        });

        contents.appendChild(clone); // 완성된 비디오 카드를 #contents 영역에 추가
        

          // link?.addEventListener("click", (e) => {
          //     e.preventDefault();
          //     alert(`썸네일 클릭: ${el.title}`);
          // });

          // titleLink?.addEventListener("click", (e) => {
          //     e.preventDefault();
          //     alert(`비디오 제목 클릭: ${el.title}`);
          // });
        });
    
    })
}

export default insert_video_content

