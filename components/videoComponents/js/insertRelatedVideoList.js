// ------ 비디오 페이지의 관련 동영상 추천 목록 추가 ------
import timeCalculator from "../../../js/util/timeCalculator.js";
import { viewsUnit } from "./formUnit.js";
import insert_related_video_menu from "./insertRelatedVideoMenu.js";
import { build_error_message, build_network_error } from "../../../js/errorHandling/buildErrorMessage.js";

// 추천 비디오 목록 에러 처리 함수
function video_list_error(error) {
    const recommend_box = document.querySelectorAll(".recommend-box");
    if (error.name === "NetworkError") {
        build_error_message(error.message, recommend_box[0]);
        build_error_message(error.message, recommend_box[1]);
    } else {
        build_error_message("서버에서 에러가 발생했습니다.", recommend_box[0]);
        build_error_message("서버에서 에러가 발생했습니다.", recommend_box[1]);
    }
}

//-----현재 비디오 태그 정보 가져오기------//
async function Current_video_tags_info () {
    const urlParams = new URLSearchParams(window.location.search);
    const videoId = urlParams.get('video_id');

    if (!videoId) {
        build_network_error(404);
    }

    try {
        const response = await fetch(`https://www.techfree-oreumi-api.ai.kr/video/getVideoInfo?video_id=${videoId}`);
        if (response.status !== 200) build_network_error(response.status);
        const videoData = await response.json();
        return Array.from(videoData.tags);
    }
    catch(error) {
        if (error.name === "NetworkError") {
            build_error_message(error.message, document.querySelector("main"));
        } else {
            build_error_message("서버에서 에러가 발생했습니다.", document.querySelector("main"));
        }
        return [];
    }
}

//--------전체 비디오 목록 가져오기----------//
const xhr = new XMLHttpRequest();
xhr.open("GET", "https://www.techfree-oreumi-api.ai.kr/video/getVideoList", true);
xhr.onreadystatechange = function () {
    if (xhr.readyState === 4) {
        if(xhr.status === 200) {
            const data = JSON.parse(xhr.response);
            (async () => {
                const Current_video_tags = await Current_video_tags_info();
                let Related_video_list = await tags_count(data, Current_video_tags);
                video_list(Related_video_list);
            })();
            
        } else {
            build_network_error(xhr.status);
        }
    }
};

// 요청 전송
xhr.send(); 

//---------유사도 준비 완료 기다리는 함수 ----------//
async function wait_SimMap(timeout = 100000, interval = 200) {
    const start = Date.now();
    return new Promise((resolve, reject) => {
        const checkReady = () => {
            const ready = localStorage.getItem('similarityMap_ready');
            if (ready === 'true') {
                resolve();
            } else if (Date.now() - start > timeout) {
                // 기다리다 타임아웃 → 에러
                reject('similarityMap_ready timeout');
            } else {
                // interval 간격마다 다시 체크
                setTimeout(checkReady, interval);
            }
        };
        checkReady();
    });
}

//-----현재 비디오랑 같은 태그 개수 세기 및 유사도 합산 함수-----//
async function tags_count(list, tags) {
    const urlParams = new URLSearchParams(window.location.search);
    const videoId = Number(urlParams.get('video_id'));

    // 유사도 로딩 완료까지 기다리기
    await wait_SimMap();
    const saved = localStorage.getItem('similarityMap_local');
    const parsed = saved ? JSON.parse(saved) : null;
    const similarityMap = parsed && typeof parsed === 'object'
        ? new Map(Object.entries(parsed))
        : new Map();

    // 유사도 가져오는 함수
    function similarity_tag(a, b) {
        if (!similarityMap || similarityMap.size === 0) {
        return 0;
        }
        const key = [a, b].sort().join(',');
        return similarityMap.get(key) ?? 0;
    };
    const filteredList = Array.from(list).filter(data => data.id !== videoId);

    for (const data of filteredList) {
        if (data.tags) {
            let i = 0;
            let count = 0;
            let sim_sum = 0;
            while (tags[i]) {
                let j = 0;
                while (data.tags[j]) {
                    if (tags[i] === data.tags[j])
                        count++;
                    else {
                        //같은 태그가 아닐경우 유사도 계산해서 넣기
                        sim_sum += await similarity_tag(tags[i], data.tags[j]);
                    }
                    j++;
                }
                i++;
            }
            data['count'] = count;
            data['simSum'] = sim_sum;
        } else {
            console.error(`${data.id}의 태그가 존재하지 않습니다.`)
            data['count'] = -1;
        }
    }
    const cleanedList = filteredList.filter(data => !(data.count === 0 && data.simSum === 0));
    return sort_count_sim(cleanedList);
}

//-----정렬해서 재배치하는 함수-----//
function sort_count_sim (list) {
    let sorted_list = [];
    sorted_list = [...list].sort((a, b) => {
        if (b.count !== a.count) {
            return b.count - a.count;
        } else {
            return b.simSum - a.simSum;
        }
    });
    return sorted_list;
}

//------추천 순서대로 화면 표출------//
function video_list(data){
    const video = data;

    const public_url = "../../images/icon/";

    const temp_div = document.createElement("div");

    // 템플릿 코드를 사용하여 비디오 컨텐츠 생성
    function insert_video_list() {
        fetch("../components/videoComponents/html/videoTemplate.html")
            .then(res => {
                if (!res.ok) {
                    throw new Error("HTML template 불러오기 실패");
                }
                return res.text();
            })
            .then(data => {
                temp_div.innerHTML = data;
                const video_template = temp_div.querySelector("#video-template").content;
                const recommend_box = document.querySelectorAll(".recommend-box");

                const videoPromises = video.map(el => {
                    return fetch(`https://www.techfree-oreumi-api.ai.kr/channel/getChannelInfo?id=${el.channel_id}`)
                        .then(res => {
                            if (!res.ok) build_network_error(res.status);
                            return res.json();
                        })
                        .then(channelData => {
                            const clone = video_template.cloneNode(true);
                            if (channelData.subscribers <= 1000000) {
                                clone.querySelector(".channel-badge-box").style.display = "none";
                            }
                            clone.querySelector(".related-video-content").dataset.videoId = el.id;
                            clone.querySelector(".video-thumbnail-img").src = el.thumbnail;
                            clone.querySelector(".video-title").textContent = el.title;
                            clone.querySelector(".channel-name").textContent = channelData.channel_name;
                            clone.querySelector(".spectator-number").textContent = `조회수 ${viewsUnit(el.views)}회`;
                            clone.querySelector(".uploaded-time").textContent = timeCalculator(el.created_dt);
                            clone.querySelector(".btn-icon").src = public_url + 'threeDotsVertical.svg';
                            clone.querySelector(".menu-toggle-btn").dataset.videoId = el.id;
                            clone.querySelectorAll(".video-link").forEach(link => {
                                link.href = `/html/video.html?video_id=${el.id}`;
                            });
                            return clone;
                        })
                        .catch(error => {
                            video_list_error(error);
                            return null;
                        });
                });

                Promise.all(videoPromises)
                    .then(videoClones => {
                        videoClones.forEach(clone => {
                            if (clone) {
                                recommend_box.forEach(box => {
                                    box.appendChild(clone.cloneNode(true));
                                });
                            }
                        });
                    })
                    .then(()=>{
                        insert_related_video_menu();
                    })
                    .catch(error => video_list_error(error));
            })
            .catch(error => video_list_error(error));
    }
    insert_video_list();
}
