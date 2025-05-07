// ------ 상단 바에서 검색 시 검색 결과를 가져오는 영역 -------
import insert_search_results from "../../components/searchComponents/js/insertSearchVideoList.js";
import {getTag} from "./tag_filter.js";

// 검색어
// 한글 검색을 위한 URI decoding 처리
const params = new URLSearchParams(window.location.search);
const query = decodeURIComponent(params.get("query") || "");

// 가져온 전체 비디오 내용
let video_total_list = [];

// 검색 결과 비디오 카드
let video_content_div;
// 검색 결과 없을 때 표시용 div
let no_result_div;

// 검색어 키워드와 비디오 제목의 공백 무시, 소문자로 치환, 부분 문자열 검사 진행
function normalize_for_search(str) {
    return str
        .normalize("NFD") // 조합형 문자 분해 (Café 등)
        .replace(/[\u0300-\u036f]/g, "") // 결합 문자 제거 (Café 등)
        .replace(/\s+/g, " ") // 중복 공백 정리
        .trim() // 앞 뒤 공백 제거
        .toLowerCase(); // 소문자 처리
}

// 비디오 전체 목록 가져오기
async function get_video_list() {
    // api 요청
    fetch("http://techfree-oreumi-api.kro.kr:5000/video/getVideoList")
        .then(res => {
            if (!res.ok) {
                throw new Error("Video list 불러오기 실패");
            }
            return res.json();
        })
        .then(async data => {
            // 검색 키워드 가공
            const normalized_query = normalize_for_search(query);

            // 검색어가 있을 때만 검색 요청 처리
            if (query) {
                // 비디오와 채널 정보를 담은 배열
                // 비디오 제목 검색 + 비디오 태그 검색 결과
                // 전역 변수에 비디오 목록 저장
                video_total_list = await get_video_query(data, normalized_query);
            }

            // 표시할 결과 생성
            const {video_content, no_result} = await insert_search_results(query, video_total_list);
            video_content_div = video_content;
            no_result_div = no_result;
        })
        .catch(error => {
            // console.error("Error:", error);
        });
}

// 비디오 제목과 태그 검색
async function get_video_query(data, normalized_query) {
    // 비디오 제목에 검색어를 포함하는 경우만 추출

    console.log(data)
    const video_title_query = data.filter(video => {
        // 비디오 제목의 공백 무시, 소문자 치환, 부분 문자열 검사 준비
        const normalized_title = normalize_for_search(video.title);
        return normalized_title.includes(normalized_query);
    });

    // 비디오 태그에 검색어를 포함하는 경우만 추출
    const video_tag_query = data.filter(video => {
        // 조건(테스트 함수)를 만족하는 요소가 있는지 찾음
        return video.tags.some(tag => {
            const normalized_tag = normalize_for_search(tag);
            return normalized_tag.includes(normalized_query);
        });
    });

    // 검색 결과 배열을 Set로 생성 - 합칠 때 중복 제거용
    const title_query_set = new Set(video_title_query);
    const tag_query_set = new Set(video_tag_query);

    // 검색 결과 합치기
    const total_query = Array.from(title_query_set.union(tag_query_set));

    // 각 비디오의 채널 정보 가져오기
    const channel_ids = new Set(total_query.map(video => video.channel_id));

    // 채널 id로 채널 정보 가져오기
    const channel_info = await Promise.all(
        Array.from(channel_ids).map(async id => {
            return await get_channel_list(id);
        })
    );

    // 비디오 정보와 채널 정보를 담은 새 배열 생성
    // 채널 정보를 가져오는 비동기 함수의 모든 결과가 나왔을 때 제대로 된 데이터 출력
    const total_info = total_query.map(video => {
        // 비디오 정보의 채널 id와 채널 정보의 채널 id가 같은 채널 정보 찾기
        let channel_data = channel_info.find(channel => channel.id == video.channel_id);
        // id = channel.id, 그 외에는 각 대응되는 변수 이름에 저장
        const {id, ...rest_channel_data} = channel_data || {};
        // 채널 데이터의 key를 가공한 새 채널 데이터 객체 생성
        const renamed_channel_data = {channel_id: id, ...rest_channel_data};
        // 비디오 정보와 채널 데이터를 합친 객체 생성
        return {...video, ...renamed_channel_data};
    });

    return total_info;
}

// 채널 정보 가져오기
async function get_channel_list(channel_id) {
    // api 요청
    return fetch(`http://techfree-oreumi-api.kro.kr:5000/channel/getChannelInfo?id=${channel_id}`)
        .then(res => {
            if (!res.ok) {
                throw new Error("Channel 정보 불러오기 실패");
            }
            return res.json();
        })
        .then(data => data)
        .catch(error => {
            //console.error("Error:", error);
        });
}

// 웹 페이지 로드 시 이벤트 처리
window.addEventListener('DOMContentLoaded', get_video_list);

