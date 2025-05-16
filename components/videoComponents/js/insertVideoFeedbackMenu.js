// ------ 동영상의 메뉴 리스트(좋아요, 공유 등) 생성 ------
import { viewsUnit } from "./formUnit.js";

// 상시 표시용 메뉴 목록
const feedback_list = [
    {id: "like", name: "", img_src: "thumbsup.svg", need_invert: false, count: 100, liked: false},
    {id: "dislike", name: "", img_src: "DisLiked.svg", need_invert: false},
    {id: "share", name: "공유", img_src: "sharearrow.svg", need_invert: false},
]

// 반응형에 따라 다르게 표시되는 메뉴 목록
const feedback_list_dynamic = [
    {id: "save", name: "저장", img_src: "listsave.svg", need_invert: false},
    {id: "clip", name: "클립", img_src: "scissors.svg", need_invert: true},
]

// 항상 드랍메뉴에 있는 메뉴 목록
const feedback_list_hidden = [
    {id: "download", name: "오프라인 저장", img_src: "download.svg", need_invert: true},
    {id: "report", name: "신고", img_src: "reporthistory.svg", need_invert: false},
]

// 비디오 메뉴 태그
const video_menu = document.querySelector("#video-menu");

// 메뉴 버튼 추가 함수
function append_element(element, parentElement) {
    // 버튼 태그 생성
    const item = document.createElement("button");
    item.id = `${element.id}`;

    // 메뉴 버튼 양식
    let menu_item_html = 
    `<div class="menu-icon-box">
        <img src="../images/icon/${element.img_src}" alt="${element.name}" class="icon-img">
    </div>
    <div class="menu-option-name" id="menu-${element.id}">
        ${(element.id === "like") 
            ? `<span class="like-text">${element.name}</span> <span class="like-count">${element.count ?? 0}</span>` 
            : element.name}
    </div>`;

    // 버튼을 부모 요소에 추가
    item.innerHTML = menu_item_html;
    item.classList.add("video-menu-btn");
    //이미지 색 반전 주기 위해
    if (element.need_invert) {
        item.querySelector(".icon-img").classList.add('invert');
    } else {
        item.querySelector(".icon-img").classList.add('no-invert');
    }  

    // 좋아요 버튼 토글 기능
    if (element.id === "like") {
        item.addEventListener("click", function () {
            const countSpan = item.querySelector(".like-count");
            let current = parseInt(countSpan.dataset.likes);
            
            element.liked = !element.liked;
            countSpan.textContent = element.liked ? viewsUnit(current+1) : viewsUnit(current);
        });
    }

    parentElement.appendChild(item);
}

// 더보기 버튼 추가 함수
function append_show_more_btn() {
    // 버튼 태그 생성 및 클래스와 id 지정
    const show_more_btn = document.createElement("button");
    show_more_btn.id = "menu-show-more";
    show_more_btn.classList.add("video-menu-btn");
    
    // 더보기 버튼 양식
    show_more_btn.innerHTML = 
    `<div class="menu-icon-box">
        <img src="../../../images/icon/threedots.svg" alt="show-more-three-dots" class="icon-img-dots">
    </div>`;

    // 버튼을 부모 요소에 추가
    video_menu.appendChild(show_more_btn);


    // 비디오 메뉴버튼 더보기 클릭 시 나타나게
    show_more_btn.addEventListener('click', function () {
        const dropbox = document.getElementById("video-menu-dropbox");
        
        if (dropbox.style.display === "flex") {
            dropbox.style.display = "none";
        } else {
            dropbox.style.display = "flex";
        };
    });
}

// 비디오 메뉴 버튼을 생성하여 HTML에 추가
function build_menu() {
    // 표시 비디오 메뉴 생성
    const view_menu = document.createElement("div");
    view_menu.id = "video-menu-views";

    // 상시 표시용 메뉴 추가
    feedback_list.forEach(el=>{
        append_element(el, view_menu);
    });

    // 드랍 메뉴 생성
    const drop_menu = document.createElement("div");
    drop_menu.id = "video-menu-dropbox";

    // 동적 메뉴 추가
    feedback_list_dynamic.forEach(el=>{
        append_element(el, view_menu);
        append_element(el, drop_menu);
    })

    // 항상 드랍다운에 있는 메뉴 추가
    feedback_list_hidden.forEach(el=>{
        append_element(el, drop_menu);
    });


    // 메뉴 추가
    video_menu.appendChild(view_menu);
    // 더보기 버튼 추가
    append_show_more_btn();
    video_menu.appendChild(drop_menu);
}

document.addEventListener("DOMContentLoaded", build_menu);
