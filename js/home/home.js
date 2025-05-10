import insert_video_content from "../../components/homeComponents/js/insertVideoContents.js";
import { getTag } from "../search/tag_filter.js";
import add_scroll_menu from "../../components/homeComponents/js/insertHomeScrollMenu.js";
import { build_error_message, build_network_error } from "../errorHandling/buildErrorMessage.js";

// 가져온 전체 비디오 내용
let video_total_list = [];

// 비디오 내의 태그 목록
let video_tags = [];
// 기본 태그 목록
const default_tag_menu = ['전체', '최근에 업로드된 동영상'];

// 비디오 카드
let video_content_div;


// API에서 비디오 목록 가져오기
async function get_video_list() {
    // api 요청
    fetch("http://techfree-oreumi-api.kro.kr:5000/video/getVideoList")
    .then(res => {
        if (!res.ok) build_network_error(res.status);
        return res.json();
    })
    .then(async data => {
        if (data === null || data.length === 0) {
            throw new Error("server error");
        }

        // 변수에 전체 비디오 목록 저장
        video_total_list = data;

        // 비디오 전체의 태그 목록을 변수에 저장
        const tags_set = new Set(data.map(video => video.tags).flat());
        if (tags_set.size === 0) {
            video_tags = default_tag_menu;
        } else {
            video_tags = [default_tag_menu[0], ...Array.from(tags_set), default_tag_menu[1]];
        }

        // 스크롤 메뉴 생성
        await add_scroll_menu(video_tags);

        // 각 비디오의 채널 id만 추출
        const channel_ids = new Set(video_total_list.map(video => video.channel_id));

        // 채널 id로 채널 정보 가져오기
        let channel_info = [];
        try {
            channel_info = await Promise.all(
                Array.from(channel_ids).map(id => get_channel_info(id))
            );
        } catch (error) {
            throw error;
        }

        // 비디오 정보와 채널 정보를 담은 새 배열 생성
        const total_info = video_total_list.map(video => {
            // 비디오 정보의 채널 id와 채널 정보의 채널 id가 같은 채널 정보 찾기
            let channel_data = channel_info.find(channel => channel.id == video.channel_id);
            if (channel_data === undefined || channel_data === null) return;
            // id = channel.id, 그 외에는 각 대응되는 변수 이름에 저장
            const {id, ...rest_channel_data} = channel_data || {};
            // 채널 데이터의 key를 가공한 새 채널 데이터 객체 생성
            const renamed_channel_data = {channel_id: id, ...rest_channel_data};
            // 비디오 정보와 채널 데이터를 합친 객체 생성
            return {...video, ...renamed_channel_data};
        });
        
        // 비디오 목록을 화면에 추가
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
    // api 요청
    return fetch(`http://techfree-oreumi-api.kro.kr:5000/channel/getChannelInfo?id=${channel_id}`)
        .then(res => {
            if (!res.ok) build_network_error(res.status);
            return res.json();
        })
        .then(data => data)
        .catch(error => { 
            throw error; });
}

// 비디오 가져오기
window.addEventListener('DOMContentLoaded', get_video_list);

// ---------- 검색 결과 태그 필터링 동작 ---------- //
// 업로드 시간 비교
function compare_upload_time(created_dt) {
    const now = new Date();
    const past = new Date(created_dt).getTime(); // 대상 날짜(밀리초 단위)

    // 두 시간 차이를 계산(초 단위)
    const diffInSeconds = Math.floor((now - past) / 1000);
    return diffInSeconds;
}

// 태그 필터링
async function filter_tags() {
    // 버튼으로 설정된 태그 가져오기
    const tag_filter = getTag();
    let filtered_video_list = [];

    if (tag_filter === '최근에 업로드된 동영상') {
        filtered_video_list = video_total_list.filter(video => {
                // 업로드가 일주일 이내인 경우만 출력
                return compare_upload_time(video.created_dt) < 2592000;
            }
        ).map(video => video.id);
    } else {
        // 검색 결과에서 태그를 포함하는 동영상의 id만 추출
        filtered_video_list = video_total_list.filter(
            video => video.tags.some(tag => tag.includes(tag_filter))
        ).map(video => video.id);
    }
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
    } else {
        // 태그 필터에 해당하는 항목이 1개 이상일 때 표시
        video_content_div.forEach(content => {
            // content div에 있는 비디오 id 가져오기
            const video_id = Number(content.dataset.videoId);
            // 태그 필터링 대상에 따른 표시 여부
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
