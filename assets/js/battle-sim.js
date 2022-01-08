// GLOBALS
let stage;

let placingOn = false;
let baseSizeSelected = null;
let objPlacingOn = false;

let selectedObject = null;
let selectionMarker = null;

let rulerOn = false;
let rulerLine = null;
let measurementObj = null;

// INIIIALISE STAGE
function init() {
    stage = new createjs.Stage("game-board");
    loadBackground();
    stage.enableMouseOver();
  
    // Global event listeners
    stage.addEventListener("stagemousedown", clearObjectSelection);
    document.addEventListener("keydown", keyboardHandler);
}

// APPLY BACKGROUND IMAGE
function loadBackground() {
    const bgImg = new Image(1200, 880);
    bgImg.src = "https://i.pinimg.com/originals/07/97/64/0797645e945ae611cca110d1cd002d46.jpg";
    const bgBitmap = new createjs.Bitmap(bgImg);
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
    if (rulerOn) toggleRuler();
  } else {
    objPlacingOn = false;
    stage.removeEventListener("stagemousedown", makeObjective);
    objButton.classList.remove("button-on");
  }
}

function toggleRuler() {
    if (!rulerOn) {
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

// OBJECTIVE & MODEL PLACING
function makeCircle(event, width, height) {
    const circle = new createjs.Shape();
  
    circle.x = event.stageX;
    circle.y = event.stageY;

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
  
    const circle = makeCircle(event, width, height);
   
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

function makeObjective(event) {
  const width = 120;
  const circle = makeCircle(event, width);
  
  circle.graphics.beginStroke("red").drawCircle(0, 0, width).endStroke()
            .beginStroke("blue").drawCircle(0, 0, width / 2).endStroke()
            .beginFill("red").drawCircle(0, 0, 3);
  
  circle.on("dblclick", selectObject);
  
  stage.addChild(circle);
  stage.setChildIndex(circle, 1);
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
}

function drag(event) {
    if (!rulerOn) {
        event.target.x = event.stageX;
        event.target.y = event.stageY;
        stage.update();
    }
}

function deleteObject() {
    if (!rulerOn) {
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

// DOCUMENT FUNCTIONS
function clearField(field) {
    field.value = "";
}
