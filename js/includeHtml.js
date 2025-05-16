// 파비콘 등록
// <link rel="icon" href="/path/to/favicon.svg" type="image/svg+xml">
function setFavicon(url, type = "image/x-icon") {
    const link = document.createElement("link");
    link.rel = "icon";
    link.type = type;
    link.href = url;

    // 기존 파비콘이 있으면 제거
    const oldLinks = document.querySelectorAll("link[rel='icon']");
    oldLinks.forEach(el => el.remove());

    // <head>에 파비콘 추가
    document.head.appendChild(link);
};

setFavicon("/images/favicon/youtubeFavicon.svg");


function includeHTML(targetId, url) {
    fetch(url)
        .then(res => res.text())
        .then(html => {
        document.getElementById(targetId).innerHTML = html;
        })
        .catch(err => console.error("UI include error:", err));
}
