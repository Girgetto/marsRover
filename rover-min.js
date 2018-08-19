var roverA = {
  name: "Rover A",
  direction: "N",
  position: [0, 0],
  movements: "rff",
  status: "ok"
};

var obstacles = [[{x: 5,y: 5}],[ {x: 6,y: 1}]];

directions = ["N", "E", "S", "W"];

function numberDirection(direction) {
  for (var index = 0; index < 4; index++) {
    if (directions[index] == direction) return index;
  }
}

function turn(rover) {
  var directionNumber = numberDirection(rover.direction);

  switch (rover.movements) {
    case "l": //turn left
      directionNumber -= 1;
      if (directionNumber < 0) directionNumber = 3;
      rover.direction = directions[directionNumber];
      break;
    default://turn right
      directionNumber += 1;
      if (directionNumber > 3) directionNumber = 0;
      rover.direction = directions[directionNumber];
      break;
  }
}

function move(rover,movement) {
  var yIncrease = 0;
  var xIncrease = 0;
  if (rover.direction === "N") yIncrease = -1;
  else if (rover.direction === "E") xIncrease = 1;
  else if (rover.direction === "S") yIncrease = 1;
  else if (rover.direction === "W") xIncrease = -1;
  if (movement === "b") {
    xIncrease *= -1;
    yIncrease *= -1;
  }
  var newLocation = [rover.position[0] + xIncrease,rover.position[1] + yIncrease];
  if (boundaries(rover, newLocation)) return false;
  if (isObstacle(rover, newLocation)) return false;
  if (roverA.position.toString() == newLocation.toString()) {
    console.log("Rover found in one position");
    return false;
  }
  console.log(rover.name);
  console.log(newLocation);
  rover.position = newLocation;
  return true;
}

function start(rover) {
  if (rover.movements === "") {
    console.log("add movements" + rover.name);
    return rover.commandsArray;
  } else {
    for (var index = 0; index < rover.movements.length; index++) {
      var movement = rover.movements[index];
      if (validation(movement)) break;
      if (movement === "f" || movement === "b") {
        if (!move(rover,movement)) break;
      } else if (movement === "l" || movement === "r") {
        turn(rover, movement);
      }
    }
    rover.commandsArray = movement;
  }
}

function validation(movement) {
  if (movement != "f" && movement != "r" && movement != "l" && movement != "b") {
    console.log("inputs must be f, b, r, or l");
    return true;
  }
}

function isObstacle(rover, newLocation) {
  for (var index = 0; index < obstacles.length; index++) {
    if (newLocation[0] == obstacles[index].x && newLocation[1] == obstacles[index].y) {
      rover.status = "obstacle found";
      console.log(rover.name + " " + rover.status);
      return true;
    }
  }
  return false;
}

function boundaries(rover, newLocation) {
  if (newLocation[1] < 0 || newLocation[0] < 0 ||newLocation[0] > 9 ||newLocation[1] > 9) {
    console.log(rover.name + " " + "cant move forward");
    return true;
  }else false;
}

start(roverA);