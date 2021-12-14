const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http, {
    cors: {
        origin: ["http://localhost:3000"]
    }
});

app.use(function (req, res, next) {

    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
    res.setHeader('Access-Control-Allow-Credentials', true);
    
    next();

});


const port = 8000 || process.env.PORT;

app.get('/', (req, res) => {
    res.send('Data here');
});

// Socket connection
let players = 0, rooms = {}, player = 0;
io.on('connection', socket => {
    players++;
    console.log("socket connected", players);
    // Emitting message
    
    let globalRoom;
    socket.on("create-room", room => {
        
        let sameRoom = Object.keys(rooms).some(currRoom => currRoom === room);
        console.log('line 35', room, rooms, sameRoom);

        if (!sameRoom) {
            rooms[room] = 1;
           
            io.emit("rooms", rooms);
            
        } else rooms[room]++;

        socket.join(room);
        globalRoom = room;
       

        
    });
    
    let singleTime = true;

    socket.on("get-players", () => {
        if (!singleTime) return;
        console.log(globalRoom);
        console.log("sockets from this room", [...io.sockets.adapter.rooms.get(globalRoom)]);

        io.emit("players", [...io.sockets.adapter.rooms.get(globalRoom)].length);
        singleTime = false;
    });

    

    socket.on("move-piece", (oldIdx, newIdx, pieceCode, sound) => {
        console.log(globalRoom, "this is global room");
        console.log('from move piece', oldIdx, newIdx, pieceCode);
        socket.broadcast.to(globalRoom).emit("send-piece", oldIdx, newIdx, pieceCode, sound);
    })


    
    // Disconnect
    socket.on('disconnect', () => {
        players--;
        
        console.log('socket disconnect', players);
        
    });
})

http.listen(port, () => console.log('Server started on port ' + port));