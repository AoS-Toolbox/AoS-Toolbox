// GLOBALS
let diceStage;

let numDiceInTray = 0;
let diceTrayObjects = [];
let rolledDiceObjects = [];
let numDiceText;

let rollResults = {
  1: null,
  2: null,
  3: null,
  4: null,
  5: null,
  6: null
}
let readOuts = [];

// INITIALISE STAGE, BUTTONS & CONTAINERS
function dicerollerInit() {
  diceStage = new createjs.Stage("rolling-tray");
    
  initDiceButtons();
  initClearButton();
  initRollButton();
  buildResultsContainers();
  
  numDiceText = new createjs.Text(`(${numDiceInTray})`, '18px Arial', "white");
  numDiceText.textBaseline = "alphabetic";
  numDiceText.x = 70;
  numDiceText.y = 190;
  
  diceStage.addChild(numDiceText);
  diceStage.update();
}

function initDiceButtons() {
  let add1D6Button = new createjs.Shape();
  let add2D6Button = new createjs.Shape();
  let add5D6Button = new createjs.Shape();
  let add10D6Button = new createjs.Shape();
  
  const addDiceButtons = [add1D6Button, add2D6Button, add5D6Button, add10D6Button];
  
  for (let i = 0; i < addDiceButtons.length; i++) {
    addDiceButtons[i].graphics.s("black").f("white").drawRect(0, 0, 60, 30);
    addDiceButtons[i].y = 10;
  }
  
  add1D6Button.x = 5;
  add2D6Button.x = 75;
  add5D6Button.x = 145;
  add10D6Button.x = 215;
  
  add1D6Button.numDice = 1;
  add2D6Button.numDice = 2;
  add5D6Button.numDice = 5;
  add10D6Button.numDice = 10;
  
  addDiceButtons.forEach(element => {
    element.on("click", addDice);
  });
  
  diceStage.addChild(add1D6Button, add2D6Button, add5D6Button, add10D6Button);
  
  for (let i = 0; i < addDiceButtons.length; i++) {
    let label;
    
    switch (i) {
      case 0:
        label = "1D6";
        break;
      case 1:
        label = "2D6";
        break;
      case 2:
        label = "5D6";
        break;
      case 3:
        label = "10D6";
        break;
    }
    
    const text = new createjs.Text(label, "18px Arial", "black");
    text.x = addDiceButtons[i].x + 14;
    text.y = addDiceButtons[i].y + 7;
    
    if (i === 3) text.x = addDiceButtons[i].x + 10;
    
    diceStage.addChild(text);
  }
}

function initClearButton() {
  let clearButton = new createjs.Shape();
  clearButton.graphics.s("black").f("white").drawRect(5, 175, 60, 20);
  
  clearButton.on("click", clearTray);
  clearButton.on("click", clearResults);
  
  let clearText = new createjs.Text("CLEAR", "15px Arial", "black");
  clearText.x = 9;
  clearText.y = 178;
  
  diceStage.addChild(clearButton, clearText);
}

function initRollButton() {
  let rollButton = new createjs.Shape();
  rollButton.graphics.s("black").f("white").drawRect(215, 175, 60, 20);
  
  rollButton.on("click", rollDice);
  
  let rollText = new createjs.Text("ROLL", "15px Arial", "black");
  rollText.x = 225;
  rollText.y = 178;
  
  diceStage.addChild(rollButton, rollText);
}

function buildResultsContainers() {
  for (let i = 1; i <= 6; i++) {
    let posY;
    
    switch (i) {
      case 1:
        posY = 260;
        break;
      case 2:
        posY = 310;
        break;
      case 3:
        posY = 360;
        break;
      case 4:
        posY = 410;
        break;
      case 5:
        posY = 460;
        break;
      case 6:
        posY = 510;
        break;
    }
    
    let del = new createjs.Shape();
    del.graphics.s("black").f("#d46359").drawRect(10, posY, 30, 20);
    del.diceValue = i;
    del.on("click", deleteRolledDice);
    
    let delText = new createjs.Text("DEL", "12px Arial", "black");
    delText.x = 14;
    delText.y = posY + 5;
    
    let container = new createjs.Shape();
    container.graphics.f("#6e878a").drawRect(60, posY-10, 210, 40);
    
    diceStage.addChild(container, del, delText);
  }
  
  let reRollButton = new createjs.Shape();
  reRollButton.graphics.s("black").f("white").drawRect(200, 555, 70, 30);
  
  reRollButton.on("click", reRoll);
  
  let reRollText = new createjs.Text("RE-ROLL", "15px Arial", "black");
  reRollText.x = 203;
  reRollText.y = 563;
  
  diceStage.addChild(reRollButton, reRollText);
  diceStage.update();
}

