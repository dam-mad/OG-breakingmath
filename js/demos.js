(function() {
  'use strict';
}());


var c = document.getElementById("sierpinskiCanvas");
var ctx = c.getContext("2d");
ctx.beginPath();
ctx.arc(95, 50, 40, 0, 2 * Math.PI);
ctx.stroke();

var sierpinskiElement = document.getElementById("sierpinskiCanvas");
var sierpinskiCtx = sierpinskiElement.getContext("2d");
document.getElementById("sierpinskiCanvas").style.backgroundColor = 'rgba(0,0,0,1)';

var lorenzElement = document.getElementById("lorenzCanvas");
var lorenzCtx = lorenzElement.getContext("2d");
document.getElementById("lorenzCanvas").style.backgroundColor = 'rgba(0,0,0,1)';

var fourierElement = document.getElementById("fourierCanvas");
var fourierCtx = fourierElement.getContext("2d");
document.getElementById("fourierCanvas").style.backgroundColor = 'rgba(0,0,0,1)';

function clrscrn(context, element) {
  context.clearRect(0, 0, element.width, element.height);
}

function drawLine(context, x, y, x2, y2) {
  context.strokeStyle = "white";
  context.beginPath();
  context.moveTo(x, y);
  context.lineTo(x2, y2);
  context.stroke();
}


function drawBigPixel(context, x, y, n) {
  x = Math.floor(x);
  y = Math.floor(y);
  context.fillStyle = "white";
  context.fillRect(x, y, n, n);
}

function drawpixel(x, y, r, g, b, a, ctx) {
  var id = ctx.createImageData(1, 1);
  var d = id.data;
  d[0] = r;
  d[1] = g;
  d[2] = b;
  d[3] = a;
  ctx.putImageData(id, x, y);
}

function draw3dpixel(x, y, z, r, g, b, a, w, h, zoff, ctx) {
  var scale = 1 / ((zoff + z) * (zoff + z));
  //    alert((x)+","+(y)+","+(z)+",,,"+(scale*x*w)+",,"+(scale*y*w));
  drawpixel(scale * x * w * zoff, scale * y * w * zoff, r, g, b, a, ctx);
}

function _lorenz(xs, ys, zs, k, kmax, dt, interval) {
  var dx = 10 * (ys[k] - xs[k]);
  var dy = xs[k] * (28 - zs[k]) - ys[k];
  var dz = xs[k] * ys[k] - 2.66666666666666666 * zs[k];
  dx *= dt;
  dy *= dt;
  dz *= dt;
  var knew = (k + 1) % kmax;
  x = xs[k] + dx;
  xs[knew] = x;
  y = ys[k] + dy;
  ys[knew] = y;
  z = zs[k] + dz;
  zs[knew] = z;
  x = x / 5 + 10;
  y = y / 5 + 6;
  z = z / 5 + 5;
  draw3dpixel(x, z, y, 255, 255, 255, 255, 250, 250, 10, lorenzCtx)
  setTimeout(function() {
    _lorenz(xs, ys, zs, knew, kmax, dt, interval)
  }, interval);
}

function lorenz() {
  lorenzCtx.clearRect(0, 0, lorenzElement.width, lorenzElement.height)
    /* The way this is written is for future "trailing off" effects */
  var xs = [Math.random() * 10 - 5];
  var ys = [Math.random() * 10 - 5];
  var zs = [Math.random() * 10 - 5];
  var k = 0;
  var dt = 0.004;
  var interval = 6;
  var kmax = 1;
  var x = 3;
  var y = 5;
  var z = 6;
  _lorenz(xs, ys, zs, k, kmax, dt, interval);
}

function _sierpinski(x, y, i, k, interval) {
  for (var j = 0; j < k; ++j) {
    var r = Math.random() * 3.0;
    if (r < 1.0) {
      x = x * .5;
      y = y * .5;
    } else if (r < 2.0) {
      x = .5 + x * .5;
      y = y * .5;
    } else {
      x = .25 + x * .5;
      y = .5 + y * .5;
    }
  }
  drawpixel(250 * x, 250 * (1 - y), 255, 255, 255, 255, sierpinskiCtx);
  if (i != 0) {
    setTimeout(function() {
      _sierpinski(Math.random(),
        Math.random(),
        i - 1,
        k)
    }, interval);
  }
}

function sierpinksi() {
  sierpinskiCtx.clearRect(0, 0, sierpinskiElement.width, sierpinskiElement.height);
  _sierpinski(Math.random(), Math.random(), 120000, 20, 500);
}
var frame = 0;
  var speed = 0.02;
  var n = 50;
  var maxn = n;
  var xs = new Array(n);
  var ys = new Array(n);
  n = 4;

function minus() {
  if (n > 2) {
    n--;
  }
}

function plus() {
  if (n < maxn) {
    n++;
  }
}

var interval;
function closefourier() {
    clearInterval(interval);
}
function fourier() {
  
  m = 600;
  var zs = new Array(m);
    for(i=0;i<m;++i) {
        zs[i] = -1;
    }
  xs[0] = Math.floor(fourierElement.width / 2);
  ys[0] = Math.floor(fourierElement.height / 2);
  var s = Math.max(fourierElement.width,fourierElement.height) / 5;
    
  interval = setInterval(function() {
    frame++;
     clrscrn(fourierCtx, fourierElement);
    for (var i = 1; i < n; i++) {
      xs[i] = xs[i - 1] + Math.cos(frame * speed * (2 * i - 1)) * s / (2 * i - 1);
      ys[i] = ys[i - 1] + Math.sin(frame * speed * (2 * i - 1)) * s / (2 * i - 1);
      drawBigPixel(fourierCtx, xs[i], ys[i], Math.floor((n - i) / n * 5));
      drawLine(fourierCtx, xs[i], ys[i], xs[i - 1], ys[i - 1]);
      if (i == n - 1) {
        drawLine(fourierCtx, xs[i], ys[i], fourierElement.width, ys[i]);
        zs[frame % m] = ys[i];
      }
    }
    for (var i = 1; i < m; i++) {
//        console.log(zs[i]);
//        drawpixel(i,i,255,255,255,255,fourierCtx);
      drawpixel(i * fourierElement.width / m, zs[(i + frame) % m], 255, 255, 255, 255, fourierCtx);
    }
  }, 10);
}