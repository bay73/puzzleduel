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

  typeProperties["snake_dutch"] = {
    cellController: cell => {
      setClickSwitch(cell, false, [{},{color: "#606060", returnValue: "1"},{image: "cross"}], [{},{color: "#a0a0a0"},{image: "cross"}]);
      if (cell.isClue && cell.data.image != "cross") {
        setClueClickSwitch(cell, [{},{color: "#606060", returnValue: "1"}], [{},{color: "#a0a0a0"}]);
      }
    },
    cellEditController: cell => {cell.isClue = true; cell.clickSwitch = [{},{image: "white_circle", returnValue: "white_circle"},{image: "black_circle", returnValue: "black_circle"},{image: "cross", returnValue: "cross"}];},
    decodeClue: value => {return {image: value} },
  }

  typeProperties["starbattle"] = {
    needNodes: true,
    cellController: cell => {
      setClickSwitch(cell, false, [{},{image: "star", returnValue: "star"},{image: "cross"}]);
    },
    cellEditController: cell => {cell.isClue = true; cell.clickSwitch = [{},{image: "cross", returnValue: "cross"}];},
    edgeEditController: edge => {
       edge.isClue = true;
       edge.clickSwitch = [{},{color: self.colorSchema.gridColor, returnValue: "1"}];
       edge.dragSwitch = [{},{color: self.colorSchema.gridColor, returnValue: "1"}];
    },
    nodeEditController: node => node.dragProcessor = true,
    decodeClue: value => {return {image: value} },
    collectAreas: this.editMode,
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

function setClueClickSwitch(element, clickSwitch, pencilClickSwitch) {
  if (!element.isClue) {
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
