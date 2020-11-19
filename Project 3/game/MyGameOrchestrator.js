const GameState = Object.freeze({
    "mainMenu"      : 1,    //Showing main menu
    "sceneLoading"  : 2,    //The scene graph is loading
    "player1Turn"   : 3,    //Player 1 is playing
    "renderMoves"   : 4,    //The animation is playing
    "player2Turn"   : 5,    //Player2 is playing
    "evaluateEnd"   : 6,    //Prolog is evaluating if the game is in a final state
    "endGame"       : 7,    //The game is over
});

const GameEvent = Object.freeze({
    "startPlay"     : 1,    //Start game button has been pressed
    "loadComplete"  : 2,    //The scene has finished loading
    "playMade"      : 3,    //The player has made his play
    "animComplete"  : 4,    //The animation is completed
    "nextP1"        : 5,    //The player 1 plays next
    "nextP2"        : 6,    //The player 2 plays next
    "gameFinished"  : 7,    //The game has finished 
    "playAgain"     : 8,    //Another game will start -> going to menu
    "sceneChange"   : 9,    //The scene was change and has to be loaded
});

const PlayerMode = Object.freeze({
    "twoPlayers"    : 1,    //Player 1 vs Player 2
    "playerBot"     : 2,    //Player 1 vs Bot
    "twoBots"       : 3,    //Bot 1 vs Bot 2    
    "none"          : 4,    //No mode selected
});

const Player = Object.freeze({
    "playerOne"     :1,
    "playerTwo"     :2,     
});

const PlayerType = Object.freeze({
    "human"         : 1,    //Represents a human playee
    "bot"           : 2,    //Represents a bot
});

class MyGameOrchestrator {    
    constructor(scene) {
        this.scene = scene;

        this.currentState = GameState.sceneLoading;
        this.savedState = GameState.mainMenu;   //The state the game was in before a loading

        this.interfaceConected = false;

        this.selectedScene = null;
        this.sceneNames = [];
        this.sceneLoaded = false;

        this.playerMode = PlayerMode.none;
        this.nextPlayer = Player.playerOne;

        this.currentPlayValue = null;
        this.currentPlayCoords = null;
        this.score = [0,0];

        this.init();
    }

    /**
     * Initializes the orchestrator
     */
    init() {
        this.prologInterface = new PrologInterface(this);
        this.interface = this.scene.interface;
        this.sceneParser = new SceneParser(this);
        this.boardStateManager = new BoardStateManager();
        this.gameboard = null;
    }

    /**
     * Executed when the scenes file is parsed
     * @param scenes 
     */
    onScenesParsed(scenes) {
        for (var key in scenes) {
            this.sceneNames.push(key); 
        }
        this.selectedScene = this.sceneParser.defaultScene;
        this.interface.loadScenes();
        this.updateScene();
    }

    updateScene() {
        if (this.currentState != GameState.sceneLoading) {
            this.manageEvent(GameEvent.sceneChange);
        }
        this.interface.reset();
        this.theme = new MySceneGraph(this.sceneParser.scenes[this.selectedScene],this.scene);
    } 

    initMainMenu() {
        this.scene.changeCamera("defaultCamera");
        this.mainMenu = new MainMenu(this.scene,this,this.theme.mainMenuTransformation,this.theme.mainMenuTexture,[this.theme.playButtonTexture,this.theme.twoPlayersButtonTex,this.theme.playerBotButtonTex,this.theme.twoBotsButtonTex],
            [this.gameboard.playerOnePieceTextures,this.gameboard.playerTwoPieceTextures],this.score);
    }

    saveState() {
        this.savedState = this.currentState;
    }

    notifyUndo() {
        if (this.boardStateManager.boardStates.length > 2) {
            this.boardStateManager.popBoardState();
            this.boardStateManager.popBoardState();
            this.gameboard.setState(this.boardStateManager.getCurrentBoardState().board);
        }
        else if (this.boardStateManager.boardStates.length == 2) {
            this.boardStateManager.popBoardState();
            this.boardStateManager.popBoardState();
            this.gameboard.reset();
        }
    }

