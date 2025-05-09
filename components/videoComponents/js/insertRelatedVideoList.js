// ------ 비디오 페이지의 관련 동영상 추천 목록 추가 ------
import timeCalculator from "../../../js/util/timeCalculator.js";
import { viewsUnit } from "./formUnit.js";
import insert_related_video_menu from "./insertRelatedVideoMenu.js";

//-----현재 비디오 태그 정보 가져오기------//
async function Current_video_tags_info () {
    const urlParams = new URLSearchParams(window.location.search);
    const videoId = urlParams.get('video_id');

    if (!videoId) {
        console.error('비디오 ID가 URL에 없습니다!');
        return;
    }

    try {
        const response = await fetch(`http://techfree-oreumi-api.kro.kr:5000/video/getVideoInfo?video_id=${videoId}`);
        const videoData = await response.json();
        return Array.from(videoData.tags);
    }
    catch(error) {
        console.error('비디오 정보 가져오기 실패:', error);
        return [];
    }
}

//--------전체 비디오 목록 가져오기----------//
// HTTPRequest 객체 생성
const xhr = new XMLHttpRequest();
// get 요청 설정 - 비디오 리스트를 비동기로 가져오기
xhr.open("GET", "http://techfree-oreumi-api.kro.kr:5000/video/getVideoList", true);
// 요청 전송 후 상태 변화 시 콜백 함수
xhr.onreadystatechange = function () {
    if (xhr.readyState === 4) {
        if(xhr.status === 200) {
            // 결과 데이터 파싱
            const data = JSON.parse(xhr.response);
            console.log(data);
            (async () => {
                const Current_video_tags = await Current_video_tags_info();
                let Related_video_list = await tags_count(data, Current_video_tags);
                console.log(Related_video_list);
                video_list(Related_video_list); // 비디오 목록에 데이터 추가
            })();
            
        } else {
            // 에러 처리
            console.error("Error:", xhr.status);
        }
    }
};
    // 요청 전송
xhr.send(); 

//-----현재 비디오랑 같은 태그 개수 세는 함수-----//
async function tags_count(list, tags) {
    const urlParams = new URLSearchParams(window.location.search);
    const videoId = Number(urlParams.get('video_id'));

     // videoId와 일치하는 data.id를 가진 항목 제거
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
                        //sim_sum += await similarity_tag(tags[i], data.tags[j]);
                        sim_sum = 1
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
    console.log(similarityMap);
    return(sort_count_sim(filteredList));
}

// function similarity_tag(a, b) {
//     const key = [a, b].sort().join(',');
//     return similarityMap.get(key) ?? 0;
// };

// 유사도 계산을 위한 API
var openApiURL = 'http://aiopen.etri.re.kr:8000/WiseWWN/WordRel';
var access_key = 'my-key';

const saved = localStorage.getItem('similarityMap_local');
const similarityMap = saved ? new Map(Object.entries(JSON.parse(saved))) : new Map();
// let similarityMap = new Map();

async function delayRequest(time) {
    return new Promise(resolve => setTimeout(resolve, time));
}

//------유사도 계산하는 함수-------//
async function similarity_tag(firstWord, secondWord) {

    const key = [firstWord, secondWord].sort().join(',');

    if (similarityMap.has(key)) {
        console.log("related-이미 있음");
        return similarityMap.get(key);
        // 이미 저장된 유사도 사용
    } else {
        // fetch로 API 요청해서 유사도 받기
        const requestJson = {
            'argument': {
                'first_word': firstWord,
                'second_word': secondWord,
            }
        };

        try {
            console.log("related-없음");
            await delayRequest(10);  // 0.01초 대기, 너무 빠르면 오류
            const response = await fetch(openApiURL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': access_key
                },
                body: JSON.stringify(requestJson)
            });

            const result = await response.json();
            // lin 알고리즘 유사도 받아옴
            if (result && result.return_object && result.return_object['WWN WordRelInfo']) {
                const simArray = result.return_object['WWN WordRelInfo'].WordRelInfo.Similarity;
                const linScore = Array.from(simArray).find(item => item.Algorithm === "Lin").SimScore;
                similarityMap.set(key, linScore);
                return linScore;
            } else {
                console.error('유효한 유사도 정보가 없습니다.', result);
                return 0;
            }
        } catch(error) {
            console.error('Error occurred:', error.message);
            return 0;
        }
    }
}
// 페이지 닫기 직전에 저장
window.addEventListener('beforeunload', () => {
    localStorage.setItem('similarityMap_local', JSON.stringify(Object.fromEntries(similarityMap)));
});
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

    const public_url = "../../images/";

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
                // 문자열로 로드된 HTML을 DOM으로 파싱
                temp_div.innerHTML = data;

                // 비디오 태그
                const video_template = temp_div.querySelector("#video-template").content;
                const recommend_box = document.querySelectorAll(".recommend-box");

                // 비디오에 대한 채널 정보를 비동기적으로 가져오기
                const videoPromises = video.map(el => {
                    // 채널 정보 가져오기
                    return fetch(`http://techfree-oreumi-api.kro.kr:5000/channel/getChannelInfo?id=${el.channel_id}`)
                        .then(res => res.json())
                        .then(channelData => {
                            const clone = video_template.cloneNode(true);
                            clone.querySelector(".related-video-content").dataset.videoId = el.id;
                            clone.querySelector(".video-thumbnail-img").src = el.thumbnail;
                            clone.querySelector(".video-title").textContent = el.title;
                            clone.querySelector(".channel-name").textContent = channelData.channel_name;
                            clone.querySelector(".spectator-number").textContent = `조회수 ${viewsUnit(el.views)}회`;
                            clone.querySelector(".uploaded-time").textContent = timeCalculator(el.created_dt);
                            clone.querySelector(".btn-icon").src = public_url + 'three-dots-vertical.svg';
                            clone.querySelector(".menu-toggle-btn").dataset.videoId = el.id; // 메뉴 버튼에 id 지정
                            clone.querySelectorAll(".video-link").forEach(link => {
                                link.href = `http://127.0.0.1:5500/html/video.html?video_id=${el.id}`;
                            });
                            return clone;
                        })
                        .catch(error => {
                            console.error("채널 정보 가져오기 실패:", error);
                            return null; // 오류가 발생해도 null 반환하여 Promise.all()에서 처리할 수 있게 함
                        });
                });

                // Promise.all로 비동기 작업이 모두 완료되면(비디오를 배열 순서대로 넣기 위해)
                Promise.all(videoPromises)
                    .then(videoClones => {
                        // videoClones 배열의 순서대로 클론된 비디오들을 recommend-box에 추가
                        videoClones.forEach(clone => {
                            if (clone) {
                                recommend_box.forEach(box => {
                                    box.appendChild(clone.cloneNode(true)); // 비디오 클론을 추가
                                });
                            }
                        });
                    })
                    .then(()=>{
                        insert_related_video_menu();
                    })
                    .catch(error => {
                        console.error("비디오 정보 처리 중 오류 발생:", error);
                    });
            })
            .catch(error => {
                console.error("HTML 템플릿을 불러오는 중 오류 발생:", error);
            });
    }
    insert_video_list();
}