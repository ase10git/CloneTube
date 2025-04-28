// const buttons = document.querySelectorAll(".comment-icon-box");
// buttons.forEach(button => {
//     button.addEventListener('click', function click_report(e) {
//         const button = e.currentTarget;
//         const report = button.nextElementSibling; // 바로 옆 형제 요소 가져오기
    
//         if (!report || !report.classList.contains('comment-dropdown')) {
//             console.error("comment-dropdown이 없음");
//             return;
//         }
    
//         if (report.style.display === 'none' || report.style.display === '') {
//             report.style.display = 'block';
//         } else {
//             report.style.display = 'none';
//         }
//     });
// });