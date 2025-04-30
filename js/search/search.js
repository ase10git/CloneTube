// ------ 상단 바에서 검색 시 검색 결과를 가져오는 영역 -------
import insert_search_results from "../../components/searchComponents/js/insertSearchVideoList.js";

// 검색어
// 한글 검색을 위한 URI decoding 처리
const params = new URLSearchParams(window.location.search);
const query = decodeURIComponent(params.get("query") || "");

// 검색어 키워드와 비디오 제목의 공백 무시, 소문자로 치환, 부분 문자열 검사 진행
function normalize_for_search(str) {
    return str
        .normalize("NFD") // 조합형 문자 분해 (Café 등)
        .replace(/[\u0300-\u036f]/g, "") // 결합 문자 제거 (Café 등)
        .replace(/\s+/g, " ") // 중복 공백 정리
        .trim() // 앞 뒤 공백 제거
        .toLowerCase(); // 소문자 처리
}

// 비디오 전체 목록 가져오기
async function get_video_list() {
    // api 요청
    fetch("http://techfree-oreumi-api.kro.kr:5000/video/getVideoList")
        .then(res => {
            if (!res.ok) {
                throw new Error("Video list 불러오기 실패");
            }
            return res.json();
        })
        .then(async data => {
            // 검색 키워드 가공
            const normalized_query = normalize_for_search(query);
            
            // 채널 목록 중에서 검색어에 맞는 비디오 목록만 추출
            data = data.filter(video => {
                // 비디오 제목의 공백 무시, 소문자 치환, 부분 문자열 검사 준비
                const normalized_title = normalize_for_search(video.title);
                // 비디오 제목에 검색어를 포함하는 경우만 추출
                return normalized_title.includes(normalized_query);
            });

            // 각 비디오의 채널 정보 가져오기
            // Set 활용: 중복되는 채널 정보 제거
            const channel_ids = new Set(data.map(video => video.channel_id));
            // 채널 id로 채널 정보 가져오기
            const channel_info = await Promise.all(
                Array.from(channel_ids).map(async id => {
                    return get_channel_list(id);
                })
            );

            // 비디오 정보와 채널 정보를 담은 새 배열 생성
            // 채널 정보를 가져오는 비동기 함수의 모든 결과가 나왔을 때 제대로 된 데이터 출력
            const total_info = data.map(video => {
                // 비디오 정보의 채널 id와 채널 정보의 채널 id가 같은 채널 정보 찾기
                const channel_data = channel_info.find(channel => channel.id == video.channel_id);
                return {...video, ...channel_data};
            });

            // 표시할 결과 생성
            insert_search_results(query, total_info);
        })
        .catch(error => {
            console.error("Error:", error);
        });
}

// 채널 정보 가져오기
async function get_channel_list(channel_id) {
    // api 요청
    return fetch(`http://techfree-oreumi-api.kro.kr:5000/channel/getChannelInfo?id=${channel_id}`)
        .then(res => {
            if (!res.ok) {
                throw new Error("Channel 정보 불러오기 실패");
            }
            return res.json();
        })
        .then(data => data)
        .catch(error => {
            console.error("Error:", error);
        });
}

// 웹 페이지 로드 시 이벤트 처리
window.addEventListener('DOMContentLoaded', get_video_list);