// ---------- 검색 결과 태그 필터링 동작 ---------- //
// 검색 결과 리스트에서 태그 필터링
async function filter_tags() {
    // 버튼으로 설정된 태그 가져오기
    const tag_filter = getTag();
    
    // 검색 결과에서 태그를 포함하는 동영상의 id만 추출
    const filtered_video_list = video_total_list.filter(
        video => video.tags.some(tag => tag.includes(tag_filter))
    ).map(video => video.id);

    // 표시할 결과 생성
    filtered_video_display(filtered_video_list);
}

// 태그 필터에 걸린 항목만 표시
function filtered_video_display(video_list) {
    // 태그 필터에 해당하는 항목이 없을 때의 표시
    if (video_list.length === 0) {
        video_content_div.forEach(content => {
            content.style.display = "none";
        });
        no_result_div.style.display = "flex";
    } else {
        // 태그 필터에 해당하는 항목이 1개 이상일 때 표시
        no_result_div.style.display = "none";

        video_content_div.forEach(content => {
            // content div에 있는 비디오 id 가져오기
            const video_id = Number(content.dataset.videoId);
            // 태그 필터링 대상에 따른 표시 여부
            if (video_list.includes(video_id)) {
                content.style.display = "flex";
            } else {
                content.style.display = "none";
            }
        });
    }
}

// 필터 없을 때 전체 표시
function display_all_video() {
    video_content_div.forEach(content => {
        content.style.display = "flex";
    });
}

// 태그 버튼 이벤트로 태그 변동 시 검색 결과에 필터링 적용
document.addEventListener('tagChanged', function () {
    const tag_filter = getTag();
    if (tag_filter && tag_filter !== '전체') { 
        filter_tags();
    } else {
        // 표시할 결과 생성
        display_all_video();
    }
});


// ---------- 날짜 필터링 동작 ---------- //
// 클릭 시 필터 조건 나타나게
const filter_btn = document.getElementById("search-filter");
const filter_dropdown = document.getElementById("filter-dropdown");

filter_btn.addEventListener("click", function () {

    if (filter_dropdown.style.display == "flex") {
        filter_dropdown.style.display = "none";
    } else {
        filter_dropdown.style.display = "flex";
    }
});

// 검색,태그 결과 리스트에서 필터링
async function detail_filter_tags(date) {
    // 버튼으로 설정된 타겟 날짜 가져오기
    const tag_filter = getTag();
    const target = date;
    let video_list = [];

    //태그 유무에 따른 비디오 리스트 설정
    if (tag_filter && tag_filter !== '전체') { 
        video_list = video_total_list.filter(
            video => video.tags.some(tag => tag.includes(tag_filter))
        );
    } else {
        video_list = video_total_list;
    }

    //날짜 필터에 따른 비디오 리스트 설정
    const filtered_video_list = video_list.filter(video => {
        const videoDate = new Date(video.created_dt);
        return videoDate >= target;
        }).map(video => video.id);

    // 표시할 결과 생성
    filtered_video_display(filtered_video_list);
};

const date_dropdown = document.getElementById("date-dropdown");

date_dropdown.addEventListener('click', function (e) {
    if (e.target.tagName === "BUTTON") {
        const filter_type = e.target.dataset.filter;
        applyDateFilter(filter_type);
    }
});

function applyDateFilter(filter_type) {
    const now = new Date();
    let startDate;

    switch (filter_type) {
        case "1hour":
            startDate = new Date(now.getTime() - 60 * 60 * 1000);
            break;
        case "today":
            startDate = new Date(now.setHours(0, 0, 0, 0));
            break;
        case "week":
            startDate = new Date(now.setDate(now.getDate() - 7));
            break;
        case "month":
            startDate = new Date(now.setMonth(now.getMonth() - 1));
            break;
        case "year":
            startDate = new Date(now.setFullYear(now.getFullYear() - 1));
            break;
        default:
            return;
    }

    detail_filter_tags(startDate);
}

// ---------- 정렬 필터링 동작 ---------- //
const sort_dropdown = document.getElementById("sort-dropdown");

sort_dropdown.addEventListener('click', function (e) {
    if (e.target.tagName === "BUTTON") {
        const filter_type = e.target.dataset.filter;
        video_sort(filter_type);
    }
});

function video_sort(filter_type) {
    //created_dt, likes, views

    let video_list = [];
    video_content_div.forEach(content => {
        if (content.style.display == "flex" || content.style.display == ""){
            video_list.push(content.dataset.videoId);
        }
    });

    switch (filter_type) {
        case "sort-views" :
            {
                video_total_list.filter(video =>
                    video_list.includes(video.id)
                );
                console.log(video_total_list);
            }
            break;
        case "sort-date" :
            break;
        case "sort-likes" :
            break;
        default:
            break;
    }
    console.log(video_list);

    return video_list;
};

function sort_list(list, value) {
    
};