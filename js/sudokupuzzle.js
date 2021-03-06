define(["square"], function() {

sudokuPuzzleType = function(puzzleData, controls, settings) {
  squarePuzzle.call(this, puzzleData, controls, settings);
}

Object.setPrototypeOf(sudokuPuzzleType.prototype, squarePuzzle.prototype);

sudokuPuzzleType.prototype.setTypeProperties = function(typeCode) {
  var self = this;
  var typeProperties = {}

  typeProperties["sudoku_classic"] = {
    cellController: cell => {if (!cell.isClue) setNumberChooser(cell, 1, self.rows)},
    cellEditController: cell => setNumberChooser(cell, 1, self.rows),
    cellMultiPencil: true,
  }

  typeProperties["sudoku_antiknight"] = {
    cellController: cell => {if (!cell.isClue) setNumberChooser(cell, 1, self.rows)},
    cellEditController: cell => setNumberChooser(cell, 1, self.rows),
    cellMultiPencil: true,
  }

  typeProperties["sudoku_notouch"] = {
    cellController: cell => {if (!cell.isClue) setNumberChooser(cell, 1, self.rows)},
    cellEditController: cell => setNumberChooser(cell, 1, self.rows),
    cellMultiPencil: true,
  }

  typeProperties["sudoku_square_number"] = {
    cellController: cell => {if (!cell.isClue) setNumberChooser(cell, 1, self.rows)},
    cellEditController: cell => setNumberChooser(cell, 1, self.rows),
    edgeEditController: edge => {
      if (edge.allCells.length > 1) {
        var clickSwitch = [{}, {image: "black_circle", returnValue: "black_circle"}];
        edge.isClue = true;
        edge.clickSwitch = clickSwitch.map(val => Object.assign({color: edge.data.color}, val));
      }
    },
    decodeClue: value => {
      if (value=="black_circle") {
        return {image: "black_circle"}
      } else {
        return {text: value}
      }
    },
    cellMultiPencil: true,
  }

  typeProperties["sudoku_consecutive"] = {
    cellController: cell => {if (!cell.isClue) setNumberChooser(cell, 1, self.rows)},
    cellEditController: cell => setNumberChooser(cell, 1, self.rows),
    edgeEditController: edge => {
      if (edge.allCells.length > 1) {
        var clickSwitch = [{}, {image: "white_dot", returnValue: "white_dot"}];
        edge.isClue = true;
        edge.clickSwitch = clickSwitch.map(val => Object.assign({color: edge.data.color}, val));
      }
    },
    decodeClue: value => {
      if (value=="white_dot") {
        return {image: "white_dot"}
      } else {
        return {text: value}
      }
    },
    cellMultiPencil: true,
  }

  typeProperties["sudoku_fortress"] = {
    cellController: cell => {
      if (!cell.data.text) {
        var chooserValues = [{color: cell.data.color}];
        for (var i=1; i<=self.rows; i++) {
          chooserValues.push({text: i.toString(), color: cell.data.color, returnValue: i.toString()});
        }
        cell.chooserValues = chooserValues;
      }
    },
    cellEditController: cell => {
      var chooserValues = [{}];
      for (var i=1; i<=self.rows; i++) {
        chooserValues.push({text: i.toString(), returnValue: i.toString()});
      }
      chooserValues.push({color: "grey", returnValue: "-"});
      for (var i=1; i<=self.rows; i++) {
        chooserValues.push({text: i.toString(), color: "grey", returnValue: "-" + i.toString()});
      }
      cell.chooserValues = chooserValues;
    },
    decodeClue: value => {
      if (value.startsWith("-")) {
        return {color: "grey", text: value.substring(1)}
      } else {
        return {text: value}
      }
    },
    cellMultiPencil: true,
    toChooserShow: value => {
      showValue = Object.assign({}, value);
      if (!self.editMode) {
        delete showValue.color;
      }
      return showValue;
    },
  }

  typeProperties["sudoku_even_odd"] = {
    cellController: cell => {
      if (!cell.data.text) {
        var chooserValues = [{color: cell.data.color}];
        for (var i=1; i<=self.rows; i++) {
          chooserValues.push({text: i.toString(), color: cell.data.color, returnValue: i.toString()});
        }
        cell.chooserValues = chooserValues;
      }
    },
    cellEditController: cell => {
      var chooserValues = [{}];
      for (var i=1; i<=self.rows; i++) {
        if (i%2==0) {
          chooserValues.push({text: i.toString(), color: "grey", returnValue: "-" + i.toString()});
        } else {
          chooserValues.push({text: i.toString(), returnValue: i.toString()});
        }
      }
      chooserValues.push({color: "grey", returnValue: "-"});
      cell.chooserValues = chooserValues;
    },
    decodeClue: value => {
      if (value =="-") {
        return {color: "grey"}
      } else if (value.startsWith("-")) {
        return {color: "grey", text: value.substring(1)}
      } else {
        return {text: value}
      }
    },
    cellMultiPencil: true,
    toChooserShow: value => {
      showValue = Object.assign({}, value);
      if (!self.editMode) {
        delete showValue.color;
      }
      return showValue;
    },
  }

  typeProperties["sudoku_odd"] = {
    cellController: cell => {
      if (!cell.data.text) {
        var chooserValues = [{color: cell.data.color}];
        for (var i=1; i<=self.rows; i++) {
          chooserValues.push({text: i.toString(), color: cell.data.color, returnValue: i.toString()});
        }
        cell.chooserValues = chooserValues;
      }
    },
    cellEditController: cell => {
      var chooserValues = [{}];
      for (var i=1; i<=self.rows; i++) {
        chooserValues.push({text: i.toString(), returnValue: i.toString()});
      }
      chooserValues.push({color: "grey", returnValue: "-"});
      cell.chooserValues = chooserValues;
    },
    decodeClue: value => {
      if (value =="-") {
        return {color: "grey"}
      } else if (value.startsWith("-")) {
        return {color: "grey", text: value.substring(1)}
      } else {
        return {text: value}
      }
    },
    cellMultiPencil: true,
    toChooserShow: value => {
      showValue = Object.assign({}, value);
      if (!self.editMode) {
        delete showValue.color;
      }
      return showValue;
    },
  }

  if (typeCode in typeProperties) {
    this.typeProperties = Object.assign({}, this.typeProperties,  typeProperties[typeCode]);
  }
}

sudokuPuzzleType.prototype.createBoard = function() {
  squarePuzzle.prototype.createBoard.call(this);
  var dx = this.cols==8?4:3;
  var dy = this.rows==9?3:2;
  for (var x=dx-1;x<this.cols;x+=dx) {
    for (var y=0;y<this.rows;y++) {
      this.edges[y][x][1].isFinal = true;
      this.edges[y][x][1].data = {text: null, image: null, color: this.colorSchema.gridColor, textColor: null};
    }
  }
  for (var x=0;x<this.cols;x++) {
    for (var y=dy-1;y<this.rows;y+=dy) {
      this.edges[y][x][2].isFinal = true;
      this.edges[y][x][2].data = {text: null, image: null, color: this.colorSchema.gridColor, textColor: null};
    }
  }
}

function setNumberChooser(cell, start, end) {
  var chooserValues = [{}];
  for (var i=start; i<=end; i++) {
    chooserValues.push({text: i.toString(), returnValue: i.toString()});
  }
  cell.chooserValues = chooserValues;
}

})
