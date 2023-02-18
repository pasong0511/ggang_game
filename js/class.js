class Hero {
    constructor(el) {
        this.el = document.querySelector(el);

        console.log(this.el);
    }

    /**
     * 키를 누를 때 히어로의 모션을 변경하는 함수
     */
    keyMotion() {
        if (key.keyDown["left"]) {
            this.el.classList.add("run");
            this.el.classList.add("flip"); //왼쪽 방향 눌렀을때 <- 방향 이동
        } else if (key.keyDown["right"]) {
            this.el.classList.add("run");
            this.el.classList.remove("flip"); //flip 클래스 삭제해서 왼쪽 오른쪽 삭제
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
    }
}
