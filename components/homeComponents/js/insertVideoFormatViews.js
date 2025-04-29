function formatViews(views) {
    // 1,000 이상일 때 K 단위로 변환
    if (views >= 1000) {
        if (views >= 10000) {
            const viewsInK = Math.floor(views / 1000); // 10,000 이상일 경우 소수점 없이 정수로 반환
            return `${viewsInK}만회`; // 소수점 없이 K 단위로 반환
        } else {
            const viewsInK = (views / 1000).toFixed(1); // 1,000 ~ 9,999 사이일 경우 소수점 1자리까지 표시
            return `${viewsInK}만회`; // 소수점 1자리까지 K 단위로 반환
        }
    }
    return views; // 1,000 미만은 그대로 숫자 반환
}

export default formatViews;
