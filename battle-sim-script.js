// GLOBALS
let stage;

let placingOn = false;
let baseSizeSelected = null;

let selectedObject = null;
let selectionMarker = null;

let rulerOn = false;
let rulerLine = null;
let measurementObj = null;

// INIIIALISE STAGE
function init() {
    stage = new createjs.Stage("game-board");
    stage.enableMouseOver();
    loadBackground();

    // Global event listeners
    stage.addEventListener("stagemousedown", clearObjectSelection);
    //document.addEventListener("keypress", keyboardHandler);
}

// APPLY BACKGROUND IMAGE
function loadBackground() {
    const bgImg = new Image(1200, 880);
    bgImg.src = "https://i.pinimg.com/originals/07/97/64/0797645e945ae611cca110d1cd002d46.jpg";
    const bgBitmap = new createjs.Bitmap(bgImg);
    bgBitmap.cache(0, 0, 1200, 880);
    stage.addChild(bgBitmap);
    stage.setChildIndex(bgBitmap, 0);
    stage.update();
}

// PLACEMENT & DRAWING TOGGLES
function togglePlacement(baseSize, forceArg) {
    if ((baseSizeSelected === null || baseSizeSelected != baseSize) && forceArg == undefined) {
        placingOn = true;
        baseSizeSelected = baseSize;
        stage.addEventListener("stagemousedown", makeCircle);

        if (rulerOn) toggleRuler();
    } else {
        placingOn = false;
        baseSizeSelected = null;
        stage.removeEventListener("stagemousedown", makeCircle);
    }

    const baseSizeClassLists = {
        "25MM": document.getElementById("btn-25mm").classList,
        "32MM": document.getElementById("btn-32mm").classList,
        "40MM": document.getElementById("btn-40mm").classList,
        "50MM": document.getElementById("btn-50mm").classList,
        "60MM": document.getElementById("btn-60mm").classList,
        "80MM": document.getElementById("btn-80mm").classList,
        "100MM": document.getElementById("btn-100mm").classList,
        "130MM": document.getElementById("btn-130mm").classList,
        "160MM": document.getElementById("btn-160mm").classList,
        "305MM": document.getElementById("btn-305mm").classList,
        "60x35MM": document.getElementById("btn-60x35mm").classList,
        "75x42MM": document.getElementById("btn-75x42mm").classList,
        "90x52MM": document.getElementById("btn-90x52mm").classList,
        "105x70MM": document.getElementById("btn-105x70mm").classList,
        "120x92MM": document.getElementById("btn-120x92mm").classList,
        "170x105MM": document.getElementById("btn-170x105mm").classList,
        "280x210MM": document.getElementById("btn-280x210mm").classList,
    }

    for (const key of Object.keys(baseSizeClassLists)) {
        if (key != baseSize) {
            baseSizeClassLists[key].remove("button-on");
        } else {
            baseSizeClassLists[key].toggle("button-on");
        }
    }
}

function toggleRuler() {
    if (!rulerOn) {
        // Turn ruler on, force placement to toggle off, listen for mouse on stage,
        // show ruler button status
        rulerOn = true;
        if (placingOn) togglePlacement(null, "forceToggleOff");
        stage.addEventListener("stagemousedown", beginRuler);
        document.getElementById('btn-ruler').classList.toggle("button-on");
    } else if (rulerOn) {
        rulerOn = false;
        stage.removeEventListener("stagemousedown", beginRuler);
        document.getElementById('btn-ruler').classList.remove("button-on");
    }
}

