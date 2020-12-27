define(["hexa"], function() {

hexaFencePuzzle = function(puzzleData, controls, settings) {
  hexaPuzzle.call(this, puzzleData, controls, settings);
}

Object.setPrototypeOf(hexaFencePuzzle.prototype, hexaPuzzle.prototype);

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

function setDragSwitch(element, withClues, dragSwitch, pencilDragSwitch) {
  if (element.isClue && !withClues) {
    return;
  }
  element.dragSwitch = dragSwitch.map(val => {return {...element.data, ...val}})
  if (typeof pencilDragSwitch != "undefined") {
    element.pencilDragSwitch = pencilDragSwitch;
  } else {
    element.pencilDragSwitch = dragSwitch.map(val => {var clone = Object.assign({}, val); delete clone.returnValue; return clone});
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

hexaFencePuzzle.prototype.setTypeProperties = function(typeCode){
  var self = this;
  var typeProperties = {}

  typeProperties["hexa_fence"] = {
    thickEdges: true,
    outerEdges: false,
    needNodes: true,
    cellController: cell => setClickSwitch(cell, true, [{},{image: "cross"},{image: "white_circle"}]),
    edgeController: edge => {
      setClickSwitch(edge, false, [{},{color: self.colorSchema.lineColor, returnValue: 1},{image: "cross"}]);
      setDragSwitch(edge, false, [{},{color: self.colorSchema.lineColor}]);
    },
    nodeController: node => node.dragProcessor = true,
    cellEditController: cell => setNumberClues(cell, 0, 6),
  }

  typeProperties["hexa_islands"] = {
    cellController: cell => setClickSwitch(cell, false, [{},{color: self.colorSchema.textColor, returnValue: "1"},{image: "cross"}], [{},{color: "grey"},{image: "cross"}]),
    cellEditController: cell => {cell.isClue = true; cell.clickSwitch = [{},{color: self.colorSchema.clueColor, returnValue: "1"}];},
    decodeClue: value => {
      if (value=='1') {
        return {color: self.colorSchema.clueColor};
      }
      if (value=='0') {
        return {image: "cross"};
      }
    },
  }

  typeProperties["hexa_paint"] = {
    cellController: cell => setClickSwitch(cell, true, [{},{color: "grey", returnValue: 1},{image: "white_circle"}], [{},{color: "lightgrey"},{image: "white_circle"}]),
    cellEditController:  cell => setNumberClues(cell, 0, 7),
  }

  if (typeCode in typeProperties) {
    this.typeProperties = {...this.typeProperties, ...typeProperties[typeCode]};
  }
}
})
