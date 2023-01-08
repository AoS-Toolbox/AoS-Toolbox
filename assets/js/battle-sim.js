// GLOBALS
let stage;

let placingOn = false;
let baseSizeSelected = null;
let objPlacingOn = false;
let tokenPlacingOn = false;

let selectedObject = null;
let selectionMarker = null;

let redDeployment = null;
let blueDeployment = null;
let staticObjectives = [];

let rulerOn = false;
let rulerLine = null;
let measurementObj = null;

let measureMovementCheckbox = document.getElementById("measure-movement-checkbox");
let measureMovement = false;

// INIIIALISE STAGE
function init() {
    stage = new createjs.Stage("game-board");
    stage.enableMouseOver();
    stage.enableDOMEvents(true);
    loadBackground();
  
    measureMovementCheckbox.addEventListener("input", toggleMeasureMovement);
  
    // Global event listeners
    stage.addEventListener("stagemousedown", clearObjectSelection);
    document.addEventListener("keydown", keyboardHandler);
    stage.update();
}

// APPLY BACKGROUND IMAGE
function loadBackground() {
    const bgImg = new Image(1200, 880);
    bgImg.src = "https://i.pinimg.com/originals/07/97/64/0797645e945ae611cca110d1cd002d46.jpg";
    const bgBitmap = new createjs.Bitmap(bgImg);
    console.log("Background loaded!");
    stage.addChild(bgBitmap);
    stage.setChildIndex(bgBitmap, 0);
    stage.update();
}

// PLACEMENT & DRAWING TOGGLES
function toggleBasePlacement(forceOff) {
    let baseSize = document.getElementById("baseSelect").value;
    let baseButton = document.getElementById("place-base-btn");

    if ((baseSizeSelected === null || baseSizeSelected != baseSize) && forceOff === undefined) {
        placingOn = true;
        baseSizeSelected = baseSize;
        stage.addEventListener("stagemousedown", makeBase);
      
        baseButton.classList.add("button-on");
        baseButton.innerText = "[P] PLACE:  ON";
        
        if (objPlacingOn) toggleObjectivePlacement(true);
        if (tokenPlacingOn) toggleTokenPlacement(true);
        if (rulerOn) toggleRuler();
    } else {
        placingOn = false;
        baseSizeSelected = null;
        stage.removeEventListener("stagemousedown", makeBase);
      
        baseButton.classList.remove("button-on");
        baseButton.innerText = "[P] PLACE: OFF";
    }
}

function toggleObjectivePlacement(forceOff) {
  let objButton = document.getElementById("obj-btn");
  
  if (objPlacingOn === false && forceOff === undefined) {
    objPlacingOn = true;
    stage.addEventListener("stagemousedown", makeObjective);
    objButton.classList.add("button-on");
    
    if (placingOn) toggleBasePlacement(true);
    if (tokenPlacingOn) toggleTokenPlacement(true);
    if (rulerOn) toggleRuler();
  } else {
    objPlacingOn = false;
    stage.removeEventListener("stagemousedown", makeObjective);
    objButton.classList.remove("button-on");
  }
}

function toggleTokenPlacement(forceOff) {
  const tokenButton = document.getElementById("token-btn");
  const tokenLabel = document.getElementById("tokenSelect").value;
  
  if ((tokenPlacingOn === false || currentToken != tokenLabel) && forceOff === undefined) {
    currentToken = tokenLabel;
    tokenPlacingOn = true;
    stage.addEventListener("stagemousedown", makeToken);
    tokenButton.classList.add("button-on");
    
    if (placingOn) toggleBasePlacement(true);
    if (objPlacingOn) toggleObjectivePlacement(true);
    if (rulerOn) toggleRuler();
  } else {
    currentToken = null;
    tokenPlacingOn = false;
    stage.removeEventListener("stagemousedown", makeToken);
    tokenButton.classList.remove("button-on");
  }
}

