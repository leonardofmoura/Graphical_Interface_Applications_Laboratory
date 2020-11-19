/**
 * MyGameBoard
 * @constructor
 * @extends Primitive
 * @param scene - Reference to MyScene object
 * @param boardpl - Game Board matrix received from prolog
 * @param boardinf - Board list of influences
 */

class MyGameBoard extends Primitive {

    constructor(scene){
        super (scene);
        this.scene = scene;
        this.tiles = []; //array de Tiles.
        this.playerOnePieces = [];
        this.playerTwoPieces = [];
        this.enabled = null;    //The player that can interact with the board
        this.pieceSelected = false;
        this.time = null;
        this.interface = null;

        this.playerOnePiecePos = [];
        this.playerTwoPiecePos = [];
        this.tilePos = [];

        this.initBuffers();
    }

    initBuffers() {
        this.section = new MyGameBoardSection(this.scene);

        let pieceLen = 0.65;

        //Player one piece positions
        for (let i = 0; i < 9; i++) {
            this.playerOnePiecePos.push([-2.65+i*pieceLen,0.06,3.95]);
        }

        //Player two piece positions
        for (let i = 0; i < 9; i++) {
            this.playerTwoPiecePos.push([2.65-i*pieceLen,0.06,-3.95]);
        }

        //init tile positions
        for (let i = 0; i < 9; i++) {
            for (let j = 0; j < 9; j++) {
                this.tilePos.push([-2.65+i*pieceLen,0.06,-2.65+j*pieceLen]);
            }
        }
        
        //Player 1 pieces
        for (let i = 0; i < 9; i++) {
            this.playerOnePieces.push(new MyPiece(this.scene,i,Player.playerOne,null,null,null,20+i,null));
        }

        //Player 2 pieces
        for (let i = 0; i < 9; i++) {
            this.playerTwoPieces.push(new MyPiece(this.scene,i,Player.playerTwo,null,null,null,30+i,null));
        }

        //Board tiles
        for (let i = 0; i < 9; i++) {
            for (let j = 0; j < 9; j++) {
                this.tiles.push(new MyTile(this.scene,i,j,100+9*i+j));
            }
        }
    }

    setTextures(playerOneTextures,playerTwoTextures,boardTexture,boardSeparatorTex,interfaceTex,undoTex) {
        this.playerOnePieceTextures = playerOneTextures;
        this.playerTwoPieceTextures = playerTwoTextures;
        this.boardTexture = boardTexture;
        this.boardSepTex = boardSeparatorTex;
        this.interfaceTexture = interfaceTex;
        this.undoTexture = undoTex;

        this.section.setTextures(this.boardTexture,this.boardSepTex);

        for (let i = 0; i < this.tiles.length; i++) {
            this.tiles[i].setTexture(this.boardTexture);
        }
        for (let i = 0; i < this.playerOnePieces.length; i++) {
            this.playerOnePieces[i].setTexture(this.playerOnePieceTextures[i]);
        }

        for (let i = 0; i < this.playerTwoPieces.length; i++) {
            this.playerTwoPieces[i].setTexture(this.playerTwoPieceTextures[i]);
        }
    } 

    setOrchestrator(orchestrator) {
        this.orchestrator = orchestrator;
        for (let i = 0; i < this.playerOnePieces.length; i++) {
            this.playerOnePieces[i].setOrchestrator(orchestrator);
        }
        for (let i = 0; i < this.playerTwoPieces.length; i++) {
            this.playerTwoPieces[i].setOrchestrator(orchestrator);
        }
        for (let i = 0; i < this.tiles.length; i++) {
            this.tiles[i].setOrchestrator(orchestrator);
        } 

        this.interface = new GameInterface(this.scene,this.orchestrator,this.interfaceTexture,[this.undoTexture]);
    }

    highlightPiece(pieceNumber,player) {
        if (player == Player.playerOne) {
            this.playerOnePieces[pieceNumber].highlight();
        }
        else if (player == Player.playerTwo) {
            this.playerTwoPieces[pieceNumber].highlight();
        }
    }

    unhighlighAllPieces(player) {
        if (player == Player.playerOne) {
            for (let i = 0; i < this.playerOnePieces.length; i++) {
                this.playerOnePieces[i].unhighlight();
            }
        }
        else if (player == Player.playerTwo) {
            for (let i = 0; i < this.playerTwoPieces.length; i++) {
                this.playerTwoPieces[i].unhighlight();
            }
        }
    }

    highlightTile(x,y) {
        this.tiles[9*x+y].highlight();
    }

    highlightTiles(tileArray) {
        for (let i = 0; i < tileArray.length; i++) {
            this.highlightTile(Number(tileArray[i][0]),Number(tileArray[i][1]));
        }
    }

    unhighlightTiles() {
        for (let i = 0; i < this.tiles.length; i++) {
            if (this.tiles[i].highlighted) {
                this.tiles[i].unhighlight();
            }
        }
    }

    updateTimes(t) {
        this.time = t;
        for (let i = 0; i < this.playerOnePieces.length; i++) {
            this.playerOnePieces[i].setTime(t);
        }
        for (let i = 0; i < this.playerTwoPieces.length; i++) {
            this.playerTwoPieces[i].setTime(t);
        }
        for (let i = 0; i < this.tiles.length; i++) {
            this.tiles[i].setTime(t);
        } 
    }

