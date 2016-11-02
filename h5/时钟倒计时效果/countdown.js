var WIDTH, HEIGHT, MARGIN_TOP, MARGIN_LEFT, RADIUS
var endTime = new Date()
endTime.setTime(endTime.getTime() + 3600*1000) 
var curShowTimeSeconds = 0

var balls = []
var colors = ["#33b5e5", "#0099cc", "#aa66cc", "#9933cc", "#669900", "99cc00", "#ffbb33", "#ff8800", "#ff4444", "#cc0000"]
var timer
window.onload = function() {
  setCanvas()
}

function setCanvas() {
	WIDTH = document.body.clientWidth
  HEIGHT = document.documentElement.clientHeight - 20

  MARGIN_LEFT = Math.round(WIDTH/10)

  RADIUS = Math.round(WIDTH*4/5/108) - 1

  MARGIN_TOP = Math.round(HEIGHT/10)
	var canvas = document.getElementById('canvas');
	canvas.width = WIDTH
	canvas.height = HEIGHT
	var ctx = canvas.getContext('2d');
	//curShowTimeSeconds = getCurrenShowTimeSeconds()
  curShowTimeSeconds = getNowTimeSeconds()
	timer = setInterval(function() {
	  render(ctx)
	  update()
	}, 50)
}
//   先关闭之前的定时器，再开启一个定时器，但是有一个问题，彩色小球的位置不会跟着变化
 window.onresize = function() {
	clearInterval(timer)
  setCanvas()
}
function update() {
	//var nextShowTimeSeconds = getCurrenShowTimeSeconds()
	var nextShowTimeSeconds = getNowTimeSeconds()
	var nextHours = parseInt(nextShowTimeSeconds/3600)  //   剩多少小时
	var nextMinutes = parseInt((nextShowTimeSeconds-nextHours*3600)/60)  //  剩多少分钟
	var nextSeconds = parseInt(nextShowTimeSeconds%60)   //  

	var curHours = parseInt(curShowTimeSeconds/3600)  //   剩多少小时
	var curMinutes = parseInt((curShowTimeSeconds-curHours*3600)/60)  //  剩多少分钟
	var curSeconds = parseInt(curShowTimeSeconds%60)

	if(nextSeconds !== curSeconds) {
		
		if(parseInt(curHours/10) !== parseInt(nextHours/10)) {
			addBalls(MARGIN_LEFT+0, MARGIN_TOP, parseInt(curHours/10))
		}
		if(parseInt(curHours%10) !== parseInt(nextHours%10)) {
			addBalls(MARGIN_LEFT+15*(RADIUS+1), MARGIN_TOP, parseInt(curHours%10))
		}
		if(parseInt(curMinutes/10) !== parseInt(nextMinutes/10)) {
			addBalls(MARGIN_LEFT+39*(RADIUS+1), MARGIN_TOP, parseInt(curMinutes/10))
		}
		if(parseInt(curMinutes%10) !== parseInt(nextMinutes%10)) {
			addBalls(MARGIN_LEFT+54*(RADIUS+1), MARGIN_TOP, parseInt(curMinutes%10))
		}
		if(parseInt(curSeconds/10) !== parseInt(nextSeconds/10)) {
			addBalls(MARGIN_LEFT+78*(RADIUS+1), MARGIN_TOP, parseInt(curSeconds/10))
		}
		if(parseInt(curSeconds%10) !== parseInt(nextSeconds%10)) {
			addBalls(MARGIN_LEFT+93*(RADIUS+1), MARGIN_TOP, parseInt(curSeconds%10))
		}

		curShowTimeSeconds = nextShowTimeSeconds
	}

	updateBalls()
}

function updateBalls() {
	//  彩色小球的碰撞
	for(var i = 0; i < balls.length; i++) {
		balls[i].x += balls[i].vx
			//   每次改变小球圆心y抽的位置
			balls[i].y += balls[i].vy
			//   ball.g即为现实生活中的加速度，改变小球圆心y抽的位置
			balls[i].vy += balls[i].g
			/*
			 ** 碰撞检测
			 ** 当小球到达底部时即小球此时y抽的位置已经大于容器高度-小球半径时，说明小球已经碰到底部
			 ** 此时小球圆心Y抽的坐标为容器高度-小球半径，此时为了让小球有一个往上的状态应让改变小球的
			 **  运动轨迹，即让vy对于以前的-vy
			*/
			if(balls[i].y >= HEIGHT-RADIUS) {
				balls[i].y = HEIGHT-RADIUS
				balls[i].vy = -balls[i].vy*0.75
			}
	}
  

  /*
   ** 优化balls，把已经不存在容器内的小球从balls数组中删除掉，
   *
  */
	var cnt = 0
	for(var i = 0; i < balls.length; i++) {
		if(balls[i].x+RADIUS > 0 && balls[i].x-RADIUS < WIDTH) {
			//   当满足这个条件的小球，重新把这个小球的参数付到balls数组中
			balls[cnt++] = balls[i]
		}
	}
  //  此时cnt的大小为还存在屏幕中小球的个数，所以通过循环判断删除balls中多余的小球的参数，减小内存消耗
	while(balls.length > cnt) {
		balls.pop()
	}
}

