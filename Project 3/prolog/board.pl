/*	PLOG 2019/2020
 *	Leonardo Moura & Joao Campos
 *	File responsible for interaction with the board
 */

% starting board list of lines
board([
	[' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
	[' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
	[' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
	[' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
	[' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
	[' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
	[' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
	[' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
	[' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ']] ).

% starting board list of blocks
board_blocks([
	[' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
	[' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
	[' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
	[' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
	[' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
	[' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
	[' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
	[' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
	[' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ']] ).

% starting board list of influences
board_influence([0, 0, 0, 0, 0, 0, 0, 0, 0]).

% get starting boards
start_board([BL,BB,BI]) :- board(BL), board_blocks(BB), board_influence(BI).

% move
move(Coords, Board, Result) :- place_piece(Coords, Board, Result).
move(_, _, _) :- msg('error move'), fail.

% check_move
check_move(X, Y, V, BL, BB) :- 
	check_x(X), check_y(Y), check_v(V), 
	check_cell(X, Y, BL), \+ check_restrictions(X, Y, V, BL, BB).
check_move(_,_,_,_,_) :- fail.

% check_move auxiliar
check_x(X) :- valid(X).
check_y(Y) :- valid(Y).
check_v(V) :- abs(V,A), valid(A).
check_cell(X, Y, B) :- nth0(Y, B, L), nth0(X, L, ' ').
check_restrictions(X,Y,P,BL,BB) :-
	abs(P,V), NV is -V,
	(
		(get_line(BL,Y,L), (member(V,L); member(NV,L)));
		(get_column(BL,X,C), (member(V,C); member(NV,C)));
		(coords_to_blocks(X, Y, B, _), get_line(BB,B,F), (member(V,F); member(NV,F)))
	).

% place_piece
place_piece([X, Y, V], [BL, BB, BI], [RL, RB, RI]) :- 
	place_piece_board(X, Y, V, BL, RL),
	coords_to_blocks(X, Y, B, N),
	place_piece_blocks(B, N, V, BB, RB),
	update_influence(BI, B, N, V, RI).

place_piece_board(X, Y, V, BL, RL) :- replace_matrix(BL, X, Y, V, RL).
place_piece_blocks(B, N, V, BB, RB) :- replace_matrix(BB, N, B, V, RB).

% update_influence
update_influence(BI, _, _, 0, BI) :- true.
update_influence(BI, B, B, V, RI) :- update_power(BI, B, V, RI).
update_influence(BI, B, 4, V, RI) :- update_power(BI, B, V, RI).
update_influence(BI, 0, 1, V, RI) :- update_power(BI, 0, V, RI).
update_influence(BI, 0, 3, V, RI) :- update_power(BI, 0, V, RI).
update_influence(BI, 2, 1, V, RI) :- update_power(BI, 2, V, RI).
update_influence(BI, 2, 5, V, RI) :- update_power(BI, 2, V, RI).
update_influence(BI, 6, 3, V, RI) :- update_power(BI, 6, V, RI).
update_influence(BI, 6, 7, V, RI) :- update_power(BI, 6, V, RI).
update_influence(BI, 8, 5, V, RI) :- update_power(BI, 8, V, RI).
update_influence(BI, 8, 7, V, RI) :- update_power(BI, 8, V, RI).
update_influence(BI, B, N, V, EI) :- update_power(BI, B, V, RI), INF is V/2, update_influence_(RI, B, N, INF, EI).

% update_influence auxiliar
update_influence_(BI, B, 0, V, RI) :- 
	B1 is B - 3, B2 is B - 1, B3 is B - 4,(
	((B2 = 2; B2 = 5), valid(B1), update_power(BI, B1, V, RI));
	(valid(B1), valid(B2), update_power(BI, B1, V, CI), update_power(CI, B2, V, DI), update_power(DI, B3, V, RI));
	(valid(B1), update_power(BI, B1, V, RI));
	(valid(B2), update_power(BI, B2, V, RI));
	RI = BI).

update_influence_(BI, B, 1, V, RI) :- 
	B1 is B - 3, (
	valid(B1), update_power(BI, B1, V, RI);
	RI = BI).

update_influence_(BI, B, 2, V, RI) :- 
	B1 is B - 3, B2 is B + 1, B3 is B - 2,(
	((B2 = 3; B2 = 6), valid(B1), update_power(BI, B1, V, RI));
	(valid(B1), valid(B2), update_power(BI, B1, V, CI), update_power(CI, B2, V, DI), update_power(DI, B3, V, RI));
	(valid(B1), update_power(BI, B1, V, RI));
	(valid(B2), update_power(BI, B2, V, RI));
	RI = BI).
	
update_influence_(BI, B, 3, V, RI) :- 
	B1 is B - 1, (
	valid(B1), update_power(BI, B1, V, RI);
	RI = BI).

update_influence_(BI, B, 5, V, RI) :- 
	B1 is B + 1, (
	valid(B1), update_power(BI, B1, V, RI);
	RI = BI).

update_influence_(BI, B, 6, V, RI) :- 
	B1 is B + 3, B2 is B - 1, B3 is B + 2,(
	((B2 = 2; B2 = 5), valid(B1), update_power(BI, B1, V, RI));
	(valid(B1), valid(B2), update_power(BI, B1, V, CI), update_power(CI, B2, V, DI), update_power(DI, B3, V, RI));
	(valid(B1), update_power(BI, B1, V, RI));
	(valid(B2), update_power(BI, B2, V, RI));
	RI = BI).

update_influence_(BI, B, 7, V, RI) :- 
	B1 is B + 3, (
	valid(B1), update_power(BI, B1, V, RI);
	RI = BI).

update_influence_(BI, B, 8, V, RI) :- 
	B1 is B + 3, B2 is B + 1, B3 is B + 4,(
	((B2 = 3; B2 = 6), valid(B1), update_power(BI, B1, V, RI));
	(valid(B1), valid(B2), update_power(BI, B1, V, CI), update_power(CI, B2, V, DI), update_power(DI, B3, V, RI));
	(valid(B1), update_power(BI, B1, V, RI));
	(valid(B2), update_power(BI, B2, V, RI));
	RI = BI).

% update_power
update_power([H|T], I, V, [H|R]) :- I > 0, NI is I - 1, update_power(T, NI, V, R).
update_power([OV|T], 0, V, [NV|T]) :- NV is OV + V.