function toggleRuler(forceOff) {
    if (!rulerOn && forceOff === undefined) {
        // Turn ruler on, force placement to toggle off, listen for mouse on stage,
        // show ruler button status
        rulerOn = true;
        if (placingOn) toggleBasePlacement(true);
        if (objPlacingOn) toggleObjectivePlacement(true);
        stage.addEventListener("stagemousedown", beginRuler);
        document.getElementById('btn-ruler').classList.toggle("button-on");
    } else if (rulerOn) {
        rulerOn = false;
        stage.removeEventListener("stagemousedown", beginRuler);
        document.getElementById('btn-ruler').classList.remove("button-on");
    }
}

function toggleMeasureMovement() {
  measureMovement = (measureMovementCheckbox.checked === true) ? true : false;
}

// OBJECTIVE & MODEL PLACING
function makeCircle(event) {
    const circle = new createjs.Shape();
  
    // Allow for non-event based placement of objectives
    if (event != undefined) {
      circle.x = event.stageX;
      circle.y = event.stageY;
    }

    circle.on("pressmove", drag);
    circle.on("pressmove", selectObject);
  
    return circle;
}

function makeBase(event) {
    let width;
    let height;
    const color = document.getElementById('base-color').value;
    switch (baseSizeSelected) {
        case "25mm":
            width = 9.8;
            break;
        case "32mm":
            width = 12.5;
            break;
        case "40mm":
            width = 15.7;
            break;
        case "50mm":
            width = 19.6;
            break;
        case "60mm":
            width = 23.6;
            break;
        case "80mm":
            width = 31.4;
            break;
        case "100mm":
            width = 39.3;
            break;
        case "130mm":
            width = 51.1;
            break;
        case "160mm":
            width = 62.9;
            break;

        // Elliptical bases  
        case "60x35mm":
            width = 23.6;
            height = 13.7;
            break;
        case "75x42mm":
            width = 29.5;
            height = 16.5;
            break;
        case "90x52mm":
            width = 35.4;
            height = 20.4;
            break;
        case "105x70mm":
            width = 41.3;
            height = 27.5;
            break;
        case "120x92mm":
            width = 47.2;
            height = 36.2;
            break;
        case "170x105mm":
            width = 66.9;
            height = 41.3;
            break;
        case "280x210mm":
            width = 110;
            height = 82.6;
            break;
    }
  
    const circle = makeCircle(event);
   
    if (!baseSizeSelected.includes("x")) { 
      // Draw a circular base
      circle.name = document.getElementById('unit-name').value
            .split(" ")
            .map(e => e.charAt(0).toUpperCase(0) + e.slice(1))
            .join(" ");

      circle.graphics.beginFill(color).drawCircle(0, 0, width);
      circle.shadow = new createjs.Shadow("#000000", 2, 2, 35);
    } else { 
      // Draw an elliptical base
      circle.name = document.getElementById('unit-name').value
            .split(" ")
            .map(e => e.charAt(0).toUpperCase(0) + e.slice(1))
            .join(" ");

      circle.graphics.beginFill(color).drawEllipse(0 - width, 0 - height, width * 2, height * 2);
      circle.shadow = new createjs.Shadow("#000000", 2, 2, 35);
    }
  
    circle.on("mouseover", showName);
    circle.on("click", selectObject);
  
    stage.addChild(circle);
    stage.update();
}

function makeObjective(event, params) {
  const width = 120;
  const circle = makeCircle(event);
  
  // Allow programmatic placement of objectives
  if (arguments.length > 1) {
    circle.x = params.x;
    circle.y = params.y;
  }
  
  circle.graphics.beginStroke("red").drawCircle(0, 0, width).endStroke()
            .beginStroke("blue").drawCircle(0, 0, width / 2).endStroke()
            .beginFill("red").drawCircle(0, 0, 3);
  
  circle.on("dblclick", selectObject);
  
  if (arguments.length > 1) staticObjectives.push(circle);
  
  stage.addChild(circle);
  stage.setChildIndex(circle, 1);
  stage.update();
}

