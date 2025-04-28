// ------ 비디오 페이지의 관련 동영상 추천 목록 추가 ------
import menu_titles from "./videoMenuList.js";
import video_menu_template from "../js/videoMenu.js";

const temp_div = document.createElement("div");

function build_video_menu(public_url) {
    // 문자열로 로드된 HTML을 DOM으로 파싱
    temp_div.innerHTML = video_menu_template;

    // 메뉴 아이템 태그
    const menu = temp_div.querySelector(".menu-items");
    let menu_item = temp_div.querySelector(".menu-item");

    // ul 템플릿 내 li 요소 제거
    menu.removeChild(menu_item);

    menu_titles.forEach(el => {
        const clone = menu_item.cloneNode(true);
        // 요소 수정
        clone.querySelector(".menu-icon-img").src = public_url + el.img_name;
        clone.querySelector(".menu-icon-img").alt = el.img_name;
        clone.querySelector(".menu-name").textContent = el.title;
        menu.appendChild(clone);
    });

    return menu;
}

export default build_video_menu;
