main_menu(OP) :- 
    cls,
    write('+------------------------------------------+'), nl,
    write('|                                          |'), nl,
    write('|                  Mbrane                  |'), nl,
    write('|                                          |'), nl,
    write('|    0) Start                              |'), nl,
    write('|    1) Instructions                       |'), nl,
    write('|    2) About                              |'), nl,
    write('|    3) Quit                               |'), nl,
    write('|                                          |'), nl,
    write('+------------------------------------------+'), nl,
    get_option('Option: ', OP).

player_select(OP) :- 
    write('+------------------------------------------+'), nl,
    write('|                                          |'), nl,
    write('|             Select Game Mode             |'), nl,
    write('|                                          |'), nl,
    write('|    0) Player 1 vs Player 2               |'), nl,
    write('|    1) Player 1 vs Bot                    |'), nl,
    write('|    2) Bot vs Bot                         |'), nl,
    write('|    3) Quit                               |'), nl,
    write('|                                          |'), nl,
    write('+------------------------------------------+'), nl,
    get_option('Option: ', OP).

instructions_menu :- 
    write('+------------------------------------------+'), nl,
    write('|                                          |'), nl,
    write('|               Instructions               |'), nl,
    write('|                                          |'), nl,
    write('|   Place pieces from 0 - 8 on the board   |'), nl,
    write('|   Gain points to conquer blocks          |'), nl,
    write('|   Convert enemy pieces to gain more      |'), nl,
    write('|   points                                 |'), nl,
    write('|   Player with more blocks wins           |'), nl,
    write('|                                          |'), nl,
    write('+------------------------------------------+'), nl,
    wait_enter.

about_menu :- 
    write('+------------------------------------------+'), nl,
    write('|                                          |'), nl,
    write('|                   About                  |'), nl,
    write('|                                          |'), nl,
    write('|          Game by                         |'), nl,
    write('|               Joao Campos                |'), nl,
    write('|               Leonardo Moura             |'), nl,
    write('|                                          |'), nl,
    write('|                                          |'), nl,
    write('|                                          |'), nl,
    write('|                16/10/2019                |'), nl,
    write('|                                          |'), nl,
    write('+------------------------------------------+'), nl,
    wait_enter.

game_ui(Player1, Player2) :- 
    nl, nl, nl, nl,
    format('   ~s~n', [Player1]),
    format('                    ~p~n', 'VS'),
    format('   ~t~s~37|~n', [Player2]).

