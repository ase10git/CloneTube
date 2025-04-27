// toggle 될 때마다 채널 화면 크기 변화 하는 것 (지금 어느 순간 되면 toggle 활성화 false이랑 true가 바뀜 : 이 문제 해결해야함)
document.addEventListener("DOMContentLoaded", function () {

    const interval = setInterval(() => {
        const sidebar = document.getElementById("side-bar");
        const toggleButton = document.getElementById("side-button")

        if (sidebar && toggleButton) {
            const contentSection = document.getElementById("channel-main");

            //메뉴바 활성화에 마진 따라 변경
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
                console.log(sidebar.classList.contains("active"))
                if (sidebar.classList.contains("active")) {
                    if (windowWidth < 1312) {
                        return 72;
                    } else {
                        return 240;
                    };
                } else {
                    return 72;
                }
            }

            function calculateSectionWidth() {
                const windowWidth = window.innerWidth;
                let sidebarWidth = getSidebarWidth();
                let availableWidth = windowWidth - sidebarWidth;
                let sectionWidth;

                // console.log("windowWith:", windowWidth);
                // console.log("sidebarWidth:", sidebarWidth);
                // console.log("availableWidth:", availableWidth);


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

            // 새로고침 시 바로 적용
            calculateMargin();
            calculateSectionWidth();

            // 토글 버튼 클릭 시 바로 적용
            toggleButton.addEventListener("click", () => {
                calculateMargin();
                calculateSectionWidth();
            });

            clearInterval(interval);
        };
        }, 100);
    });