// BUTTON EVENTS

function addDice(event) {
  numDiceInTray += event.target.numDice;
  if (numDiceInTray > 60) numDiceInTray = 60;
  redrawDiceTray();
  updateDiceTrayCounter();
}

function redrawDiceTray() {
  for (let i = 0; i < diceTrayObjects.length; i++) {
    diceStage.removeChild(diceTrayObjects[i]);
  }
  
  diceTrayObjects = [];
  
  for (let i = 0; i < numDiceInTray; i++) {
    let dice = new createjs.Shape();
    dice.graphics.s("black").f("white").drawRect(0, 0, 15, 15);
    dice.context = "tray";
    diceTrayObjects.push(dice);
  }
  
  for (let i = 0; i < diceTrayObjects.length; i++) {
    if (i < 10) {
      diceTrayObjects[i].y = 50;
    } else if (i < 20) {
      diceTrayObjects[i].y = 70;
    } else if (i < 30) {
      diceTrayObjects[i].y = 90;
    } else if (i < 40) {
      diceTrayObjects[i].y = 110;
    } else if (i < 50) {
      diceTrayObjects[i].y = 130;
    } else if (i < 60) {
      diceTrayObjects[i].y = 150;
    }
    
    if (i === 0 || i === 10 || i === 20 || i === 30 || i === 40 || i === 50) {
      diceTrayObjects[i].x = 20;
    } else {
      diceTrayObjects[i].x = diceTrayObjects[i - 1].x + 25;
    }
    
    diceStage.addChild(diceTrayObjects[i]);
  }
  
  diceStage.update();
}

function clearTray() {
    numDiceInTray = 0;
    redrawDiceTray();
    updateDiceTrayCounter();
}

function updateDiceTrayCounter() {
  numDiceText.text = `(${numDiceInTray})`;
  diceStage.update();
}

function clearResults() {
  for (let i = 0; i < readOuts.length; i++) { diceStage.removeChild(readOuts[i]); }
  readOuts = [];
  diceStage.update();
}

function rollDice() {
  clearResults();
  
  let results = [];
  
  for (let i = 0; i < numDiceInTray; i++) {
    results.push(rollD6());
  }
  
  for (let i = 1; i <= 6; i++) {
    rollResults[i] = results.filter(e => e === i).length;
  }
  
  console.log(rollResults);
  
  showDiceResults();
  clearTray();
}

function reRoll() {
  let count = 0;
  for (let i = 1; i <= 6; i++) {
    count += rollResults[i];
  }
  numDiceInTray = count;
  rollDice();
}

function showDiceResults() {
  // Loop over each D6 result - 1 to 6
  for (let i = 1; i <= 6; i++) {
    let readOut = new createjs.Text(`(${rollResults[i]})`, "18px Arial", "white");
    readOut.diceValue = i;
    readOut.x = 70;
    
    switch (i) {
      case 1:
        readOut.y = 260;
        break;
      case 2:
        readOut.y = 310;
        break;
      case 3:
        readOut.y = 360;
        break;
      case 4:
        readOut.y = 410;
        break;
      case 5:
        readOut.y = 460;
        break;
      case 6:
        readOut.y = 510;
        break;
    }
    
    if (rollResults[i] > 0) {
      readOuts.push(readOut);
      diceStage.addChild(readOut);
    }
  }
  diceStage.update();
}

function deleteRolledDice(event) {
  console.log("Entering deleteRolledDice()");
  let deleteNum = event.target.diceValue;
  rollResults[deleteNum] = 0;
  for (let i = 0; i < readOuts.length; i++) {
    console.log("Loop ", i+1);
    if (readOuts[i].diceValue === deleteNum) {
      console.log("Deleting a ", readOuts[i].diceValue);
      diceStage.removeChild(readOuts[i]);
    }
  }
  readOuts = readOuts.filter(element => element.diceValue !== deleteNum);
  diceStage.update();
}

// DICEROLLING LOGIC
function rollD6() { 
  return Math.floor(Math.random() * (6 - 1 + 1)) + 1; 
}
