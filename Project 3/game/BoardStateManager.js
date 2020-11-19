class BoardStateManager {
    constructor() {
        this.boardStates = [];
    }

    pushBoardState(boardState) {
        this.boardStates.push(boardState);
    }

    popBoardState() {
        return this.boardStates.pop();
    }

    getCurrentBoardState() {
        return this.boardStates[this.boardStates.length-1];
    }

    reset() {
        this.boardStates = [];
    }

    boardInited() {
        if (this.boardStates.length == 0) {
            return false;
        }
        else {
            return true;
        }
    }
}