var players = [];
var b;
function Player(id,x,y,v,w,h,p,){
    this.id = id;
    this.x = x;
    this.y = y;
    this.v = v;
    this.w = w;
    this.h = h;
    this.p = p;
}

function Ball(id,x,y,v,r){
    this.id = id;
    this.x = x;
    this.y = y;
    this.v = v;
    this.r = r;
}

var connections = [];
var express = require('express');
var app = express();
var server = app.listen(3000);
app.use(express.static('public'));

console.log("RUNNING");

var socket = require('socket.io');
var io = socket(server);

function getCounter(){
    io.sockets.emit('getCounter',connections.length)
}

function heartBeat(){
    io.sockets.emit('heartBeat',players);
}

setInterval(heartBeat,33);

function heartBeatBall(){
    io.sockets.emit('heartBeatBall',b); //posible error
}

setInterval(heartBeatBall,33);

io.sockets.on('connection',function(socket){
    connections.push(socket);
    getCounter();
    socket.on('start',function(data){
        console.log("Un usuario se ha conectado: " + data.id + "numero de conexion" + connections.length);
        var p = new Player(socket.id,data.x,data.y,data.w,data.h,data.p);
        players.push(p);
    })

    socket.on('startBall',function(data){
        //console.log("Un usuario se ha conectado: " + data.id + "numero de conexion" + connections.length);
        b = new Ball(socket.id,data.x,data.y,data.r);
    })

    socket.on('update',function(data){
        var pl;
        for(var i= 0; i < players.length; i++){
            if(socket.id === players[i].id)
                pl = players[i];
        }
        pl.x = data.x;
        pl.y = data.y;
        pl.v = data.v;
        pl.w = data.w;
        pl.h = data.h;
        pl.p = data.p; 
    })

    socket.on('updateBall',function(data){
        b.x = data.x;
        b.y = data.y;
        b.v = data.v;
        b.r = data.r; 
    })
});