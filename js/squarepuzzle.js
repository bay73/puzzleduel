define(["square"], function() {

squarePuzzleType = function(puzzleData, controls, settings) {
  squarePuzzle.call(this, puzzleData, controls, settings);
}

Object.setPrototypeOf(squarePuzzleType.prototype, squarePuzzle.prototype);

squarePuzzleType.prototype.setTypeProperties = function(typeCode) {
  var self = this;
  var typeProperties = {}
  
  typeProperties["hitori"] = {
    cellController: cell => setClickSwitch(cell, true, [{},{color: "#303030", returnValue: "1"},{image: "white_circle"}], [{},{color: "#808080"},{image: "white_circle"}]),
    cellEditController: cell => setNumberClues(cell, 0, 16),
   
  }

  if (typeCode in typeProperties) {
    this.typeProperties = {...this.typeProperties, ...typeProperties[typeCode]};
  }
}

function setClickSwitch(element, withClues, clickSwitch, pencilClickSwitch) {
  if (element.isClue && !withClues) {
    return;
  }
  element.clickSwitch = clickSwitch.map(val => {return {...element.data, ...val}})
  if (typeof pencilClickSwitch != "undefined") {
    element.pencilClickSwitch = pencilClickSwitch;
  } else {
    element.pencilClickSwitch = clickSwitch.map(val => {var clone = Object.assign({}, val); delete clone.returnValue; return clone});
  }
}

function setNumberClues(cell, start, end) {
  cell.isClue = true;
  var clickSwitch = [{}];
  for (var i=start; i<=end; i++) {
    clickSwitch.push({text: i.toString(), returnValue: i.toString()});
  }
  cell.clickSwitch = clickSwitch;
}

})
