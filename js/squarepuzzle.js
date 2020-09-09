define(["square"], function() {

squarePuzzleType = function(puzzleData, controls, settings) {
  squarePuzzle.call(this, puzzleData, controls, settings);
}

Object.setPrototypeOf(squarePuzzleType.prototype, squarePuzzle.prototype);


squarePuzzleType.prototype.createBoard = function() {
  squarePuzzle.prototype.createBoard.call(this);
  for (var y = 0; y < this.rows; y++) {
    for (var x = 0; x < this.cols; x++) {
      for (var i=0; i<4; i++){
        if (this.edges[y][x][i].allCells.length==1) {
          this.edges[y][x][i].isFinal = true;
          this.edges[y][x][i].data = {text: null, image: null, color: this.colorSchema.gridColor, textColor: null};
        }
      }
    }
  }
}

squarePuzzleType.prototype.initController = function() {
  squarePuzzle.prototype.initController.call(this);
  if (this.typeCode == "hitori") {
    for (var y = 0; y < this.rows; y++) {
      for (var x = 0; x < this.cols; x++) {
        if (this.cells[y][x].data.text) {
          value = this.cells[y][x].data.text;
          this.cells[y][x].clickSwitch = [
            {text: value},
            {text: value, color: "303030", returnValue: "1"},
            {text: value, image: "white_circle"}
          ];
        } else {
          this.cells[y][x].clickSwitch = [{},{color: "303030", returnValue: "1"},{image: "white_circle"}];
        }
        this.cells[y][x].pencilClickSwitch = [{},{color: "303030"},{image: "white_circle"}];
      }
    }
  }
}


squarePuzzleType.prototype.initEditController = function() {
  squarePuzzle.prototype.initController.call(this);
  if (this.typeCode == "hitori") {
    for (var y = 0; y < this.rows; y++) {
      for (var x = 0; x < this.cols; x++) {
        this.cells[y][x].isClue = true;
        this.cells[y][x].clickSwitch = [{}];
        for (var i=0;i<16;i++) {
          this.cells[y][x].clickSwitch.push({text: i.toString(), returnValue: i.toString()})
        }
      }
    }
  }
}

squarePuzzleType.prototype.decodeClue = function(value) {
  if (this.typeCode == "hitori") {
    return {text: value};
  }
}

})
