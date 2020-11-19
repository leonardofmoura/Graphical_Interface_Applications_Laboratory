/*	PLOG 2019/2020
 *	Leonardo Moura & Joao Campos
 *	Main file of project
 */
 
 :- use_module(library(lists)).
 :- use_module(library(random)). 

 :- include('util.pl').
 :- include('menu.pl').
 :- include('board.pl').
 :- include('display.pl').
 :- include('bot.pl').

play :- main_menu(OP), repeat, mbrane(OP).
mbrane('0') :- game.
mbrane('1') :- instructions_menu, fail.
mbrane('2') :- about_menu, fail.
mbrane(_) :- true.

game :- player_select(OP), repeat, game(OP).
game('0') :- game_2players.
game('1') :- game_player_bot.
game('2') :- game_2bots.
game(_) :- true.

% game_2players
game_2players :- 
	get_player(P1),
	get_player(P2),
	start_board(B),
	game_loop_2players(P1,P2,0,B).

% game_player_bot
game_player_bot :- 
	get_player(Player),
	start_board(B),
	game_loop_player_bot(Player,"Bot",0,B).

% game_2bots
game_2bots :- 
	start_board(B),
	game_loop_2bots("Bot1","Bot2",0,B).

% game_loop_2players
game_loop_2players(P1, P2, Play, [BL,BB,BI]) :- 
	even(Play),
	% Player 1 plays
	display_game(BL, P1, P2),
	display_power(BI),
	write('Play '), write(Play),nl,
	player_turn([BL,BB,BI], 1, R),!,
	% Check complete board
	game_over(R,W),
	((	W = 0,
		NextPlay is Play + 1,
		game_loop_2players(P1,P2,NextPlay,R)
	);(
		write('Winner is '), 
		(W = -1, format('~s~n', [P2])); format('~s~n', [P1])
	)).

game_loop_2players(P1, P2, Play, [BL,BB,BI]) :-
	% Player 2 plays
	display_game(BL, P1, P2),
	display_power(BI),
	write('Play '), write(Play),nl,
	player_turn([BL,BB,BI], -1, R),!,
	% Check complete board
	game_over(R,W),
	((	W = 0,
		NextPlay is Play + 1,
		game_loop_2players(P1,P2,NextPlay,R)
	);(
		write('Winner is '), 
		(W = -1, format('~s~n', [P2])); format('~s~n', [P1])
	)).

game_loop_player_bot(P1,P2,Play,[BL,BB,BI]) :-
	even(Play),
	% Player 1 plays
	display_game(BL, P1, P2),
	display_power(BI),
	write('Play '), write(Play),nl,
	player_turn([BL,BB,BI], 1, R),!,
	% Check complete board
	game_over(R,W),
	((	W = 0,
		NextPlay is Play + 1,
		game_loop_player_bot(P1,P2,NextPlay,R)
	);(
		write('Winner is '), 
		(W = -1, format('~s~n', [P2])); format('~s~n', [P1])
	)).


game_loop_player_bot(P1,P2,Play,[BL,BB,BI]) :-
	% Bot plays
	display_game(BL, P1, P2),
	display_power(BI),
	write('Play '), write(Play),nl,
	bot_turn([BL,BB,BI], -1, R),!,
	% Check complete board
	game_over(R,W),
	((	W = 0,
		NextPlay is Play + 1,
		game_loop_player_bot(P1,P2,NextPlay,R)
	);(
		write('Winner is '), 
		(W = -1, format('~s~n', [P2])); format('~s~n', [P1])
	)).


game_loop_2bots(P1,P2,Play,[BL,BB,BI]) :-
	%Bot1 plays
	even(Play),
	display_game(BL, P1, P2),
	display_power(BI),
	write('Play '), write(Play),nl,
	bot_turn([BL,BB,BI], 1, R),!,
	% Check complete board
	game_over(R,W),
	((	W = 0,
		NextPlay is Play + 1,
		game_loop_2bots(P1,P2,NextPlay,R)
	);(
		write('Winner is '), 
		(W = -1, format('~s~n', [P2])); format('~s~n', [P1])
	)).

game_loop_2bots(P1,P2,Play,[BL,BB,BI]) :-
	% Bot 2 plays
	display_game(BL, P1, P2),
	display_power(BI),
	write('Play '), write(Play),nl,
	bot_turn([BL,BB,BI], -1, R),!,
	% Check complete board
	game_over(R,W),
	((	W = 0,
		NextPlay is Play + 1,
		game_loop_2bots(P1,P2,NextPlay,R)
	);(
		write('Winner is '), 
		(W = -1, format('~s~n', [P2])); format('~s~n', [P1])
	)).


% game_over
game_over([BL,BB,BI],W) :- 
	valid_moves([BL,BB], R), !, 
	((R = [], get_winner(BI,W));
	(W is 0)).

% get_winner
get_winner(B,W) :-
	get_winner_(B,P1,P2),
	(P1 > P2, W is 1); W is -1.

get_winner_([],P1,P2) :- P1 is 0, P2 is 0.
get_winner_([H|T],P1,P2):-
	get_winner_(T,N1,N2),
	((H > 0, P1 is N1 + 1, P2 is N2);
		(H < 0, P1 is N1, P2 is N2 + 1)).
	
	

% player_turn
% get player input and make move
player_turn([BL,BB,BI], P, R) :- 
	repeat,
	get_move(X, Y, V),
	TV is P * V,
	check_move(X, Y, TV, BL, BB),!,
	move([X, Y, TV], [BL,BB,BI], R).

bot_turn([BL,BB,BI], P, R) :-
	random_move([BL,BB],X,Y,V),
	TV is P * V,
	write([X, Y, TV]),!,
	move([X, Y, TV], [BL,BB,BI], R).

bot_turn(_, _, _) :- write('no more plays'), true.
