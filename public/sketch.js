var p;
var b;
var players = [];
var socket;
var balls = [];
//var a;
var lastPos;
var go = false;
var counter = 0;
function setup(){
  socket = io.connect("http://localhost:3000");
    createCanvas(750,600);
    //p = new Player();
    b = new Ball();
    /*for(var i = 0; i < 4; i++){
      balls[i] = new Ball();
    }*/
   // a = new Ai();

   socket.on('getCounter',function(data){
      counter = data;
      if(p === undefined){
        if(counter % 2 === 0)
          p = new Player(0);
      else
          p = new Player(width);
      }
      var data = {
        x:p.x,
        y:p.y,
        v:p.v,
        w:p.w,
        h:p.h,
        p:p.p,
      };
      socket.emit('start',data);

      var data = {
        x:b.x,
        y:b.y,
        v:b.v,
        r:b.r,
      };
      socket.emit('startBall',data);

      if(counter === 2)
        go = true;

   });


   socket.on('heartBeat',function(data){
    players = data;
});

   socket.on('heartBeatBall',function(data){
     if(data !== null){
      b.x = data.x;
      b.y = data.y;
      b.v = data.v;
      b.r = data.r;
     }
   });
}

function draw(){
    background(0);
    rect(width/2,0,10,600)
    textSize(48);
    fill(0, 102, 153);
    //text(p.points, 30, 40);
    //text(a.points, width - 80, 40);
    if(go === true){
    p.show();
    p.move(b);
    b.show();
    /*a.show();
    a.move(b);*/
    b.move();
    if(b.collision(p))
      b.xv = 5;
    /*if(b.collision(a))
      b.xv = -5;
    */if(b.x < 0)
      throwBall();
    if(b.x > width)
       throwBall();
    for(var i = 0; i < players.length; i++){
      var id = players[i].id;
      if(id !== socket.id){
        fill(255,0,0);
        rectMode(CENTER);
        rect(players[i].x,players[i].y,players[i].v,players[i].w,players[i].h,players[i].p);  //posible error
      }
    }
    var data = {
      x:p.x,
      y:p.y,
      v:p.v,
      w:p.w,
      h:p.h,
      p:p.p,
    };
    socket.emit('update',data);

    var data = {
      x:b.x,
      y:b.y,
      v:b.v,
      r:b.r,
    };
    socket.emit('updateBall',data);
  }
}

function throwBall(){
    b.x = width/2;
    b.y = height/2;
}

/*function showWinner(){
  background(0);
  textSize(80);
  fill(0, 102, 153);
  if(p.points > a.points)
    text("YOU WIN", width/2 - 100, height/2);
  else if(a.points > p.points)
    text("YOU LOSE", width/2 - 100, height/2);
  else
    text("TIE", width/2 -100, height/2);

}*/
