var scene = {
	X:0,
	Y:0,
	Width: 800,
	Height: 400
};

var canvas = document.getElementById("scene");
canvas.width = scene.Width
canvas.height = scene.Height
var ctx = canvas.getContext("2d");
var speedMod = 0.0;


var Ball = {
	X: 0,
	Y: 0,
	vX: 1,
	vY: 1,
	Rad: 5,
	Color: '#000',

	Draw: function(){
		ctx.beginPath();
		ctx.fillStyle = this.Color;
		ctx.arc(this.X, this.Y, this.Rad, 0, Math.PI*2, false);
		ctx.fill();
	},

	Update: function(){
		this.X += this.vX;
		this.Y += this.vY;
	},

	Set: function(){
		this.X = scene.Width/2;
		this.Y = scene.Height/2;
		this.vX = 0.8;
		this.vY = 0.8;
	},

	R: function(){ return this.X + this.Rad; },
	L: function(){ return this.X - this.Rad; },
	T: function(){ return this.Y - this.Rad; },
	B: function(){ return this.Y + this.Rad; },

	HitX: function() {
		this.vX *= -(1+speedMod);
	},

	HitY: function() {
		this.vY *= -(1+speedMod);
	}
};

function Paddle(x, y, width, height, color, position) {
	this.X = x;
	this.Y = y;
	this.Width = width;
	this.Height = height;

	this.Color = color;

	this.PlayerIndex = (position=="left"?1:2);

	this.Draw = function() {
		ctx.fillStyle = this.Color;
		ctx.fillRect(this.X, this.Y, this.Width, this.Height);
	};

	this.X2 = function() {
		return this.X + this.Width;
	};

	this.Y2 = function() {
		return this.Y + this.Height;
	};
}

var Collision = {
	BallToBounds: function(ball) {
		if (ball.L() < scene.X || ball.R() > scene.Width) {
			console.log("Bounds hit X:"+ball.X);
			ball.HitX();
		}
			

		if (ball.T() < scene.Y || ball.B() > scene.Height) {
			console.log("Bounds hit Y:"+ball.Y);
			ball.HitY();
		}
	},

	BallToRect: function(ball, rect) {
		//console.log("BallToRect:" + JSON.stringify(ball, null, 4) + JSON.stringify(rect, null, 4));
		if (!(ball.B() <= rect.Y || ball.T() >= rect.Y2()))
		{
			console.log("Rect hit Y:"+ball.Y);
			ball.HitY();
		}

		if (!(ball.R() <= rect.X || ball.L() >= rect.X2())) {
			console.log("Rect hit X:"+ball.X);
			ball.HitX();
		}
			
	}
}

var Players = new Array();

function StartNew() {
	Ball.Set();

	Players[0] = new Paddle(20, 100, 5, 100, '#000', "left");

	MainLoop();
}

function MainLoop() {
	var init = requestAnimFrame(MainLoop);
    DrawScene();

    //console.log("X:"+Ball.X+" Y:"+Ball.Y);

    Collision.BallToBounds(Ball);

    // for (var i = Players.length - 1; i >= 0; i--) {
    // 	Collision.BallToRect(Ball, Players[i]);
    // };


    UpdateScene();
}

function ClearScene() {
	ctx.fillStyle = "rgb(255,255,255)";
	ctx.fillRect (scene.X, scene.Y, scene.Width, scene.Height);

	ctx.lineWidth = 3;
	ctx.strokeStyle = "rgb(0,0,0)";
    ctx.strokeRect(scene.X, scene.Y, scene.Width, scene.Height);  
}

function DrawScene() {
	ctx.beginPath();
	ClearScene();
	Ball.Draw();

	for (var i = Players.length - 1; i >= 0; i--) {
    	Players[i].Draw();
    };
}

function UpdateScene() {
	Ball.Update();
}

function OutOfBounds(ball) {

}

window.requestAnimFrame = (function(){
	return window.requestAnimationFrame ||
			window.webkitRequestAnimationFrame ||
			window.mozRequestAnimationFrame ||
			window.oRequestAnimationFrame ||
			window.msRequestAnimationFrame ||
			function( callback ){return window.setTimeout(callback, 1000/60); };
})();

StartNew();