import express from "express";
import Room from "./libs/Room.js";
import { engine } from "express-handlebars";
import { WebSocketServer } from "ws";
import handleAction from "./libs/actionHandler.js";

const app = express();
app.use(express.static('static'));
app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', './views');

app.get("/create-room", (_, res) => {
    const room = new Room();
    res.redirect(`/join-room?room=${room.id}&id=${room.host}`);
});

app.get('/join-room', (req, res) => {
    const { room, id } = req.query;
    res.render('join-room', {
        layout: false,
        room, id,
    });
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}`));

const wss = new WebSocketServer({ port: port + 1 });
wss.on('connection', (ws) => {
    ws.on('message', (data) => {
        const decoder = new TextDecoder()
        const action = JSON.parse(decoder.decode(data));
        handleAction(action, ws);
    });
});
