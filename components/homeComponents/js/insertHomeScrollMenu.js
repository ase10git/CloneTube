// ------ 스크롤형식의 메뉴 생성 및 추가 -------
import addScrollEvent from "../../scrollMenu/js/addScrollEvent.js";
import { setTag } from "../../../js/search/tag_filter.js";
import { build_error_message } from "../../../js/errorHandling/buildErrorMessage.js";

// 템플릿 결과를 담을 태그
const temp_div = document.createElement("div");

// 태그 버튼 메뉴 추가
async function add_scroll_menu(tag_menu) {
    fetch("../../components/scrollMenu/html/scrollMenuTemplate.html")
        .then(res => {
            if (!res.ok) {
                throw new Error("HTML template 불러오기 실패");
            }
            return res.text();
        })
        .then(data => {
            temp_div.innerHTML = data;
            const template = temp_div.querySelector("#scroll-menu").content;
            const scroll_wrap = template.querySelector(".scroll-menu-wrap");
            const target = document.querySelector("#btn-header");
            const menu_list = scroll_wrap.querySelector(".menu-list");

            tag_menu.forEach(el => {
                const item = document.createElement("li");
                const item_btn =  document.createElement("button");
                item_btn.textContent = el;
                item_btn.classList.add("menu-item-btn");
                item.appendChild(item_btn);
                menu_list.appendChild(item);
            });
            target.appendChild(scroll_wrap);

            const item_buttons = menu_list.querySelectorAll(".menu-item-btn");
            item_buttons.forEach(btn => {
                btn.addEventListener("click", (e)=>{
                    item_buttons.forEach(btn => btn.classList.remove("selected"));
                    btn.classList.add("selected");
                    setTag(e.target.textContent);
                });
            });
            
            addScrollEvent(scroll_wrap);
        })
        .catch(err => {
            const message = "비디오 템플릿 파일을 가져오는데 실패했습니다. 네트워크 연결 상태를 확인하거나 파일의 위치를 다시 확인해주세요";
            build_error_message(message, document.querySelector("main"));
        });
}

export default add_scroll_menu;