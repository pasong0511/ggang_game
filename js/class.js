class Hero {
    constructor(el) {
        this.el = document.querySelector(el);
        this.moveX = 0; //히어로가 이동할 거리
        this.speed = 16; //히어로의 스피드
    }

    /**
     * 키를 누를 때 히어로의 모션을 변경하는 함수
     */
    keyMotion() {
        if (key.keyDown["left"]) {
            this.el.classList.add("run");
            this.el.classList.add("flip"); //왼쪽 방향 눌렀을때 <- 방향 이동

            this.moveX = this.moveX - this.speed; //<- 왼쪽으로 이동해야하기 때문에 마이너스 값(스피드 값 빼면서 감소)
        } else if (key.keyDown["right"]) {
            this.el.classList.add("run");
            this.el.classList.remove("flip"); //flip 클래스 삭제해서 왼쪽 오른쪽 삭제

            this.moveX = this.moveX + this.speed; //-> 오른쪽으로 이동해야 하기 때문에 플러스 값(스피드 값 더하면서 증가)
        }

        //x 눌러서 공격 클래스 추가
        if (key.keyDown["attack"]) {
            //수리검 중복 나감 방지
            if (!bulletComProp.launch) {
                this.el.classList.add("attack");
                bulletComProp.arr.push(new Bullet()); //공격키를 눌렀을 때 수리검 클래스 생성해서 수리검 관리 배열에 추가

                bulletComProp.launch = true; //launch을 true로 변경해서 수리검 던짐 중지
            }
        }

        //사용자가 모두 키를 뗀 경우 run 클래스 삭제해서 대기모드로 변경
        if (!key.keyDown["left"] && !key.keyDown["right"]) {
            this.el.classList.remove("run");
        }

        //키를 뗀 경우
        if (!key.keyDown["attack"]) {
            this.el.classList.remove("attack");
            bulletComProp.launch = false; //수리검 다시 던질 수 있도록 세팅
        }

        //hero 엘리먼트의 부모인 hero_box에 translateX를 이용해서 hero_box의 위치를 변경시킨다.
        this.el.parentNode.style.transform = `translateX(${this.moveX}px)`;
    }

    /**
     * getBoundingClientRect() : 엘리먼트의 left, right, top, width 등을 알 수 있는 함수
     * 위치 값이 위 또는 아래에 위치값이 맞지 않으면 충돌 처리할 때 문제 발생
     */
    position() {
        return {
            left: this.el.getBoundingClientRect().left,
            right: this.el.getBoundingClientRect().right,
            top: gameProp.screenHeight - this.el.getBoundingClientRect().top, //화면 bottom을 기준으로 한 히어로의 머리 위치
            bottom:
                gameProp.screenHeight -
                this.el.getBoundingClientRect().top -
                this.el.getBoundingClientRect().height, //아래를 기준으로한 바텀 위치
        };
    }

    /**
     * size() : 히어로 엘리먼트의 너비, 높이 구하기
     * getBoundingClientRect()를 이용해서 구할 수도 있지만 offset을 이용해서 구한다.
     */
    size() {
        return {
            width: this.el.offsetWidth,
            height: this.el.offsetHeight,
        };
    }
}

class Bullet {
    constructor() {
        this.parentNode = document.querySelector(".game"); //수리검 엘리먼트를 담을 엘리먼트
        this.el = document.createElement("div"); //수리검 엘리먼트
        this.el.className = "hero_bullet";
        this.x = 0;
        this.y = 0;
        this.speed = 30;
        this.distance = 0;
        this.init();
    }

    init() {
        this.x = hero.position().left + hero.size().width / 2; //수리검 위치는 히어로의 위치를 기준으로 담아준다
        this.y = hero.position().bottom - hero.size().height / 2;
        this.distance = this.x; //수리검 생성 위치를 히어로 위치로 생성
        //수리검의 위치
        this.el.style.transform = `translate(${this.x}px, ${this.y}px)`;
        this.parentNode.appendChild(this.el); //수리검 game엘리먼트에 추가
    }

    /**
     * 수리검의 이동을 담당하는 함수
     * renderGame()에서 수리검을 계속 호출해서 수리검을 이동시킨다.
     */
    moveBullent() {
        console.log(this.distance);
        this.distance += this.speed; //수리검의 위치를 30식 계속 증가, 이 값을 수리검 거리에 누적해서 이동시킨다.

        this.el.style.transform = `translate(${this.distance}px, ${this.y}px)`;
        this.crashBullet();
    }

    /**
     * 수리검의 위치를 알아내는 함수(상속, 오버라이딩으로 중복을 제거할 수 있음)
     */
    position() {
        return {
            left: this.el.getBoundingClientRect().left,
            right: this.el.getBoundingClientRect().right,
            top: gameProp.screenHeight - this.el.getBoundingClientRect().top, //화면 bottom을 기준으로 한 히어로의 머리 위치
            bottom:
                gameProp.screenHeight -
                this.el.getBoundingClientRect().top -
                this.el.getBoundingClientRect().height, //아래를 기준으로한 바텀 위치
        };
    }

    /**
     * 수리검 충돌 시 수리검 제거
     * 수리검이 이동할 때마다 호출되어 화면을 벗어났는지, 충돌을 체크했는지 체크
     */
    crashBullet() {
        //수리검의 왼쪽 위치가 스크린보다 크다면 : 수리검이 화면 오른쪽을 벗어나는 경우
        //수리검의 오른쪽 위치가 스크린보다 작다면 : 수리검이 화면 왼쪽을 벗어나는 경우
        if (
            this.position().left > gameProp.screenWidth ||
            this.position().right < 0
        ) {
            this.el.remove();
        }
    }
}
