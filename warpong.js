var Scene = {
	X:0,
	Y:0,
	Width: 300,
	Height: 400,

	canvas: null,
	ctx: null,

	R: function(){ return this.X + this.Width; },
	L: function(){ return this.X; },
	T: function(){ return this.Y; },
	B: function(){ return this.Y + this.Height; },

	Init: function() {
		this.canvas = document.getElementById("scene");
		this.canvas.width = this.Width
		this.canvas.height = this.Height
		this.ctx = this.canvas.getContext("2d");
	},

	DrawBall: function(ball) {
		this.ctx.beginPath();
		this.ctx.fillStyle = ball.Color;
		this.ctx.arc(ball.X, ball.Y, ball.Rad, 0, Math.PI*2, false);
		this.ctx.fill();
	},

	DrawRect: function(rect) {
		this.ctx.fillStyle = rect.Color;
		this.ctx.fillRect(rect.X, rect.Y, rect.Width, rect.Height);
	},

	BeginDraw: function() {
		this.ctx.fillStyle = "rgb(255,255,255)";
		this.ctx.fillRect (this.X, this.Y, this.Width, this.Height);

		this.ctx.lineWidth = 3;
		this.ctx.strokeStyle = "rgb(0,0,0)";
	    this.ctx.strokeRect(this.X, this.Y, this.Width, this.Height);  
	}
};

var Input = {
	keydowns: null,
	keyups: null,

	Init: function() {
		this.keydowns = new Array();
		this.keyups = new Array();
		window.addEventListener("keydown", this.onKeyDown.bind(this));
		window.addEventListener("keyup", this.onKeyUp.bind(this)); 
	},

	AddDownHandler: function(key, handler) {
		var kc = key.charCodeAt(0);
		this.keydowns[kc] = handler;
	},

	AddUpHandler: function(key, handler) {
		var kc = key.charCodeAt(0);
		this.keyups[kc] = handler;
	},

	onKeyDown: function(e) {
		var handler = this.keydowns[e.keyCode];
		if (handler != null) {
			handler.call();
		}
	},

	onKeyUp: function(e) {
		var handler = this.keyups[e.keyCode];
		if (handler != null) {
			handler.call();
		}
	}
}


var speedMod = 0.0;


var Ball = {
	X: 0,
	Y: 0,
	vX: 1,
	vY: 1,
	Rad: 5,
	Color: '#000',

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

	this.R = function(){ return this.X + this.Width; };
	this.L = function(){ return this.X; };
	this.T = function(){ return this.Y; };
	this.B = function(){ return this.Y + this.Height; };

	this.HandleUp = function() {
		this.Y -= 10;
	};

	this.HandleDown = function() {
		this.Y += 10;
	};
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
	Scene.Init();
	Input.Init();

	Ball.Set();

	p1 = new Paddle(20, 100, 5, 100, '#000', "left");
	Input.AddDownHandler("W", p1.HandleUp.bind(p1));
	Input.AddDownHandler("S", p1.HandleDown.bind(p1));

	Players[0] = p1;


	MainLoop();
}

function MainLoop() {
	var init = requestAnimFrame(MainLoop);
    Render();

    Collision.Bounds(Ball, Scene);

    for (var i = Players.length - 1; i >= 0; i--) {
    	Collision.Rect(Ball, Players[i]);
    };


    UpdateScene();
}



function Render() {
	Scene.BeginDraw();

	Scene.DrawBall(Ball);

	for (var i = Players.length - 1; i >= 0; i--) {
    	Scene.DrawRect(Players[i]);
    };
}

function UpdateScene() {
	Ball.Update();
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