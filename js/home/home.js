import insert_video_content from "../../components/homeComponents/js/insertVideoContents.js";
import { getTag } from "../search/tag_filter.js";
import add_scroll_menu from "../../components/homeComponents/js/insertHomeScrollMenu.js";
import { build_error_message, build_network_error } from "../errorHandling/buildErrorMessage.js";

// 가져온 전체 비디오 내용
let video_total_list = [];
let video_tags = [];
const default_tag_menu = ['전체', '최근에 업로드된 동영상'];
let video_content_div;

// API에서 비디오 목록 가져오기
async function get_video_list() {
    fetch("https://www.techfree-oreumi-api.ai.kr/video/getVideoList")
    .then(res => {
        if (!res.ok) build_network_error(res.status);
        return res.json();
    })
    .then(async data => {
        if (data === null || data.length === 0) {
            throw new Error("server error");
        }

        video_total_list = data;
        const tags_set = new Set(data.map(video => video.tags).flat());
        if (tags_set.size === 0) {
            video_tags = default_tag_menu;
        } else {
            video_tags = [default_tag_menu[0], ...Array.from(tags_set), default_tag_menu[1]];
        }
        await add_scroll_menu(video_tags);

        const channel_ids = new Set(video_total_list.map(video => video.channel_id));

        let channel_info = [];
        try {
            channel_info = await Promise.all(
                Array.from(channel_ids).map(id => get_channel_info(id))
            );
        } catch (error) {
            throw error;
        }

        const total_info = video_total_list.map(video => {
            let channel_data = channel_info.find(channel => channel.id == video.channel_id);
            if (channel_data === undefined || channel_data === null) return;
            const {id, ...rest_channel_data} = channel_data || {};
            const renamed_channel_data = {channel_id: id, ...rest_channel_data};
            return {...video, ...renamed_channel_data};
        });
        
        try {
            const {video_content} = await insert_video_content(total_info);
            video_content_div = video_content;
        } catch (error) {
            throw error;
        }
        
    })
    .catch(error => {
        if (error.name === "NetworkError") {
            build_error_message(error.message, document.querySelector("main"));
        } else {
            build_error_message("서버에서 에러가 발생했습니다.", document.querySelector("main"));
        }
    });
}

// 채널 정보 요청
async function get_channel_info(channel_id) {
    return fetch(`https://www.techfree-oreumi-api.ai.kr/channel/getChannelInfo?id=${channel_id}`)
        .then(res => {
            if (!res.ok) build_network_error(res.status);
            return res.json();
        })
        .then(data => data)
        .catch(error => { 
            throw error; });
}

// 비디오 가져오기
window.addEventListener('DOMContentLoaded', async function () {
    try {
        await get_video_list();
        document.querySelector("#btn-header").classList.add("visible");
        document.querySelector("#contents").classList.add("visible");
    }
    catch (error) {
        build_error_message("서버에서 에러가 발생했습니다.", document.querySelector("main"));
    } finally {
        document.querySelector(".loading").classList.add("hidden");
    }
});

// 업로드 시간 비교
function compare_upload_time(created_dt) {
    const now = new Date();
    const past = new Date(created_dt).getTime();
    const diffInSeconds = Math.floor((now - past) / 1000);
    return diffInSeconds;
}

// 태그 필터링
async function filter_tags() {
    const tag_filter = getTag();
    let filtered_video_list = [];

    if (tag_filter === '최근에 업로드된 동영상') {
        filtered_video_list = video_total_list.filter(video => {
                return compare_upload_time(video.created_dt) < 2592000;
            }
        ).map(video => video.id);
    } else {
        filtered_video_list = video_total_list.filter(
            video => video.tags.some(tag => tag.includes(tag_filter))
        ).map(video => video.id);
    }
    filtered_video_display(filtered_video_list);
}

// 태그 필터에 걸린 항목만 표시
function filtered_video_display(video_list) {
    if (video_list.length === 0) {
        video_content_div.forEach(content => {
            content.style.display = "none";
        });
    } else {
        video_content_div.forEach(content => {
            const video_id = Number(content.dataset.videoId);
            if (video_list.includes(video_id)) {
                content.style.display = "block";
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
    try {
        const tag_filter = getTag();
        if (tag_filter && tag_filter !== '전체') { 
            filter_tags();
        } else {
            // 표시할 결과 생성
            display_all_video();
        }
    } catch (error) {
        const error_message = "서버에서 에러가 발생했습니다";
        build_error_message(error_message, document.querySelector("main"));
    }
});
