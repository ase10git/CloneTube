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
    dislikedActive: false,
    replies: [] //test
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

    // 정렬 버튼 스타일 유지
    document.querySelectorAll('.sort-options button').forEach(btn => {
        btn.classList.remove('selected'); // 일단 제거..
    });

    if (localStorage.getItem("comment_sort") === "latest") {
        document.querySelectorAll('.sort-options button')[1].classList.add('selected');
    } else {
        document.querySelectorAll('.sort-options button')[0].classList.add('selected');
    }


    // 정렬 기준 불러오기
    const sortOption = localStorage.getItem("comment_sort") || "popular"; // 기본: 인기 댓글순

    // 정렬 기준에 따라 정렬
    let sortedComments = [...comments];
    if (sortOption === "popular") {
        sortedComments.sort((a, b) => b.liked - a.liked);
    } else if (sortOption === "latest") {
        sortedComments.reverse(); // 최신순
    }

    sortedComments.forEach((comment, index) => {
        const clone = document.importNode(template.content, true);
        clone.querySelector(".commentor-author-profile").src = comment.profile;
        clone.querySelector(".comment-author").textContent = comment.author;
        clone.querySelector(".comment-uploaded").textContent = comment.commented_at;
        clone.querySelector(".comment-body").textContent = comment.body;
        clone.querySelector(".comment-liked-number").textContent = comment.liked;

        // 답글 버튼
        const replyBtn = clone.querySelector(".reply-btn");
        const commentBox = clone.querySelector(".comment-box");
        const replyDiv = document.createElement("div");
        replyDiv.classList.add("reply-input-box");
        replyDiv.innerHTML = `
            <img src="../../../images/icon4.svg" alt="my-profile" style="width: 36px; height: 36px; border-radius: 50%;">
            <input type="text" class="reply-input" placeholder="답글을 입력하세요" />
            <div class="reply-action-buttons">
                <button class="reply-cancel-btn">취소</button>
                <button class="reply-submit-btn">답글</button>
            </div>
        `;
        
        replyBtn.addEventListener("click", () => {
            const commentBox = replyBtn.closest(".comment-box");
            const repliesContainer = commentBox.querySelector(".replies-container");
            if (commentBox.querySelector(".reply-input-box")) return; // 중복 방지
        
            const replyDiv = document.createElement("div");
            replyDiv.classList.add("reply-input-box");
            replyDiv.innerHTML = `
                <img src="../../../images/icon4.svg" alt="my-profile" style="width: 36px; height: 36px; border-radius: 50%;">
                <input type="text" class="reply-input" />
                <div class="reply-action-buttons">
                    <button class="reply-cancel-btn">취소</button>
                    <button class="reply-submit-btn">답글</button>
                </div>
            `;
            repliesContainer.parentNode.insertBefore(replyDiv, repliesContainer);

            const submitBtn = replyDiv.querySelector(".reply-submit-btn");
            const inputField = replyDiv.querySelector(".reply-input");

            submitBtn.addEventListener("click", () => {
                const text = inputField.value.trim();
                if (!text) return;
                if (!comment.replies) comment.replies = [];

                comment.replies.push({
                    author: "오르미",
                    commented_at: timeCalculator(new Date()),
                    body: text
                });

                saveComments();
                commentInsert();
            });

            replyDiv.querySelector(".reply-cancel-btn").addEventListener("click", () => {
                replyDiv.remove();
            });
        });
        
        // 답글 목록
        const repliesContainer = clone.querySelector(".replies-container");

        if (comment.replies && comment.replies.length > 0) {
            comment.replies.forEach(reply => {
                const replyEl = document.createElement("div");
                replyEl.className = "reply-item";
                replyEl.innerHTML = `
                    <img src="../../../images/icon4.svg" alt="reply-profile">
                    <div class="reply-body">
                        <div class="reply-author">${reply.author} <span class="reply-date">${reply.commented_at}</span></div>
                        <div class="reply-text">${reply.body}</div>
                    </div>
                `;
                repliesContainer.appendChild(replyEl);
            });
        }


        // 좋아요, 싫어요 버튼
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

    // 신고 버튼 이벤트 등록
    const buttons = document.querySelectorAll(".comment-icon-box");
    buttons.forEach(button => {
        button.addEventListener("click", function (e) {
            // 현재 버튼의 다음 형제 요소 (comment-dropdown)
            const button = e.currentTarget;
            const dropdown = button.nextElementSibling;

            // 드롭다운이 없으면 중단
            if (!dropdown || !dropdown.classList.contains("comment-dropdown")) {
                console.error("comment-dropdown이 없음");
                return;
            }
            // 지금 클릭한 드롭다운이 열려 있었는지 확인
            const isAlreadyOpen = dropdown.classList.contains("visible");

            // 모든 드롭다운 닫기
            document.querySelectorAll(".comment-dropdown").forEach(el => {
                el.classList.remove("visible");
            });
        
            // 지금 클릭한 드롭다운이 이전에 닫혀 있었다면 열기
            if (!isAlreadyOpen) {
                dropdown.classList.add("visible");
            }
        });
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
