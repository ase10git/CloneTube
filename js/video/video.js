import timeCalculator from "../../js/util/timeCalculator.js";
import {subscribersUnit, viewsUnit} from "../../components/videoComponents/js/formUnit.js";
import { build_error_message, build_network_error } from "../errorHandling/buildErrorMessage.js";
import { commentInsert } from "../../components/videoComponents/js/insertComments.js";

document.addEventListener("DOMContentLoaded", async function () {
    try {
        await fetchVideoinfo();
        await fetchChannelinfo();

        document.querySelector("#primary").classList.add("visible");
        document.querySelector("#secondary").classList.add("visible");
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

// 비디오 정보 가져오기
async function fetchVideoinfo() {
    const urlParams = new URLSearchParams(window.location.search);
    const videoId = urlParams.get('video_id');

    if (!videoId) {
        build_network_error(404);
    }

    fetch(`https://www.techfree-oreumi-api.ai.kr/video/getVideoInfo?video_id=${videoId}`)
        .then(response => {
            if (!response.ok) build_error_message(response.status);
            return response.json();
        })
        .then(videoData => {
            document.getElementById('video-player').src = `https://storage.googleapis.com/youtube-clone-video/${videoData.id}.mp4`;
            document.getElementById('videopage-title').textContent = videoData.title;
            document.getElementById('viewerships').textContent = `조회수 ${viewsUnit(videoData.views)}회`;
            document.getElementById('upload-date').textContent = timeCalculator(videoData.created_dt);
            document.getElementById('description').textContent = videoData.description;
            document.querySelector('.like-count').textContent = viewsUnit(videoData.likes);
            document.querySelector('.like-count').dataset.likes = videoData.likes;
            document.title = videoData.title;
        })
        .catch(error => {
            if (error.name === "NetworkError") {
                build_error_message(error.message, document.querySelector("main"));
            } else {
                build_error_message("서버에서 에러가 발생했습니다.", document.querySelector("main"));
            }
        });
}

//채널 정보 가져오기
async function fetchChannelinfo() {
    const urlParams = new URLSearchParams(window.location.search);
    const videoId = urlParams.get('video_id');

    if (!videoId) {
        build_network_error(404);
    }

    fetch(`https://www.techfree-oreumi-api.ai.kr/video/getVideoInfo?video_id=${videoId}`)
        .then(response => {
            if (!response.ok) build_error_message(response.status);
            return response.json();
        })
        .then(videoData => {
            const channelId = videoData.channel_id;

            fetch(`https://www.techfree-oreumi-api.ai.kr/channel/getChannelInfo?id=${channelId}`)
                .then(res => {
                    if (!res.ok) build_error_message(res.status);
                    return res.json();
                })
                .then(channelInfo => {
                    if (channelInfo.subscribers <= 1000000) {
                        document.getElementById("badge").style.display = "none";
                    }
                    document.getElementById('channel-img').src = channelInfo.channel_profile;
                    document.getElementById('channel-name').textContent = channelInfo.channel_name;
                    document.getElementById('subscribers').textContent = `구독자 ${subscribersUnit(channelInfo.subscribers)}명`;
                    document.getElementById('channel-img').addEventListener('click', () => {
                        window.location.href = `../html/channel.html?channel_id=${channelId}`;
                    });
                    document.getElementById('channel-name').addEventListener('click', () => {
                        window.location.href = `../html/channel.html?channel_id=${channelId}`;
                    });
                })
                .catch(error => {
                    if (error.name === "NetworkError") {
                        build_error_message(error.message, document.querySelector("main"));
                    } else {
                        build_error_message("서버에서 에러가 발생했습니다.", document.querySelector("main"));
                    }
                });
        })
        .catch(error => {
            if (error.name === "NetworkError") {
                build_error_message(error.message, document.querySelector("main"));
            } else {
                build_error_message("서버에서 에러가 발생했습니다.", document.querySelector("main"));
            }
        });
}

// 댓글 정렬기준 클릭 시 나타나게
const sortbutton = document.querySelector(".dropdown");

sortbutton.addEventListener('click', function click_report(e) {
    const dropbox = document.querySelector(".sort-options")
    
    if (dropbox.style.display === "flex") {
        dropbox.style.display = "none";
    } else {
        dropbox.style.display = "flex";
    };
});

// 인기 댓글순
document.querySelector(".sort-options button:nth-child(1)").addEventListener("click", () => {
    localStorage.setItem("comment_sort", "popular");
    document.querySelector(".sort-options").style.display = "none";
    commentInsert();
});

// 최신순
document.querySelector(".sort-options button:nth-child(2)").addEventListener("click", () => {
    localStorage.setItem("comment_sort", "latest");
    document.querySelector(".sort-options").style.display = "none";
    commentInsert();
});

// 설명 더보기 토글
document.addEventListener("DOMContentLoaded", () => {
    const descriptionEl = document.getElementById("description");
    const toggleBtn = document.getElementById("description-btn");
    const descBox = document.getElementById("video-desc");

    if (descriptionEl && toggleBtn && descBox) {
        let expanded = false;

        toggleBtn.addEventListener("click", () => {
            expanded = !expanded;

            if (expanded) {
                descriptionEl.classList.remove("collapsed");
                descBox.classList.remove("collapsed");
                toggleBtn.textContent = "간략히";
            } else {
                descriptionEl.classList.add("collapsed");
                descBox.classList.add("collapsed");
                toggleBtn.textContent = "더보기";
            }
        });
        descriptionEl.classList.add("collapsed");
        descBox.classList.add("collapsed");
    }
});

document.addEventListener("DOMContentLoaded", () => {
    fetchVideoinfo();
    fetchChannelinfo();

    const subscribeBtn = document.getElementById("subscribe-btn");
    let subscribed = false;
    if (subscribeBtn) {
        subscribeBtn.addEventListener("click", () => {
            subscribed = !subscribed;
            subscribeBtn.textContent = subscribed ? "구독중" : "구독";
        });
    }

    const observer = new MutationObserver(() => {
        const video = document.getElementById("video-player");
        const playToggle = document.getElementById("play-toggle");
        const playIcon = document.getElementById("play-icon");
        const volumeBar = document.getElementById("volume-bar");
        const fullscreenBtn = document.getElementById("fullscreen-btn");
        const timeCurrent = document.getElementById("current-time");
        const timeTotal = document.getElementById("duration");
        const progressBar = document.getElementById("progress-bar");
        const videoContainer = document.getElementById("video-container");
        const progressContainer = document.getElementById("progress-container");
        const volumeWrapper = document.getElementById("volume-control");
        const volumeToggle = document.getElementById("volume-toggle");

        if (
            video && playToggle && playIcon && volumeBar &&
            fullscreenBtn && progressBar && videoContainer &&
            progressContainer && volumeWrapper && volumeToggle
        ) {
            observer.disconnect();

            video.volume = 1;
            video.muted = false;

            video.addEventListener("play", () => {
                playIcon.src="../../images/icon/pauseicon.svg";
            });
            video.addEventListener("pause", () => {
                playIcon.src="../../images/icon/play.svg";
            });

            playToggle.addEventListener("click", (e) => {
                e.preventDefault();
                if (video.paused) {
                    video.play();
                } else {
                    video.pause();
                }
            });

            volumeBar.addEventListener("input", () => {
                video.volume = volumeBar.value;
            });

            volumeToggle.addEventListener("click", (e) => {
                e.stopPropagation();
                volumeWrapper.classList.toggle("active");
            });

            document.addEventListener("click", (e) => {
                if (!volumeWrapper.contains(e.target)) {
                    volumeWrapper.classList.remove("active");
                }
            });

            fullscreenBtn.addEventListener("click", () => {
                if (video.requestFullscreen) video.requestFullscreen();
            });

            video.addEventListener("loadedmetadata", () => {
                timeTotal.textContent = formatTime(video.duration);
            });
            video.addEventListener("timeupdate", () => {
                timeCurrent.textContent = formatTime(video.currentTime);
                const percent = (video.currentTime / video.duration) * 100;
                progressBar.style.width = `${percent}%`;
            });

            progressContainer.addEventListener("click", (e) => {
                const rect = progressContainer.getBoundingClientRect();
                const clickX = e.clientX - rect.left;
                const percent = clickX / rect.width;
                video.currentTime = percent * video.duration;
            });
        }
    });

    observer.observe(document.getElementById("custom-video-ui"), {
        childList: true,
        subtree: true,
    });
});

// 시간 포맷 함수
function formatTime(seconds) {
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
}
