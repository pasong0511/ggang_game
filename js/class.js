class Hero {
    constructor(el) {
        this.el = document.querySelector(el);
        this.moveX = 0; //히어로가 이동할 거리
        this.speed = 11; //히어로의 스피드
        this.direction = "right"; //히어로가 바라보는 방향(기본은 right)
        this.attackDamage = 1000; //공격 대미지
    }

    /**
     * 키를 누를 때 히어로의 모션을 변경하는 함수
     */
    keyMotion() {
        if (key.keyDown["left"]) {
            this.direction = "left";

            this.el.classList.add("run");
            this.el.classList.add("flip"); //왼쪽 방향 눌렀을때 <- 방향 이동

            //0보다 작은 경우 0까지만 이동(왼쪽에서 벗어남 방지)
            this.moveX = this.moveX <= 0 ? 0 : this.moveX - this.speed; //<- 왼쪽으로 이동해야하기 때문에 마이너스 값(스피드 값 빼면서 감소)
        } else if (key.keyDown["right"]) {
            this.direction = "right";

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
        this.bulletDirection = "right";
        this.init();
    }

    init() {
        this.bulletDirection = hero.direction === "left" ? "left" : "right"; //히어로가 왼쪽을 보고있다면, 수리검이 왼쪽 방향에서 생성

        this.x =
            this.bulletDirection === "right"
                ? hero.moveX + hero.size().width / 2
                : hero.moveX - hero.size().width / 2; //수리검 위치는 히어로가 이동한 거리를 기준으로 담아준다
        this.y = hero.position().bottom - hero.size().height / 2;
        this.distance = this.x; //수리검 생성 위치를 히어로 위치로 생성
        //수리검의 위치
        this.el.style.transform = `translate(${this.x}px, ${this.y}px)`;
        this.parentNode.appendChild(this.el); //수리검 game엘리먼트에 추가
    }

    //수리검을 생성할 때 히어로의 방향을 체크해서 수리검 생성 방향을 결정

    /**
     * 수리검의 이동을 담당하는 함수
     * renderGame()에서 수리검을 계속 호출해서 수리검을 이동시킨다.
     */
    moveBullent() {
        let setRotate = "";
        //수리검을 생성할 때 히어로가 왼쪽을 바라보고 있다면
        if (this.bulletDirection === "left") {
            this.distance -= this.speed;
            setRotate = "rotate(180deg)"; //수리검 방향 전환
        } else {
            this.distance += this.speed; //수리검의 위치를 30식 계속 증가, 이 값을 수리검 거리에 누적해서 이동시킨다.(수리검 오른쪽 이동)
        }

        this.el.style.transform = `translate(${this.distance}px, ${this.y}px) ${setRotate}`;
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
        for (let j = 0; j < allMonsterComProp.arr.length; j++) {
            //수리검의 왼쪽 위치보다 몬스터의 왼쪽 위치보다 큰 경우 수리검 제거 &&
            //수리검의 오른쪽 위치보다 몬스터의 오른쪽 위치보다 큰 경우 수리검 제거
            if (
                this.position().left >
                    allMonsterComProp.arr[j].position().left &&
                this.position().right <
                    allMonsterComProp.arr[j].position().right
            ) {
                //몬스터 길이만큼 배열 돌면서, 공격한 몬스터 찾기

                //수리검 배열만큼 돌면서 현재 충돌한 수리검 찾기
                for (let i = 0; i < bulletComProp.arr.length; i++) {
                    //현재 충돌한 수리검을 찾는 조건문
                    //i번째 인스턴스가 햔재의 수리검 인스턴스와 같다면 : 현재 충돌한 수리검 찾기
                    if (bulletComProp.arr[i] === this) {
                        bulletComProp.arr.splice(i, 1);
                        this.el.remove();

                        //몬스터와 수리검이 충돌했다면 체력 업데이트
                        allMonsterComProp.arr[j].updateHp();
                    }
                }
            }
        }

        //수리검의 왼쪽 위치가 스크린보다 크다면 : 수리검이 화면 오른쪽을 벗어나는 경우
        //수리검의 오른쪽 위치가 스크린보다 작다면 : 수리검이 화면 왼쪽을 벗어나는 경우 수리검 제거
        if (
            this.position().left > gameProp.screenWidth ||
            this.position().right < 0
        ) {
            //수리검 배열만큼 돌면서 현재 화면 밖을 벗어난 수리검 찾기
            for (let i = 0; i < bulletComProp.arr.length; i++) {
                if (bulletComProp.arr[i] === this) {
                    bulletComProp.arr.splice(i, 1);
                    this.el.remove(); //수리검이 화면 밖으로 벗어나는 경우 수리검 엘리먼트 제거
                }
            }
        }
    }
}

class Monster {
    constructor(positionX, hp) {
        this.parentNode = document.querySelector(".game"); //몬스터의 부모가 될 엘리먼트
        this.el = document.createElement("div");
        this.el.className = "monster_box";

        this.elChildren = document.createElement("div"); //몬스터 엘리먼트 생성
        this.elChildren.className = "monster";

        this.hpNode = document.createElement("div");
        this.hpNode.className = "hp";
        this.hpValue = hp;
        this.hpTextNode = document.createTextNode(this.hpValue); //텍스트 노드 생성

        this.positionX = positionX;

        this.init();
    }

    /**
     * 몬스터를 몬스터 박스에 추가
     * 몬스터를 화면(.game)에 추가
     */
    init() {
        this.hpNode.appendChild(this.hpTextNode);
        this.el.appendChild(this.hpNode); //몬스터 박스에 추가
        this.el.appendChild(this.elChildren); //몬스터 박스에 추가
        this.parentNode.appendChild(this.el);
        this.el.style.left = this.positionX + "px";
    }

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
     * 몬스터의 체력을 깍고 업데이트를 하는 함수
     * 체력을 변경하는 메소드 이므로 몬스터와 수리검이 충돌할 때 호출
     */
    updateHp() {
        this.hpValue = Math.max(0, this.hpValue - hero.attackDamage); //몬스터 체력 - 히어로 공격력, 두개의 값중 큰 값이 나오게 해서 0로 안떨어지게 하자
        this.el.childNodes[0].innerText = this.hpValue;
    }
}
