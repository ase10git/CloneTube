// ------ 스크롤형식의 메뉴 생성 및 추가 -------
import addScrollEvent from "../../scrollMenu/js/addScrollEvent.js";
import { setTag } from "../../../js/search/tag_filter.js";
import { build_error_message } from "../../../js/errorHandling/buildErrorMessage.js";

// 템플릿 결과를 담을 태그
const temp_div = document.createElement("div");

// 태그 버튼 메뉴 추가
async function add_scroll_menu(tag_menu) {
    // 템플릿으로 스크롤 메뉴 가져오기
    fetch("../../components/scrollMenu/html/scrollMenuTemplate.html")
        .then(res => {
            if (!res.ok) {
                throw new Error("HTML template 불러오기 실패");
            }
            return res.text();
        })
        .then(data => {
            temp_div.innerHTML = data;

            // 템플릿
            const template = temp_div.querySelector("#scroll-menu").content;

            // 스크롤 메뉴 전체 박스
            const scroll_wrap = template.querySelector(".scroll-menu-wrap");

            // index.html에서 비디오 목록을 넣을 위치
            const target = document.querySelector("#btn-header");

            // 템플릿에서 목록 아이템을 넣을 위치
            const menu_list = scroll_wrap.querySelector(".menu-list");

            // 태그 버튼 생성 및 등록
            tag_menu.forEach(el => {
                // 리스트 아이템
                const item = document.createElement("li");
                // 버튼 태그
                const item_btn =  document.createElement("button");
                item_btn.textContent = el;
                item_btn.classList.add("menu-item-btn");

                // 버튼과 li를 추가
                item.appendChild(item_btn);
                menu_list.appendChild(item);
            });
            target.appendChild(scroll_wrap);

            // 추가된 태그 버튼 가져오기
            const item_buttons = menu_list.querySelectorAll(".menu-item-btn");

            // 버튼 클릭 시 내용을 표시하는 이벤트 리스너
            item_buttons.forEach(btn => {
                btn.addEventListener("click", (e)=>{
                    // 모든 버튼의 선택된 버튼 스타일 제거
                    item_buttons.forEach(btn => btn.classList.remove("selected"));
                    // 선택된 버튼 스타일 추가
                    btn.classList.add("selected");
                    // 선택한 버튼의 태그 내용을 tag 변수에 저장
                    setTag(e.target.textContent);
                });
            });
            
            // 스크롤 이벤트 추가
            addScrollEvent(scroll_wrap);
        })
        .catch(err => {
            const message = "비디오 템플릿 파일을 가져오는데 실패했습니다. 네트워크 연결 상태를 확인하거나 파일의 위치를 다시 확인해주세요";
            build_error_message(message, document.querySelector("main"));
        });
}

export default add_scroll_menu;