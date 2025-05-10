import NetworkError from "./NetworkError.js";

// fetch 요청에서 응답 코드 기반 에러 던지기
function build_network_error(error_code) {
    switch (error_code) {
        case 400:
            throw new NetworkError(error_code, "잘못된 요청입니다.");
        case 403:
            throw new NetworkError(error_code, "접근 권한이 없습니다.");
        case 404:
            throw new NetworkError(error_code, "요청한 리소스를 찾을 수 없습니다.");
        case 500:
            throw new NetworkError(error_code, "서버 내부 오류입니다.");
        default:
            throw new NetworkError(error_code, "알 수 없는 오류 발생");
    }
}

// 에러 메시지 생성 함수
function build_error_message(message, parent_node) {
    // 에러 메시지 넣을 위치에 자식 요소 모두 제거
    parent_node.replaceChildren();

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

export {build_error_message, build_network_error};