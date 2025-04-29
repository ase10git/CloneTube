// const buttons = document.querySelectorAll(".comment-icon-box");
// buttons.forEach(button => {
//     button.addEventListener('click', function click_report(e) {
//         const button = e.currentTarget;
//         const report = button.nextElementSibling; // 바로 옆 형제 요소 가져오기
    
//         if (!report || !report.classList.contains('comment-dropdown')) {
//             console.error("comment-dropdown이 없음");
//             return;
//         }
    
//         if (report.style.display === 'none' || report.style.display === '') {
//             report.style.display = 'block';
//         } else {
//             report.style.display = 'none';
//         }
//     });
// });
// import timeCalculator from "../../components/videoComponents/js/insertRelatedVideoList.js";

document.addEventListener("DOMContentLoaded", function () {
    fetchVideoinfo();
    fetchChannelinfo();
});

// 비디오 정보 가져오기
function fetchVideoinfo() {
    const urlParams = new URLSearchParams(window.location.search);
    const videoId = urlParams.get('video_id');

    if (!videoId) {
        console.error('비디오 ID가 URL에 없습니다!');
        return;
    }

    fetch(`http://techfree-oreumi-api.kro.kr:5000/video/getVideoInfo?video_id=${videoId}`)
        .then(response => response.json())
        .then(videoData => {
            document.getElementById('video-player').src = `https://storage.googleapis.com/youtube-clone-video/${videoData.id}.mp4`;
            document.getElementById('video-title').textContent = videoData.title;
            document.getElementById('viewerships').textContent = `조회수 ${viewsUnit(videoData.views)}회`;
            document.getElementById('upload-date').textContent = timeCalculator(videoData.created_dt);
            document.getElementById('description').textContent = videoData.description;
        })
        .catch(error => {
            console.error('비디오 정보 가져오기 실패:', error);
        });
}

//채널 정보 가져오기
function fetchChannelinfo() {
    const urlParams = new URLSearchParams(window.location.search);
    const videoId = urlParams.get('video_id');

    if (!videoId) {
        console.error('비디오 ID가 URL에 없습니다!');
        return;
    }

    fetch(`http://techfree-oreumi-api.kro.kr:5000/video/getVideoInfo?video_id=${videoId}`)
        .then(response => response.json())
        .then(videoData => {
            fetch(`http://techfree-oreumi-api.kro.kr:5000/channel/getChannelInfo?id=${videoData.channel_id}`)
            .then(res => res.json())
            .then(channelInfo => {
                document.getElementById('channel-img').src = channelInfo.channel_profile;
                document.getElementById('channel-name').textContent = channelInfo.channel_name;
                document.getElementById('subscribers').textContent = `구독자 ${subscribersUnit(channelInfo.subscribers)}명`;
            })
            .catch(error => {
                console.error('채널 정보 가져오기 실패:', error);
            }); 
        })
        .catch(error => {
            console.error('비디오 정보 가져오기 실패:', error);
        });
}

function timeCalculator(date) {
    const now = new Date(); // 현재 날짜
    const past = new Date(date); // 대상 날짜
    // 두 시간 차이를 계산(초 단위)
    const diffInSeconds = Math.floor((now - past) / 1000);

    const secondsInMinute = 60;
    const secondsInHour = 3600;
    const secondsInDay = 86400;

    if (diffInSeconds < secondsInMinute) { // 차이가 초 단위일 때
        return `${diffInSeconds}초 전`;
    } else if (diffInSeconds < secondsInHour) { // 차이가 분 단위일 때
        const minutes = Math.floor(diffInSeconds / secondsInMinute);
        return `${minutes}분 전`;
    } else if (diffInSeconds < secondsInDay) { // 차이가 시간 단위일 때
        const hours = Math.floor(diffInSeconds / secondsInHour);
        return `${hours}시간 전`;
    } else { // 차이가 일 단위일 때
        const days = Math.floor(diffInSeconds / secondsInDay);
        return `${days}일 전`;
    }
}

function viewsUnit(views) {
    if (views / 100000000 >= 1) {
        return `${(views / 100000000).toFixed(0)}억 ${((views % 100000000) / 10000).toFixed(0)}만`
    } else if (views / 10000000 >= 1) {
        return `${(views / 10000000).toFixed(0)},${((views % 10000000) / 10000).toFixed(0)}만`
    } else if (views / 1000000 >= 1) {
        return `${(views / 10000).toFixed(0)}만`
    }else if (views / 100000 >= 1) {
        return `${(views / 10000).toFixed(0)}만`
    } else if (views / 10000 >= 1) {
        return `${(views / 10000).toFixed(1)}만`
    } else if (views / 1000 >= 1) {
        return `${(views / 1000).toFixed(1)}천`
    } else {
        return `${views}`;
    }
}

function subscribersUnit(views) {
    if (views / 100000000 >= 1) {
        return `${(views / 100000000).toFixed(0)}억 ${((views % 100000000) / 10000).toFixed(0)}만`
    } else if (views / 10000000 >= 1) {
        return `${(views / 10000000).toFixed(0)},${((views % 10000000) / 10000).toFixed(0)}만`
    } else if (views / 1000000 >= 1) {
        return `${(views / 10000).toFixed(2)}만`
    }else if (views / 100000 >= 1) {
        return `${(views / 10000).toFixed(2)}만`
    } else if (views / 10000 >= 1) {
        return `${(views / 10000).toFixed(2)}만`
    } else if (views / 1000 >= 1) {
        return `${(views / 1000).toFixed(2)}천`
    } else {
        return `${views}`;
    }
}