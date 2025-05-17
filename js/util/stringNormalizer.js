// 검색어 키워드와 비디오 제목의 공백 무시, 소문자로 치환, 부분 문자열 검사 진행
function normalize_for_search(str) {
    return str
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/\s+/g, " ")
        .trim()
        .toLowerCase();
}

export default normalize_for_search;