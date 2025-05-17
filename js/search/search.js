// ------ 상단 바에서 검색 시 검색 결과를 가져오는 영역 -------
import insert_search_results from "../../components/searchComponents/js/insertSearchVideoList.js";
import normalize_for_search from "../util/stringNormalizer.js";
import {getTag} from "./tag_filter.js";
import add_scroll_menu from "../../components/homeComponents/js/insertHomeScrollMenu.js";
import { build_error_message, build_network_error } from "../errorHandling/buildErrorMessage.js";

// 검색어
const params = new URLSearchParams(window.location.search);
const query = decodeURIComponent(params.get("query") || "");

document.title = `${query} - YouTube`;
let video_total_list = [];
let video_tags = [];
const default_tag_menu = ['전체'];
let video_content_div;
let no_result_div;

// sanitizer
function escape_HTML(str) {
    return str.replace(/[&<>"']/g, function(match) {
        const escapeMap = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#39;'
        };
        return escapeMap[match];
    });
}

// 비디오 전체 목록 가져오기
async function get_video_list() {
    fetch("https://www.techfree-oreumi-api.ai.kr/video/getVideoList")
        .then(res => {
            if (!res.ok) build_network_error(res.status);
            return res.json();
        })
        .then(async data => {
            const normalized_query = normalize_for_search(query);
            document.querySelector("h1").textContent = `${escape_HTML(query)} 검색 결과`;

            if (query) {
                video_total_list = await get_video_query(data, normalized_query);
                const tags_set = new Set(data.map(video => video.tags).flat());
                video_tags = [default_tag_menu[0], ...Array.from(tags_set)];
                await add_scroll_menu(video_tags);
            }

            const {video_content, no_result} = await insert_search_results(query, video_total_list);
            video_content_div = video_content;
            no_result_div = no_result;
        })
        .catch(error => {
            if (error.name === "NetworkError") {
                build_error_message(error.message, document.querySelector("main"));
            } else {
                build_error_message("서버에서 에러가 발생했습니다.", document.querySelector("main"));
            }
        });
}

// 비디오 제목과 태그 검색
async function get_video_query(data, normalized_query) {
    const video_title_query = data.filter(video => {
        const normalized_title = normalize_for_search(video.title);
        return normalized_title.includes(normalized_query);
    });

    const video_tag_query = data.filter(video => {
        return video.tags.some(tag => {
            const normalized_tag = normalize_for_search(tag);
            return normalized_tag.includes(normalized_query);
        });
    });

    const title_query_set = new Set(video_title_query);
    const tag_query_set = new Set(video_tag_query);
    const total_query = Array.from(title_query_set.union(tag_query_set));
    const channel_ids = new Set(total_query.map(video => video.channel_id));
    const channel_info = await Promise.all(
        Array.from(channel_ids).map(async id => {
            return await get_channel_list(id);
        })
    );

    const total_info = total_query.map(video => {
        let channel_data = channel_info.find(channel => channel.id == video.channel_id);
        const {id, ...rest_channel_data} = channel_data || {};
        const renamed_channel_data = {channel_id: id, ...rest_channel_data};
        return {...video, ...renamed_channel_data};
    });

    return total_info;
}

// 채널 정보 가져오기
async function get_channel_list(channel_id) {
    return fetch(`https://www.techfree-oreumi-api.ai.kr/channel/getChannelInfo?id=${channel_id}`)
        .then(res => {
            if (!res.ok) build_network_error(res.status);
            return res.json();
        })
        .then(data => data)
        .catch(error => {
            if (error.name === "NetworkError") {
                build_error_message(error.message, document.querySelector("main"));
            } else {
                build_error_message("서버에서 에러가 발생했습니다.", document.querySelector("main"));
            }
        });
}

// 웹 페이지 로드 시 이벤트 처리
window.addEventListener('DOMContentLoaded', async function() {
    try {
        await get_video_list();

        document.querySelector("#search-header").classList.add("visible");
        document.querySelector("#contents").classList.add("visible");
        
    } catch(error) {
        if (error.name === "NetworkError") {
            build_error_message(error.message, document.querySelector("main"));
        } else {
            build_error_message("서버에서 에러가 발생했습니다.", document.querySelector("main"));
        }
    } finally {
        document.querySelector(".loading").classList.add("hidden");
    }
});

// 검색 결과 리스트에서 태그 필터링
async function filter_tags() {
    const tag_filter = getTag();
    const filtered_video_list = video_total_list.filter(
        video => video.tags.some(tag => tag.includes(tag_filter))
    ).map(video => video.id);

    filtered_video_display(filtered_video_list);
}

// 태그 필터에 걸린 항목만 표시
function filtered_video_display(video_list) {
    const container = document.getElementById("contents");

    if (video_list.length === 0) {
        video_content_div.forEach(content => {
            content.style.display = "none";
        });
        no_result_div.style.display = "flex";
    } else {
        no_result_div.style.display = "none";

        video_list.forEach(id => {
            const content = Array.from(video_content_div).find(div => Number(div.dataset.videoId) === id);
            if (content) {
                content.style.display = "flex";
                container.appendChild(content);
            }
        });
        video_content_div.forEach(content => {
            const video_id = Number(content.dataset.videoId);
            if (!video_list.includes(video_id)) {
                content.style.display = "none";
            }
        });
    }
}

// 필터 없을 때 전체 표시
function display_all_video() {
    no_result_div.style.display = "none";
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
        display_all_video();
    }
});

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
    const tag_filter = getTag();
    const target = date;
    let video_list = [];

    if (tag_filter && tag_filter !== '전체') { 
        video_list = video_total_list.filter(
            video => video.tags.some(tag => tag.includes(tag_filter))
        );
    } else {
        video_list = video_total_list;
    }

    const filtered_video_list = video_list.filter(video => {
        const videoDate = new Date(video.created_dt);
        return videoDate >= target;
        }).map(video => video.id);

    filtered_video_display(filtered_video_list);
};

const date_dropdown = document.getElementById("date-dropdown");

//버튼의 filter 타입에 따라 이벤트 다르게 반응
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
    let video_list = [];
    let sorted_list = [];
    video_content_div.forEach(content => {
        if (content.style.display == "flex" || content.style.display == ""){
            video_list.push(Number(content.dataset.videoId));
        }
    });
    const matchedVideos = video_total_list.filter(video =>
        video_list.includes(video.id)
    );

    switch (filter_type) {
        case "sort-views" :
            sorted_list = [...matchedVideos].sort((a, b) => Number(b.views) - Number(a.views));
            break;
        case "sort-date" :
            sorted_list = [...matchedVideos].sort((a, b) => new Date(b.created_dt) - new Date(a.created_dt));
            break;
        case "sort-likes" :
            sorted_list = [...matchedVideos].sort((a, b) => Number(b.likes) - Number(a.likes));
            break;
        default:
            break;
    }
    const sorted_ids = sorted_list.map(video => video.id);
    filtered_video_display(sorted_ids);
};

// 썸네일 이미지 비율 고정(240px일 경우)
function thumbnail_height() {
    const thumbnails = document.querySelectorAll('.thumbnail-box');
    thumbnails.forEach(el => {
        const width = el.offsetWidth;
        if (width === 240) {
            el.style.height = '139px';
        } else
        {
            el.style.height = '';
        };
    });
}

// 실행 시점
window.addEventListener('resize', thumbnail_height);
window.addEventListener('DOMContentLoaded', thumbnail_height);