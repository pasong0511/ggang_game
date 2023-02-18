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

/**
 * loadImg() : css에서 사용하는 이미지를 미리 로드시키기 위한 함수
 * CSS에서 작성한 히어로 이미지를 미리 로드되게 한다.
 * css background 이미지를 이용해서 인터렉션을 구현하는 경우
 * 나중에 로드되는 경우 키를 눌렀을 때 이미지가 깜빡이게 보일 수 있다.
 * 이미지가 처음에 로드되지 않고, 스크립트에서 css 클래스를 추가할 때
 * 이미지가 추가되는 것을 방지합니다.
 *
 * 처음 페이지를 불러올 때 모든 이미지를 로드해야 하므로, init 에서 호출한다.
 */
const loadImg = () => {
    //미리 로드할 이미지는 배열에 담아둔다.
    const preLoadImgSrc = [
        "../images/ninja_attack.png",
        "../images/ninja_run.png",
    ];

    //반복문으로 배열에 있는 모든 이미지가 로드될 수 있도록 처리한다.
    preLoadImgSrc.forEach((arr) => {
        const img = new Image();
        img.src = arr;
    });
};

let hero;
const init = () => {
    hero = new Hero(".hero"); //클래스 이름 넘기기
    loadImg(); //css에서 사용하는 이미지를 미리 로드시키기 위한 함수
    windowEvent();
};

window.onload = () => {
    init();
};
