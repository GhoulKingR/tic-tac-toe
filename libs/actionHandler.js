import Room from "./Room.js";

/**
 * 
 * @param {{ type: string, payload: string }} action 
 * @param {WebSocket} ws WebSocket conection
 */
export default function handleAction (action, ws) {
    switch (action.type) {  
        case 'error':
            console.error(`From client: ${action.payload}`);
            break;
        
        case 'join-room':
            handleJoiningRoom(action.payload, ws);
            break;
        
        case 'chat':
            handleChat(action.payload);
            break;
        
        case 'clear-board':
            clearBoard(action.payload);
            break;
        
        case 'make-move':
            handleMove(action.payload);
            break;
        
        case 'request-board':
            const room = Room.rooms.get(action.payload);
            if (room)
                ws.send(JSON.stringify({
                    type: 'board-update',
                    payload: room.board.join(','),
                }));
            break;
                
        default:
            const msg = `Invalid client action: ${action.type}`;
            console.error(msg);
            ws.send(JSON.stringify({ type: 'error', payload: msg }));
            break;
    }
}

/**
 * 
 * @param {string} payload
 */
function clearBoard(payload) {
    const room = Room.rooms.get(payload);
    room?.clearBoard();
}

/**
 * 
 * @param {string} payload
 */
function handleMove(payload) {
    const [roomId, playerId, key] = payload.split(",");
    const room = Room.rooms.get(roomId);
    room?.makeMove(playerId, parseInt(key));
}

/**
 * 
 * @param {string} payload
 */
function handleChat(payload) {
    const payloadArr = payload.split(",");
    const [playerId, roomId] = payloadArr;
    const msg = payloadArr.slice(2).join(",");
    const room = Room.rooms.get(roomId);
    room?.broadcast(playerId, msg);
}

/**
 * 
 * @param {string} payload
 * @param {WebSocket} ws WebSocket client
 */
function handleJoiningRoom(payload, ws) {
    const data = payload.split(",");
    const room = Room.rooms.get(data[0]);

    if (room?.host !== data[1] && room?.guest.length === 0)
        data[1] = room.newGuest();

    if (room?.join(ws, data[1]))
        ws.send(JSON.stringify({ type: 'join-success', payload: data[1] }));
    else
        ws.send(JSON.stringify({ type: 'join-failed', payload: data[0] }));
}