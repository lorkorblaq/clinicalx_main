var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");

canvas.width = 500;
canvas.height = 500;

ctx.strokeStyle = '#ff7e22';
ctx.lineWidth = 17;
ctx.shadowBlur = 1;
ctx.shadowColor = '#ff7e22'

function degToRad(degree) {
    var factor = Math.PI / 180;
    return degree * factor;
}

function renderTime() {
    var now = new Date();
    var today = now.toDateString();
    var time = now.toLocaleTimeString();
    var hrs = now.getHours();
    var min = now.getMinutes();
    var sec = now.getSeconds();
    var mil = now.getMilliseconds();
    var smoothsec = sec + (mil / 1000);
    var smoothmin = min + (smoothsec / 60);

    // Background
    gradient = ctx.createRadialGradient(250, 250, 5, 250, 250, 300);
    gradient.addColorStop(0, "rgba(0, 51, 58, 0)"); // Transparent black
    gradient.addColorStop(1, "rgba(0, 51, 58, 0)"); // Transparent black
    ctx.fillStyle = gradient;

    // Clear the canvas with a transparent background
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // // Hours
    // ctx.beginPath();
    // ctx.arc(150, 250, 200, degToRad(270), degToRad((hrs * 30) - 90));
    // ctx.stroke();

    // // Minutes
    // ctx.beginPath();
    // ctx.arc(150, 250, 170, degToRad(270), degToRad((smoothmin * 6) - 90));
    // ctx.stroke();

    // // Seconds
    // ctx.beginPath();
    // ctx.arc(150, 250, 140, degToRad(270), degToRad((smoothsec * 6) - 90));
    // ctx.stroke();

    // Date
    
    // Time
    ctx.font = "60px Helvetica Bold";
    ctx.fillStyle = '#ff7e22';
    ctx.fillText(time, 0, 70);

    ctx.font = "30px Helvetica";
    ctx.fillStyle = '#ff7e22'
    ctx.fillText(today, 0, 110);

}
setInterval(renderTime, 40);
