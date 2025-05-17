// 조회수를 읽기 좋은 형식으로 변환하는 함수
function formatViews(views) {
    if (views >= 100000) {
        const viewsInMan = Math.floor(views / 10000);
        return `${viewsInMan}만회`;
    } 
    else if (views >= 10000) {
        const viewsInMan = views / 10000;
        return `${formatNumber(viewsInMan)}만회`;
    } 
    else if (views >= 1000) {
        const viewsInCheon = views / 1000;
        return `${formatNumber(viewsInCheon)}천회`;
    } 
    else {
        return `${views}회`;
    }
}

// 소수점이 있을 경우 반올림하여 처리하고, .0은 제거하는 함수
function formatNumber(value) {
    const rounded = Math.round(value * 10) / 10;
    return rounded % 1 === 0 ? rounded.toFixed(0) : rounded.toFixed(1);
}

export default formatViews;
