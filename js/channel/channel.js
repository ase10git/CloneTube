import timeCalculator from '../util/timeCalculator.js';
import {subscribersUnit, viewsUnit} from "../../components/videoComponents/js/formUnit.js";
import insert_video_scroll from '../../components/channelComponents/js/insertVideoScroll.js';
import insert_video_menu from '../../components/channelComponents/js/insertChannelVideoMenu.js';
import { build_error_message, build_network_error } from "../errorHandling/buildErrorMessage.js";

let subscriberCount = 0;

// 동영상 목록
let video_list = [];
let filtered_list = [];
let video_tags = {};

const urlParams = new URLSearchParams(window.location.search);
const channelId = urlParams.get('channel_id');
const query = urlParams.get('query')?.toLowerCase(); // 검색어 소문자 처리

document.addEventListener("DOMContentLoaded", async function () {
    try {
        //console.log("DOM fully loaded and parsed");
        // setupSubscribeButton(); // 구독 버튼

        // 채널 정보를 가져온 뒤 동영상 정보 가져오기
        await fetchChannelInfo(); // 채널 정보
        fetchVideosAndRender(); // 영상 목록

        // 채널 정보 작업 완료 시 메인 표시, 로딩중 숨김
        document.querySelector("#channel-header").classList.add("visible");
        document.querySelector("#channel-section").classList.add("visible");

        // 해시(#)와 검색(?query) 따라 탭에 맞는 출력 조절
        function handleSectionDisplay() {
            const hash = window.location.hash.substring(1); // URL 해시 가져오기

            const video_section = document.querySelector("#video-section");
            const main_video = document.querySelector("#main-video");
            const playlist_main = document.querySelector("#playlist-main");

            if (hash === "home" || !hash) {
                main_video.classList.remove("hidden");
                video_section.classList.remove("visible");
                playlist_main.classList.remove("hidden", "playlist-tab");
            } else if (hash === "videos") {
                main_video.classList.add("hidden");
                video_section.classList.add("visible");
                playlist_main.classList.add("hidden");
                playlist_main.classList.remove("playlist-tab");
            } else if (hash === "playlists") {
                main_video.classList.add("hidden");
                video_section.classList.remove("visible");
                playlist_main.classList.remove("hidden");
                playlist_main.classList.add("playlist-tab");
            } else {
                main_video.classList.add("hidden");
                video_section.classList.remove("visible");
                playlist_main.classList.add("hidden");
                playlist_main.classList.remove("playlist-tab");
            }

            if (query) {
                main_video.classList.add("hidden");
                video_section.classList.add("visible");
                playlist_main.classList.add("hidden");
                playlist_main.classList.remove("playlist-tab");
            }
        }


        // 이벤트 등록
        window.addEventListener("load", handleSectionDisplay);
        window.addEventListener("hashchange", handleSectionDisplay);
    } catch (error) {
        if (error.name === "NetworkError") {
            build_error_message(error.message, document.querySelector("main"));
        } else {
            build_error_message("서버에서 에러가 발생했습니다.", document.querySelector("main"));
        }
    } finally {
        document.querySelector(".loading").classList.add("hidden");
    }
});

let isSubscribed = false;

// 구독 버튼
// function setupSubscribeButton() {
    const subscribeButton = document.getElementById('button-subscribe');
    subscribeButton.addEventListener('click', () => {
        if (isSubscribed) {
            // subscriberCount -= 1;
            subscribeButton.textContent = "구독";
            isSubscribed = false;
        } else {
            // subscriberCount += 1;
            subscribeButton.textContent = "구독중";
            isSubscribed = true;
        }
    });
// }

// 채널 정보
async function fetchChannelInfo() {
    const urlParams = new URLSearchParams(window.location.search);
    const channelId = urlParams.get('channel_id');

    if (!channelId) {
        build_network_error(404);
    }

    fetch(`https://www.techfree-oreumi-api.ai.kr/channel/getChannelInfo?id=${channelId}`)
    .then(response => {
        if (!response.ok) build_network_error(response.status);
        return response.json();
    })
    .then(channelData => {
        subscriberCount = channelData.subscribers;
        document.getElementById('channel-name').textContent = channelData.channel_name;
        document.getElementById('subscribers').textContent = `구독자 ${subscribersUnit(subscriberCount)}명`;
        document.getElementById('channel-cover-img').src = channelData.channel_banner;
        document.getElementById('channel-profile-img').src = channelData.channel_profile;
        // setupSubscribeButton();
    
        // 문서 title을 채널 이름으로 변경
        document.title = channelData.channel_name;
    })
    .catch(error=>{
        if (error.name === "NetworkError") {
            build_error_message(error.message, document.querySelector("main"));
        } else {
            build_error_message("서버에서 에러가 발생했습니다.", document.querySelector("main"));
        }
    });
}

