/*	PLOG 2019/2020
 *	Leonardo Moura & Joao Campos
 *	File responsible for displaying board and GUI to the screen
 */

% display_board(+Board)
display_board(B) :- 
	write('     0   1   2   3   4   5   6   7   8  '), nl,
	display_board(B, 8).
display_board([L|T], I) :- 
	I >= 0,
	write('   +---+---+---+---+---+---+---+---+---+'), nl,
	N is 8 - I, write(' '), write(N), write(' '),
	draw_line(L), nl,
	NI is I - 1,
	display_board(T, NI).
display_board(_, -1) :- write('   +---+---+---+---+---+---+---+---+---+'), nl.

% display_line(+Line)
draw_line(L) :- draw_line(L, 9).
draw_line(_, 0) :- write('|').
draw_line([H|T], J) :- 
	J > 0, (H = ' ', V = ' '; abs(H,V)),
	write('| '), write(V), write(' '),
	NJ is J - 1,
	draw_line(T, NJ).

% display_power(+Power)
display_power(P) :- nl,write('Power '),write(P),nl,nl.

% display_game(+Board, +Player1, +Player2)
display_game(B, P1, P2) :- game_ui(P1, P2), display_board(B).
