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
            this.el.classList.add("attack");
        }

        //사용자가 모두 키를 뗀 경우 run 클래스 삭제해서 대기모드로 변경
        if (!key.keyDown["left"] && !key.keyDown["right"]) {
            this.el.classList.remove("run");
        }

        //키를 뗀 경우
        if (!key.keyDown["attack"]) {
            this.el.classList.remove("attack");
        }

        //hero 엘리먼트의 부모인 hero_box에 translateX를 이용해서 hero_box의 위치를 변경시킨다.
        this.el.parentNode.style.transform = `translateX(${this.moveX}px)`;
    }
}
