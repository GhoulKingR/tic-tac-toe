import { v4 as uuid4 } from "uuid";

/**
 * @typedef {(0 | 1 | 2)} Player
 */

const Player = Object.freeze({
    X: 0,
    O: 1,
    NULL: 2,
});

export default class Room {
    /** @type { Map<string, Room> } */
    static rooms = new Map();

    constructor() {
        /** @type { WebSocket[] } */ this.players = [];
        /** @private @type { Player[] } */ this._board = Array(9).fill(Player.NULL);
        /** @private @type {Player} */ this.turn = Player.X;
        /** @private */ this._code = uuid4().split("-");
        /** @private @type {{X: number, O: number}} */ this.scores = { X: 0, O: 0, };

        // prevent collision
        while (Room.rooms.has(this._code[0])) {
            this._code = uuid4().split("-");
        }

        this.id = this._code[0];
        this.host = this._code[1];
        this.guest = "";
        
        Room.rooms.set(this.id, this);

        // Delete room after a minute if all players aren't in it
        const t = setInterval(() => {
            if (Object.keys(this.players).length === 0) {
                Room.rooms.delete(this.id);
                clearInterval(t);
            }
        }, 60000);
    }

    newGuest() {
        this.guest = this._code[2];
        return this.guest;
    }
    
    get board() {
        return this._board;
    }

    clearBoard() {
        // even player shouldn't be able to force a restart
        if (this.whoWins() === Player.NULL)
            return;

        this._board = Array(9).fill(Player.NULL);
        this.players.forEach(ws => {
            ws.send(JSON.stringify({
                type: 'board-update',
                payload: this._board.join(','),
            }));
            ws.send(JSON.stringify({
                type: 'update-rounds',
                payload: JSON.stringify(this.scores),
            }));
            ws.send(JSON.stringify({
                type: 'disable-restart',
                payload: "",
            }));
            ws.send(JSON.stringify({
                type: 'log',
                payload: `Game restarted`,
            }));
        })
    }

    /**
     * 
     * @param {WebSocket} ws Client WebSocket connection
     * @param {string} playerId Player id
     */
    join(ws, playerId) {
        if (playerId !== this.host && playerId !== this.guest) {
            return false;
        } else {
            ws.send(JSON.stringify({
                type: 'which-player',
                payload: playerId === this.host ? 'X' : 'O',
            }))
            ws.onclose = (ev) => {
                const index = this.players.indexOf(ws);
                this.players.splice(index, 1);

                this.players.forEach(player => {
                    player.send(JSON.stringify({
                        type: 'log',
                        payload: "Other player disconnected",
                    }));
                })
            };
        }
        
        if (this.players.length < 2 && this.players.indexOf(ws) === -1) {
            this.players.push(ws);

            this.players.forEach((player) => {
                ws.send(JSON.stringify({
                    type: 'update-rounds',
                    payload: JSON.stringify(this.scores),
                }));
                player.send(JSON.stringify({
                    type: 'log',
                    payload: `Player ${playerId === this.host ? 'X' : 'O'} connected`,
                }));
                player.send(JSON.stringify({
                    type: 'log',
                    payload: `Player ${this.turn === Player.X ? 'X' : 'O'} turn`,
                }));
            });

            return true;
        }
        return false;
    }

    /** @private */
    whoWins() {
        for (let player of [Player.X, Player.O]) {
            // row
            for (let i = 0; i < this._board.length; i += 3) {
                if (this.compare(i, i+1, i+2, player, this._board)) {
                    return player;
                }
            }
            // column
            for (let i = 0; i < 3; i++) {
                if (this.compare(i, i+3, i+6, player, this._board)) {
                    return player;
                }
            }
            // diagonals
            if (this.compare(0, 4, 8, player, this._board) || this.compare(2, 4, 6, player, this._board)) {
                return player
            }
        }
        return Player.NULL;
    }

    /**
     * @private
     * @param {number} c1 Cell 1
     * @param {number} c2 Cell 2
     * @param {number} c3 Cell 3
     * @param {Player} player Player
     * @param {Player[]} board Board
     * @returns {boolean}
     */
    compare(c1, c2, c3, player, board) {
        return board[c1] === board[c2] && board[c2] === board[c3] && board[c3] === player;
    }

    /**
     * 
     * @param {string} playerId ID of the sender
     * @param {string} msg Message to broadcase to the chat
     */
    broadcast(playerId, msg) {
        if (msg.trim().length === 0)
            return;

        /** @type { string } */
        let player;

        if (playerId === this.host)
            player = 'X';
        else if (playerId === this.guest)
            player = 'O';
        else
            return;

        this.players.forEach(ws => {
            ws.send(JSON.stringify({
                type: 'log',
                payload: `(Chat) Player ${player}: ${msg}`,
            }));
        });
    }
    
    /**
     * 
     * @param {string} playerId Player id
     * @param {number} key Position on the board
     */
    makeMove(playerId, key) {
        /** @type { Player } */
        let player;

        if (playerId === this.host)
            player = Player.X;
        else if (playerId === this.guest)
            player = Player.O;
        else
            return;
        
        if (this.turn !== player) {
            return;
        }

        if (this._board[key] === Player.NULL) {
            this._board[key] = player;
            const winner = this.whoWins();
            this.turn = winner !== Player.NULL ? Player.NULL : (this.turn === Player.X ? Player.O : Player.X);

            if (winner !== Player.NULL)
                this.scores[winner === Player.X ? 'X' : 'O']++;

            this.players.forEach((ws) => {
                ws.send(JSON.stringify({
                    type: 'board-update',
                    payload: this._board.join(','),
                }));

                if (this.turn !== Player.NULL) {
                    ws.send(JSON.stringify({
                        type: 'log',
                        payload: `Player ${this.turn === Player.X ? 'X' : 'O'} turn`,
                    }));
                } else {
                    ws.send(JSON.stringify({
                        type: 'log',
                        payload: `Game over. Player ${winner === Player.X ? 'X' : 'O'} wins`,
                    }));
                    ws.send(JSON.stringify({
                        type: 'enable-restart',
                        payload: "",
                    }));
                }
            });
        }
    }
}