//키코드 key 관리하면 말이 복잡해져서 오브젝트로 관리
const key = {
    keyDown: {}, //키 이벤트 저장
    keyValue: {
        ArrowLeft: "left",
        ArrowRight: "right",
        ArrowUp: "up",
    },
};

const windowEvent = () => {
    //키 누를때 이벤트
    window.addEventListener("keydown", (event) => {
        console.log(event);

        key.keyDown[key.keyValue[event.key]] = true;
        console.log(key.keyDown);
    });

    window.addEventListener("keyup", (event) => {
        key.keyDown[key.keyValue[event.key]] = false;
        console.log(key.keyDown);
    });
};

const init = () => {
    windowEvent();
};

window.onload = () => {
    init();
};
