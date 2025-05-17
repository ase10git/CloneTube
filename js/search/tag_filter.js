// 홈, 검색 페이지의 태그 관리 js
let tag = '전체';

// 태그 새로 지정
export function setTag(newTag) { 
    tag = newTag;
    document.dispatchEvent(new CustomEvent('tagChanged', {detail: tag}));
}

// 태그 가져오기
export function getTag() { return tag; }