class Stage {
    constructor() {
        this.isStart = false; //스테이지를 시작하는 플래그
        this.stageStart();
    }

    /**
     * 스테이지 시작 메소드
     * 인스턴스를 생성할 때 함께 생성한다.
     */
    stageStart() {
        this.isStart = true; //시작 플래그 stage 시작하면 true로 변경
        this.stageGuide("START LEVEL 1"); //스테이지 시작
        this.callMonster(); //몬스터 소환
    }

    /**
     * 스테이지 시작을 알리는 텍스트를 화면에 보여주는 메소드
     * stageStart() 에서 호출
     */
    stageGuide(text) {
        this.parentNode = document.querySelector(".game_app");

        this.textBox = document.createElement("div");
        this.textBox.className = "stage_box";
        this.txtNode = document.createTextNode(text);

        this.textBox.appendChild(this.txtNode);
        this.parentNode.appendChild(this.textBox);

        setTimeout(() => {
            this.textBox.remove();
        }, 1500);
    }

    /**
     * 몬스터 생성 함수
     * 스테이지가 시작할 때 실행
     */
    callMonster() {
        for (let i = 0; i <= 10; i++) {
            //보스 몬스터가 나올 수 있는 조건
            if (i === 10) {
                allMonsterComProp.arr[i] = new Monster(
                    greenMonBoss,
                    gameProp.screenWidth + 700 * i
                );
            } else {
                allMonsterComProp.arr[i] = new Monster(
                    greenMon,
                    gameProp.screenWidth + 700 * i
                );
            }
        }
    }

    /**
     * 모든 몬스터를 사냥했는 지 체크하는 함수
     * renderGame() 에서 계속 호출하면서 다 잡았는지 체크
     * allMonsterComprop.arr.length 길이가 0인 경우 -> 모든 몬스터를 사냥 완료
     */
    clearCheck() {
        //몬스터 다 잡고, this.isStart가 true 경우
        if (allMonsterComProp.arr.length === 0 && this.isStart) {
            console.log("몬스터 올킬");
            this.isStart = false;
            this.stageGuide("CLEAR STAGE"); //스테이지 시작
        }
    }
}

