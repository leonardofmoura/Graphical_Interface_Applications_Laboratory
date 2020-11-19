:- include('mbrane.pl').

% =========================== SPACE PARSING ===========================0

%parse_spaces_(+Spaces,+Aux,-NoSpaces)
parse_spaces_([],Aux,NoSpaces) :- reverse(Aux, NoSpaces).

parse_spaces_(['%20'|T],Aux,NoSpaces) :-
    parse_spaces_(T,[' '|Aux],NoSpaces).

parse_spaces_([Char|T],Aux,NoSpaces) :-
    parse_spaces_(T,[Char|Aux],NoSpaces).

%parse_spaces_(+Spaces,-NoSpaces)
parse_spaces(Spaces,NoSpaces) :-
    parse_spaces_(Spaces,[],NoSpaces).

%parse_spaces_(+List,-NoSpaces)
parse_space_list_([],Aux,NoSpaces) :- reverse(Aux, NoSpaces).

parse_space_list_([List|T],Aux,NoSpaces) :-
    parse_spaces(List,NewList),
    parse_space_list_(T,[NewList|Aux],NoSpaces).

%parse_spaces_(+List,-NoSpaces)
parse_space_list(List,NoSpaces) :- 
    parse_space_list_(List,[],NoSpaces).

% =================== HELPER PREDICATES ========================================
%helper predicate for check_move
check_move_bool(X,Y,TV,BL,BB,yes) :- check_move(X,Y,TV,BL,BB).
check_move_bool(_,_,_,_,_,no).

test_game_over(Boards,Ans) :-
    valid_moves(Boards,Res), !,
    ((Res = [], Ans = yes);
    Ans = no).

get_value_moves([],Res,_,Res).

get_value_moves([[X,Y,Value]|Tail],Aux,Value,Res) :-
    get_value_moves(Tail,[[X,Y]|Aux],Value,Res).

get_value_moves([_|Tail],Aux,Value,Res) :-
    get_value_moves(Tail,Aux,Value,Res).

get_possible_moves_value(Boards,Value,Res) :-
    valid_moves(Boards,PossibleMoves), !,
    get_value_moves(PossibleMoves,[],Value,Res).


%===================== VALID INPUT PARSING ========================================

parse_input(handshake, handshake).
parse_input(test(C,N), Res) :- test(C,Res,N).
parse_input(quit, goodbye).

test(_,[],N) :- N =< 0.
test(A,[A|Bs],N) :- N1 is N-1, test(A,Bs,N1).

% Commands used by mbrane
parse_input(board(BL),BL) :- board(BL).
parse_input(board_blocks(BB),BB) :- board_blocks(BB).
parse_input(board_influence(BI),BI) :- board_influence(BI).

parse_input(start_board,[BL,BL,BI]) :- start_board([BL,BL,BI]).

parse_input(check_move(X,Y,TV,BL,BB),Res) :- 
    parse_space_list(BL,NoSpaceBL),
    parse_space_list(BB,NoSpaceBB),
    check_move_bool(X,Y,TV,NoSpaceBL,NoSpaceBB,Res).

parse_input(place_piece(Coords,[BL,BB,BI]),ResBoards) :-
    parse_space_list(BL,NoSpaceBL),
    parse_space_list(BB,NoSpaceBB),
    place_piece(Coords,[NoSpaceBL,NoSpaceBB,BI],ResBoards).

parse_input(game_over([BL,BB]),Res) :-
    parse_space_list(BL,NoSpaceBL),
    parse_space_list(BB,NoSpaceBB),
    test_game_over([NoSpaceBL,NoSpaceBB],Res).

parse_input(get_possible_moves([BL,BB],Value),Res) :- 
    parse_space_list(BL,NoSpaceBL),
    parse_space_list(BB,NoSpaceBB),
    get_possible_moves_value([NoSpaceBL,NoSpaceBB],Value,Res).

parse_input(get_bot_move([BL,BB]),[X,Y,V]) :-
    parse_space_list(BL,NoSpaceBL),
    parse_space_list(BB,NoSpaceBB),
    random_move([NoSpaceBL,NoSpaceBB],X,Y,V).

parse_input(get_winner(BI),W) :- 
    get_winner(BI,W).