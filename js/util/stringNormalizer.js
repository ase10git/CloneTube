// 검색어 키워드와 비디오 제목의 공백 무시, 소문자로 치환, 부분 문자열 검사 진행
function normalize_for_search(str) {
    return str
        .normalize("NFD") // 조합형 문자 분해 (Café 등)
        .replace(/[\u0300-\u036f]/g, "") // 결합 문자 제거 (Café 등)
        .replace(/\s+/g, " ") // 중복 공백 정리
        .trim() // 앞 뒤 공백 제거
        .toLowerCase(); // 소문자 처리
}

export default normalize_for_search;