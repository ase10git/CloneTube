document.addEventListener("DOMContentLoaded", function () {
    const interval = setInterval(() => {
        const sidebar = document.getElementById("side-bar");
        const toggleButton = document.getElementById("side-button");

        if (sidebar && toggleButton) {
            const contentSection = document.getElementById("channel-main");

            function calculateMargin() {
                const windowWidth = window.innerWidth;
                if (windowWidth < 792) {
                    contentSection.style.marginLeft = `0px`;
                } else if (sidebar.classList.contains("active")) {
                    if (windowWidth < 1312) {
                        contentSection.style.marginLeft = `72px`;
                    } else {
                        contentSection.style.marginLeft = `240px`;
                    }
                } else {
                    contentSection.style.marginLeft = `72px`;
                }
            }

            function getSidebarWidth() {
                const windowWidth = window.innerWidth;
                if (sidebar.classList.contains("active")) {
                    return windowWidth < 1312 ? 72 : 240;
                } else {
                    return 72;
                }
            }

            function calculateSectionWidth() {
                const windowWidth = window.innerWidth;
                let sidebarWidth = getSidebarWidth();
                let availableWidth = windowWidth - sidebarWidth;
                let sectionWidth;

                if (windowWidth < 1312) {
                    sidebarWidth = 72;
                    availableWidth = windowWidth - sidebarWidth;
                }
                if (availableWidth > 1327) {
                    sectionWidth = 1284;
                } else if (availableWidth > 1327 - 214) {
                    sectionWidth = 1284 - 214;
                } else if (availableWidth > 1327 - 214 * 2) {
                    sectionWidth = 1284 - 214 * 2;
                } else if (windowWidth > 685) {
                    sectionWidth = 1284 - 214 * 3;
                } else {
                    sectionWidth = 428;
                }

                contentSection.style.width = `${sectionWidth}px`;
            }

            window.addEventListener("resize", calculateMargin);
            window.addEventListener("resize", calculateSectionWidth);
            calculateMargin();
            calculateSectionWidth();

            toggleButton.addEventListener("click", () => {
                calculateMargin();
                calculateSectionWidth();
            });

            clearInterval(interval);
        }
    }, 100);
});

function fetchChannelInfo() {
    const urlParams = new URLSearchParams(window.location.search);
    const channelId = urlParams.get('channel_id'); // ✨ channel_id 가져오기!

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

            // ✨ HTML 요소에 데이터 넣기
            document.getElementById('channel-name').textContent = channelData.channelName;
            document.getElementById('subscribers').textContent = `${channelData.subscribers} subscribers`;
            document.getElementById('channel-profile-img').src = channelData.profileImage;
        })
        .catch(error => {
            console.error('채널 정보 가져오기 실패:', error);
        });
}

// API
function fetchVideosAndRender() {
    const urlParams = new URLSearchParams(window.location.search);
    const channelId = urlParams.get('channel_id');

    if (!channelId) {
        console.error('채널 ID가 URL에 없습니다!');
        return; // 채널 id 없으면 함수 멈춤
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

// 카드 생성 함수
function renderVideos(sectionId, videoList) {
    const container = document.getElementById(sectionId);

    container.innerHTML = '';

    videoList.forEach((video) => {
        const videoCard = document.createElement("div");
        videoCard.classList.add("video-card");

        videoCard.innerHTML = `
        <div class="video-thumbnail">
            <img src="${video.thumbnail}" alt="Video Thumbnail" />
            <div class="video-duration">${video.duration}</div>
        </div>
        <div class="video-info">
            <div class="video-title">${video.title}</div>
            <div class="video-meta">${video.channelName}<br>${video.views} · ${video.uploadDate}</div>
        </div>
        `;

        // 이부분 테스트
        videoCard.addEventListener('click', () => {
            // 클릭한 영상 정보를 localStorage에 저장
            localStorage.setItem('selectedVideo', JSON.stringify(video));
            localStorage.setItem('selectedChannelId', video.channelId);

            // video.html로 이동
            window.location.href = '../html/video.html';
        });
        //여기까지
                container.appendChild(videoCard);
            });
        }

// 이제 실행
fetchChannelInfo();
fetchVideosAndRender();
