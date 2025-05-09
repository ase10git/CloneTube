// 에러 메시지 생성 함수
function build_error_message(message, parent_node) {
    const error_div = document.createElement("div");
    error_div.classList.add("error-box");

    const error_img_div = document.createElement("div");
    error_img_div.classList.add("error-img-box");
    const error_img = document.createElement("img");
    error_img.src = "../../images/x-octagon-fill.svg";
    error_img.alt = "error";
    error_img_div.appendChild(error_img);

    const error_message = document.createElement("p");
    error_message.classList.add("error-message");
    error_message.textContent = message;
    
    error_div.appendChild(error_img_div);
    error_div.appendChild(error_message);
    parent_node.appendChild(error_div);
}

export {build_error_message};