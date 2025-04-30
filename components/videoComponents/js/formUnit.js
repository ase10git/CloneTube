//구독자 수 단위 계산
function subscribersUnit(views) {

    if (views / 100000000 >= 1) {
        return `${(views / 100000000).toFixed(0)}억 ${((views % 100000000) / 10000).toFixed(0)}만`
    } else if (views / 10000000 >= 1) {
        return `${(views / 10000000).toFixed(0)},${((views % 10000000) / 10000).toFixed(0)}만`
    } else if (views / 100000 >= 1) {
        const val = (views / 10000).toFixed(1);
        if (val.endsWith('.0')) return `${parseInt(val)}만`;
        return `${val}만`;
    } else if (views / 10000 >= 1) {
        const val = (views / 10000).toFixed(2);
        if (val.endsWith('.00')) return `${parseInt(val)}만`;
        if (val.endsWith('0')) return `${parseFloat(val).toFixed(1)}만`;
        return `${val}만`;
    } else if (views / 1000 >= 1) {
        const val = (views / 1000).toFixed(2);
        if (val.endsWith('.00')) return `${parseInt(val)}천`;
        if (val.endsWith('0')) return `${parseFloat(val).toFixed(1)}천`;
        return `${val}천`;
    } else {
        return `${views}`;
    }
}

function viewsUnit(views) {
    if (views / 100000000 >= 1) {
        return `${(views / 100000000).toFixed(0)}억 ${((views % 100000000) / 10000).toFixed(0)}만`
    } else if (views / 10000000 >= 1) {
        return `${(views / 10000000).toFixed(0)},${((views % 10000000) / 10000).toFixed(0)}만`
    } else if (views / 1000000 >= 1) {
        return `${(views / 10000).toFixed(0)}만`
    }else if (views / 100000 >= 1) {
        return `${(views / 10000).toFixed(0)}만`
    } else if (views / 10000 >= 1) {
        const val = (views / 10000).toFixed(1);
        return val.endsWith('.0') ? `${parseInt(val)}만` : `${val}만`;
    } else if (views / 1000 >= 1) {
        const val = (views / 1000).toFixed(1);
        return val.endsWith('.0') ? `${parseInt(val)}천` : `${val}천`;
    } else {
        return `${views}`;
    }
}

export {subscribersUnit, viewsUnit};