var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");
var gridRowCount = 10;
var gridColumnCount = 10;
var gridWidth = 50;
var gridHeight = 50;
var gridOffsetTop = 30;
var gridOffsetLeft = 30;
var roverRadius = 10;
var obstacles = [];
obstacles[0] = {
  x: 5,
  y: 5
};
obstacles[1] = {
  x: 6,
  y: 1
};

var roverA = {
  name: "Rover A",
  direction: "N",
  position: [0, 0],
  movements: "",
  status: "ok"
};

var roverB = {
  name: "Rover B",
  direction: "N",
  position: [9, 9],
  movements: "",
  status: "ok"
};

function go(roverA, roverB) {
  traverLog.innerHTML = "Rovers Traver Log";
  roverA.position = [0, 0];
  roverB.position = [9, 9];
  roverA.direction = "N";
  roverB.direction = "N";
  roverA.movements = document.getElementById("movementsA").value;
  roverB.movements = document.getElementById("movementsB").value;
  obstacles[0].x = document.getElementById("obstacleAx1").value;
  obstacles[0].y = document.getElementById("obstacleAy1").value;
  obstacles[1].x = document.getElementById("obstacleAx2").value;
  obstacles[1].y = document.getElementById("obstacleAy2").value;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  start(roverA);
  start(roverB);
  drawGrid();
  drawObstacles();
  drawRover(roverB);
  drawRover(roverA);
  drawLine(roverA);
  drawLine(roverB);
}

function turn(rover, movement) {
  var directionNumber = numberDirection(rover.direction);

  switch (movement) {
    case "l": //turn left
      directionNumber -= 1;
      if (directionNumber < 0) {
        directionNumber = 3;
      }

      rover.direction = directions[directionNumber];
      break;
    default:
      //turn right
      directionNumber += 1;
      if (directionNumber > 3) {
        directionNumber = 0;
      }

      rover.direction = directions[directionNumber];
      break;
  }
}

directions = ["N", "E", "S", "W"];

function numberDirection(direction) {
  for (var index = 0; index < 4; index++) {
    if (directions[index] == direction) return index;
  }
}

function move(rover, movement) {
  var xIncrease = 0,
    yIncrease = 0;
  if (rover.direction === "N") {
    yIncrease = -1;
  } else if (rover.direction === "E") {
    // East
    xIncrease = 1;
  } else if (rover.direction === "S") {
    // South
    yIncrease = 1;
  } else if (rover.direction === "W") {
    // West
    xIncrease = -1;
  }
  if (movement === "b") {
    // Backward
    xIncrease *= -1;
    yIncrease *= -1;
  }
  var newLocation = [
    rover.position[0] + xIncrease,
    rover.position[1] + yIncrease
  ];
  if (boundaries(rover, newLocation)) {
    return false;
  }
  if (isObstacle(rover, newLocation)) {
    return false;
  }
  if (roverA.position.toString() == newLocation.toString()) {
    alert("Rover found in one position");
    console.log("Rover found in one position");
    return false;
  }
  var x = document.createElement("p");
  var text = document.createTextNode(
    rover.name + " " + newLocation + " " + rover.direction
  );
  x.appendChild(text);
  document.getElementById("traverLog").appendChild(x);
  console.log(rover.name);
  console.log(newLocation);
  rover.position = newLocation;
  return true;
}

function start(rover) {
  if (rover.movements === "") {
    alert("Add movements" + rover.name);
    console.log("add movements" + rover.name);
    return rover.commandsArray;
  } else {
    for (var index = 0; index < rover.movements.length; index++) {
      var movement = rover.movements[index];
      if (validation(movement)) break;
      if (movement === "f" || movement === "b") {
        if (!move(rover, movement)) break;
      } else if (movement === "l" || movement === "r") {
        turn(rover, movement);
      }
    }
    rover.commandsArray = rover.movements;
  }
}

function validation(movement) {
  if (
    movement != "f" &&
    movement != "r" &&
    movement != "l" &&
    movement != "b"
  ) {
    alert("inputs must be f, b, r, or l");
    console.log("inputs must be f, b, r, or l");
    return true;
  }
}

function isObstacle(rover, newLocation) {
  for (var index = 0; index < obstacles.length; index++) {
    if (
      newLocation[0] == obstacles[index].x &&
      newLocation[1] == obstacles[index].y
    ) {
      rover.status = "obstacle found";
      alert(rover.name + " " + rover.status);
      console.log(rover.name + " " + rover.status);
      return true;
    }
  }
  return false;
}

function boundaries(rover, newLocation) {
  if (
    newLocation[1] < 0 ||
    newLocation[0] < 0 ||
    newLocation[0] > 9 ||
    newLocation[1] > 9
  ) {
    alert(rover.name + " " + "cant move forward");
    console.log(rover.name + " " + "cant move forward");
    return true;
  }
  return false;
}

var grid = [];
for (c = 0; c < gridColumnCount; c++) {
  grid[c] = [];
  for (r = 0; r < gridRowCount; r++) {
    grid[c][r] = {
      x: 0,
      y: 0
    };
  }
}

function drawGrid() {
  for (c = 0; c < gridColumnCount; c++) {
    for (r = 0; r < gridRowCount; r++) {
      var gridX = r * gridWidth + gridOffsetLeft;
      var gridY = c * gridHeight + gridOffsetTop;
      grid[c][r].x = gridX;
      grid[c][r].y = gridY;
      ctx.beginPath();
      ctx.rect(gridX, gridY, gridWidth, gridHeight);
      ctx.stroke();
      ctx.closePath();
    }
  }
}

function drawRover(rover) {
  ctx.beginPath();
  ctx.arc(
    grid[0][rover.position[0]].x + gridWidth / 2,
    grid[rover.position[1]][0].y + gridWidth / 2,
    roverRadius,
    0,
    2 * Math.PI
  );
  ctx.fill();
}

function drawObstacles(rover) {
  ctx.beginPath();
  for (i = 0; i < obstacles.length; i++) {
    ctx.rect(
      grid[0][obstacles[i].x].x,
      grid[obstacles[i].y][0].y,
      gridWidth,
      gridHeight
    );
  }
  ctx.fill();
}

function drawLine(rover) {
  ctx.beginPath();
  ctx.moveTo(
    grid[0][rover.position[0]].x + gridWidth / 2,
    grid[rover.position[1]][0].y + gridWidth / 2
  );
  var dy = 0;
  var dx = 0;
  if (rover.direction == "N") {
    dy = -20;
  } else if (rover.direction == "E") {
    dx = 20;
  } else if (rover.direction == "S") {
    dy = 20;
  } else {
    dx = -20;
  }
  ctx.lineTo(
    grid[0][rover.position[0]].x + gridWidth / 2 + dx,
    grid[rover.position[1]][0].y + gridWidth / 2 + dy
  );
  ctx.stroke();
}

function addObstacles() {
  var li = document.createElement("li");
  var text = document.createElement("p");
  var ob = document.createTextNode("Obstacle");
  var x = document.createTextNode("x");
  var y = document.createTextNode("y");
  var input = document.createElement("input", "x");
  var input2 = document.createElement("input", "y");
  li.appendChild(text);
  text.appendChild(ob);
  li.appendChild(x);
  li.appendChild(input);
  li.appendChild(y);
  li.appendChild(input2);
  document.getElementById("obstacles").appendChild(li);
  obstacles[obstacles.length]++;
}

drawGrid();
drawRover(roverB);
drawRover(roverA);
drawLine(roverA);
drawLine(roverB);
drawObstacles();