/*
 =======================================================
 Disegna 30 piccoli aeroplanini (è sufficiente la silhouette)
 che si muovono (lentamente e con velocità diversa) verso la posizione corrente del mouse (le sovrapposizioni sono permesse).
 Quando un aeroplanino raggiunge il mouse scompare e riappare in un punto randomico dell'area di disegno.
 =======================================================
 */

const SCREEN_WIDTH = window.innerWidth;
const SCREEN_HEIGHT = window.innerHeight;
const AIRPLANES_NUM = 30;

var lastSeenMouseX;
var lastSeenMouseY;
var isGameStarted = false;

var airplanes = [];
var speeds = [];

var canvas = d3.select("body")
    .append("svg")
    .attr("width", SCREEN_WIDTH)
    .attr("height", SCREEN_HEIGHT);

/*Inizializzazione randomica delle velocità degli aereoplanini*/
for(var i=0; i<AIRPLANES_NUM; i++) {
    speeds[i] = Math.floor((Math.random() * 1000) + 4500);
}

for (var j = 0; j < AIRPLANES_NUM; j++) {
    airplanes[j] = canvas.append('svg:image')
        .attr("x", 0)
        .attr("y", 0)
        .attr('xlink:href', './images/airplane.png')
        .attr("speed", speeds[j])
        .attr('width', 50)
        .attr('height', 50)
        .on("load", function () {
            var x = Math.floor(Math.random() * SCREEN_WIDTH);
            var y = Math.floor(Math.random() * SCREEN_HEIGHT);
            d3.select(this)
                .transition()
                .duration(0)
                .attr("transform", "translate(" + x + "," + y + ")")
        });
}

document.onmousemove = moveAirplanes;

function moveAirplanes(event) {
    if (!isGameStarted)  {
        document.getElementById("testo").style.display = 'none';
        isGameStarted = true;
    }
    var y = event.clientY - 25;
    var x = event.clientX - 25;
    lastSeenMouseX = x;
    lastSeenMouseY = y;
    for (var i = 0; i < AIRPLANES_NUM; i++) {
        var speed = speeds[i];
        airplanes[i].transition()
            .duration(speed)
            .attr("transform", "translate(" + x + "," + y + ")")
            .each("end", function () {
                respawn(this)
            })
    }
}

function respawn(airplane) {
    var x = Math.floor(Math.random() * SCREEN_WIDTH);
    var y = Math.floor(Math.random() * SCREEN_HEIGHT);
    console.log("mouseover");
    d3.select(airplane)
        .transition()
        .duration(0)
        .attr("transform", "translate(" + x + "," + y + ")")
        .each("end", function () {
            followMouse(this)
        });
}

/*Fa si che gli aereoplanini, dopo il respawn, continuino a seguire il mouse, anche se questo non si muove.*/
function followMouse(airplane) {
    var speed = airplane.getAttribute("speed");
    d3.select(airplane)
        .transition()
        .duration(speed)
        .attr("transform", "translate(" + lastSeenMouseX + "," + lastSeenMouseY + ")")
        .each("end", function () {
            respawn(this)
        })
}
