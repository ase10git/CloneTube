function timeCalculator(date) {
    const now = new Date().getTime(); // 현재 날짜를 생성
    const past = new Date(date).getTime(); // 인자로 받은 날짜를 Date 객체로 변환
    const diffInSeconds = Math.floor((now - past) / 1000); // 현재와 대상 날짜의 차이를 초 단위로 계산

    const secondsInMinute = 60; // 1분 = 60초
    const secondsInHour = 3600; // 1시간 = 3600초
    const secondsInDay = 86400; // 1일 = 86400초
    const secondsInWeek = 604800; // 1주 = 7일 기준 = 604800초
    const secondsInMonth = 2592000; // 1달 = 30일 기준 = 2592000초
    const secondsInYear = 31536000; // 1년 = 365일 기준 = 31536000초

    if (diffInSeconds < secondsInMinute) { // 1분 미만일 경우
        return `${diffInSeconds}초 전`; // 초 단위로 반환
    } else if (diffInSeconds < secondsInHour) { // 1시간 미만일 경우
        const minutes = Math.floor(diffInSeconds / secondsInMinute); // 분 단위로 계산
        return `${minutes}분 전`; // 분 단위로 반환
    } else if (diffInSeconds < secondsInDay) { // 1일 미만일 경우
        const hours = Math.floor(diffInSeconds / secondsInHour); // 시간 단위로 계산
        return `${hours}시간 전`; // 시간 단위로 반환
    } else if (diffInSeconds < secondsInWeek) { // 1주 미만일 경우
        const days = Math.floor(diffInSeconds / secondsInDay); // 일 단위로 계산
        return `${days}일 전`; // 일 단위로 반환
    } else if (diffInSeconds < secondsInMonth) { // 1달 미만일 경우
        const weeks = Math.floor(diffInSeconds / secondsInWeek); // 주 단위로 계산
        return `${weeks}주 전`; // 주 단위로 반환
    } else if (diffInSeconds < secondsInYear) { // 1년 미만일 경우
        const months = Math.floor(diffInSeconds / secondsInMonth); // 월 단위로 계산
        return `${months}달 전`; // 월 단위로 반환
    } else {
        const years = Math.floor(diffInSeconds / secondsInYear); // 연 단위로 계산
        return `${years}년 전`; // 연 단위로 반환
    }
}

export default timeCalculator; // 모듈로 내보내기 (다른 파일에서 import 가능하게 함)
