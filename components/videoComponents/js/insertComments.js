// ------ 비디오 페이지의 댓글 추가 ------
// 테스트용 댓글
const comments = [
    {author: 'kim', profile: '', commented_at: '2024.10.24', body: '댓글 추가했습니다', liked: 100, disliked: 1},
    {author: 'park', profile: '', commented_at: '2023.04.17', body: '영상 잘 봤습니다', liked: 1, disliked: 0},
    {author: 'test', profile: '', commented_at: '2023.12.10', body: '댓글 내용 테스트중', liked: 30, disliked: 0},
    {author: 'oliver', profile: '', commented_at: '2024.02.15', body: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec pulvinar volutpat vehicula. Donec efficitur lacus lectus, blandit aliquet justo euismod ut. Sed justo ex, condimentum non rutrum et, lacinia at odio. Etiam vel consectetur lacus, vel efficitur sem. Suspendisse vestibulum libero sodales velit facilisis, at maximus ligula dignissim. Cras dui augue, dignissim a ullamcorper ut, condimentum eu enim. Quisque eleifend efficitur feugiat. Integer consequat vestibulum risus, sed ornare mi tincidunt non. Nunc malesuada rhoncus diam, vel cursus odio euismod nec. Donec ac laoreet lectus.', liked: 100, disliked: 10},
    {author: 'loopin', profile: '', commented_at: '2024.09.01', body: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec pulvinar volutpat vehicula. Donec efficitur lacus lectus, blandit aliquet justo euismod ut. Sed justo ex, condimentum non rutrum et, lacinia at odio.', liked: 100, disliked: 1},
]

// 이미지 경로
const public_url = '../../images/';

const temp_div = document.createElement("div");

// 템플릿 코드를 사용하여 비디오 컨텐츠 생성
fetch("../components/videoComponents/html/commentTemplate.html")
    .then(res => {
        if (!res.ok) {
            throw new Error("HTML template 불러오기 실패");
        }
        return res.text();
    })
    .then(data => {
        // 문자열로 로드된 HTML을 DOM으로 파싱
        temp_div.innerHTML = data;

        // 댓글 템플릿 태그
        const comment_template = temp_div.querySelector("#comment-template").content;

        // 댓글 위치
        const contents = document.querySelector("#comments-list");

        comments.forEach(el => {

            const clone = comment_template.cloneNode(true);

            clone.querySelector(".commentor-author-profile").src = el.profile;
            clone.querySelector(".comment-author").textContent = el.author;
            clone.querySelector(".comment-uploaded").textContent = el.commented_at;
            clone.querySelector(".comment-body").textContent = el.body;
            clone.querySelector(".comment-liked-number").textContent = el.liked;
            contents.appendChild(clone);
        })
    })