//Bidirectional parsing between the strings returned by Prolog and arrays used bu Javascript
class BoardParser {

    // =========== ARRAY -> PROLOG LIST =========================================
    static substChar(char) {
        if (char == ' ') {
            return  '\'' + char + '\'';
        }
        else {
            return char;
        }
    }


    //Converts an array to a string representing a prolog list
    static arrayToListString(array) {
        let str = '[';

        for (let i = 0; i < array.length-1; i++) {
            str += BoardParser.substChar(array[i]) + ',';
        }

        str += BoardParser.substChar(array[array.length-1]) + ']';

        return str;
    }

    //Converts a board to a string representing a prolog list
    static boardArrayToListString(array) {
        let string = '['

        for (let i = 0; i < array.length - 1; i++) {
            string += BoardParser.arrayToListString(array[i]) + ',';
        }

        string += BoardParser.arrayToListString(array[array.length - 1]) + ']';

        return string;
    }

    static influenceToListString(influence) {
        let str = '[';

        for (let i = 0; i < influence.length-1; i++) {
            str +=  influence[i] + ',';
        }

        str += influence[influence.length-1] + ']';

        return str;
    }

    //Complies the three boards to a string reprrsenting a prolog list containing the three
    static compileBoardString(board,boardBlocks,boardInfluence) {
        return '[' + BoardParser.boardArrayToListString(board) + ',' + BoardParser.boardArrayToListString(boardBlocks) + ',' + BoardParser.influenceToListString(boardInfluence)+']';
    }

    // =========== PROLOG LIST -> ARRAY ========================================= 

    // Parses a string representing a prolog list to a Board -> 9x9 Array
    static parseBoard(board) {
        let array = board.split("],[");
        
        //Remove prolog list characters
        for (let i = 0; i < array.length; i++) {
            array[i] = array[i].replace("[[[","");
            array[i] = array[i].replace("[[","");
            array[i] = array[i].replace("[","");
            array[i] = array[i].replace("]]","");
            array[i] = array[i].replace("]","");
        }
        
        //Convert the board into an array of arrays
        for (let i = 0; i < array.length; i++) {
            array[i] = array[i].split(",");
        }
            
        return array;
    }

    //Parses a string representing a prolog list to the influence Array (9 elements)
    static parseInfluence(influence) {
        let array = influence.split(",");

        //Remove prolog list characters
        for (let i = 0; i < array.length; i++) {
            array[i] = array[i].replace("[","");
            array[i] = array[i].replace("]]","");
            array[i] = array[i].replace("]","");
        }

        return array;
    }

    //Parses a string representing a prolog list to a Full Board (2 9x9 Arrays a 9 elem Array)
    static parseCompleteBoard(boardString) {
        let string = boardString;

        let board = string.split("]],[");

        board[0] = BoardParser.parseBoard(board[0]);    //Parses BL
        board[1] = BoardParser.parseBoard(board[1]);    //Parses BB
        board[2] = BoardParser.parseInfluence(board[2]);//Parses BI

        return board;
    }
}