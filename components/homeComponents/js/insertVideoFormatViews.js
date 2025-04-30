// 조회수를 읽기 좋은 형식으로 변환하는 함수
function formatViews(views) {
    // 조회수가 100,000 이상인 경우
    if (views >= 100000) {
        const viewsInMan = Math.floor(views / 10000); // 만 단위로 변환 (정수로)
        return `${viewsInMan}만회`;
    } 
    // 조회수가 10,000 이상인 경우
    else if (views >= 10000) {
        const viewsInMan = views / 10000; // 만 단위로 변환 (소수점 포함 가능)
        return `${formatNumber(viewsInMan)}만회`; // 소수점 처리 후 반환
    } 
    // 조회수가 1,000 이상인 경우
    else if (views >= 1000) {
        const viewsInCheon = views / 1000; // 천 단위로 변환 (소수점 포함 가능)
        return `${formatNumber(viewsInCheon)}천회`; // 소수점 처리 후 반환
    } 
    // 조회수가 1,000 미만인 경우
    else {
        return `${views}회`; // 조회수 그대로 반환
    }
}

// 소수점이 있을 경우 반올림하여 처리하고, .0은 제거하는 함수
function formatNumber(value) {
    const rounded = Math.round(value * 10) / 10; // 소수점 첫째 자리까지 반올림
    // 소수점이 .0일 경우 정수로, 아니면 소수점 한 자리까지 표시
    return rounded % 1 === 0 ? rounded.toFixed(0) : rounded.toFixed(1);
}

export default formatViews;
