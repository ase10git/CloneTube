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
import {timeCalculator, viewsUnit} from "../../components/videoComponents/js/insertRelatedVideoList.js";

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
            document.getElementById('videopage-title').textContent = videoData.title;
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

//구독자 수 단위 계산
function subscribersUnit(views) {

    if (views / 100000000 >= 1) {
        return `${(views / 100000000).toFixed(0)}억 ${((views % 100000000) / 10000).toFixed(0)}만`
    } else if (views / 10000000 >= 1) {
        return `${(views / 10000000).toFixed(0)},${((views % 10000000) / 10000).toFixed(0)}만`
    } else if (views / 100000 >= 1) {
        const val = (views / 10000).toFixed(1);
        if (val.endsWith('.0')) return `${parseInt(val)}만`;
        return `${val}만`;
    } else if (views / 10000 >= 1) {
        const val = (views / 10000).toFixed(2);
        if (val.endsWith('.00')) return `${parseInt(val)}만`;
        if (val.endsWith('0')) return `${parseFloat(val).toFixed(1)}만`;
        return `${val}만`;
    } else if (views / 1000 >= 1) {
        const val = (views / 1000).toFixed(2);
        if (val.endsWith('.00')) return `${parseInt(val)}천`;
        if (val.endsWith('0')) return `${parseFloat(val).toFixed(1)}천`;
        return `${val}천`;
    } else {
        return `${views}`;
    }
}