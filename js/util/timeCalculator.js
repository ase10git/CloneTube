// 업로드 시간 계산
function timeCalculator(date) {
    const now = new Date().getTime(); // 현재 날짜(밀리초 단위)
    const past = new Date(date).getTime(); // 대상 날짜(밀리초 단위)

    // 두 시간 차이를 계산(초 단위)
    const diffInSeconds = Math.floor((now - past) / 1000);

    const secondsInMinute = 60;
    const secondsInHour = 3600;
    const secondsInDay = 86400;
    const secondsInMonth = 2592000;
    const secondsInYear = 31536000;

    if (diffInSeconds < secondsInMinute) { // 차이가 초 단위일 때
        return `${diffInSeconds}초 전`;
    } else if (diffInSeconds < secondsInHour) { // 차이가 분 단위일 때
        const minutes = Math.floor(diffInSeconds / secondsInMinute);
        return `${minutes}분 전`;
    } else if (diffInSeconds < secondsInDay) { // 차이가 시간 단위일 때
        const hours = Math.floor(diffInSeconds / secondsInHour);
        return `${hours}시간 전`;
    } else if (diffInSeconds < secondsInMonth){ // 차이가 년 단위일 때
        const days = Math.floor(diffInSeconds / secondsInDay);
        return `${days}일 전`;
    } else if (diffInSeconds < secondsInYear){ // 차이가 월 단위일 때
        const months = Math.floor(diffInSeconds / secondsInMonth);
        return `${months}달 전`;
    } else { // 차이가 년 단위일 때
        const years = Math.floor(diffInSeconds / secondsInYear);
        return `${years}년 전`;
    }
}

export default timeCalculator;