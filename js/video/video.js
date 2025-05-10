import timeCalculator from "../../js/util/timeCalculator.js";
import {subscribersUnit, viewsUnit} from "../../components/videoComponents/js/formUnit.js";
import { build_error_message, build_network_error } from "../errorHandling/buildErrorMessage.js";

document.addEventListener("DOMContentLoaded", async function () {
    try {
        await fetchVideoinfo();
        await fetchChannelinfo();

        // 비디오 정보 작업 완료 시 메인 표시, 로딩중 숨김
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

    fetch(`http://techfree-oreumi-api.kro.kr:5000/video/getVideoInfo?video_id=${videoId}`)
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

            // 문서 title을 비디오 제목으로 설정
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

    fetch(`http://techfree-oreumi-api.kro.kr:5000/video/getVideoInfo?video_id=${videoId}`)
        .then(response => {
            if (!response.ok) build_error_message(response.status);
            return response.json();
        })
        .then(videoData => {
            const channelId = videoData.channel_id;

            fetch(`http://techfree-oreumi-api.kro.kr:5000/channel/getChannelInfo?id=${channelId}`)
                .then(res => {
                    if (!res.ok) build_error_message(res.status);
                    return res.json();
                })
                .then(channelInfo => {
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

// 비디오 메뉴버튼 더보기 클릭 시 나타나게
const dotsbutton = document.getElementById("menu-show-more");

dotsbutton.addEventListener('click', function click_report(e) {
    const dropbox = document.getElementById("video-menu-dropbox")
    
    if (dropbox.style.display === "flex") {
        dropbox.style.display = "none";
    } else {
        dropbox.style.display = "flex";
    };
});

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
// 정렬 버튼 클릭 시 정렬 기준 설정하고 댓글 다시 로드
document.querySelectorAll(".sort-options button").forEach((btn) => {
    btn.addEventListener("click", (e) => {
        const selected = e.target.textContent.trim();
        if (selected === "인기 댓글순") {
            localStorage.setItem("comment_sort", "popular");
        } else if (selected === "최신순") {
            localStorage.setItem("comment_sort", "latest");
        }
        location.reload();
    });
});

// 구독 버튼
document.addEventListener("DOMContentLoaded", () => {
    const subscribeBtn = document.getElementById("subscribe-btn");
    let subscribed = false;

    if (subscribeBtn) {
        subscribeBtn.addEventListener("click", () => {
            subscribed = !subscribed;
            subscribeBtn.textContent = subscribed ? "SUBSCRIBED" : "SUBSCRIBE";
        });
    }
});

// 인기 댓글순
document.querySelector(".sort-options button:nth-child(1)").addEventListener("click", () => {
    localStorage.setItem("comment_sort", "popular");
    commentInsert();
});

// 최신순
document.querySelector(".sort-options button:nth-child(2)").addEventListener("click", () => {
    localStorage.setItem("comment_sort", "latest");
    commentInsert();
});
