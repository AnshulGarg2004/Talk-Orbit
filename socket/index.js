import http from 'http';
import dotenv from 'dotenv';
import { Server } from 'socket.io';
import { v4 as uuid } from 'uuid';

dotenv.config();

const server = http.createServer();
const port = process.env.PORT || 5000;


const io = new Server(server, {cors : {origin: "*"}});

const waitingList = [];
const activePairs = new Map();


io.on("connection", (socket) => {
    console.log(socket.id);

    if(waitingList.includes(socket.id)) return;
    socket.on("start", () => {
        if(waitingList.length > 0) {
            const partner = waitingList.shift();
            const roomId = uuid();

            activePairs.set(socket.id, partner);
            activePairs.set(partner, socket.id);

            socket.emit("matched", {roomId});
            socket.to(partner).emit("matched", {roomId});
        }
        else {
            waitingList.push(socket.id);
            socket.emit('waiting');
        }
    })

    socket.on("next", () => {
        handleLeave(socket.id);
    })

    socket.on("disconnect", () => {
        handleLeave(socket.id);
    })

    function handleLeave(id) {
        const index = waitingList.indexOf(id);
        if(index !== -1) waitingList.splice(index, 1);
        const partner = activePairs.get(id);
        if(partner) {
            io.to(partner).emit("partnerLeft");
            activePairs.delete(partner);
            activePairs.delete(id);
        }
    }
})

server.listen(port, () => {
    console.log("Listening to: " + port);
    
})