% random_move
% get a random move for a bot
random_move([BL,BB], X, Y, V) :-
    %get the random move
    valid_moves([BL,BB],R), !,
    length(R, Len),
    random(0,Len,Rand),
    nth0(Rand, R, [X,Y,V]).

random_move(random_move([BL,BB], _, _, _)) :-
    valid_moves([BL,BB],R), !,
    R = [],
    fail.

% valid_moves(+Board, -Result)
valid_moves([BL,BB], R) :-
    check_all(BL,L),
    test_all(L,[BL,BB],R).


% check_all
check_all(B,L) :- check_all_cells(8,8,B,[],L).

check_all_cells(0, 0, B,Acc, [[0,0]|Acc]) :-
    check_cell(0,0,B).

check_all_cells(0, 0, _, Acc, Acc).

check_all_cells(0, Y, B, Acc, L) :-
    check_cell(0, Y, B),
    H = [0,Y],
    NY is Y - 1,
    check_all_cells(8,NY, B, [H|Acc], L).

check_all_cells(0, Y, B, Acc, L) :-
    NY is Y - 1,
    check_all_cells(8,NY, B, Acc, L).

check_all_cells(X, Y, B, Acc, L) :-
    check_cell(X, Y, B),
    H = [X,Y],
    NX is X - 1,
    check_all_cells(NX,Y,B,[H|Acc],L).

check_all_cells(X, Y, B, Acc ,L) :-
    NX is X - 1,
    check_all_cells(NX,Y,B,Acc,L).

% test_all
test_all(I, B, R) :- test_all_cells(8, I, B, [], R).


test_all_cells(_,[], _, Acc, Acc).

test_all_cells(0, [[X,Y]|T], [BL,BB], Acc, R) :-
    check_move(X, Y, 0, BL, BB),
    H = [X,Y,0],
    test_all_cells(8,T,[BL,BB],[H|Acc],R).

test_all_cells(0, [_|T], [BL,BB], Acc, R) :-
    test_all_cells(8,T,[BL,BB],Acc,R).

test_all_cells(V, [[X,Y]|T], [BL,BB], Acc, R) :-
    check_move(X, Y, V, BL, BB),
    H = [X,Y,V],
    NV is V - 1, 
    test_all_cells(NV, [[X,Y]|T], [BL,BB], [H|Acc],R).

test_all_cells(V,I,[BL,BB],Acc, R) :-
    NV is V - 1,
    test_all_cells(NV, I, [BL,BB], Acc,R).
