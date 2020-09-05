define(["hexa"], function() {

hexaFencePuzzle = function(puzzleData, controls, settings) {
  hexaPuzzle.call(this, puzzleData, controls, settings);
}

Object.setPrototypeOf(hexaFencePuzzle.prototype, hexaPuzzle.prototype);


hexaFencePuzzle.prototype.createBoard = function() {
  hexaPuzzle.prototype.createBoard.call(this);
  if (this.typeCode != "hexa_fence") {
    for (var y = 0; y < this.rows + this.cols - 1; y++) {
      for (var x = 0; x < 2*this.cols - 1; x++) {
        if (this.cells[y] && this.cells[y][x]) {
          for (var i=0; i<6; i++){
            if (this.edges[y][x][i].allCells.length==1) {
              this.edges[y][x][i].isFinal = true;
              this.edges[y][x][i].data = {text: null, image: null, color: this.colorSchema.gridColor, textColor: null};
            }
          }
        }
      }
    }
  }
}

hexaFencePuzzle.prototype.initController = function() {
  hexaPuzzle.prototype.initController.call(this);
  if (this.typeCode == "hexa_fence") {
    for (var y = 0; y < this.rows + this.cols - 1; y++) {
      for (var x = 0; x < 2*this.cols - 1; x++) {
        if (this.cells[y] && this.cells[y][x]) {
          if (this.cells[y][x].isClue) {
            value = this.cells[y][x].data.text;
            this.cells[y][x].clickSwitch = [{text: value},{text: value, image: "cross"},{text: value, image: "white_circle"}];
          } else {
            this.cells[y][x].clickSwitch = [{},{image: "cross"},{image: "white_circle"}];
          }
          this.cells[y][x].pencilClickSwitch = [{},{image: "cross"},{image: "white_circle"}];
          for (var i=0; i<6; i++){
            this.edges[y][x][i].clickSwitch = [{},{color: this.colorSchema.lineColor, returnValue: 1},{image: "cross"}];
            this.edges[y][x][i].pencilClickSwitch = this.edges[y][x][i].clickSwitch;
            this.edges[y][x][i].dragSwitch = [{},{color: this.colorSchema.lineColor}];
            this.edges[y][x][i].pencilDragSwitch = this.edges[y][x][i].dragSwitch;
            this.nodes[y][x][i].dragProcessor = true;
          }
        }
      }
    }
  }
  if (this.typeCode == "hexa_islands") {
    for (var y = 0; y < this.rows + this.cols - 1; y++) {
      for (var x = 0; x < 2*this.cols - 1; x++) {
        if (this.cells[y] && this.cells[y][x]) {
          if (!this.cells[y][x].isClue) {
            this.cells[y][x].clickSwitch = [{},{color: this.colorSchema.textColor, returnValue: "1"},{image: "cross"}];
            this.cells[y][x].pencilClickSwitch = [{},{color: this.colorSchema.textColor},{image: "cross"}];
          }
        }
      }
    }
  }
  if (this.typeCode == "hexa_paint") {
    for (var y = 0; y < this.rows + this.cols - 1; y++) {
      for (var x = 0; x < 2*this.cols - 1; x++) {
        if (this.cells[y] && this.cells[y][x]) {
          if (this.cells[y][x].isClue) {
            value = this.cells[y][x].data.text;
            this.cells[y][x].clickSwitch = [{text: value},{text: value, color: "grey", returnValue: 1},{text: value, image: "white_circle"}];
          } else {
            this.cells[y][x].clickSwitch = [{},{color: "grey", returnValue: 1},{image: "white_circle"}];
          }
        }
      }
    }
  }
}


hexaFencePuzzle.prototype.initEditController = function() {
  hexaPuzzle.prototype.initController.call(this);
  if (this.typeCode == "hexa_fence") {
    for (var y = 0; y < this.rows + this.cols - 1; y++) {
      for (var x = 0; x < 2*this.cols - 1; x++) {
        if (this.cells[y] && this.cells[y][x]) {
          this.cells[y][x].isClue = true;
          this.cells[y][x].clickSwitch = [
            {},
            {text: "0", returnValue: "0"},
            {text: "1", returnValue: "1"},
            {text: "2", returnValue: "2"},
            {text: "3", returnValue: "3"},
            {text: "4", returnValue: "4"},
            {text: "5", returnValue: "5"},
            {text: "6", returnValue: "6"}
          ];
        }
      }
    }
  }
  if (this.typeCode == "hexa_islands") {
    for (var y = 0; y < this.rows + this.cols - 1; y++) {
      for (var x = 0; x < 2*this.cols - 1; x++) {
        if (this.cells[y] && this.cells[y][x]) {
          this.cells[y][x].isClue = true;
          this.cells[y][x].clickSwitch = [{},{color: this.colorSchema.clueColor, returnValue: "1"}];
          for (var i=0; i<6; i++){
            if (this.edges[y][x][i].allCells.length==1) {
              this.edges[y][x][i].switchToData({color: this.colorSchema.gridColor});
            }
          }
        }
      }
    }
  }
  if (this.typeCode == "hexa_paint") {
    for (var y = 0; y < this.rows + this.cols - 1; y++) {
      for (var x = 0; x < 2*this.cols - 1; x++) {
        if (this.cells[y] && this.cells[y][x]) {
          this.cells[y][x].isClue = true;
          this.cells[y][x].clickSwitch = [
            {},
            {text: "0", returnValue: "0"},
            {text: "1", returnValue: "1"},
            {text: "2", returnValue: "2"},
            {text: "3", returnValue: "3"},
            {text: "4", returnValue: "4"},
            {text: "5", returnValue: "5"},
            {text: "6", returnValue: "6"},
            {text: "7", returnValue: "7"}
          ];
        }
      }
    }
  }
}

hexaFencePuzzle.prototype.decodeClue = function(value) {
  if (this.typeCode == "hexa_fence") {
    return {text: value};
  }
  if (this.typeCode == "hexa_paint") {
    return {text: value};
  }
  if (this.typeCode == "hexa_islands") {
    if (value=='1') {
      return {color: this.colorSchema.clueColor};
    }
    if (value=='0') {
      return {image: "cross"};
    }
  }
}

})