class Hero {
    constructor(el) {
        this.el = document.querySelector(el);
        this.moveX = 0; //히어로가 이동할 거리
        this.speed = 11; //히어로의 스피드
        this.direction = "right"; //히어로가 바라보는 방향(기본은 right)
        this.attackDamage = 500000; //공격 대미지
        this.hpProgress = 0;
        this.hpValue = 5000000; //히어로의 기본 체력
        this.defaultHpValue = this.hpValue; //체력 퍼센트를 위해서 초기 hp 저정
        this.realDamage = 0; //실재 공격 데미지
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

    /**
     * 몬스터와 히어로가 충돌 했을 때 히어로의 체력을 깎아주는 메소드
     */
    updateHp(monsterDamage) {
        this.hpValue = Math.max(0, this.hpValue - monsterDamage); //히어로의 체력에서 데미지 빼줌, 0보다 더 떨어지지 않기 위해서 max 처리
        this.progress = (this.hpValue / this.defaultHpValue) * 100;

        const heroHpBox = document.querySelector(".state_box .hp span"); //hp 게이지에 추가
        heroHpBox.style.width = this.progress + "%"; //히어로 체력 퍼센트 대입

        this.crash();

        //히어로의 hp가 0인 경우 : 죽음
        if (this.hpValue === 0) {
            this.dead();
        }
    }

    /**
     * 히어로가 충돌했을 때 모션을 처리할 메소드
     */
    crash() {
        this.el.classList.add("crash");
        //충돌을 풀어주기 위해서 setTimeout으로 crash 클래스 제거
        setTimeout(() => this.el.classList.remove("crash"), 400);
    }

    /**
     * 히어로가 죽었을 때 모션을 처리할 메소드
     */
    dead() {
        this.el.classList.add("dead");
        endGame();
    }

    /**
     * 공격 데미지 확률 조정
     * 수리검과 몬스터가 충돌 했을 때 값을 조정
     * 몬스터가 수리검과 충돌 했을 때마다 호출
     */
    hitDamage() {
        this.realDamage =
            this.attackDamage -
            Math.round(Math.random() * this.attackDamage * 0.1); //총 공격력에서 10% 뺀다.
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
                        //대미지 랜덤값
                        hero.hitDamage();

                        bulletComProp.arr.splice(i, 1);
                        this.el.remove();

                        //수리검과 몬스터가 충돌했다 : 데미지 깎임
                        //damageView()가 updateHp() 보다 먼저 호출해야한다.
                        this.damageView(allMonsterComProp.arr[j]); //수리검과 몬스터의 충돌 x, y 좌표 넘기기 위해 충돌한 몬스터 인스턴스 넘김

                        //몬스터와 수리검이 충돌했다면 체력 업데이트
                        allMonsterComProp.arr[j].updateHp(j); //충돌한 몬스터의 인덱스 j를 넘김
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

    /**
     * 수리검에 맞은 몬스터 데미지를 화면에 보여주는 함수
     * 수리검과 몬스터가 충돌했을 때 호출
     */
    damageView(monster) {
        this.parentNode = document.querySelector(".game_app"); //game_app을 부모로 : 화면을 기준으로 화면 크기를 기준으로  데미지 위치 지정

        this.textDamageNode = document.createElement("div");
        this.textDamageNode.className = "text_damage";

        this.textDamage = document.createTextNode(hero.realDamage);

        this.textDamageNode.appendChild(this.textDamage);
        this.parentNode.appendChild(this.textDamageNode);

        let textPosition = Math.random() * -100; //살짝 왼쪽에서 랜덤하게 보이게 하기
        let damageX = monster.position().left + textPosition; //수리검과 몬스터가 충돌한 x 좌표
        let damageY = monster.position().top; //수리검과 몬스터가 충돌한 y 좌표

        this.textDamageNode.style.transform = `translate(${damageX}px, ${-damageY}px)`;

        //일정 시간 지나면 대미지 제거
        setTimeout(() => {
            this.textDamageNode.remove();
        }, 500);
    }
}

class Monster {
    constructor(property, positionX) {
        this.parentNode = document.querySelector(".game"); //몬스터의 부모가 될 엘리먼트
        this.el = document.createElement("div");
        this.el.className = `monster_box ${property.name}`;

        this.elChildren = document.createElement("div"); //몬스터 엘리먼트 생성
        this.elChildren.className = "monster";

        this.hpNode = document.createElement("div");
        this.hpNode.className = "hp";
        this.hpValue = property.hpValue;
        this.defaultHpValue = property.hpValue;
        this.progress = 0;
        this.hpInner = document.createElement("span"); //텍스트 노드 생성

        this.positionX = positionX; //몬스터 소환 위치

        this.moveX = 0;
        this.speed = property.speed;

        this.crashDamage = property.crashDamage; //몬스터가 충돌했을 때 히어로가 hp 떨어지는 데미지 양

        this.init();
    }

    /**
     * 몬스터를 몬스터 박스에 추가
     * 몬스터를 화면(.game)에 추가
     */
    init() {
        this.hpNode.appendChild(this.hpInner);
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
    updateHp(index) {
        this.hpValue = Math.max(0, this.hpValue - hero.realDamage); //몬스터 체력 - 히어로 공격력, 두개의 값중 큰 값이 나오게 해서 0로 안떨어지게 하자
        this.progress = (this.hpValue / this.defaultHpValue) * 100; //프로그래스 퍼센트 구하기 현재 hp / 초기 hp * 100

        this.el.children[0].children[0].style.width = this.progress + "%"; // 프로그래스 바에 퍼센트 대입

        //몬스터의 체력이 0이 되었을 때 dead() 호출
        if (this.hpValue === 0) {
            this.dead(index);
        }
    }

    /**
     * 몬스터의 체력이 0이 되었을 때 몬스터를 사라지게 하는 함수
     * 몬스터의 체력을 업데이트 하는 곳에서 호출
     */
    dead(index) {
        this.el.classList.add("remove"); //서서히 사라지게 클래스 추가

        //몬스터가 remove 하면 바로 사라져서 "remove" 클래스를 먹지 않않는다 -> setTimeout을 사용해서 딜레이를 주자
        setTimeout(() => this.el.remove(), 200);
        //화면에서 몬스터 엘리먼트를 사라지게 했지만, 아직 몬스터 인스턴스는 남아있음
        //반복문을 돌면서 배열에서 제거해줘야한다.
        //인덱스는 충돌시에 넘겨준다
        allMonsterComProp.arr.splice(index, 1);
    }

    /**
     * 몬스터를 이동시키는 메소드
     * 수리검 이동 메소드와 비슷하게 몬스터 배열(allMonsterComProp.arr)의 길이만큼 반복문 돌면서 moveMonster 메소드를 실행시킨다.
     * 몬스터의 속도와, 몬스터의 이동거리 필요
     * <- 방향으로 움직이므로 speed 값을 빼줌
     * //수식은 강의 참고 ㅋㅋㅋ
     */
    moveMonster() {
        //현재위치 + 몬스터 소환위치 + 몬스터의 너비 -> 맨 왼쪽으로 가면 0 나옴
        //즉 몬스터가 화면 왼쪽을 넘어갔다면
        //히어로가 움직인 위치만큼 이동해서 몬스터 위치 잡고 다시 생성
        if (
            this.moveX +
                this.positionX +
                this.el.offsetWidth +
                hero.position().left -
                hero.moveX <=
            0
        ) {
            this.moveX =
                hero.moveX -
                this.positionX +
                gameProp.screenWidth -
                hero.position().left;
        } else {
            this.moveX -= this.speed; //계속 왼쪽으로 이동
        }

        this.el.style.transform = `translateX(${this.moveX}px)`;

        this.clash(); //몬스터가 이동할 때마다 충돌 체크
    }

    /**
     * 몬스터가 이동할 때마다 호출해서 충돌했는지 체크 하는 함수
     * 히어로와 몬스터의 position 함수로 위치값을 가져와서 충돌 체크
     */
    clash() {
        let rightDiff = 30; //박스 크기와 캐릭터의 여백 존재하여 여백 보정 -> 30px(여백) 만큼 느리게 충돌
        let leftDiff = 90; //왼쪽 여백 보정
        //1. 히어로의 오른쪽 위치와 몬스터의 왼쪽 위치를 비교 : 몬스터가 히어로를 지나갔다면
        //2. 히어로의 왼쪽 값보다 몬스터의 오른쪽 값이 더 큰 경우  : 몬스터가 히어로를 지나가지 않았다면(지나가기 전)
        if (
            hero.position().right - rightDiff > this.position().left &&
            hero.position().left + leftDiff < this.position().right
        ) {
            hero.updateHp(this.crashDamage); //충돌 대미지 넘겨줌
        }
    }
}

//히어로의 hp,