function makeToken(event) {
  let width = 50;
  let colour;
  let alpha = 0.8;
  const circle = makeCircle(event);
  const container = new createjs.Container();
  const tokenLabel = document.getElementById("tokenSelect").value;
  
  switch (tokenLabel) {
    case "+1 Hit":
    case "-1 Hit":
      colour = `rgba(121, 207, 118, ${alpha})`;
      break;
      
    case "+1 Wound":
    case "-1 Wound":
      colour = `rgba(59, 143, 217, ${alpha})`;
      break;
      
    case "+1 Save":
    case "-1 Save":
    case "Mystic Shield":
      colour = `rgba(166, 198, 227, ${alpha})`;
      break;
      
    case "Heroic Leadership":
    case "Heroic Willpower":
    case "Their Finest Hour":
    case "Roar":
    case "Titanic Duel":
    case "Smash To Rubble":
      colour = `rgba(250, 235, 75, ${alpha})`;
      break;
      
    case "+1 Rend":
    case "-1 Rend":
      colour = `rgba(222, 173, 89, ${alpha})`;
      break;
      
    case "+1 Attack":
    case "-1 Attack":
      colour = `rgba(227, 179, 221, ${alpha})`;
      break;
      
    case "+1 Damage":
    case "-1 Damage":
      colour = `rgba(224, 63, 152, ${alpha})`;
      break;
      
    case "MW on 5+":
    case "+1 Wound Stat":
      colour = `rgba(194, 214, 103, ${alpha})`;
      break;
       
    case "-1 Pile-In":
    case "+3 Pile-In":
    case "No Pile-In":
      colour = `rgba(114, 163, 106, ${alpha})`;
      break;
      
    case "Arcane Bolt":
      colour = `rgba(86, 67, 99, ${alpha})`;
      break;
      
    case "Run & Charge":
    case "+1 Run":
    case "+1 Charge":
    case "-1 Charge":
    case "Half Charge":
    case "Fight First":
    case "Fight Last":
      colour = `rgba(204, 71, 71, ${alpha})`;
      break;
      
    case "+1 Bravery":
    case "-1 Bravery":
    case "No Battleshock":
      colour = `rgba(179, 111, 77, ${alpha})`;
      break;
      
    case "Disease":
      colour = `rgba(51, 128, 74, ${alpha})`
      break;
  }
  
  circle.graphics.beginStroke("black").beginFill(colour).drawRect(0-(width/2), 0-(width/2), width, width);
  
  // TODO: DRAW TEXT (from tokenLabel) ONTO TOKEN
  
  let fontSize = (tokenLabel.length < 9) ? "20px" : "15px";
  let string = tokenLabel.replaceAll(" ", "\n");
  
  circle.type = "token";
  circle.text = new createjs.Text(string, `${fontSize} Arial`, "black").set({
    x: circle.x - (width/4),
    y: circle.y - (width/4)
  });
  
  stage.addChild(circle, circle.text);
  stage.setChildIndex(circle.text, 1);
  stage.setChildIndex(circle, 1);
  stage.update();
}

