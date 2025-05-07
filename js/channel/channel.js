import timeCalculator from '../util/timeCalculator.js';

let subscriberCount = 0;
let isSubscribed = false;

document.addEventListener("DOMContentLoaded", function () {
    console.log("DOM fully loaded and parsed");
    setupSubscribeButton(); // 구독 버튼
    fetchChannelInfo(); // 채널 정보
    fetchVideosAndRender(); // 영상 목록
    setupVideoButton(); // 동영상 버튼 설정
});

// 동영상 버튼 클릭 시 동영상 목록 표시/숨기기
function setupVideoButton() {
    const videoButton = document.getElementById('video-button'); // 동영상 버튼
    const mainVideo = document.getElementById('main-video'); // 메인 비디오 영역
    const videoList = document.getElementById('video-list'); // 동영상 목록 영역

    if (!videoButton) {
        console.error('video-button 요소를 찾을 수 없습니다!');
        return;
    }

    videoButton.addEventListener('click', () => {
        console.log('Video button clicked');
        // 메인 비디오 영역 숨기기
        mainVideo.style.display = 'none';

        // 동영상 목록 영역 표시하기
        videoList.style.display = 'block';
    });
}

// 구독 버튼
function setupSubscribeButton() {
    const subscribeButton = document.getElementById('button-subscribe');
    subscribeButton.addEventListener('click', () => {
        if (isSubscribed) {
            subscriberCount -= 1;
            subscribeButton.textContent = "SUBSCRIBE";
            isSubscribed = false;
        } else {
            subscriberCount += 1;
            subscribeButton.textContent = "SUBSCRIBED";
            isSubscribed = true;
        }
        document.getElementById('subscribers').textContent = `${subscriberCount} subscribers`;
    });
}

// 채널 정보
function fetchChannelInfo() {
    const urlParams = new URLSearchParams(window.location.search);
    const channelId = urlParams.get('channel_id');

    if (!channelId) {
        console.error('채널 ID가 URL에 없습니다!');
        return;
    }

    fetch(`http://techfree-oreumi-api.kro.kr:5000/channel/getChannelInfo?id=${channelId}`)
        .then(response => response.json())
        .then(channelData => {
            subscriberCount = channelData.subscribers;
            document.getElementById('channel-name').textContent = channelData.channel_name;
            document.getElementById('subscribers').textContent = `${subscriberCount} subscribers`;
            document.getElementById('channel-profile-img').src = channelData.channel_profile;
        })
        .catch(error => {
            console.error('채널 정보 가져오기 실패:', error);
        });
}

// 메인 비디오
function renderMainVideo(videoId) {
    fetch(`http://techfree-oreumi-api.kro.kr:5000/video/getVideoInfo?video_id=${videoId}`)
        .then(response => response.json())
        .then(video => {
            // 영상 소스 삽입
            const source = document.querySelector('#main-video video source');
            source.src = `https://storage.googleapis.com/youtube-clone-video/${video.id}.mp4`;

            // video 태그 재로드 (src 변경 시 필요)
            const videoElement = document.querySelector('#main-video video');
            videoElement.load();

            // 텍스트 정보 삽입
            document.getElementById('video-title').textContent = video.title;
            document.getElementById('spectators').textContent = `${video.views} views`;
            document.getElementById('uploaded-time').textContent = formatUploadDate(video.created_dt);
            document.getElementById('video-description').textContent = video.description;
        })
        .catch(error => {
            console.error('메인 비디오 불러오기 실패:', error);
        });
}
renderMainVideo(1);

// 영상 목록
function fetchVideosAndRender() {
    const urlParams = new URLSearchParams(window.location.search);
    const channelId = urlParams.get('channel_id');
    const query = urlParams.get('query')?.toLowerCase(); // 검색어 소문자 처리

    if (!channelId) {
        console.error('채널 ID가 URL에 없습니다!');
        return;
    }

    fetch(`http://techfree-oreumi-api.kro.kr:5000/video/getChannelVideoList?channel_id=${channelId}`)
        .then(response => response.json())
        .then(data => {
            //  검색어가 있다면 title, description, tags 기준으로 필터링
            const filteredVideos = query
                ? data.filter(video => {
                    const title = video.title?.toLowerCase() || '';
                    const description = video.description?.toLowerCase() || '';
                    const tags = Array.isArray(video.tags) ? video.tags.join(' ').toLowerCase() : '';
                    return title.includes(query) || description.includes(query) || tags.includes(query);
                })
                : data;

            renderVideos('section1', filteredVideos);
            renderVideos('section2', filteredVideos);
        })
        .catch(error => {
            console.error('Fetch error:', error);
        });
}

function renderVideos(sectionId, videoList) {
    const container = document.getElementById(sectionId);
    container.innerHTML = '';

    videoList.forEach((video) => {
        const videoCard = document.createElement("div");
        videoCard.classList.add("video-card");

        const thumbnailUrl = video.thumbnail || "https://via.placeholder.com/300x200.png?text=No+Thumbnail";
        const uploadText = timeCalculator(video.created_dt);
        const viewsFormatted = formatViews(video.views);

        videoCard.innerHTML = `
        <div class="video-thumbnail">
            <img src="${thumbnailUrl}" alt="Video Thumbnail" />
            <div class="video-duration">00:00</div>
        </div>
        <div class="video-info">
            <div class="video-title">${video.title}</div>
            <div class="video-meta">${viewsFormatted} views · ${uploadText}</div>
        </div>
        `;

        videoCard.addEventListener('click', () => {
            localStorage.setItem('selectedVideo', JSON.stringify(video));
            localStorage.setItem('selectedChannelId', video.channel_id);
            window.location.href = '../html/video.html';
        });

        container.appendChild(videoCard);
    });
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