// 메인 비디오
function renderMainVideo(video) {
    if (!video) {
        console.warn("표시할 메인 비디오가 없습니다.");
        return;
    }

    // 영상 소스 삽입
    const source = document.querySelector('#main-video video source');
    source.src = `https://storage.googleapis.com/youtube-clone-video/${video.id}.mp4`;

    // video 태그 재로드 (src 변경 시 필요)
    const videoElement = document.querySelector('#main-video video');
    videoElement.load();

    // 텍스트 정보 삽입
    document.getElementById('video-title').textContent = video.title;
    document.getElementById('video-title').href = `video.html?video_id=${video.id}`;
    document.getElementById('spectators').textContent = `조회수 ${viewsUnit(video.views)}회`;
    document.getElementById('uploaded-time').textContent = timeCalculator(video.created_dt);
    document.getElementById('video-description').textContent = video.description;
}

// 영상 목록
function fetchVideosAndRender() {
    if (!channelId) {
        build_network_error(404);
    }

    fetch(`https://www.techfree-oreumi-api.ai.kr/video/getChannelVideoList?channel_id=${channelId}`)
        .then(response => {
            if(!response.ok) build_network_error(response.status);
            return response.json();
        })
        .then(data => {
            // 메인 비디오는 최신
            const sortedVideos = data.sort((a, b) => new Date(b.created_dt) - new Date(a.created_dt));
            const latestVideo = sortedVideos[0];
            renderMainVideo(latestVideo);

            // 동영상 목록 저장 - 최신순
            video_list = sortedVideos;

            // 태그 빈도 계산
            const best_tags = getFrequentTag(data);

            //  검색어가 있다면 title, description, tags 기준으로 필터링
            const filteredVideos = query
                ? data.filter(video => {
                    const title = video.title?.toLowerCase() || '';
                    const description = video.description?.toLowerCase() || '';
                    const tags = Array.isArray(video.tags) ? video.tags.join(' ').toLowerCase() : '';
                    return title.includes(query) || description.includes(query) || tags.includes(query);
                })
                : data;

            filtered_list = filteredVideos;

            // 태그를 포함하는 동영상들 목록 생성
            const tag_videos_first = video_list.filter(el=>el.tags.some(tag=> tag === best_tags[0].value));
            const tag_videos_second = video_list.filter(el=>el.tags.some(tag=> tag === best_tags[1].value));

            renderVideos('section1', best_tags[0].value, tag_videos_first);
            renderVideos('section2', best_tags[1].value, tag_videos_second);
            renderVideos('all-video-section', '', (query ? filteredVideos : sortedVideos));

            // 비디오 메뉴와 이벤트 등록
            insert_video_menu();
            
            // 정렬 기능 추가
            sort_video_query();
        })
        .catch(error => {
            if (error.name === "NetworkError") {
                build_error_message(error.message, document.querySelector("main"));
            } else {
                build_error_message("서버에서 에러가 발생했습니다.", document.querySelector("main"));
            }
        });
}