    /**
     * Enables interaction with the game board
     */
    enable(player) {
        this.enabled = player;
    }

    /**
     * Adds a piece to a given Tile
     * @param piece - the number of the piece
     * @param coords - an array with the coordinates of the piece
     */
    placePiece(piece, coords, player){
        if (player == Player.playerOne) {
            this.tiles[9*coords[0] + coords[1]].setPiece(new MyPiece(this.scene,piece,player,null,null,null,null,this.playerOnePieceTextures[piece]));
        }
        else if (player == Player.playerTwo) {
            this.tiles[9*coords[0] + coords[1]].setPiece(new MyPiece(this.scene,piece,player,null,null,null,null,this.playerTwoPieceTextures[-piece]));
        }
        
    }

    placePieceAnim(piece,coords,player) {
        let initPos;
        let tilePos = this.tilePos[9*coords[0]+coords[1]];
        let texture;

        if (player == Player.playerOne) {
            initPos = this.playerOnePiecePos[piece];
            texture = this.playerOnePieceTextures[piece];

        }
        else if (player == Player.playerTwo) {
            initPos = this.playerTwoPiecePos[piece];
            texture = this.playerTwoPieceTextures[piece]
        }

        this.tiles[9*coords[0] + coords[1]].setPiece(new MyPiece(this.scene,piece,player,this.time,initPos,tilePos,null,texture));
        this.tiles[9*coords[0] + coords[1]].setOrchestrator(this.orchestrator);
    }

    removePiece(coords) {
        this.tiles[9*coords[0] + coords[1]].setPiece(null);
    }

    /**
     * Resets the board
     */
    reset() {
        //Board tiles
        for (let i = 0; i < 9; i++) {
            for (let j = 0; j < 9; j++) {
                this.tiles[9*i +j].piece = null;
            }
        }
    }   

    /**
     * Updates the state of the board according to the state given
     * @param boardArray - board Array in the prolog format 
     */
    setState(boardArray) {
        for (let i = 0; i < boardArray.length; i++) {
            for (let j = 0; j < boardArray[i].length; j++) {
                if (boardArray[i][j] == " ") {
                    this.removePiece([j,i]);
                }
                else if (Number(boardArray[i][j]) < 0) {
                    this.placePiece(Number(boardArray[i][j]),[j,i],Player.playerTwo);
                }
                else if (Number(boardArray[i][j]) > 0) {
                    this.placePiece(Number(boardArray[i][j]),[j,i],Player.playerOne);
                }
            }
        }
    }

    /**
     * Get a Piece when given its Tile
     * @param a - Tile position
     */
    getPiece(a){
        return this.tiles[a].getPiece();

    }


    /**
     * Get a Tile, when given coordinates
     */
    getTileCoord(x,y){
        return this.tiles[9*i + j];
    }

    display(){
        //secções estao por ordem canto superior esquerdo, cima, canto superior direito, esquerda, centro, direita,
        // canto inferior esquerdo, baixo, canto inferior direito

        let secLen = 1.95;
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                this.scene.pushMatrix();
                this.scene.translate(-1.95+i*secLen,0,-1.95+j*secLen);
                this.section.display();
                this.scene.popMatrix();
            }
        }

        //Display Tiles and Pieces
        let pieceLen = 0.65;
        for (let i = 0; i < 9; i++) {
            for (let j = 0; j < 9; j++) {
                this.scene.pushMatrix();
                this.scene.translate(-2.675+i*pieceLen,0.06,-2.675+j*pieceLen);
                if (this.enabled == Player.playerTwo) {
                    this.scene.rotate(Math.PI,0,1,0);
                }
                if ((this.enabled == Player.playerOne || this.enabled == Player.playerTwo) && this.pieceSelected) {
                    this.tiles[9*i+j].enablePick();
                }
                this.tiles[9*i + j].display();
                this.scene.popMatrix();
            }
        }

        //Display the outside pieces
        //Player 1
        for (let i = 0; i < 9; i++) {
            this.scene.pushMatrix();
            this.scene.translate(this.playerOnePiecePos[i][0],this.playerOnePiecePos[i][1],this.playerOnePiecePos[i][2]);
            if (this.enabled == Player.playerOne) {
                this.playerOnePieces[i].enablePick();
            }
            this.playerOnePieces[i].display();
            this.scene.popMatrix();
        }

        //Player 2
        for (let i = 0; i < 9; i++) {
            this.scene.pushMatrix();
            this.scene.translate(this.playerTwoPiecePos[i][0],this.playerTwoPiecePos[i][1],this.playerTwoPiecePos[i][2]);
            this.scene.rotate(Math.PI,0,1,0);
            if (this.enabled == Player.playerTwo) {
                this.playerTwoPieces[i].enablePick();
            }
            this.playerTwoPieces[i].display();
            this.scene.popMatrix();
        }

        if (this.enabled == Player.playerOne) {
            this.scene.pushMatrix();
            this.scene.translate(3.9,0,3.8);
            this.interface.display();
            this.scene.popMatrix();
        }
        else if (this.enabled == Player.playerTwo) {
            this.scene.pushMatrix();
            this.scene.translate(-4.0,0,-3.8);
            this.scene.rotate(Math.PI,0,1,0);
            this.interface.display();
            this.scene.popMatrix();
        }
    }
}