    notifyPieceSelection(piece,player) {
        this.currentPlayValue = piece;
        this.currentPlayer = player

        let boards = this.boardStateManager.getCurrentBoardState();
        this.gameboard.unhighlightTiles();

        this.prologInterface.getPossibleMoves([boards.board,boards.boardBlocks],this.currentPlayValue);
    }

    notifyPossibleMovesReceived(moveArray) {
        this.gameboard.unhighlighAllPieces(this.currentPlayer);
        this.gameboard.highlightPiece(this.currentPlayValue,this.currentPlayer);
        if (!this.gameboard.pieceSelected) {
            this.gameboard.pieceSelected = true;
        }
        if (moveArray[0] != "") {
            this.gameboard.highlightTiles(moveArray); 
        }
    }

    notifyPlayMade(play) {
        this.currentPlayCoords = play;

        let boards = this.boardStateManager.getCurrentBoardState().getBoard()

        if (this.currentPlayer == Player.playerOne) {
            this.prologInterface.placePiece(play[0],play[1],this.currentPlayValue,boards);
        } 
        else if (this.currentPlayer == Player.playerTwo) {
            this.prologInterface.placePiece(play[0],play[1],-1*this.currentPlayValue,boards);
        }
    }

    notifyBoardUpdate(board) {
        this.gameboard.unhighlightTiles();
        this.boardStateManager.pushBoardState(board);
        this.manageEvent(GameEvent.playMade);
    }

    notifyBoardCreation(board) {
        this.boardStateManager.pushBoardState(board);
    }

    notifyBoardEvaluation(result) {
        if (result) {
            this.manageEvent(GameEvent.gameFinished);
        }
        else if (this.currentPlayer == Player.playerOne) {
            this.manageEvent(GameEvent.nextP2);
        }
        else if (this.currentPlayer == Player.playerTwo) {
            this.manageEvent(GameEvent.nextP1);
        }
    }

    notifyAnimationComplete() {
        this.manageEvent(GameEvent.animComplete);
    }

    notifyBotPlay(playArray) {
        this.currentPlayCoords = [Number(playArray[0]),Number(playArray[1])];
        this.currentPlayValue = Number(playArray[2]);

        let boards = this.boardStateManager.getCurrentBoardState().getBoard()

        if (this.currentPlayer == Player.playerOne) {
            this.prologInterface.placePiece(this.currentPlayCoords[0],this.currentPlayCoords[1],this.currentPlayValue,boards);
        } 
        else if (this.currentPlayer == Player.playerTwo) {
            this.prologInterface.placePiece(this.currentPlayCoords[0],this.currentPlayCoords[1],-1*this.currentPlayValue,boards);
        }
    }

    notifyWinner(winner) {
        if (winner == Player.playerOne) {
            console.log("Player one wins");
            this.score[0] += 1;
        }
        else if (winner == Player.playerTwo) {
            console.log("Player two wins");
            this.score[0] += 1;
        }
        if (this.score[0] > 8 || this.score[1] > 8) {
            this.score = [0,0];
        }

        this.manageEvent(GameEvent.playAgain);
    }

