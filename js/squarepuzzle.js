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
  for (var y = 0; y < this.rows; y++) {
    for (var x = 0; x < this.cols; x++) {
      this.cells[y][x].clickSwitch = [{}, {text: "A"},{image: "cross"},{color: "grey"}];
      this.cells[y][x].pencilClickSwitch = [{}, {text: "A"},{image: "cross"},{color: "grey"}];
      for (var i=0; i<4; i++){
        this.edges[y][x][i].clickSwitch = [{},{color: this.colorSchema.lineColor},{image: "cross"},{text: "B"}];
        this.edges[y][x][i].pencilClickSwitch = [{},{color: this.colorSchema.lineColor},{image: "cross"},{text: "B"}];
        this.nodes[y][x][i].clickSwitch = [{},{color: this.colorSchema.lineColor},{image: "cross"},{text: "B"}];
        this.nodes[y][x][i].pencilClickSwitch = [{},{color: this.colorSchema.lineColor},{image: "cross"},{text: "B"}];
        this.edges[y][x][i].dragSwitch = [{},{color: this.colorSchema.lineColor}];
        this.edges[y][x][i].pencilDragSwitch = this.edges[y][x][i].dragSwitch;
        this.nodes[y][x][i].dragProcessor = true;
      }
    }
  }
}


squarePuzzleType.prototype.initEditController = function() {
  squarePuzzle.prototype.initController.call(this);
}

squarePuzzleType.prototype.decodeClue = function(value) {
}

})
