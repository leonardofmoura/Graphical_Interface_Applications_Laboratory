class PrologInterface {
    constructor(orchestrator) {
        this.orchestrator = orchestrator;

        this.connected = false;

        this.init();
    }

    init() {
        let initHandler = function(data) {
            if (data.target.response == 'handshake') {
                console.log('Connected to Prolog server');
                this.interface.connected = true; //this is an instance of XMLHttpRequest!!
            }
            else  {
                console.log('Could not connect to prolog server');
            }
        }

        this.getPrologRequest('handshake',initHandler);
    }

    getPrologRequest(requestString, onSuccess, onError, port) {
    var requestPort = port || 8086;
    var request = new XMLHttpRequest();
    request.open('GET', 'http://localhost:'+requestPort+'/'+requestString, true);

    request.onload = onSuccess || function(data){console.log("Request successful. Reply: " + data.target.response);};
    request.onerror = onError || function(){console.log("Error waiting for response");};
    request.interface = this; //Makes the target be able to access interface methods
    request.orchestrator = this.orchestrator; //Makes the request be able to comunicato with the orchestrator

    request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
    request.send();
    }

    checkMove(x,y,value,boardArray) {
        let checkMoveHandler = function(data) {
            console.log(data.target.response);
        }

        let requestString = 'check_move(' + x + ',' + y + ',' + value + ',' + BoardParser.boardArrayToListString(boardArray[0]) + ',' + BoardParser.boardArrayToListString(boardArray[1]) + ')';

        if (this.connected) {
            this.getPrologRequest(requestString,checkMoveHandler);
        }
        else {
            console.error("Not connected to the server");
        }
    }

    createBoard() {
        let handleBoardReply = function(data) {
            let string = data.target.response;

            let board = BoardParser.parseCompleteBoard(string);

            let boardState = new BoardState(board);

            this.orchestrator.notifyBoardCreation(boardState);
        }

        if (this.connected) {
            this.getPrologRequest('start_board',handleBoardReply);
        }
        else {
            console.error("Not connected to the server");
        }
    }

    placePiece(x,y,value,boardArray) {
        let placePieceHandler = function(data) {
            let string = data.target.response;
            let board = BoardParser.parseCompleteBoard(string);

            this.orchestrator.notifyBoardUpdate(new BoardState(board));
        }

        let requestString = 'place_piece(['+x+','+y+','+value+'],' + BoardParser.compileBoardString(boardArray[0],boardArray[1],boardArray[2])+')';
        
        if (this.connected) {
            this.getPrologRequest(requestString,placePieceHandler);
        }
        else {
            console.error("Not connected to the server");
        }
    }

    getPossibleMoves(boardArray,value) {
        let possibleMovesHandler = function(data) {
            let string = data.target.response;
            let array = BoardParser.parseBoard(string);

            this.orchestrator.notifyPossibleMovesReceived(array);
        }

        
        let request = 'get_possible_moves(['+BoardParser.boardArrayToListString(boardArray[0])+','+BoardParser.boardArrayToListString(boardArray[1])+'],'+value+')';

        if (this.connected) {
            this.getPrologRequest(request,possibleMovesHandler);
        }
        else {
            console.error("Not connected to the server");
        }
    }

    testGameOver(boardArray) {

        let gameOverHandler = function(data) {
            if (data.target.response == "yes") {
                this.orchestrator.notifyBoardEvaluation(true);
            }
            else {
                this.orchestrator.notifyBoardEvaluation(false);
            }
        }

        let resquestString = 'game_over(['+BoardParser.boardArrayToListString(boardArray[0])+','+BoardParser.boardArrayToListString(boardArray[1])+'])';

        if (this.connected) {
            this.getPrologRequest(resquestString,gameOverHandler);
        }
        else {
            console.error("Not connected to the server");
        }
    }

    getRandomMove(boardArray) {
        let randomMoveHandler = function(data) {
            let string = data.target.response;

            let array = BoardParser.parseInfluence(string);

            this.orchestrator.notifyBotPlay(array);
        }

        let requestString = 'get_bot_move(['+BoardParser.boardArrayToListString(boardArray[0])+','+BoardParser.boardArrayToListString(boardArray[1])+'])';

        if (this.connected) {
            this.getPrologRequest(requestString,randomMoveHandler);
        }
        else {
            console.error("Not connected to the server");
        }
    }

    getWinner(boardInfluenceArray) {
        let winnerRequestHandler = function(data) {
            if (data.target.response == "1") {
                this.orchestrator.notifyWinner(Player.playerOne);
            }
            else if (data.target.response == "-1") {
                this.orchestrator.notifyWinner(Player.playerTwo);
            }
        }

        let request = 'get_winner('+BoardParser.influenceToListString(boardInfluenceArray)+')';
        
        if (this.connected) {
            this.getPrologRequest(request,winnerRequestHandler);
        }
        else {
            console.error("Not connected to the server");
        }
    }


    handshake() {
        let handleBoardReply = function(data) {
            console.log(data.target.response);
        }

        this.getPrologRequest('handshake',handleBoardReply);
    }

    quit() {
        let handleQuitReply = function(data) {
            console.log(data.target.response);
        }

        if (this.connected) {
            this.getPrologRequest('quit',handleQuitReply);
        }
        else {
            console.log("Not connected to the server");
        }
    }
}