    /**
     * Loads a state
     * @param {GameState} state 
     */
    initState(state) {
        switch(state) {
            case GameState.mainMenu:
                this.prologInterface.createBoard();
                this.initMainMenu();
                this.gameboard.reset();
                return;

            case GameState.player1Turn:
                this.currentPlayer = Player.playerOne;
                if (this.playerMode == PlayerMode.twoPlayers || this.playerMode == PlayerMode.playerBot) {
                    this.gameboard.enable(Player.playerOne);
                    this.scene.changeCamera("player1");
                    this.currentPlayValue = null;
                    this.currentPlayCoords = null;
                    this.gameboard.pieceSelected = false;
                }
                else if (this.playerMode == PlayerMode.twoBots) {
                    this.currentPlayValue = null;
                    this.currentPlayCoords = null;
                    this.scene.changeCamera("player1");

                    let boards = this.boardStateManager.getCurrentBoardState();
                    this.gameboard.unhighlightTiles();

                    this.prologInterface.getRandomMove([boards.board, boards.boardBlocks]);
                    this.currentPlayer = Player.playerOne;
                }
                return;

            case GameState.player2Turn:
                this.currentPlayer = Player.playerTwo;
                if (this.playerMode == PlayerMode.twoPlayers) {
                    this.gameboard.enable(Player.playerTwo);
                    this.scene.changeCamera("player2");
                    this.currentPlayValue = null;
                    this.currentPlayCoords = null;
                    this.gameboard.pieceSelected = false;
                }
                else if (this.playerMode == PlayerMode.playerBot || this.playerMode == PlayerMode.twoBots) {
                    this.currentPlayValue = null;
                    this.currentPlayCoords = null;
                    this.scene.changeCamera("player2");

                    let boards = this.boardStateManager.getCurrentBoardState();
                    this.gameboard.unhighlightTiles();

                    this.prologInterface.getRandomMove([boards.board, boards.boardBlocks]);
                    this.currentPlayer = Player.playerTwo; 
                }

                return;

            case GameState.sceneLoading:
                this.sceneLoaded = false;
                return;

            case GameState.evaluateEnd:
                let boards = this.boardStateManager.getCurrentBoardState();
                this.prologInterface.testGameOver([boards.board,boards.boardBlocks]);
                return;

            default:
                return;
        }
    }

    displayState(state) {
        switch(state) {
            case GameState.mainMenu:
                this.mainMenu.display();
                return;

            case GameState.player2Turn:
                //Notify the gameboard if the player selected a piece
                if (this.currentPlayValue != null && !this.gameboard.pieceSelected)  {
                    this.gameboard.pieceSelected = true; 
                }
                return;
        }
    }

    /**
     * Manages the ocurrence of an event
     * @param {GameEvent} event 
     */
    manageEvent(event) {
        //Whenever there's a scene change the game enters loading state
        if (event == GameEvent.sceneChange) {
            this.saveState();
            this.initState(GameState.sceneLoading);
            this.currentState = GameState.sceneLoading;
            return;
        }

        switch(this.currentState) {
            case GameState.mainMenu:
                if (event == GameEvent.startPlay) {
                    if (this.boardStateManager.boardInited()) {
                        // this.scene.changeCamera("player1");
                        this.initState(GameState.player1Turn);
                        this.currentState = GameState.player1Turn;
                    }
                    else {
                        console.error("Board not initiated");
                    }
                }
                else {
                    //Process
                    this.currentState = GameState.mainMenu;
                }
                return;

            case GameState.sceneLoading:
                if (event == GameEvent.loadComplete) {
                    this.gameboard = this.theme.gameboard;
                    this.gameboard.setOrchestrator(this);
                    if (this.boardStateManager.boardInited()) {
                        this.gameboard.setState(this.boardStateManager.getCurrentBoardState().board);
                    }
                    this.sceneLoaded = true;
                    this.initState(this.savedState);
                    this.currentState = this.savedState;
                }
                else {
                    //Process
                    this.currentState = GameState.mainMenu;
                }
                return;

            case GameState.player1Turn:
                if (event == GameEvent.playMade) {
                    this.gameboard.enable(null); //Locks the Gameboard
                    this.gameboard.unhighlighAllPieces(Player.playerOne);
                    this.gameboard.placePieceAnim(this.currentPlayValue,this.currentPlayCoords,Player.playerOne);
                    this.currentState = GameState.renderMoves;
                }
                else {
                    this.gameboard.enable(null); //Locks the Gameboard
                    this.currentState = GameState.mainMenu;
                }
                return;

            case GameState.renderMoves:
                if (event == GameEvent.animComplete) {
                    this.initState(GameState.evaluateEnd);
                    this.currentState = GameState.evaluateEnd;
                }
                else {
                    //Process
                    this.currentState = GameState.mainMenu;
                }
                return;

            case GameState.player2Turn:
                if (event == GameEvent.playMade) {
                    this.gameboard.enable(null); //Locks the Gameboard
                    this.gameboard.unhighlighAllPieces(Player.playerTwo);
                    this.gameboard.placePieceAnim(this.currentPlayValue,this.currentPlayCoords,Player.playerTwo);
                    this.currentState = GameState.renderMoves;
                }
                else {
                    //Process
                    this.currentState = GameState.mainMenu;
                }
                return;

            case GameState.evaluateEnd:
                if (event == GameEvent.gameFinished) {
                    this.prologInterface.getWinner(this.boardStateManager.getCurrentBoardState().boardInfluences);
                    this.currentState = GameState.endGame;
                }
                else if (event == GameEvent.nextP1) {
                    this.initState(GameState.player1Turn);
                    this.currentState = GameState.player1Turn;
                }
                else if (event == GameEvent.nextP2) {
                    this.initState(GameState.player2Turn);
                    this.currentState = GameState.player2Turn;
                }
                return;

            case GameState.endGame:
                if (event == GameEvent.playAgain) {
                    this.initState(GameState.mainMenu);
                    this.currentState = GameState.mainMenu;
                }
                return;
        }
    }

