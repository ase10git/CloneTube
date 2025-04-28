// ------ 비디오 페이지의 관련 동영상 추천 목록 추가 ------

// 비디오 메뉴 정보
const menu_titles = [
    {title: '현재 재생목록에 추가', img_name: 'list-play.svg'},
    {title: '나중에 볼 동영상에 저장', img_name: 'clock.svg'},
    {title: '재생목록에 저장', img_name: 'bookmark.svg'},
    {title: '오프라인 저장', img_name: 'download.svg'},
    {title: '공유', img_name: 'share_arrow.svg'},
    {title: '관심 없음', img_name: 'ban.svg'},
    {title: '채널 추천 안함', img_name: 'dash-circle.svg'},
    {title: '신고', img_name: 'report-history.svg'},
];

// 비디오 메뉴 태그
const video_menu_template = `
    <ul class="menu-items">

        <li class="menu-item">
            <button class="menu-btn">
                <span class="menu-item-line">
                    <div class="menu-icon-box">
                        <img src="" alt="" class="menu-icon-img">
                    </div>
                </span>
                <span class="menu-name"></span>
            </button>
        </li>
        
    </ul>
`;

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