// BATTLEPLAN DEPLOYMENT ZONES & OBJECTIVE PLACING
function showDeployments() {
  function clearZones() {
    stage.removeChild(redDeployment, blueDeployment);
    redDeployment = null;
    blueDeployment = null;
    
    staticObjectives.forEach(e => stage.removeChild(e));
    staticObjectives = [];
  }
  
  clearZones();
  const scenario = document.getElementById("battleplanSelect").value;
  
  const redRGB = "255, 0, 0";
  const blueRGB = "0, 30, 255";
  const alpha = 0.3;
  
  redDeployment = new createjs.Shape();
  blueDeployment = new createjs.Shape();
  
  switch (scenario) {
    case "N/A":
      clearZones();
      break;

    case "Prize of Gallet":
      redDeployment.graphics.beginFill(`rgba(${redRGB}, ${alpha})`).drawRect(0, 0, 1200, 220);
      blueDeployment.graphics.beginFill(`rgba(${blueRGB}, ${alpha})`).drawRect(0, 660, 1200, 220);
      defineObjectives([{x: 600, y: 220}, {x: 300, y: 440}, {x: 600, y: 440}, {x: 900, y: 440}, {x: 600, y: 660}]);
      break;
    case "Realmstone Cache":
      redDeployment.graphics.beginFill(`rgba(${redRGB}, ${alpha})`).drawRect(300, 0, 600, 220);
      blueDeployment.graphics.beginFill(`rgba(${blueRGB}, ${alpha})`).drawRect(300, 660, 600, 880);
      defineObjectives([{x: 600, y: 440}]);
      break;
    case "Lukers Below":
      redDeployment.graphics.beginFill(`rgba(${redRGB}, ${alpha})`).drawRect(0, 0, 300, 880);
      blueDeployment.graphics.beginFill(`rgba(${blueRGB}, ${alpha})`).drawRect(900, 0, 1200, 880);
      defineObjectives([{x: 300, y: 440}, {x: 600, y: 440}, {x: 900, y: 440}]);
      break;

    case "Marking Territory":
      redDeployment.graphics.beginFill(`rgba(${redRGB}, ${alpha})`).drawRect(0, 0, 1200, 220);
      blueDeployment.graphics.beginFill(`rgba(${blueRGB}, ${alpha})`).drawRect(0, 660, 1200, 220);
      defineObjectives([{x: 300, y: 220}, {x: 900, y: 220}, {x: 300, y: 660}, {x: 900, y: 660}]);
      break;
    case "Savage Gains":
      redDeployment.graphics.beginFill(`rgba(${redRGB}, ${alpha})`).drawRect(0, 0, 1200, 220);
      blueDeployment.graphics.beginFill(`rgba(${blueRGB}, ${alpha})`).drawRect(0, 660, 1200, 220);
      defineObjectives([{x: 600, y: 220}, {x: 300, y: 440}, {x: 900, y: 440}, {x: 600, y: 660}]);
      break;
    case "First Blood":
      redDeployment.graphics.beginFill(`rgba(${redRGB}, ${alpha})`).drawRect(0, 0, 600, 220);
      redDeployment.graphics.drawRect(0, 0, 300, 440);
      blueDeployment.graphics.beginFill(`rgba(${blueRGB}, ${alpha})`).drawRect(600, 660, 600, 220);
      blueDeployment.graphics.drawRect(900, 440, 300, 440);
      defineObjectives([{x: 300, y: 660}, {x: 600, y: 440}, {x: 900, y: 220}]);
      break;
    case "Power Struggle":
      redDeployment.graphics.beginFill(`rgba(${redRGB}, ${alpha})`).drawRect(0, 0, 1200, 220);
      blueDeployment.graphics.beginFill(`rgba(${blueRGB}, ${alpha})`).drawRect(0, 660, 1200, 220);
      defineObjectives([{x: 300, y: 220}, {x: 900, y: 220}, {x: 300, y: 660}, {x: 900, y: 660}, {x: 600, y: 440}]);
      break;
    case "Survival of the Fittest":
      redDeployment.graphics.beginFill(`rgba(${redRGB}, ${alpha})`).drawRect(0, 0, 900, 220);
      redDeployment.graphics.drawRect(0, 0, 600, 440);
      redDeployment.graphics.drawRect(0, 0, 300, 660);
      blueDeployment.graphics.beginFill(`rgba(${blueRGB}, ${alpha})`).drawRect(300, 660, 900, 220);
      blueDeployment.graphics.drawRect(600, 440, 600, 440);
      blueDeployment.graphics.drawRect(900, 220, 300, 660);
      defineObjectives([{x: 300, y: 660}, {x: 600, y: 440}, {x: 900, y: 220}]);
      break;
    case "Tectonic Interference":
      redDeployment.graphics.beginFill(`rgba(${redRGB}, ${alpha})`).drawRect(0, 0, 1200, 440);
      blueDeployment.graphics.beginFill(`rgba(${blueRGB}, ${alpha})`).drawRect(0, 440, 1200, 440);
      defineObjectives([{x: 300, y: 440}, {x: 600, y: 440}, {x: 900, y: 440}]);
      break;
    case "Apex Predators":
      redDeployment.graphics.beginFill(`rgba(${redRGB}, ${alpha})`).drawRect(0, 0, 600, 440);
      blueDeployment.graphics.beginFill(`rgba(${blueRGB}, ${alpha})`).drawRect(600, 440, 600, 440);
      defineObjectives([{x: 300, y: 660}, {x: 600, y: 440}, {x: 900, y: 220}]);
      break;
    case "The Vice":
      redDeployment.graphics.beginFill(`rgba(${redRGB}, ${alpha})`).drawRect(0, 0, 600, 880);
      blueDeployment.graphics.beginFill(`rgba(${blueRGB}, ${alpha})`).drawRect(600, 0, 600, 880);
      defineObjectives([{x: 0, y: 0}, {x: 300, y: 220}, {x: 600, y: 440}, {x: 0, y: 880}, {x: 300, y: 660},
                       {x: 1200, y: 0}, {x: 900, y: 220}, {x: 900, y: 660}, {x: 1200, y: 880}]);
      break;
    case "Tooth And Nail":
      redDeployment.graphics.beginFill(`rgba(${redRGB}, ${alpha})`).drawRect(0, 0, 900, 220);
      redDeployment.graphics.drawRect(0, 0, 600, 440);
      redDeployment.graphics.drawRect(0, 0, 300, 660);
      blueDeployment.graphics.beginFill(`rgba(${blueRGB}, ${alpha})`).drawRect(300, 660, 900, 220);
      blueDeployment.graphics.drawRect(600, 440, 600, 440);
      blueDeployment.graphics.drawRect(900, 220, 300, 660);
      defineObjectives([{x: 300, y: 220}, {x: 900, y: 220}, {x: 300, y: 660}, {x: 900, y: 660}]);
      break;
    case "Feral Foray":
      redDeployment.graphics.beginFill(`rgba(${redRGB}, ${alpha})`).drawRect(0, 0, 1200, 440);
      blueDeployment.graphics.beginFill(`rgba(${blueRGB}, ${alpha})`).drawRect(0, 440, 1200, 440);
      defineObjectives([{x: 300, y: 220}, {x: 600, y: 220}, {x: 900, y: 220}, 
                        {x: 300, y: 660}, {x: 600, y: 660}, {x: 900, y: 660}]);
      break;
    case "Power In Numbers":
      redDeployment.graphics.beginFill(`rgba(${redRGB}, ${alpha})`).drawRect(0, 0, 1200, 220);
      blueDeployment.graphics.beginFill(`rgba(${blueRGB}, ${alpha})`).drawRect(0, 660, 1200, 220);
      defineObjectives([{x: 300, y: 220}, {x: 600, y: 220}, {x: 900, y: 220}, 
                        {x: 300, y: 660}, {x: 600, y: 660}, {x: 900, y: 660}]);
      break;
    case "The Veins Of Ghur":
      redDeployment.graphics.beginFill(`rgba(${redRGB}, ${alpha})`).drawRect(0, 0, 1200, 220);
      blueDeployment.graphics.beginFill(`rgba(${blueRGB}, ${alpha})`).drawRect(0, 660, 1200, 220);
      break;
  }
  
  function defineObjectives(array) {
    for (let i = 0; i < array.length; i++) {
      makeObjective(null, {
        x: array[i].x,
        y: array[i].y
      });
    }
  }
  
  stage.addChild(redDeployment, blueDeployment);
  stage.setChildIndex(redDeployment, 1);
  stage.setChildIndex(blueDeployment, 1);
  stage.update();
}

