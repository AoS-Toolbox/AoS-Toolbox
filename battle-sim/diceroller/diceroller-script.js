// GLOBALS
let diceStage;

let numDiceInTray = 0;
let diceTrayObjects = [];
let numDiceText;

let rollResults = {
  1: null,
  2: null,
  3: null,
  4: null,
  5: null,
  6: null
}

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
  numDiceText.y = 155;
  
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
    addDiceButtons[i].graphics.s("black").f("white").drawRect(0, 0, 65, 30);
    addDiceButtons[i].y = 10;
  }
  
  add1D6Button.x = 5;
  add2D6Button.x = 80;
  add5D6Button.x = 155;
  add10D6Button.x = 230;
  
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
    
    if (i === 3) text.x = addDiceButtons[i].x + 12;
    
    diceStage.addChild(text);
  }
}

function initClearButton() {
  let clearButton = new createjs.Shape();
  clearButton.graphics.s("black").f("white").drawRect(5, 155, 60, 20);
  
  clearButton.on("click", clearTray);
  
  let clearText = new createjs.Text("CLEAR", "15px Arial", "black");
  clearText.x = 9;
  clearText.y = 158;
  
  diceStage.addChild(clearButton, clearText);
}

function initRollButton() {
  let rollButton = new createjs.Shape();
  rollButton.graphics.s("black").f("white").drawRect(0, 0, 60, 20);
  rollButton.x = 235;
  rollButton.y = 155;
  
  rollButton.on("click", rollDice);
  
  let rollText = new createjs.Text("ROLL", "15px Arial", "black");
  rollText.x = 246;
  rollText.y = 158;
  
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
    
    diceStage.addChild(del, delText);
  }
  
  diceStage.update();
}

// BUTTON EVENTS

function addDice(event) {
  numDiceInTray += event.target.numDice;
  if (numDiceInTray > 60) numDiceInTray = 60;
  redrawDiceTray();
  updateDiceTrayCounter();
};

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
    if (i < 12) {
      diceTrayObjects[i].y = 50;
    } else if (i < 24) {
      diceTrayObjects[i].y = 70;
    } else if (i < 36) {
      diceTrayObjects[i].y = 90;
    } else if (i < 48) {
      diceTrayObjects[i].y = 110;
    } else if (i < 60) {
      diceTrayObjects[i].y = 130;
    }
    
    if (i === 0 || i === 12 || i === 24 || i === 36 || i === 48 || i === 60) {
      diceTrayObjects[i].x = 5;
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

function rollDice() {
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
  
}

function showDiceResults() {
  
}

function deleteRolledDice(event) {
  // use event.target.diceValue to determine which row to delete
}

// DICEROLLING LOGIC
function rollD6() { 
  return Math.floor(Math.random() * (6 - 1 + 1)) + 1; 
}