function addBalls(x, y, num) {
	for(var i = 0; i < digit[num].length; i++) {
		for(var j = 0; j < digit[num][j].length; j++) {
			if(digit[num][i][j] === 1) {
				var aBall = {
					x: x+j*2*(RADIUS+1)+(RADIUS+1), 
					y: y+i*2*(RADIUS+1)+(RADIUS+1),
					g: 1.5+Math.random(),
					vx: Math.pow(-1, Math.ceil(Math.random()*1000))*4,
					vy: -5,
					color: colors[Math.floor(Math.random()*colors.length)]
				}
				balls.push(aBall)
			}
		}
	}
}

//  倒计时效果方法
function getCurrenShowTimeSeconds() {
	var curTime = new Date();
	var ret = endTime.getTime() - curTime.getTime()
  ret = Math.round(ret/1000)

  return ret >= 0 ? ret : 0;
}

//   时钟效果方法
function getNowTimeSeconds() {
	var curTime = new Date();
	var ret = curTime.getHours() * 3600 + curTime.getMinutes() * 60 + curTime.getSeconds();

	return ret;
}

function render(ctx) {
	ctx.clearRect(0, 0, WIDTH, HEIGHT)
	var hours = parseInt(curShowTimeSeconds/3600)  //   剩多少小时
	var minutes = parseInt((curShowTimeSeconds-hours*3600)/60)  //  剩多少分钟
	var seconds = parseInt(curShowTimeSeconds%60)   //  
	/*
	**  因为我们的每个数字的方格为7*10的标准，即x坐标的位置为2*7*(半径+1), 冒号为4*10的标准
	*/
	//var n = 0 
	//renderDigit(MARGIN_TOP+n*15*(RADIUS+1), MARGIN_LEFT, parseInt(hours/10), ctx)
	//renderDigit(MARGIN_TOP+(n+1)*15*(RADIUS+1), MARGIN_LEFT, parseInt(hours%10), ctx)
	
	/*var hoursString = String(hours)
	var n = String(hours).length
	for(var i = 0; i < hoursString.length; i++) {
		renderDigit(MARGIN_LEFT+i*15*(RADIUS+1), MARGIN_TOP, Number(hoursString[i]), ctx)
	}
	renderDigit(MARGIN_LEFT+(n)*15*(RADIUS+1), MARGIN_TOP, 10, ctx)
	renderDigit(MARGIN_LEFT+((n)*15+9)*(RADIUS+1), MARGIN_TOP, parseInt(minutes/10), ctx)
	renderDigit(MARGIN_LEFT+((n+1)*15+9)*(RADIUS+1), MARGIN_TOP, parseInt(minutes%10), ctx)
	renderDigit(MARGIN_LEFT+((n+2)*15+9)*(RADIUS+1), MARGIN_TOP, 10, ctx)
	renderDigit(MARGIN_LEFT+((n+2)*15+9+9)*(RADIUS+1), MARGIN_TOP, parseInt(seconds/10), ctx)
	renderDigit(MARGIN_LEFT+((n+3)*15+9+9)*(RADIUS+1), MARGIN_TOP, parseInt(seconds%10), ctx)*/


	renderDigit( MARGIN_LEFT , MARGIN_TOP , parseInt(hours/10) , ctx )
  renderDigit( MARGIN_LEFT + 15*(RADIUS+1) , MARGIN_TOP , parseInt(hours%10) , ctx )
  renderDigit( MARGIN_LEFT + 30*(RADIUS + 1) , MARGIN_TOP , 10 , ctx )
  renderDigit( MARGIN_LEFT + 39*(RADIUS+1) , MARGIN_TOP , parseInt(minutes/10) , ctx);
  renderDigit( MARGIN_LEFT + 54*(RADIUS+1) , MARGIN_TOP , parseInt(minutes%10) , ctx);
  renderDigit( MARGIN_LEFT + 69*(RADIUS+1) , MARGIN_TOP , 10 , ctx);
  renderDigit( MARGIN_LEFT + 78*(RADIUS+1) , MARGIN_TOP , parseInt(seconds/10) , ctx);
  renderDigit( MARGIN_LEFT + 93*(RADIUS+1) , MARGIN_TOP , parseInt(seconds%10) , ctx);


	for(var j = 0; j < balls.length; j++) {
		ctx.fillStyle = balls[j].color
		ctx.beginPath()
		ctx.arc(balls[j].x, balls[j].y, RADIUS, 0, 2*Math.PI)
		ctx.closePath()
		ctx.fill()
	}
}
/*
 *ctx.arc(x, y, 半径, 起始位置, 结束位置, 是否是逆时针默认为false)
 x, y为圆心的位置 如： ctx.arc(0, 0, 8, 0, 1.5*Math.PI, false)
*/
function renderDigit(x, y, num, ctx) {
	ctx.fillStyle = 'rgb(0, 102, 153)'
	for(var i = 0; i < digit[num].length; i++) {
		for(var j = 0; j < digit[num][j].length; j++) {
			if(digit[num][i][j] === 1) {
				ctx.beginPath()
				ctx.arc(x+j*2*(RADIUS+1)+(RADIUS+1), y+i*2*(RADIUS+1)+(RADIUS+1), RADIUS, 0, 2*Math.PI )
				ctx.fill()
			}
		}
	}
}