    /**
     * Updates animations
     * @param t 
     */
    update(t) {
        //Update all animations
        if (this.scene.sceneInited && !this.scene.timeSet) {
            this.scene.graph.setAnimationStartingTime(t);
            this.scene.timeSet = true;
        }
        else if (this.scene.sceneInited && this.scene.timeSet) {
            this.scene.graph.updateAnimations(t);
        }

        if (this.scene.sceneInited) {
            this.scene.secCamera.setTime(t);
            this.mainMenu.updateButtons(t);
            this.gameboard.updateTimes(t);
        }
        this.scene.camera.update(t);
    }

    /**
     * Processes the pick of an object
     * ids 1->8 -> Reserved for menu buttons
     * ids 100->181 Reserved for tiles
     * ids 20->40 Reserved dor pieces
     * ids 80->90 Reserved for interface buttons
     */
    processPicking() {
        if (this.scene.pickMode == false)  {
            if (this.scene.pickResults != null && this.scene.pickResults.length > 0) {
				for (var i = 0; i < this.scene.pickResults.length; i++) {
					var obj = this.scene.pickResults[i][0];
					if (obj) {
                        obj.execPick();					
					}
				}
				this.scene.pickResults.splice(0, this.scene.pickResults.length);
			}
        }
    }

    /**
     * Renders the scene.
     */
    render(activeCamera) {
        // ---- BEGIN Background, camera and axis setup
        this.scene.camera = activeCamera;
        this.interface.setActiveCamera(this.scene.stubCamera); //Block camera moviment

        // Clear image and depth buffer everytime we update the scene
        this.scene.gl.viewport(0, 0, this.scene.gl.canvas.width, this.scene.gl.canvas.height);
        this.scene.gl.clear(this.scene.gl.COLOR_BUFFER_BIT | this.scene.gl.DEPTH_BUFFER_BIT);

        // Initialize Model-View matrix as identity (no transformation
        this.scene.updateProjectionMatrix();
        this.scene.loadIdentity();

        // Apply transformations corresponding to the camera position relative to the origin
        this.scene.applyViewMatrix();

        this.scene.pushMatrix();

        if (this.scene.drawAxis) {
            this.scene.axis.display();
        }

        if (this.scene.sceneInited) {
            //Process light interface
            this.scene.processLights();

            // Draw axis
            this.scene.setDefaultAppearance();

            // Displays the scene (MySceneGraph function).
            this.scene.defaultMat.apply();
            
            this.displayState(this.currentState);
            this.theme.displayScene();
        }

        this.scene.popMatrix();
        // ---- END Background, camera and axis setup
    }

    /**
     * Displays the scene
     */
    display() {
        if (this.sceneLoaded)  {
            this.processPicking();
            // this.scene.clearPickRegistration();
    
            if (this.scene.showSecCam) { //Only render rtt if sec cam display is active
                this.scene.rtt.attachToFrameBuffer();
                this.render(this.scene.activeSecCamera);
                this.scene.rtt.detachFromFrameBuffer();       
            }
    
            this.render(this.scene.activeCamera);
    
            if (this.scene.showSecCam) { //Only show the cam if display is active
                this.scene.gl.disable(this.scene.gl.DEPTH_TEST);
                this.scene.secCamera.display();
                this.scene.gl.enable(this.scene.gl.DEPTH_TEST);
            }
        }
    }
}