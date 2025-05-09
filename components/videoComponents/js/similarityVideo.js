const saved = localStorage.getItem('similarityMap_local');
const similarityMap = saved ? new Map(Object.entries(JSON.parse(saved))) : new Map();

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
var access_key = 'my-key';

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
async function similarity_tag(firstWord, secondWord) {

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

// 전체 태그 두개씩 유사도 가져와서 Map에 저장하기
async function similarity_save() {
    const tags = await video_tags_info(); // 비동기 함수에서 값을 기다림

    for (let i = 0; i < tags.length; i++) {
        for (let j = i + 1; j < tags.length; j++) {
            await similarity_tag(tags[i], tags[j]);
            // 50번째 태그마다 저장
            // if (i % 50 === 0) {
            //     localStorage.setItem('similarityMap_local', JSON.stringify(Object.fromEntries(similarityMap)));
            // }
        }
    }
    // 마지막 저장
    // localStorage.setItem('similarityMap_local', JSON.stringify(Object.fromEntries(similarityMap)));
    console.log(similarityMap);
}

async function initSimilarity() {
    // localStorage 초기화 완료 후
    await similarity_save();
}
initSimilarity();

window.addEventListener('beforeunload', () => {
    localStorage.setItem('similarityMap_local', JSON.stringify(Object.fromEntries(similarityMap)));
});