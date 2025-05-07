import timeCalculator from "../../../js/util/timeCalculator.js";

// ------ 비디오 페이지의 댓글 추가 ------
// 테스트용 댓글
// const comments= [
//     {author: 'kim', profile: '../../../images/marcus.svg', commented_at: '1년 전', body: '댓글 추가했습니다', liked: 100, disliked: 1},
//     {author: 'park', profile: '../../../images/marcus.svg', commented_at: '2달 전', body: '영상 잘 봤습니다', liked: 1, disliked: 0},
//     {author: 'test', profile: '../../../images/marcus.svg', commented_at: '24일 전', body: '댓글 내용 테스트중', liked: 30, disliked: 0},
//     {author: 'oliver', profile: '../../../images/marcus.svg', commented_at: '2시간 전', body: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec pulvinar volutpat vehicula. Donec efficitur lacus lectus, blandit aliquet justo euismod ut. Sed justo ex, condimentum non rutrum et, lacinia at odio. Etiam vel consectetur lacus, vel efficitur sem. Suspendisse vestibulum libero sodales velit facilisis, at maximus ligula dignissim. Cras dui augue, dignissim a ullamcorper ut, condimentum eu enim. Quisque eleifend efficitur feugiat. Integer consequat vestibulum risus, sed ornare mi tincidunt non. Nunc malesuada rhoncus diam, vel cursus odio euismod nec. Donec ac laoreet lectus.', liked: 100, disliked: 10},
//     {author: 'loopin', profile: '../../../images/marcus.svg', commented_at: '30분 전', body: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec pulvinar volutpat vehicula. Donec efficitur lacus lectus, blandit aliquet justo euismod ut. Sed justo ex, condimentum non rutrum et, lacinia at odio.', liked: 100, disliked: 1},
// ]

let comments = [];

// 로컬스토리지에 저장된 댓글 불러오기
const storedComments = localStorage.getItem("comments");
if (storedComments) {
    comments = JSON.parse(storedComments);
} else {
    // 초기 테스트용 댓글
    comments = [
        {author: 'kim', profile: '../../../images/marcus.svg', commented_at: '1년 전', body: '댓글 추가했습니다', liked: 100, disliked: 1},
        {author: 'park', profile: '../../../images/marcus.svg', commented_at: '2달 전', body: '영상 잘 봤습니다', liked: 1, disliked: 0},
        {author: 'test', profile: '../../../images/marcus.svg', commented_at: '24일 전', body: '댓글 내용 테스트중', liked: 30, disliked: 0},
        {author: 'oliver', profile: '../../../images/marcus.svg', commented_at: '2시간 전', body: 'Lorem ipsum...', liked: 100, disliked: 10},
        {author: 'loopin', profile: '../../../images/marcus.svg', commented_at: '30분 전', body: 'Lorem ipsum...', liked: 100, disliked: 1},
    ];
    localStorage.setItem("comments", JSON.stringify(comments));
}

// 이미지 경로
const public_url = '../../../images/';

const temp_div = document.createElement("div");

// 템플릿 코드를 사용하여 비디오 컨텐츠 생성
function commentInsert() {
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
        contents.innerHTML = "";

        comments.forEach(el => {

            const clone = comment_template.cloneNode(true);

            clone.querySelector(".commentor-author-profile").src = el.profile;
            clone.querySelector(".comment-author").textContent = el.author;
            clone.querySelector(".comment-uploaded").textContent = el.commented_at;
            clone.querySelector(".comment-body").textContent = el.body;
            clone.querySelector(".comment-liked-number").textContent = el.liked;
            contents.prepend(clone);
        });
    })
}

commentInsert();

//내가 쓴 댓글 추가
const my_comment = document.querySelector("#comment-form");

my_comment.addEventListener("submit", function commentBtn(e) {
    e.preventDefault();
    
    const mycomments = {};
    mycomments.author = document.querySelector("#my-name").textContent;
    mycomments.profile = document.querySelector("#my-profile").src;
    mycomments.commented_at = timeCalculator(new Date());
    mycomments.body = my_comment.querySelector("#comment").value;
    mycomments.liked = 0;
    mycomments.disliked = 0;

    console.log(mycomments);

    comments.push(mycomments);

    localStorage.setItem("comments", JSON.stringify(comments));

    commentInsert();
    my_comment.querySelector("#comment").value = "";
});
