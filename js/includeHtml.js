// 파비콘 등록
function setFavicon(url, type = "image/x-icon") {
    const link = document.createElement("link");
    link.rel = "icon";
    link.type = type;
    link.href = url;

    const oldLinks = document.querySelectorAll("link[rel='icon']");
    oldLinks.forEach(el => el.remove());
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
