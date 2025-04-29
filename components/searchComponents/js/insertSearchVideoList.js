// ---- 검색 결과 템플릿으로 검색 결과 비디오 카드 생성 ----
import build_video_menu from "../../videoComponents/js/insertVideoMenu.js";

const public_url = '../../images/';

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
        const menu = build_video_menu("../images/");

        // 결과 배열 길이에 따른 화면 처리
        if (total_info.length == 0) {
            // 결과가 없을 때 처리
            const result_div = document.createElement("div");
            result_div.classList.add("search-result");
            result_div.textContent = `'${query}' 검색 결과가 없습니다.`;
            contents.appendChild(result_div);
            return;
        } else {
            // 결과가 있을 때 처리
            total_info.forEach(el => {
                const clone = template.cloneNode(true);
                clone.querySelector(".thumbnail-img").src = el.thumbnail;
                clone.querySelector(".thumbnail-img").alt = el.title;
                clone.querySelector(".video-title").textContent = el.title;
                clone.querySelector(".channel-name").textContent = el.channel_name;
                clone.querySelector(".spectator-number").textContent = `조회수 ${el.views}`;
                clone.querySelector(".upload-time").textContent = el.uploaded_time;
                clone.querySelector(".avatar-img").src = el.channel_profile;
                clone.querySelector(".video-description").textContent = el.description;
                clone.querySelector(".menu-list").innerHTML = menu.outerHTML;
                clone.querySelector(".btn-icon").src = public_url + "three-dots-vertical.svg";
                clone.querySelector(".btn-icon").alt = "dot-three-icon";
                contents.appendChild(clone);
            });
        }
    })
    .catch(error => {
        console.error("Error:", error);
    });
}

export default insert_search_results;