// RULER FUNCTIONS (START, DRAW & END)
function beginRuler(event) {
    // Create the ruler line graphics at mouse position
    rulerLine = new createjs.Shape().set({
        x: stage.mouseX,
        y: stage.mouseY,
        graphics: new createjs.Graphics().ss(3).s("white")
    });
    stage.addChild(rulerLine);

    measurementObj = new createjs.Text('0.0"', "20px Arial", "white").set({
        x: stage.mouseX,
        y: stage.mouseY + 20
    });
    stage.addChild(measurementObj);

    // Add events for when the user moves or releases the mouse
    stage.addEventListener("stagemousemove", drawRulerLine);
    stage.addEventListener("stagemouseup", endRulerLine);
    stage.update();
}

function drawRulerLine(event) {
    // Clear the ruler from the previous frame and re-draw at new position
    rulerLine.graphics.clear()
        .ss(3).s("white")
        .mt(event.target.x, event.target.y)
        .lt(stage.mouseX - rulerLine.x, stage.mouseY - rulerLine.y);

    // LINE START: rulerLine.x/y
    // LINE END: stage.mouseX/Y

    let pixelWidth = Math.max(rulerLine.x, stage.mouseX) - Math.min(rulerLine.x, stage.mouseX);
    let pixelHeight = Math.max(rulerLine.y, stage.mouseY) - Math.min(rulerLine.y, stage.mouseY);
    let pixelDiagonal = Math.sqrt((pixelWidth ** 2) + (pixelHeight ** 2));
    let diagonal = parseFloat(pixelDiagonal / 20).toFixed(1);

    measurementObj.x = stage.mouseX - 20;
    measurementObj.y = stage.mouseY + 20;
    measurementObj.text = `${diagonal}"`;

    if (stage.mouseX < -1 || stage.mouseY < -1 || stage.mouseX > 1201 || stage.mouseY > 881) {
        endRulerLine();
    }

    stage.update();
}

