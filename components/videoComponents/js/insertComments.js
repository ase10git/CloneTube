import timeCalculator from "../../../js/util/timeCalculator.js";

const urlParams = new URLSearchParams(window.location.search);
const videoId = urlParams.get("video_id");
//초기
let comments = JSON.parse(localStorage.getItem(`comments_${videoId}`)) || [
    {
    author: "kim",
    profile: "../../../images/marcus.svg",
    commented_at: "1년 전",
    body: "댓글 추가했습니다",
    liked: 100,
    disliked: 0,
    likedActive: false,
    dislikedActive: false
    },
    {
    author: "park",
    profile: "../../../images/marcus.svg",
    commented_at: "2달 전",
    body: "영상 잘 봤습니다",
    liked: 1,
    disliked: 0,
    likedActive: false,
    dislikedActive: false
    }
];

function saveComments() {
    localStorage.setItem(`comments_${videoId}`, JSON.stringify(comments));
}

function commentInsert() {
    fetch("../components/videoComponents/html/commentTemplate.html")
    .then((res) => res.text())
    .then((data) => {
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = data;
    const template = tempDiv.querySelector("#comment-template");
    const container = document.querySelector("#comments-list");
    container.innerHTML = "";

    comments.forEach((comment, index) => {
        const clone = document.importNode(template.content, true);
        clone.querySelector(".commentor-author-profile").src = comment.profile;
        clone.querySelector(".comment-author").textContent = comment.author;
        clone.querySelector(".comment-uploaded").textContent = comment.commented_at;
        clone.querySelector(".comment-body").textContent = comment.body;
        clone.querySelector(".comment-liked-number").textContent = comment.liked;
        

        const likeBtn = clone.querySelectorAll(".comment-feedback button")[0];
        const dislikeBtn = clone.querySelectorAll(".comment-feedback button")[1];

        likeBtn.addEventListener("click", () => {
        if (comment.likedActive) {
            comment.liked -= 1;
        } else {
            comment.liked += 1;
            if (comment.dislikedActive) {
            comment.dislikedActive = false;
            }
        }
        comment.likedActive = !comment.likedActive;
        saveComments();
        commentInsert();
    });

        dislikeBtn.addEventListener("click", () => {
            if (comment.dislikedActive) {
                comment.disliked -= 1;
            } else {
                comment.disliked += 1;
                if (comment.likedActive) {
                comment.likedActive = false;
                }
            }
            comment.dislikedActive = !comment.dislikedActive;
            saveComments();
            commentInsert();
        });
        
        container.appendChild(clone);
        });
    });
}

commentInsert();

const form = document.querySelector("#comment-form");
form.addEventListener("submit", (e) => {
    e.preventDefault();
    const input = document.querySelector("#comment");
    const newComment = {
    author: document.querySelector("#my-name").textContent,
    profile: document.querySelector("#my-profile").src,
    commented_at: timeCalculator(new Date()),
    body: input.value,
    liked: 0,
    disliked: 0,
    likedActive: false,
    dislikedActive: false
    };
    comments.push(newComment);
    saveComments();
    input.value = "";
    commentInsert();
});
