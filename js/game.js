//키코드 key 관리하면 말이 복잡해져서 오브젝트로 관리
const key = {
    keyDown: {}, //키 이벤트 저장
    keyValue: {
        ArrowLeft: "left",
        ArrowRight: "right",
        ArrowUp: "up",
        x: "attack",
    },
};

const windowEvent = () => {
    //키 누를 때 이벤트
    window.addEventListener("keydown", (event) => {
        key.keyDown[key.keyValue[event.key]] = true;
        hero.keyMotion();
    });

    //키 떼었을 때 발생하는 이벤트
    window.addEventListener("keyup", (event) => {
        key.keyDown[key.keyValue[event.key]] = false;
        hero.keyMotion();
    });
};

let hero;
const init = () => {
    hero = new Hero(".hero"); //클래스 이름 넘기기
    windowEvent();
};

window.onload = () => {
    init();
};
