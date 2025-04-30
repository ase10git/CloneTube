// 조회수 표기용 계산기
function viewsCalculator(number, language) {
    const views = Number(number);
    let result = '';

    if (language === "kor") {
        if (views >= 1000000000) {
            result = (views / 100000000).toFixed(0) + "억";
        } else if (views >= 100000000) {
            result = (views / 100000000).toFixed(1) + "억";
        } else if (views >= 100000) {
            result = (views / 10000).toFixed(0) + "만";
        } else if (views >= 10000) {
            result = (views / 10000).toFixed(1) + "만";
        } else if (views >= 1000) {
            result = (views / 1000).toFixed(1) + "천";
        } else {
            result = views.toString();
        }
        return result+'회';
    } else {
        if (views >= 10000000000) {
            result = (views / 1000000000).toFixed(0) + "B";
        } else if (views >= 1000000000) {
            result = (views / 1000000000).toFixed(1) + "B";
        } else if (views >= 10000000) {
            result = (views / 1000000).toFixed(0) + "M";
        } else if (views >= 1000000) {
            result = (views / 1000000).toFixed(1) + "M";
        } else if (views >= 10000) {
            result = (views / 1000).toFixed(0) + "K";
        } else if (views >= 1000) {
            result = (views / 1000).toFixed(1) + "K";
        } else {
            result = views.toString();
        }
        return result+' views';
    }

    return result;
}

export default viewsCalculator;