const express = require('express')
const app = express()
const httpServer = require("http").createServer(app)
const io = require("socket.io")(httpServer)

let connections = []

io.on("connect" , (socket) => {
    connections.push(socket);
    console.log(`${socket.id} has connected`);

    socket.on('draw' , (data) => {
        connections.forEach(con => {
            if(con.id !== socket.id){
                con.emit('ondraw' , {x : data.x , y : data.y})
            }
        })
    })

    socket.on('down' , (data) => {
        connections.forEach(con => {
            if(con.id !== socket.id){
                con.emit('ondown' , {x : data.x , y : data.y})
            }
        })
    })

    socket.on("disconnect" , (reason) => {
        console.log(`${socket.id} has disconnected`)
        connections = connections.filter((con) => con.id !== socket.id);
    });
});

app.use(express.static('public'));

const port = process.env.port || 8080;
httpServer.listen(port , () => console.log(`Server listening at http://localhost:${port}`));