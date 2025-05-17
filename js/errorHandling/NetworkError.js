// 커스텀 에러 클래스 정의
function NetworkError(status, message) {
    const instance = new Error(message);
    instance.name = "NetworkError";
    instance.status = status;

    Object.setPrototypeOf(instance, Object.getPrototypeOf(this));
    if (Error.captureStackTrace) {
        Error.captureStackTrace(instance, NetworkError);
    }
    return instance;
}

// 프로토타입 설정
NetworkError.prototype = Object.create(Error.prototype, {
    constructor: {
        value: NetworkError,
        enumerable: false,
        writable: true,
        configurable: true,
    },
});

if (Object.setPrototypeOf) {
    Object.setPrototypeOf(NetworkError, Error);
} else {
    NetworkError.__proto__ = Error;
}

export default NetworkError;