var Scene = {
	X:0,
	Y:0,
	Width: 800,
	Height: 400,

	R: function(){ return this.X + this.Width; },
	L: function(){ return this.X; },
	T: function(){ return this.Y; },
	B: function(){ return this.Y + this.Height; }
};

var canvas = document.getElementById("scene");
canvas.width = Scene.Width
canvas.height = Scene.Height
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
		this.X = Scene.Width/2;
		this.Y = Scene.Height/2;
		this.vX = -1.2;
		this.vY = -0.2;
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

	this.R = function(){ return this.X + this.Width; };
	this.L = function(){ return this.X; };
	this.T = function(){ return this.Y; };
	this.B = function(){ return this.Y + this.Height; };
}

var Collision = {
	//TODO: remove hit functionality out of this
	Bounds: function(rect1, rect2) {
		if (rect1.L() < rect2.L() || rect1.R() > rect2.R()) {
			//console.log("Bounds hit X:"+ball.X);
			rect1.HitX();
		}
			

		if (rect1.T() < rect2.T() || rect1.B() > rect2.B()) {
			//console.log("Bounds hit Y:"+ball.Y);
			rect1.HitY();
		}
	},

	Rect: function(rect1, rect2) {
		//console.log("BallToRect:" + JSON.stringify(ball, null, 4) + JSON.stringify(rect, null, 4));
		if (this.Between(rect2.L(), rect1.L(), rect2.R()) ||
			this.Between(rect2.L(), rect1.R(), rect2.R())) {
				rect1.HitX();
			}

		if (this.Between(rect2.T(), rect1.T(), rect2.B()) ||
			this.Between(rect2.T(), rect1.B(), rect2.B())) {
				rect1.HitY();
			}
	},

	Between: function(low, x, high) {
		return (low < x && x < high);
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

    Collision.Bounds(Ball, Scene);

    for (var i = Players.length - 1; i >= 0; i--) {
    	Collision.Rect(Ball, Players[i]);
    };


    UpdateScene();
}

function ClearScene() {
	ctx.fillStyle = "rgb(255,255,255)";
	ctx.fillRect (Scene.X, Scene.Y, Scene.Width, Scene.Height);

	ctx.lineWidth = 3;
	ctx.strokeStyle = "rgb(0,0,0)";
    ctx.strokeRect(Scene.X, Scene.Y, Scene.Width, Scene.Height);  
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