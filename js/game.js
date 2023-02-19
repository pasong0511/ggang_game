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

//화면 너비, 높이가 변경되었을 때 공통으로 사용할 값
const gameProp = {
    screenWidth: window.innerWidth, //화면 너비
    screenHeight: window.innerHeight, //화면 높이
};

//생성된 수리검을 관리할 배열을 만든다.
const bulletComProp = {
    launch: false, //수리검이 중복해서 나가는 것을 방지하기 위한 플래그
    arr: [], //attack 키를 눌렀을 때 생성된 수리검 인스턴스를 담음
};

const gameBackground = {
    gameBox: document.querySelector(".game"), //패럴럭스 효과를 위해 game 엘리먼트 추가
    //게임 엘리먼트에 히어로가 이동한 값을 적용
    gameSky: document.querySelector(".sky"),
};

/**
 * 배경을 계속 이동시켜주는 함수
 * 히어로가 이동한 만큼 배경도 이동시켜준다.
 * 히어로가 움직인 방향의 반대방향으로 움직여줘야한다
 * renderGame() 함수에서 계속 호출하면서 배경을 계속 이동시켜준다.
 */
const setGameBackground = () => {
    //이 값이 0부터 시작한다면 히어로가 중간쯤 왔을 때 배경이 움직임
    let parallaxValue = Math.min(
        0,
        (hero.moveX - gameProp.screenWidth / 3) * -1
    ); //히어로가 중간에 위치 할때 배경 움직임

    gameBackground.gameBox.style.transform = `translateX(${parallaxValue}px)`; //히어로가 이동한 만큼 배경 이동
    gameBackground.gameSky.style.transform = `translateX(${
        parallaxValue * 0.2
    }px)`; //히어로가 이동한 만큼 하늘 배경 이동
};

/**
 * renderGame() : 키가 눌렸을 떄 키 딜레이를 줄야서 캐릭터가 자연스럽게 움직 일 수 있게 하는 함수
 * 히어로 캐릭터의 움직임이 자연스럽지 못하다
 * 원인은 key 이벤트가 연속적으로 발생했을 때 키눌림 이벤트의 딜레이 차이가 있기 때문
 * 재귀호출을 이용하여 수행
 * 초당 약 60 프레임을 그리며 renderGame 함수가 무한 반복되면서 keyMotion 함수를 계속적으로 수행한다.
 * 키 값의 상태를 계속 체크하고 히어로의 움직임에 필요한 값을 변경하면서 키 눌림의 딜레이 없이 부드럽게 움직이게 한다.
 *
 * 처음 페이지가 실행되었을 때 호출
 *  */
const renderGame = () => {
    hero.keyMotion(); //키가 눌렸을 때 발생하는 이벤트는 renderGame함수에서 계속 호출
    setGameBackground(); //배경을 이동시켜주는 함수 계속 호출
    //다수의 수리검을 관리하기 위해서 수리검 개수만큼 반복
    bulletComProp.arr.forEach((arr, i) => {
        arr.moveBullent();
    });

    window.requestAnimationFrame(renderGame);
};

const windowEvent = () => {
    //키 누를 때 이벤트
    window.addEventListener("keydown", (event) => {
        key.keyDown[key.keyValue[event.key]] = true;
    });

    //키 떼었을 때 발생하는 이벤트
    window.addEventListener("keyup", (event) => {
        key.keyDown[key.keyValue[event.key]] = false;
    });

    //화면의 리사이즈가 발생 했을 때, 수리검 등의 위치를 현재 화면의 높이와 너비에 맞게 재조정
    window.addEventListener("resize", (event) => {
        gameProp.screenWidth = window.innerWidth; //현재 화면의 너비
        gameProp.screenHeight = window.innerHeight; //현재 화면의 높이
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
 *
 * window.requestAnimationFrame() :
 * 브라우저에게 수행하기를 원하는 애니메이션을 알리고
 * 다음 리페인트가 진행되기 전에 해당 애니메이션을 업데이트하는 함수를 호출하게 합니다.
 * 이 메소드는 리페인트 이전에 실행할 콜백을 인자로 받습니다.
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
let monster;
const init = () => {
    hero = new Hero(".hero"); //클래스 이름 넘기기
    monster = new Monster(); //몬스터 클래스 생성
    loadImg(); //css에서 사용하는 이미지를 미리 로드시키기 위한 함수
    windowEvent();
    renderGame(); //키가 눌렸을 떄 키 딜레이를 줄야서 캐릭터가 자연스럽게 움직 일 수 있게 하는 함수
};

window.onload = () => {
    init();
};
