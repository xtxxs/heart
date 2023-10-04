window.requestAnimationFrame =
    window.__requestAnimationFrame ||
        window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        window.oRequestAnimationFrame ||
        window.msRequestAnimationFrame ||
        (function () {
            return function (callback, element) {
                var lastTime = element.__lastTime;
                if (lastTime === undefined) {
                    lastTime = 0;
                }
                var currTime = Date.now();
                var timeToCall = Math.max(1, 33 - (currTime - lastTime));
                window.setTimeout(callback, timeToCall);
                element.__lastTime = currTime + timeToCall;
            };
        })();
window.isDevice = (/android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(((navigator.userAgent || navigator.vendor || window.opera)).toLowerCase()));
var loaded = false;
var init = function () {
    if (loaded) return;
    loaded = true;
    var mobile = window.isDevice;
    var koef = mobile ? 0.5 : 1;
    var canvas = document.getElementById('heart');
    var ctx = canvas.getContext('2d');
    var width = canvas.width = koef * innerWidth;
    var height = canvas.height = koef * innerHeight;
    var rand = Math.random;
    var shiftX = 0;
    var circles = [];
    var counter = 0;
    var DEG_TO_RADIANS = Math.PI / 180;
    var state = "empty";
    ctx.fillStyle = "rgba(0,0,0,1)";
    ctx.fillRect(0, 0, width, height);
  
    //var scaleAndTranslate = function (pos, sx, sy, dx, dy) {
    //    return [dx + pos[0] * sx, dy + pos[1] * sy];
    //};

    window.addEventListener('resize', function () {
        width = canvas.width = koef * innerWidth;
        height = canvas.height = koef * innerHeight;
        ctx.fillStyle = "rgba(0,0,0,1)";
        ctx.fillRect(0, 0, width, height);
    });
  
    // Drawing functions
    var drawCircle = function (x, y) {
      ctx.fillStyle = "rgba(255,255,255,1)";
      ctx.beginPath();
      ctx.arc(x, y, 15, 15, Math.PI*2, true); 
      ctx.closePath();
      ctx.fill();
    };
  
    var drawHeart = function (shift) {
        // set color to red
        ctx.fillStyle = "rgba(200,0,0,1)";
  
        // center of the heart
        var x = width / 2 - 52 + shift;
        var y = height / 2 - 50;
      
        // transform the context to center and scale the heart
        // takes 6 variables: scaleX, skewX, skewY, scaleY, offsetX, offsetY
        ctx.setTransform(0.7, 0, 0, 0.7, x, y);
        
        ctx.beginPath();
        ctx.moveTo(75,40);
        ctx.bezierCurveTo(75,37,70,25,50,25);
        ctx.bezierCurveTo(20,25,20,62.5,20,62.5);
        ctx.bezierCurveTo(20,80,40,102,75,120);
        ctx.bezierCurveTo(110,102,130,80,130,62.5);
        ctx.bezierCurveTo(130,62.5,130,25,100,25);
        ctx.bezierCurveTo(85,25,75,37,75,40);
        ctx.fill();
      
        // restore the transform back to normal
        ctx.setTransform(1, 0, 0, 1, 0, 0);
    };
  
    var drawCircles = function () {
        // set the origin for drawing to the center of the heart/screen
        // takes 6 variables: scaleX, skewX, skewY, scaleY, offsetX, offsetY
        ctx.setTransform(1, 0, 0, 1, width / 2, height / 2);
      
        // loop through all circles in array
        var n = circles.length;
        var x, y;
        for (var i = 0; i < n; i++) {
          x = circles[i].d * Math.cos(circles[i].a * DEG_TO_RADIANS);
          y = circles[i].d * Math.sin(circles[i].a * DEG_TO_RADIANS);
          drawCircle(x, y);
        }
      
        // restore the transform back to normal
        ctx.setTransform(1, 0, 0, 1, 0, 0);
    }
    
    var moveCircles = function (distance) {
        // loop through all circles in array
        var n = circles.length;
        for (var i = 0; i < n; i++) {
          circles[i].d += distance;
          circles[i].a += 1;
        }
    }
    
    var addCircle = function (n) {
       var circle = {};
       circle.d = Math.min(200, width / 2 - 23); // polar coordinate distance
       circle.a = 15 * n; // polar coordinate angle in degrees
       circles.push(circle);
    }
   
    var loop = function () {
        //update counter
        counter++;
        var n = circles.length; // number of circles
        if (counter > 3) {
          counter = 0;
          if (n < 24) {
              state = "drawing_attack";
              addCircle(n);
              if (n == 23) {
                state = "last_attack_particle";
              }
          }
        }
      
        // fill canvas with black  
        if (state == "take_damage"){
          ctx.fillStyle = "rgba(0,0,0,0.3)";
        }
        else {
          ctx.fillStyle = "rgba(0,0,0,1)";
        }
        ctx.fillRect(0, 0, width, height);
      
        // draw heart in center of canvas
        drawHeart(shiftX);
      
        // draw all the circles
        drawCircles();
      
        // move all the circles
        if (state == "last_attack_particle"){
          moveCircles(-7);
          if (circles[0].d <= 55) {
              state ="take_damage";
          }
        }
       else if (state == "take_damage"){
          var d = circles[0].d;
          moveCircles(2 + d * 0.1);
          if (d <= 350) {
            shiftX = 20 * (rand() - 0.5);
          }
          else {
            shiftX = 0;
            if (d >= width) {
                state = "empty";
                circles = [];
            }
            
          }
        }

        window.requestAnimationFrame(loop, canvas);
    };
    loop();
};

var s = document.readyState;
if (s === 'complete' || s === 'loaded' || s === 'interactive') init();
else document.addEventListener('DOMContentLoaded', init, false);