function renderVideos(sectionId, playlistName, videoList) {
    const container = document.getElementById(sectionId);

    if (container.parentNode.closest(".video-scroll-wrapper")) {
        const title_div = container.parentNode.closest(".video-scroll-wrapper")?.querySelector(".section-title");
    
        title_div.textContent = `${playlistName} 태그 재생목록`;
    }
    container.innerHTML = '';

    videoList.forEach((video) => {
        const videoCard = document.createElement("div");
        videoCard.classList.add("video-card");
        videoCard.dataset.videoId = video.id;

        const thumbnailUrl = video.thumbnail || "https://via.placeholder.com/300x200.png?text=No+Thumbnail";
        const uploadText = timeCalculator(video.created_dt);
        const viewsFormatted = viewsUnit(video.views);

        // 아이콘 이미지 경로
        const menu_toggle_img = "../../../images/three-dots-vertical.svg";
        const clock_img = "../../../images/clock.svg";
        const playlist_img = "../../../images/list-play.svg";

        videoCard.innerHTML = `
        <div class="video-thumbnail">
            <img src="${thumbnailUrl}" alt="Video Thumbnail" />
            <div class="video-duration">00:00</div>
            <div class="hover-overlay-wrap">
                <div class="hover-overlay-inner-wrap">
                    <div class="hover-overlay-box">
                        <img src="${clock_img}" alt="clock-icon" class="hover-icon"></img>
                    </div>
                    <div class="hover-overlay-text-box">나중에 보기</div>
                </div>
                <div class="hover-overlay-inner-wrap">
                    <div class="hover-overlay-box">
                        <img src="${playlist_img}" alt="list-play-icon" class="hover-icon"></img>
                    </div>
                    <div class="hover-overlay-text-box">재생목록에 추가</div>
                </div>
            </div>
        </div>
        <div class="video-info">
            <div class="video-details">
                <div class="video-title">${video.title}</div>
                <div class="video-meta">조회수 ${viewsFormatted}회 • ${uploadText}</div>
            </div>
            <div class="video-menu">
                <button class="menu-toggle-btn" data-video-id="${video.id}">
                    <img src="${menu_toggle_img}" alt="three-dot-icon" class="btn-icon">
                </button>
            </div>
        </div>
        `;

        // 썸네일과 비디오 정보를 누르면 비디오 페이지 이동
        videoCard.querySelector(".video-thumbnail").addEventListener('click', () => {
            move_to_video_page(video)
        });
        videoCard.querySelector(".video-details").addEventListener('click', () => {
            move_to_video_page(video)
        });

        container.appendChild(videoCard);

        // 비디오 목록 스크롤 이벤트 추가
        const video_playlist = document.querySelectorAll(".video-playlist");
        video_playlist.forEach(playlist => {
            insert_video_scroll(playlist);
        })
    });
}

// 태그 빈도수 계산
function getFrequentTag(data) {
    // 비디오 태그와 빈도 수 저장
    data.forEach(el=>{
        el.tags.forEach(tag=>{
            // 해당 속성값이 있으면 1을 더하고, 없으면 새로 0을 추가
            video_tags[tag] = ((video_tags[tag]) || 0) + 1;
        });
    });

    const sorted_tags = Object.entries(video_tags)
    .sort((a, b)=> b[1] - a[1]);

    return sorted_tags.slice(0, 2).map(([value, count]) => ({value, count}));
}

// 정렬
function sort_video_query() {
    const sort_btn = document.querySelectorAll(".video-sort");
    let origin_list = query ? filtered_list : video_list;
    let sorted_list = [];

    sort_btn.forEach(button=>{
        button.addEventListener("click", function() {
            switch(button.textContent) {
                case("최신순"):
                sorted_list = [...origin_list].sort((a, b) => new Date(b.created_dt) - new Date(a.created_dt));
                break;
                case("인기순"):
                sorted_list = [...origin_list].sort((a, b) => Number(b.views) - Number(a.views));
                break;
                case("날짜순"):
                sorted_list = [...origin_list].sort((a, b) => new Date(a.created_dt) - new Date(b.created_dt));
                break;
            }
            renderVideos('all-video-section', '', sorted_list);
            sort_btn.forEach(el=>el.classList.remove("selected"));
            button.classList.add("selected");
        })
    })
}

// 비디오 페이지 이동 및 localStorage 설정
function move_to_video_page(video) {
    localStorage.setItem('selectedVideo', JSON.stringify(video));
    localStorage.setItem('selectedChannelId', video.channel_id);
    window.location.href = `../html/video.html?video_id=${video.id}`;
}

// 조회수
function formatViews(views) {
    if (!views) return "0";
    if (views >= 1_000_000) return (views / 1_000_000).toFixed(1).replace('.0', '') + "M";
    if (views >= 1_000) return (views / 1_000).toFixed(1).replace('.0', '') + "K";
    return views.toString();
}

// 날짜
function formatUploadDate(dateStr) {
    if (!dateStr) return "unknown";
    const date = new Date(dateStr);
    return `${date.getFullYear()}.${(date.getMonth() + 1).toString().padStart(2, '0')}.${date.getDate().toString().padStart(2, '0')}`;
}