// OBJECTIVE & MODEL PLACING
function makeCircle(event) {
    let width;
    let height;
    switch (baseSizeSelected) {
        case "25MM":
            width = 9.8;
            break;
        case "32MM":
            width = 12.5;
            break;
        case "40MM":
            width = 15.7;
            break;
        case "50MM":
            width = 19.6;
            break;
        case "60MM":
            width = 23.6;
            break;
        case "80MM":
            width = 31.4;
            break;
        case "100MM":
            width = 39.3;
            break;
        case "130MM":
            width = 51.1;
            break;
        case "160MM":
            width = 62.9;
            break;

        // Objective marker
        case "305MM":
            width = 120;
            break;

        // Elliptical bases  
        case "60x35MM":
            width = 23.6;
            height = 13.7;
            break;
        case "75x42MM":
            width = 29.5;
            height = 16.5;
            break;
        case "90x52MM":
            width = 35.4;
            height = 20.4;
            break;
        case "105x70MM":
            width = 41.3;
            height = 27.5;
            break;
        case "120x92MM":
            width = 47.2;
            height = 36.2;
            break;
        case "170x105MM":
            width = 66.9;
            height = 41.3;
            break;
        case "280x210MM":
            width = 110;
            height = 82.6;
            break;
    }

    const circle = new createjs.Shape();

    if (baseSizeSelected != "305MM" && !baseSizeSelected.includes("x")) {
        // DRAW A BASE
        const color = document.getElementById('base-color').value;
        circle.name = document.getElementById('unit-name').value
            .split(" ")
            .map(e => e.charAt(0).toUpperCase(0) + e.slice(1))
            .join(" ");

        circle.graphics.beginFill(color).drawCircle(0, 0, width);
        circle.shadow = new createjs.Shadow("#000000", 2, 2, 35);
    } else if (baseSizeSelected === "305MM") {
        // DRAW AN OBJECTIVE MARKER
        circle.graphics.beginStroke("red").drawCircle(0, 0, width).endStroke()
            .beginStroke("blue").drawCircle(0, 0, width / 2).endStroke()
            .beginFill("red").drawCircle(0, 0, 3);
    } else if (baseSizeSelected.includes("x")) {
        // DRAW AN ELLIPTICAL BASE
        const color = document.getElementById('base-color').value;
        circle.name = document.getElementById('unit-name').value
            .split(" ")
            .map(e => e.charAt(0).toUpperCase(0) + e.slice(1))
            .join(" ");

        circle.graphics.beginFill(color).drawEllipse(0 - width, 0 - height, width * 2, height * 2);
        circle.shadow = new createjs.Shadow("#000000", 2, 2, 35);
    }

    circle.x = event.stageX;
    circle.y = event.stageY;

    circle.on("pressmove", drag);
    circle.on("dblclick", selectObject);
    circle.on("mouseover", showName);

    stage.addChild(circle);
    if (baseSizeSelected === "305MM") stage.setChildIndex(circle, 1);
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

    // LINE START DATA FOUND AT: rulerLine.x and rulerLine.y
    // LINE END DATA FOUND AT: stage.mouseX and stage.mouseY

    let pixelWidth = Math.max(rulerLine.x, stage.mouseX) - Math.min(rulerLine.x, stage.mouseX);
    let pixelHeight = Math.max(rulerLine.y, stage.mouseY) - Math.min(rulerLine.y, stage.mouseY);
    let pixelDiagonal = Math.sqrt((pixelWidth ** 2) + (pixelHeight ** 2));
    let diagonal = parseFloat(pixelDiagonal / 20).toFixed(1);

    measurementObj.x = stage.mouseX - 10;
    measurementObj.y = stage.mouseY + 20;
    measurementObj.text = `${diagonal}"`;

    if (stage.mouseX < 0 || stage.mouseY < 0 || stage.mouseX > 1200 || stage.mouseY > 880) {
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

function drag(event) {
    if (!rulerOn) {
        event.target.x = event.stageX;
        event.target.y = event.stageY;
        stage.update();
    }
}

function deleteObject(event) {
    if (!rulerOn) {
        stage.removeChild(event.target);
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
    let selectionDot = new createjs.Shape();
    selectionDot.graphics.ss(3).s("grey").dc(event.target.x, event.target.y, 5);
    stage.addChild(selectionDot);
    stage.update();

    selectedObject = event.target;
    selectionMarker = selectionDot;
}

function clearObjectSelection(event) {
    if (selectedObject != null) {
        selectedObject = null;
        stage.removeChild(selectionMarker);
        stage.update();
    }
}

function rotate(dir) {
    if (selectedObject != null) {
        switch (dir) {
            case "L":
                selectedObject.rotation += 15;
                stage.update();
                break;
            case "R":
                selectedObject.rotation -= 15;
                stage.update();
                break;
        }
    }
}

// DICE FUNCTION
function rollDice() {
    // Get diceroll I/O
    const inputField = document.getElementById('dice-input');
    const outputField = document.getElementById('diceroll-field');
    const numDice = parseInt(inputField.value);

    // Define function for rolling a D6
    function rollD6() { return Math.floor(Math.random() * (6 - 1 + 1)) + 1; }

    // Define variables for storing results
    let rollsArray = [];
    let rollsString = "";

    // Roll a D6 a number of times equal to input
    for (let i = 0; i < inputField.value; i++) { rollsArray.push(rollD6()); }

    // Write result string if result is coherent // ?? This gate fails to stop NaN values ??
    if (numDice != NaN) rollsString += `Rolled: ${inputField.value}D6...\n\n`;

    // For each of the 6 possible results, construct a string with X's
    for (let i = 1; i <= 6; i++) {
        let resultString = "";
        let numOfRolls = rollsArray.filter(roll => roll === i).length;

        for (let j = 0; j < numOfRolls; j++) { resultString += "X " };

        rollsString += `${i}: ${resultString}${numOfRolls || ""}\n`;
    }

    // Display the result on the page and clear the input field
    outputField.innerText = rollsString;
    clearField(inputField);
}

// DOCUMENT FUNCTIONS
function clearField(field) {
    field.value = "";
}