/**
 * Represents a board State 
 */
class BoardState {
    constructor(boardArray) {
        this.board = boardArray[0];
        this.boardBlocks = boardArray[1];
        this.boardInfluences = boardArray[2];
    }

    setBoard(board) {
        this.board = board[0];
        this.boardBlocks = board[1];
        this.boardInfluences = board[2];
    }

    getBoard() {
        return [this.board,this.boardBlocks,this.boardInfluences];
    }
}