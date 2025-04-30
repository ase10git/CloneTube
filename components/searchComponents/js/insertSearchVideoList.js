// ---- 검색 결과 템플릿으로 검색 결과 비디오 카드 생성 ----
import build_video_menu from "../../videoComponents/js/insertVideoMenu.js";
import timeCalculator from "../../../js/util/timeCalculator.js";
import viewsCalculator from "../../../js/util/viewsCalculator.js";

const public_url = '../../images/';

// 비디오 메뉴 수정
function edit_menu() {
    // 비디오 메뉴 가져오기
    let menu = build_video_menu("../images/");

    // 메뉴 아이템 제거(추천 관련 옵션 2개 제거)
    menu.removeChild(menu.childNodes[7]);
    menu.removeChild(menu.childNodes[7]);

    // 구분 바 요소 추가
    const service_bar = document.createElement("li");
    service_bar.classList.add("service-bar");

    // 신고 항목 위에 구분바 추가
    menu.insertBefore(service_bar, menu.childNodes[7]);

    return menu;
}

// 검색 결과가 없을 때 출력 내용 생성
function no_result_html(query) {
    const html_template = 
    `
    <div class="no-search-result">
        <div class="no-search-result-img-box">
            <img src="../../images/search-no-result.svg" alt="no-search-result">
        </div>
        <div>
            <span class="no-result-message">${query} 검색결과가 없습니다.</span>
        </div>
        <div>
            <span class="no-result-recommend">다른 검색어를 시도해 보거나 검색 필터를 삭제하세요.</span>
        </div>
    </div>
    `
    return html_template;
}

// 검색 결과 만들기
async function insert_search_results(query, total_info) {
    // 템플릿을 담을 태그
    const temp_div = document.createElement("div");

    // 탬플릿 가져오기
    fetch("../../components/searchComponents/html/searchVideoTemplate.html")
    .then(res => {
        if (!res.ok) {
            throw new Error("video template 불러오기 실패");
        }
        return res.text();
    })
    .then(data => {
        temp_div.innerHTML = data;
    
        // 비디오용 템플릿
        const template = temp_div.querySelector("#content-template").content;
    
        // home에서 비디오 목록을 넣을 위치
        const contents = document.querySelector("#contents");
    
        // 비디오 메뉴 가져오기
        const video_menu = edit_menu();

        // 결과 배열 길이에 따른 화면 처리
        if (total_info.length == 0) {
            contents.innerHTML = no_result_html(query);
        } else {
            // 검색한 비디오 데이터 출력
            // 결과가 있을 때 처리
            total_info.forEach(el => {
                // 복제할 DOM
                const clone = template.cloneNode(true);
                // 업로드한 날짜 계산
                const uploaded_time = timeCalculator(el.created_dt);
                const views = viewsCalculator(el.views, "kor");

                // 비디오 링크
                const video_link = clone.querySelectorAll(".video-link");
                video_link.forEach(link=>{
                    link.href = `video.html?video_id=${el.id}`;
                })

                // 채널 링크
                clone.querySelector(".channel-link").href = `channel.html?channel_id=${el.channel_id}`;

                // 요소에 넣기
                clone.querySelector(".thumbnail-img").id = el.id;
                clone.querySelector(".thumbnail-img").src = el.thumbnail;
                clone.querySelector(".thumbnail-img").alt = el.title;
                clone.querySelector(".video-title").textContent = el.title;
                clone.querySelector(".channel-name").textContent = el.channel_name;
                clone.querySelector(".spectator-number").textContent = `조회수 ${views}`;
                clone.querySelector(".upload-time").textContent = uploaded_time;
                clone.querySelector(".avatar-img").src = el.channel_profile;
                clone.querySelector(".video-description").textContent = el.description;
                clone.querySelector(".menu-list").innerHTML = video_menu.outerHTML;
                clone.querySelector(".btn-icon").src = public_url + "three-dots-vertical.svg";
                clone.querySelector(".btn-icon").alt = "dot-three-icon";

                contents.appendChild(clone);
            });
            
            // 비디오 메뉴 이벤트 처리
            const video_menu_all = document.querySelectorAll(".menu");
            // 메뉴 버튼 클릭 시 리스트 뜨는 이벤트 추가
            video_menu_all.forEach(el => {
                const menu_btn = el.querySelector(".menu-toggle-btn");
                const menu_list = el.querySelector(".menu-list");

                menu_btn.addEventListener("click", () => {
                    // 클릭 시점에서 버튼의 활성화 여부 판단
                    const is_active = menu_btn.classList.contains("active");

                    // 버튼 활성화 클래스 제거, 열려있는 메뉴 닫기
                    video_menu_all.forEach(target => {
                        target.querySelector(".menu-toggle-btn").classList.remove("active");
                        target.querySelector(".menu-list").classList.remove("active");
                    });
                    
                    // 버튼이 비활성화였다면 보이도록 표시
                    // 활성화 여부 active로 재설정
                    if (!is_active) {
                        menu_btn.classList.add("active");
                        menu_list.classList.add("active");
                    }
                });
            })
        }
    })
    .catch(error => {
        console.error("Error:", error);
    });
}


export default insert_search_results;