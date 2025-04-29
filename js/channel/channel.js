let subscriberCount = 0;
let isSubscribed = false;

document.addEventListener("DOMContentLoaded", function () {
    setupSubscribeButton(); // 구독 버튼
    fetchChannelInfo();     // 채널 정보
    fetchVideosAndRender(); // 영상 목록
});

// 구독
function setupSubscribeButton() {
    const subscribeButton = document.getElementById('button-subscribe');

    subscribeButton.addEventListener('click', () => {
        if (isSubscribed) {
            subscriberCount -= 1;
            subscribeButton.textContent = "SUBSCRIBE"; // 버튼 텍스트 복구
            isSubscribed = false;
        } else {
            subscriberCount += 1;
            subscribeButton.textContent = "SUBSCRIBED"; // 버튼 텍스트 변경
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
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(channelData => {
            console.log('채널 정보:', channelData);

            subscriberCount = channelData.subscribers; // 서버에서 받은 구독자 수로 초기화

            document.getElementById('channel-name').textContent = channelData.channel_name;
            document.getElementById('subscribers').textContent = `${subscriberCount} subscribers`;
            document.getElementById('channel-profile-img').src = channelData.channel_profile;
        })
        .catch(error => {
            console.error('채널 정보 가져오기 실패:', error);
        });
}

// 영상 목록
function fetchVideosAndRender() {
    const urlParams = new URLSearchParams(window.location.search);
    const channelId = urlParams.get('channel_id');

    if (!channelId) {
        console.error('채널 ID가 URL에 없습니다!');
        return;
    }

    fetch(`http://techfree-oreumi-api.kro.kr:5000/video/getChannelVideoList?channel_id=${channelId}`)
        .then(response => {
            if (!response.ok) {
                throw new Error("Network response was not ok");
            }
            return response.json();
        })
        .then(data => {
            console.log("받은 데이터:", data);
            renderVideos('section1', data);
            renderVideos('section2', data);
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

        // 썸네일이 없으면 기본 이미지
        const thumbnailUrl = video.thumbnail || "https://via.placeholder.com/300x200.png?text=No+Thumbnail";

        // 날짜 포맷 변환 (optional)
        const uploadDate = formatUploadDate(video.created_dt);

        // 조회수 포맷 변환
        const viewsFormatted = formatViews(video.views);

        videoCard.innerHTML = `
        <div class="video-thumbnail">
            <img src="${thumbnailUrl}" alt="Video Thumbnail" />
            <div class="video-duration">00:00</div> <!-- duration 없으면 기본값 -->
        </div>
        <div class="video-info">
            <div class="video-title">${video.title}</div>
            <div class="video-meta">${viewsFormatted} views · ${uploadDate}</div>
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

// 업로드 날짜 (YYYY-MM-DD 형태)
function formatUploadDate(dateStr) {
    if (!dateStr) return "unknown";
    const date = new Date(dateStr);
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}.${month}.${day}`;
}