function endRulerLine(event) {
    const marker = new createjs.Shape().set({
        x: event.target.x,
        y: event.target.y,
        graphics: new createjs.Graphics().ss(2).s("white")
            .dc(stage.mouseX, stage.mouseY, 5).es()
            .s("red").dc(stage.mouseX, stage.mouseY, 1)
    });

    stage.addChild(marker);

    setTimeout(() => {
        stage.removeChild(marker);
        stage.update();
    }, 4000);

    stage.removeChild(rulerLine);
    stage.removeChild(measurementObj);
    stage.removeEventListener("stagemousemove", drawRulerLine);
    stage.removeEventListener("stagemouseup", endRulerLine);
    stage.update();
}

// EVENT FUNCTIONS

function keyboardHandler(event) {
    // Delete objects with DEL key
    if (event.code === "Delete" && selectedObject != null) {
        deleteObject();
    }

    // Rotate objects left/right with Q/E
    if (event.code === "KeyQ") {
        rotate("L");
    } else if (event.code === "KeyE") {
        rotate("R");
    }

    // Toggle ruler with R
    if (event.code === "KeyR") toggleRuler();
  
    // Toggle base placement with P
    if (event.code === "KeyP") toggleBasePlacement();
  
    // Toggle objective placement with O
    if (event.code === "KeyO") toggleObjectivePlacement();
  
    // Toggle token placement with T
    if (event.code === "KeyT") toggleTokenPlacement();
}

function drag(event) {
    if (!rulerOn || measureMovement) {
      event.target.x = event.stageX;
      event.target.y = event.stageY;
  
      if (event.target.type === "token") {
        event.target.text.x = event.stageX;
        event.target.text.y = event.stageY;
      }
  
      stage.update();
    }
    
}

function deleteObject() {
    if (!rulerOn) {
        if (selectedObject.type === "token") {
          stage.removeChild(selectedObject.text);
        }
        stage.removeChild(selectedObject);
        clearObjectSelection();
        stage.update();
    }
}

function showName(event) {
    const unitFocusField = document.getElementById('unit-focus-field');
    unitFocusField.innerText = event.target.name || "(Unnamed Unit)";

    setTimeout(() => {
        unitFocusField.innerText = "(No Unit Selected)";
    }, 2000);
}

function selectObject(event) {
    stage.removeChild(selectionMarker);
    selectionMarker = null;
  
    let selectionDot = new createjs.Shape();
    selectionDot.graphics.ss(3).s("grey").dc(event.target.x, event.target.y, 5);
    stage.addChild(selectionDot);
    stage.update();

    selectedObject = event.target;
    selectionMarker = selectionDot;
}

function clearObjectSelection(event) {
        stage.removeChild(selectionMarker);
        selectedObject = null;
        selectionMarker = null;
        stage.update();
}

function rotate(dir) {
    if (selectedObject != null) {
        switch (dir) {
            case "L":
                selectedObject.rotation -= 10;
                stage.update();
                break;
            case "R":
                selectedObject.rotation += 10;
                stage.update();
                break;
        }
    }
}