document.addEventListener("DOMContentLoaded", function () {
    const sidebar = document.getElementById("side-bar");
    const contentSection = document.getElementById("channel-main");

    function isSidebarVisible() {
        if (!sidebar) return false;
        const style = window.getComputedStyle(sidebar);
        const matrix = new DOMMatrixReadOnly(style.transform);
        return matrix.m41 === 0; // 이동 안 했으면 열려있는 상태
    }

    function updateLayout() {
        if (!sidebar || !contentSection) return;

        const windowWidth = window.innerWidth;
        let sidebarWidth;

        if (windowWidth <= 792) {
            // 792px 이하면 사이드바 숨김
            contentSection.style.marginLeft = '0px';
            sidebarWidth = 0;
        } else {
            // 792px 초과
            if (isSidebarVisible()) {
                contentSection.style.marginLeft = '240px';
                sidebarWidth = 240;
            } else {
                contentSection.style.marginLeft = '72px';
                sidebarWidth = 72;
            }
        }

        // ---- 여기서부터 Section Width 계산 ----
        let availableWidth = windowWidth - sidebarWidth;
        let sectionWidth;

        if (windowWidth < 1312) {
            sidebarWidth = 72; // 창 작을 땐 강제로 72로 취급
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

    window.addEventListener("resize", updateLayout);
    document.addEventListener("click", function (e) {
        const toggleButton = document.getElementById("side-button");
        if (toggleButton && toggleButton.contains(e.target)) {
            setTimeout(updateLayout, 300); // 토글 후 조금 기다렸다 레이아웃 업데이트
        }
    });

    updateLayout(); // 처음 로딩할 때 호출
});
//API 가져오기
// const xhr = new XMLHttpRequest();
//     xhr.open("GET", "http://techfree-oreumi-api.kro.kr:5000/video/getVideoList", true);
//     xhr.onload = function () {
//         if (xhr.status >= 200 && xhr.status < 300) {
//             console.log(JSON.parse(xhr.response));
//             const sampleVideos = JSON.parse(xhr.response);
//         } else {
//             console.error("Error:", xhr.status);
//         }
//     };
//     xhr.onerror = function () {
//         console.error('Network Error');
//     };
//     xhr.send();


// 임시 썸네일 카드에 표시될 영상 정보 배열
const sampleVideos = [
    {
        thumbnail: "https://upload.wikimedia.org/wikipedia/commons/b/b8/YouTube_Logo_2017.svg",
        duration: "23:45",
        title: "YouTube",
        channelName: "Google",
        views: "1.2M views",
        uploadDate: "2 months ago",
        description: "YouTube official video"
    },
    {
        thumbnail: "https://upload.wikimedia.org/wikipedia/commons/a/a5/Instagram_icon.png",
        duration: "15:20",
        title: "Instagram",
        channelName: "Meta",
        views: "980K views",
        uploadDate: "1 month ago",
        description: "Instagram launch"
    },
    {
        thumbnail: "https://upload.wikimedia.org/wikipedia/commons/5/51/Facebook_f_logo_%282019%29.svg",
        duration: "19:55",
        title: "Facebook",
        channelName: "Meta",
        views: "2.3M views",
        uploadDate: "3 months ago",
        description: "Facebook update"
    },
    {
        thumbnail: "https://upload.wikimedia.org/wikipedia/commons/0/08/Netflix_2015_logo.svg",
        duration: "45:00",
        title: "Netflix",
        channelName: "Netflix Inc",
        views: "4.2M views",
        uploadDate: "5 months ago",
        description: "Netflix new series"
    },
    {
        thumbnail: "https://upload.wikimedia.org/wikipedia/commons/a/a5/Instagram_icon.png",
        duration: "15:20",
        title: "Instagram",
        channelName: "Meta",
        views: "980K views",
        uploadDate: "1 month ago",
        description: "Instagram launch"
    },
    {
        thumbnail: "https://upload.wikimedia.org/wikipedia/commons/a/a5/Instagram_icon.png",
        duration: "15:20",
        title: "Instagram",
        channelName: "Meta",
        views: "980K views",
        uploadDate: "1 month ago",
        description: "Instagram launch"
    },
    {
        thumbnail: "https://upload.wikimedia.org/wikipedia/commons/0/08/Netflix_2015_logo.svg",
        duration: "45:00",
        title: "Netflix",
        channelName: "Netflix Inc",
        views: "4.2M views",
        uploadDate: "5 months ago",
        description: "Netflix new series"
    },
    {
        thumbnail: "https://upload.wikimedia.org/wikipedia/en/6/60/Twitter_Logo_as_of_2021.svg",
        duration: "10:30",
        title: "Twitter",
        channelName: "X",
        views: "740K views",
        uploadDate: "1 week ago",
        description: "Twitter changes"
    }
    ];

// 카드 생성 함수 - 특정 섹션에 영상 카드들을 동적으로 렌더링하는 함수
function renderVideos(sectionId) {
// HTML에서 전달받은 섹션 ID에 해당하는 요소를 찾음
const container = document.getElementById(sectionId);

// sampleVideos 배열의 각 비디오 데이터를 순회하면서 카드 생성
sampleVideos.forEach((video) => {
    // 새로운 div 요소 생성 (비디오 카드 하나)
    const videoCard = document.createElement("div");
    // 비디오 카드에 클래스 추가 (스타일 적용을 위해)
    videoCard.classList.add("video-card");

    // 카드의 내부 HTML 구조를 템플릿 리터럴을 이용해 작성
    videoCard.innerHTML = `
    <div class="video-thumbnail">
        <img src="${video.thumbnail}" alt="Video Thumbnail" /> <!-- 썸네일 이미지 -->
        <div class="video-duration">${video.duration}</div> <!-- 영상 재생 시간 -->
    </div>
    <div class="video-info">
        <div class="video-title">${video.title}</div> <!-- 영상 제목 -->
        <div class="video-meta">${video.channelName}<br>${video.views} · ${video.uploadDate}</div> <!-- 채널명, 조회수, 업로드 날짜 -->
    </div>
    `;

    // 완성된 비디오 카드를 컨테이너에 추가
    container.appendChild(videoCard);
});
}


// 두 섹션에 영상 표시
renderVideos('section1');
renderVideos('section2');