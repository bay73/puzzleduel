define(["hexa"], function() {

hexaFencePuzzle = function(puzzleData, controls, settings) {
  hexaPuzzle.call(this, puzzleData, controls, settings);
}

Object.setPrototypeOf(hexaFencePuzzle.prototype, hexaPuzzle.prototype);


hexaFencePuzzle.prototype.initController = function() {
  hexaPuzzle.prototype.initController.call(this);
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
          this.edges[y][x][i].clickSwitch = [{},{color: this.colorSchema.defaultColor, returnValue: 1},{image: "cross"}];
          this.edges[y][x][i].pencilClickSwitch = this.edges[y][x][i].clickSwitch;
          this.edges[y][x][i].dragSwitch = [{},{color: this.colorSchema.defaultColor}];
          this.edges[y][x][i].pencilDragSwitch = this.edges[y][x][i].dragSwitch;
          this.nodes[y][x][i].dragProcessor = true;
        }
      }
    }
  }
}


})
