class StateHandler {
    constructor(InputHandler, win) {
        this.handler = InputHandler;
        this.win = win;
        this.initEventListeners();
        this.initTouchEventListeners();
    }

    initEventListeners() {
        this.win.addEventListener('keydown', this.handleKeyDown.bind(this));
        this.win.addEventListener('keyup', this.handleKeyUp.bind(this));
        //on click on the window
        this.win.addEventListener('click', () => {
            this.handler.fire = true;
        });
    }

    initTouchEventListeners() {
        const upBtn = document.getElementById('up-btn');
        const leftBtn = document.getElementById('left-btn');
        const rightBtn = document.getElementById('right-btn');

        // Add touch start listeners
        upBtn.addEventListener('touchstart', () => this.handler.forward = true);
        leftBtn.addEventListener('touchstart', () => this.handler.left = true);
        rightBtn.addEventListener('touchstart', () => this.handler.right = true);

        // Add touch end listeners
        upBtn.addEventListener('touchend', () => this.handler.forward = false);
        leftBtn.addEventListener('touchend', () => this.handler.left = false);
        rightBtn.addEventListener('touchend', () => this.handler.right = false);
    }

    handleKeyDown(event) {
        switch (event.keyCode) {
            case 87:
                this.handler.forward = true;
                break;
            case 83:
                this.handler.backward = true;
                break;
            case 65:
                this.handler.left = true;
                break;
            case 68:
                this.handler.right = true;
                break;
            case 16:
                this.handler.shift = true;
                break;
            case 82:
                this.handler.reset = true;
                break;
            case 81:
                this.handler.space = true;
                break;
            case 32:
                this.handler.fire = true;
        }
    }

    handleKeyUp(event) {
        switch (event.keyCode) {
            case 87:
                this.handler.forward = false;
                break;
            case 83:
                this.handler.backward = false;
                break;
            case 65:
                this.handler.left = false;
                break;
            case 68:
                this.handler.right = false;
                break;
            case 16:
                this.handler.shift = false;
                break;
            case 82:
                this.handler.reset = false;
                break;
            case 81:
                this.handler.space = false;
        }
    }
}

export { StateHandler }