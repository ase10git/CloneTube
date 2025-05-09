const saved = localStorage.getItem('similarityMap_local');
const saved_tag = localStorage.getItem('tags_local');
const allvideo_tags = saved ? JSON.parse(saved_tag) : [];
const similarityMap = saved ? new Map(Object.entries(JSON.parse(saved))) : new Map();
// const similarityMap = new Map();
// localStorage.setItem('similarityMap_local', JSON.stringify(Object.fromEntries(similarityMap)));
// const allvideo_tags = [];
// localStorage.setItem('tags_local', JSON.stringify(allvideo_tags));

console.log(similarityMap);

//비디오 태그 정보 가져오기
async function video_tags_info () {
    try {
        const response = await fetch(`http://techfree-oreumi-api.kro.kr:5000/video/getVideoList`);
        const videoData = await response.json();
        const videoData_tags = videoData.map(video => video.tags);
        
        // 평탄화 (2차원 배열 → 1차원 배열) 및 Set을 이용해 중복 제거
        const VideoTags = [...new Set(videoData_tags.flat())];
        return VideoTags;
    } catch(error) {
        console.error('비디오 정보 가져오기 실패:', error);
        return [];
    }
}

// 유사도 계산을 위한 API
var openApiURL = 'http://aiopen.etri.re.kr:8000/WiseWWN/WordRel';
var access_key = '';

async function delayRequest(time) {
    return new Promise(resolve => setTimeout(resolve, time));
}

function normalizeWord(word) {
    return word.trim().toLowerCase();
}
function makeKey(word1, word2) {
    return [normalizeWord(word1), normalizeWord(word2)].sort().join(',');
}

// 유사도 계산하는 함수
async function similarity_tag(firstWord, secondWord, retryCount = 0) {

    const key = makeKey(firstWord, secondWord);

    if (similarityMap.has(key)) {
        console.log("similarity-이미 있음");
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
            console.log("similarity-없음");
            await delayRequest(10);  // 0.01초 대기, 너무 빠르면 오류(Too Many Request)
            const response = await fetch(openApiURL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': access_key
                },
                body: JSON.stringify(requestJson)
            });

            const result = await response.json();
            // 동시에 너무 많은 요청 받아 처리 못할 경우
            if (result.result === -1 && result.reason === 'Concurrent Limit Exceeded') {
                if (retryCount < 5) {
                    console.warn(`요청 제한 초과, 재시도 중... (${retryCount + 1})`);
                    await delayRequest(100); // 0.1초 대기 후 재시도
                    return similarity_tag(firstWord, secondWord, retryCount + 1);
                } else {
                    console.error("재시도 횟수 초과: ", key);
                    return 0;
                }
            }
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

// 태그 배열 같은지 확인하는 함수
function Sametags(arr1, arr2) {
    if (!arr1 || !arr2) return false;
    if (arr1.length !== arr2.length) return false;
    const sorted1 = [...arr1].sort();
    const sorted2 = [...arr2].sort();
    return sorted1.every((val, i) => val === sorted2[i]);
}

// 새로 추가된 태그들만 골라서 새로운 태그 배열 만드는 함수
function new_tags(arr1, arr2) {
    const isArr1 = Array.isArray(arr1);
    const isArr2 = Array.isArray(arr2);

    if (!isArr1 && !isArr2) return [];
    if (!isArr1) return arr2;
    if (!isArr2) return arr1;
    
    const onlyInArr1 = arr1.filter(tag => !arr2.includes(tag));
    const onlyInArr2 = arr2.filter(tag => !arr1.includes(tag));

    return [...new Set([...onlyInArr1, ...onlyInArr2])];
}

// 전체 태그 두개씩 유사도 가져와서 Map에 저장하기 - 여러 개 동시 처리
async function similarity_save() {
    let tags = await video_tags_info(); // 비동기 함수에서 값을 기다림
    // 이미 비디오 태그 값 다 비교했을 경우
    if (Sametags(tags, allvideo_tags)) {
        localStorage.setItem('similarityMap_ready', 'true'); // 저장 완료 표시
        return 0;
    }
    // 새로운 비디오 들어왔을경우, 그 태그만 비교해서 넣기
    tags = new_tags(tags, allvideo_tags);
    const maxConcurrentRequests = 20; // 최대 동시 요청 수
    const promises = [];

    for (let i = 0; i < tags.length; i++) {
        for (let j = i + 1; j < tags.length; j++) {
            promises.push(similarity_tag(tags[i], tags[j]));

            if (promises.length >= maxConcurrentRequests) {
                // 최대 동시 요청 수가 되면 실행 후 대기
                await processBatch(promises);
                promises.length = 0;  // 배열 초기화
                await delayRequest(100); // 0.1초 대기 후 다시 요청
            }
        }
    }

    // 남아있는 요청 처리 (남은 요청이 있을 수 있음)
    if (promises.length > 0) {
        await processBatch(promises);
    }

    // 로컬 저장소에 결과 저장
    localStorage.setItem('tags_local', JSON.stringify(tags));
    localStorage.setItem('similarityMap_local', JSON.stringify(Object.fromEntries(similarityMap)));
    localStorage.setItem('similarityMap_ready', 'true'); // 저장 완료 표시
}

// 병렬로 처리할 배치 처리 함수
async function processBatch(promises) {
    await Promise.all(promises);
}

async function initSimilarity() {
    // 먼저 준비 완료 플래그 초기화
    localStorage.setItem('similarityMap_ready', 'false');
    // localStorage 초기화 완료 후
    await similarity_save();
}
initSimilarity();


//+++++여러 처리에서 문제 생겼을경우 아래 처리로++++++//
// 전체 태그 두개씩 유사도 가져와서 Map에 저장하기 - 하나씩 처리
// async function similarity_save() {
//     const tags = await video_tags_info(); // 비동기 함수에서 값을 기다림
//     //이미 비디오 태그 값 다 비교했을 경우
//         if (Sametags(tags, video_tags)) {
//             localStorage.setItem('similarityMap_ready', 'true'); // 저장 완료 표시
//             return 0;
//         }

//     for (let i = 0; i < tags.length; i++) {
//         for (let j = i + 1; j < tags.length; j++) {
//             await similarity_tag(tags[i], tags[j]);
//         }
//     }
//     localStorage.setItem('local_tag', JSON.stringify(tags));
//     localStorage.setItem('similarityMap_local', JSON.stringify(Object.fromEntries(similarityMap)));
//     localStorage.setItem('similarityMap_ready', 'true'); // 저장 완료 표시
// }