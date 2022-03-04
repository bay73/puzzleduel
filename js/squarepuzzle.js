define(["square","controller_helper"], function() {

squarePuzzleType = function(puzzleData, controls, settings) {
  squarePuzzle.call(this, puzzleData, controls, settings);
}

Object.setPrototypeOf(squarePuzzleType.prototype, squarePuzzle.prototype);

squarePuzzleType.prototype.setTypeProperties = function(typeCode) {
  var self = this;

  if (typeCode =="hitori") {
    this.typeProperties = decribePuzzleType()
      .add(controller().forAuthor().cell().chooser()
        .addNumbers(0,16))
      .add(controller().forSolver().cell().clickSwitch()
        .addItem(StdItem.BLACK.submitAs("1"))
        .addItem(StdItem.WHITE_CIRCLE.doNotSubmit()))
      .build(this);

  } else if (typeCode=="snake_dutch") {
    this.typeProperties = decribePuzzleType()
      .add(controller().forAuthor().cell().clickSwitch()
        .addItem(StdItem.WHITE_CIRCLE)
        .addItem(StdItem.BLACK_CIRCLE)
        .addItem(StdItem.CROSS))
      .add(controller().forSolver().cell().noClue().clickSwitch()
        .addItem(StdItem.GREY.submitAs("1"))
        .addItem(StdItem.CROSS.doNotSubmit()))
      .add(controller().forSolver().cell().clue(StdItem.WHITE_CIRCLE, StdItem.BLACK_CIRCLE).clickSwitch()
        .addItem(StdItem.GREY.submitAs("1")))
      .build(this);

  } else if (typeCode=="starbattle") {
    this.typeProperties = decribePuzzleType()
      .add(controller().forAuthor().cell().clickSwitch()
        .addItem(StdItem.CROSS))
      .add(controller().forAuthor().edge().toAreas().clickSwitch().withDrag()
        .addItem(StdItem.BLACK.asAreaBorder()))
      .add(controller().forSolver().cell().noClue().clickSwitch()
        .addItem(StdItem.STAR)
        .addItem(StdItem.CROSS.doNotSubmit()))
     .build(this);

  } else if (typeCode=="akari") {
    this.typeProperties = decribePuzzleType()
      .add(controller().forAuthor().cell().clickSwitch()
        .addItem(StdItem.BLACK)
        .addNumbers(0,4,StdColor.BLACK))
      .add(controller().forSolver().cell().noClue().clickSwitch()
        .addItem(StdItem.BULB)
        .addItem(StdItem.CROSS.doNotSubmit()))
      .add(controller().forSolver().cell().clue().clickSwitch()
        .addItem(StdItem.WHITE_CROSS.doNotSubmit()))
      .add(controller().forSolver().connector().drag()
        .addItem(StdItem.LINE.doNotSubmit()))
      .addUpgradeClue(clue=>{if (clue.includes("_shade")){return clue.substring(0,1);} else {return clue;}})
      .build(this);

  } else if (typeCode=="point_a_star") {
    var maxValue = (Math.max(this.rows, this.cols)+1)/2;
    this.typeProperties = decribePuzzleType()
      .add(controller().forAuthor().cell().inner().chooser()
        .addItem(StdItem.ARROW_U)
        .addItem(StdItem.ARROW_UR)
        .addItem(StdItem.ARROW_R)
        .addItem(StdItem.ARROW_DR)
        .addItem(StdItem.ARROW_D)
        .addItem(StdItem.ARROW_DL)
        .addItem(StdItem.ARROW_L)
        .addItem(StdItem.ARROW_UL)
        .addItem(StdItem.CROSS))
      .add(controller().forAuthor().cell().outer().chooser()
        .addNumbers(0,maxValue))
      .add(controller().forSolver().cell().inner().noClue().clickSwitch()
        .addItem(StdItem.STAR)
        .addItem(StdItem.CROSS.doNotSubmit()))
      .add(controller().forSolver().cell().inner().clue().clickSwitch()
        .addItem(StdItem.GREY.doNotSubmit()))
      .add(controller().forSolver().cell().outer().clue().clickSwitch()
        .addItem(StdItem.WHITE_CIRCLE.doNotSubmit()))
      .addUpgradeClue(clue=>clue=="white"?null:clue)
      .build(this);

  } else if (typeCode=="clouds") {
    var maxValue = Math.max(this.rows, this.cols);
    this.typeProperties = decribePuzzleType()
      .add(controller().forAuthor().cell().inner().clickSwitch()
        .addItem(StdItem.CROSS)
        .addItem(StdItem.BLACK))
      .add(controller().forAuthor().cell().outer().chooser()
        .addNumbers(0,maxValue))
      .add(controller().forSolver().cell().inner().noClue().clickSwitch()
        .addItem(StdItem.BLACK)
        .addItem(StdItem.CROSS.doNotSubmit()))
      .add(controller().forSolver().cell().outer().clue().clickSwitch()
        .addItem(StdItem.WHITE_CIRCLE.doNotSubmit()))
      .addUpgradeClue(clue=>clue=="white"?null:clue)
      .build(this);

  } else {

  var typeProperties = {}

  typeProperties["starbattle_smallregions"] = {
    needNodes: true,
    cellController: cell => {
      setClickSwitch(cell, false, [{},{image: "star", returnValue: "star"},{image: "cross"}]);
    },
    cellEditController: cell => {cell.isClue = true; cell.clickSwitch = [{},{image: "cross", returnValue: "cross"}];},
    edgeEditController: edge => {
       if (edge.allCells.length > 1) {
         edge.isClue = true;
         edge.clickSwitch = [{},{color: self.colorSchema.gridColor, returnValue: "1"}];
         edge.dragSwitch = [{},{color: self.colorSchema.gridColor, returnValue: "1"}];
       }
    },
    nodeEditController: node => node.dragProcessor = true,
    decodeClue: value => {return {image: value} },
    collectAreas: this.editMode,
  }

  typeProperties["domino_castle_sum"] = {
    needNodes: true,
    needBottom: true,
    needRight: true,
    cellController: cell => {
      if(!cell.outerCell && !cell.isClue) {
        cell.chooserValues = [{}];
        for (var i = 0; i < self.this.dimensionExtra.length; i++) {
         cell.chooserValues.push({text: self.this.dimensionExtra[i], returnValue: self.this.dimensionExtra[i]});
        }
      }
    },
    cellEditController: cell => {
      if(cell.outerCell) {
        cell.isClue = true; setNumberChooser(cell, 1, 99);
      } else {
        cell.isClue = true; cell.clickSwitch = [{},{color: self.colorSchema.gridColor, returnValue: "black"}];
      }
    },
    edgeEditController: edge => {
       if (edge.allCells.length > 1) {
         edge.isClue = true;
         edge.clickSwitch = [{},{color: self.colorSchema.gridColor, returnValue: "1"}];
         edge.dragSwitch = [{},{color: self.colorSchema.gridColor, returnValue: "1"}];
       }
    },
    nodeEditController: node => node.dragProcessor = true,
    decodeClue: value => {
      if (value=="black") {
        return {color: self.colorSchema.gridColor}
      } else {
        return {text: value}
      }
    },
    cellMultiPencil: true,
    collectAreas: this.editMode,
    usePlus10: this.editMode?10:0,
  }

  typeProperties["lits"] = {
    needNodes: true,
    cellController: cell => {
      setClickSwitch(cell, false, [{},{color: "#606060", returnValue: "1"},{image: "cross"}], [{},{color: "#a0a0a0"},{image: "cross"}]);
    },
    cellEditController: cell => {cell.isClue = true; cell.clickSwitch = [{},{image: "cross", returnValue: "cross"}];},
    edgeEditController: edge => {
       if (edge.allCells.length > 1) {
         edge.isClue = true;
         edge.clickSwitch = [{},{color: self.colorSchema.gridColor, returnValue: "1"}];
         edge.dragSwitch = [{},{color: self.colorSchema.gridColor, returnValue: "1"}];
       }
    },
    nodeEditController: node => node.dragProcessor = true,
    decodeClue: value => {return {image: value} },
    collectAreas: this.editMode,
  }

  typeProperties["heyawake"] = {
    needNodes: true,
    cellController: cell => {
      if (!cell.isClue || cell.data.image != "cross") {
        setClickSwitch(cell, true, [{},{color: "#606060", returnValue: "1"},{image: "cross"}], [{},{color: "#a0a0a0"},{image: "cross"}]);
      }
    },
    cellEditController: cell => {
      cell.isClue = true;
      var chooserValues = [{}, {image: "cross", returnValue: "cross"}];
      for (var i=0; i<=10; i++) {
       chooserValues.push({text: i.toString(), returnValue: i.toString()});
      }
      cell.chooserValues = chooserValues;
    },
    edgeEditController: edge => {
       if (edge.allCells.length > 1) {
         edge.isClue = true;
         edge.clickSwitch = [{},{color: self.colorSchema.gridColor, returnValue: "1"}];
         edge.dragSwitch = [{},{color: self.colorSchema.gridColor, returnValue: "1"}];
       }
    },
    nodeEditController: node => node.dragProcessor = true,
    collectAreas: this.editMode,
    decodeClue: value => {return value=="cross"?{image: "cross"}:{text: value};},
  }

  typeProperties["queens"] = {
    cellController: cell => {
      if (!cell.isClue) {
        setClickSwitch(cell, true, [{},{image: "queen", returnValue: "queen"},{image: "cross"}]);
      }
    },
    cellEditController: cell => {
      cell.isClue = true;
      var chooserValues = [{}, {image: "cross", returnValue: "cross"}];
      for (var i=0; i<=8; i++) {
       chooserValues.push({text: i.toString(), returnValue: i.toString()});
      }
      cell.chooserValues = chooserValues;
    },
    decodeClue: value => {return value=="cross"?{image: "cross"}:{text: value};},
  }

  typeProperties["minesweeper_classic"] = {
    cellController: cell => {
      if (!cell.isClue) {
        setClickSwitch(cell, true, [{},{image: "mine", returnValue: "mine"},{image: "cross"}]);
      }
    },
    cellEditController: cell => {
      cell.isClue = true;
      var chooserValues = [{}, {image: "cross", returnValue: "cross"}];
      for (var i=0; i<=8; i++) {
       chooserValues.push({text: i.toString(), returnValue: i.toString()});
      }
      cell.chooserValues = chooserValues;
    },
    decodeClue: value => {return value=="cross"?{image: "cross"}:{text: value};},
  }

  typeProperties["yin_yang_classic"] = {
    cellController: cell => {
      if (!cell.isClue) {
        setClickSwitch(cell, true, [{},{image: "black_circle", returnValue: "black_circle"},{image: "white_circle", returnValue: "white_circle"}]);
      }
    },
    cellEditController: cell => {
      cell.isClue = true;
      cell.clickSwitch = [{},{image: "black_circle", returnValue: "black_circle"},{image: "white_circle", returnValue: "white_circle"}];
    },
    decodeClue: value => {return {image: value};},
  }

  typeProperties["snake_belarusian"] = {
    needNodes: true,
    cellController: cell => {
      setClickSwitch(cell, false, [{},{color: "#606060", returnValue: "1"},{image: "cross"}], [{},{image: "white_circle"},{image: "cross"}]);
      if (cell.isClue && cell.data.image != "cross") {
        setClueClickSwitch(cell, [{},{color: "#605030", returnValue: "1"},{image: "cross"}], [{},{image: "white_circle"},{image: "cross"}]);
      }
    },
    cellEditController: cell => {cell.isClue = true; cell.clickSwitch = [{},{color: "tan", returnValue: "1"}];},
    edgeEditController: edge => {
       if (edge.allCells.length > 1) {
         edge.isClue = true;
         edge.clickSwitch = [{},{color: self.colorSchema.gridColor, returnValue: "1"}];
         edge.dragSwitch        = [{},{color: self.colorSchema.gridColor, returnValue: "1"}];
       }
    },
    nodeEditController: node => node.dragProcessor = true,
    decodeClue: value => {return value=="1"?{color: "tan"}:{} },
    collectAreas: this.editMode,
  }

  typeProperties["sudoku_irregular"] = {
    needNodes: true,
    cellController: cell => {if (!cell.isClue) {setNumberChooser(cell, 1, self.rows);}},
    cellEditController: cell => {cell.isClue = true; setNumberChooser(cell, 1, self.rows);},
    edgeEditController: edge => {
       if (edge.allCells.length > 1) {
         edge.isClue = true;
         edge.clickSwitch = [{},{color: self.colorSchema.gridColor, returnValue: "1"}];
         edge.dragSwitch = [{},{color: self.colorSchema.gridColor, returnValue: "1"}];
       }
    },
    nodeEditController: node => node.dragProcessor = true,
    collectAreas: this.editMode,
    cellMultiPencil: true,
  }

  typeProperties["sudoku_double"] = {
    needNodes: true,
    cellController: cell => {if (!cell.isClue) {setNumberChooser(cell, 1, self.rows/2);}},
    cellEditController: cell => {cell.isClue = true; setNumberChooser(cell, 1, self.rows/2);},
    edgeEditController: edge => {
       if (edge.allCells.length > 1) {
         edge.isClue = true;
         edge.clickSwitch = [{},{color: self.colorSchema.gridColor, returnValue: "1"}];
         edge.dragSwitch = [{},{color: self.colorSchema.gridColor, returnValue: "1"}];
       }
    },
    nodeEditController: node => node.dragProcessor = true,
    collectAreas: this.editMode,
    cellMultiPencil: true,
  }

  typeProperties["suguru"] = {
    needNodes: true,
    cellController: cell => {if (!cell.isClue) {setNumberChooser(cell, 1, 6);}},
    cellEditController: cell => {cell.isClue = true; setNumberChooser(cell, 1, 6);},
    edgeEditController: edge => {
       if (edge.allCells.length > 1) {
         edge.isClue = true;
         edge.clickSwitch = [{},{color: self.colorSchema.gridColor, returnValue: "1"}];
         edge.dragSwitch = [{},{color: self.colorSchema.gridColor, returnValue: "1"}];
       }
    },
    nodeEditController: node => node.dragProcessor = true,
    collectAreas: this.editMode,
    cellMultiPencil: true,
  }

  typeProperties["norinori"] = {
    needNodes: true,
    cellController: cell => {
      if (!cell.isClue || cell.data.image != "cross") {
        setClickSwitch(cell, true, [{},{color: "#606060", returnValue: "1"},{image: "cross"}], [{},{color: "#a0a0a0"},{image: "cross"}]);
      }
    },
    edgeEditController: edge => {
       if (edge.allCells.length > 1) {
         edge.isClue = true;
         edge.clickSwitch = [{},{color: self.colorSchema.gridColor, returnValue: "1"}];
         edge.dragSwitch = [{},{color: self.colorSchema.gridColor, returnValue: "1"}];
       }
    },
    nodeEditController: node => node.dragProcessor = true,
    collectAreas: this.editMode
  }

  typeProperties["chaos"] = {
    needNodes: false,
    cellController: cell => {if (!cell.isClue) {setNumberChooser(cell, 1, 4);}},
    cellEditController: cell => {cell.isClue = true; setNumberChooser(cell, 1, 4);},
    cellMultiPencil: true,
  }

  typeProperties["fuzuli"] = {
    needNodes: false,
    cellController: cell => {
      if (!cell.isClue) {
        var chooserValues = [{}];
        for (var i=1; i<=self.rows-2; i++) {
         chooserValues.push({text: i.toString(), returnValue: i.toString()});
        }
        chooserValues.push({image: "cross"});
        chooserValues.push({image: "white_circle"});
        cell.chooserValues = chooserValues;
      }
    },
    cellEditController: cell => {
      cell.isClue = true;
      var chooserValues = [{}];
      for (var i=1; i<=self.rows-2; i++) {
       chooserValues.push({text: i.toString(), returnValue: i.toString()});
      }
      chooserValues.push({image: "cross", returnValue: "cross"});
      cell.chooserValues = chooserValues;
    },
    cellMultiPencil: true,
    decodeClue: value => {return value=="cross"?{image: "cross"}:{text: value};},
  }

  typeProperties["doubleblock"] = {
    needNodes: false,
    needBottom: true,
    needRight: true,
    cellController: cell => {
      if (!cell.isClue && !cell.outerCell) {
        var chooserValues = [{}];
        for (var i=1; i<=self.rows-2; i++) {
         chooserValues.push({text: i.toString(), returnValue: i.toString()});
        }
        chooserValues.push({image: "cross"});
        chooserValues.push({image: "white_circle"});
        cell.chooserValues = chooserValues;
      } else if (cell.outerCell) {
        setClueClickSwitch(cell, [{},{image: "white_circle"}]);
      }
    },
    cellEditController: cell => {
      cell.isClue = true;
      if (cell.outerCell) {
        setNumberChooser(cell, 0, (self.rows-2)*(self.rows-1)/2);
      } else {
        var chooserValues = [{}];
        for (var i=1; i<=self.rows-2; i++) {
         chooserValues.push({text: i.toString(), returnValue: i.toString()});
        }
        chooserValues.push({image: "cross", returnValue: "cross"});
        cell.chooserValues = chooserValues;
      }
    },
    usePlus10: this.editMode?12:0,
    cellMultiPencil: true,
    decodeClue: value => {
      if (value=="cross") {
        return {image: "cross"};
      } else if (value=="white") {
        return {};
      } else {
        return {text: value};
      }
    },
  }

  typeProperties["ripple_effect"] = {
    needNodes: true,
    cellController: cell => {if (!cell.isClue) {setNumberChooser(cell, 1, 6);}},
    cellEditController: cell => {cell.isClue = true; setNumberChooser(cell, 1, 6);},
    edgeEditController: edge => {
       if (edge.allCells.length > 1) {
         edge.isClue = true;
         edge.clickSwitch = [{},{color: self.colorSchema.gridColor, returnValue: "1"}];
         edge.dragSwitch = [{},{color: self.colorSchema.gridColor, returnValue: "1"}];
       }
    },
    nodeEditController: node => node.dragProcessor = true,
    collectAreas: this.editMode,
    cellMultiPencil: true,
  }

  typeProperties["fence"] = {
    thickEdges: true,
    outerEdges: false,
    needNodes: true,
    cellController: cell => setClickSwitch(cell, true, [{},{image: "cross"},{image: "white_circle"}]),
    edgeController: edge => {
      setClickSwitch(edge, false, [{},{color: self.colorSchema.lineColor, returnValue: 1},{image: "cross"}]);
      setDragSwitch(edge, false, [{},{color: self.colorSchema.lineColor}]);
    },
    nodeController: node => node.dragProcessor = true,
    cellEditController: cell => {cell.isClue = true; setNumberChooser(cell, 0, 4);},
  }

  typeProperties["lighthouses"] = {
    cellController: cell => {
      setClickSwitch(cell, false, [{},{image: "boat", returnValue: "boat"},{image: "cross"}]);
    },
    cellEditController: cell => {
      cell.isClue = true;
      var chooserValues = [{},{image: "cross", returnValue: "cross"}];
      for (var i=0; i<=10; i++) {
       chooserValues.push({text: i.toString(), returnValue: i.toString()});
      }
      cell.chooserValues = chooserValues;
    },
    decodeClue: value => {return value=="cross"?{image: "cross"}:{text: value};},
  }

  typeProperties["railroad"] = {
    needConnectors: true,
    cellController: cell => {
      cell.dragProcessor = true;
    },
    connectorController: connector => {
      setDragSwitch(connector, false, [{},{color: self.colorSchema.lineColor, returnValue: 1}]);
    },
    cellEditController: cell => {
      cell.isClue = true;
      var chooserValues = [{},{image: "big_plus", returnValue: "+"}];
      for (var i=1; i<=15; i++) {
       chooserValues.push({text: i.toString(), returnValue: i.toString()});
      }
      cell.chooserValues = chooserValues;
    },
    decodeClue: value => {return value=="+"?{image: "big_plus"}:{text: value};},
  }

  typeProperties["loop_minesweeper"] = {
    needConnectors: true,
    cellController: cell => {
      setClickSwitch(cell, false, [{},{image: "cross"},{image: "white_circle"}]);
      cell.dragProcessor = true;
    },
    connectorController: connector => {
      setDragSwitch(connector, false, [{},{color: self.colorSchema.lineColor, returnValue: 1}]);
    },
    cellEditController: cell => {cell.isClue = true; setNumberChooser(cell, 0, 8);},
  }

  typeProperties["loop_bounds"] = {
    needConnectors: true,
    cellController: cell => {
      cell.dragProcessor = true;
    },
    connectorController: connector => {
      setDragSwitch(connector, false, [{},{color: self.colorSchema.lineColor, returnValue: 1}]);
    },
    cellEditController: cell => {cell.isClue = true; setNumberChooser(cell, 0, 99);},
    usePlus10: this.editMode?10:0,
  }

  typeProperties["every_second_turn"] = {
    needConnectors: true,
    cellController: cell => {
      cell.dragProcessor = true;
    },
    connectorController: connector => {
      setDragSwitch(connector, false, [{},{color: self.colorSchema.lineColor, returnValue: 1}]);
    },
    cellEditController: cell => {cell.isClue = true; cell.clickSwitch = [{},{image: "white_circle", returnValue: "white_circle"}];},
    decodeClue: value => {return {image: value} },
  }

  typeProperties["every_second_straight"] = {
    needConnectors: true,
    cellController: cell => {
      cell.dragProcessor = true;
    },
    connectorController: connector => {
      setDragSwitch(connector, false, [{},{color: self.colorSchema.lineColor, returnValue: 1}]);
    },
    cellEditController: cell => {cell.isClue = true; cell.clickSwitch = [{},{image: "white_circle", returnValue: "white_circle"}];},
    decodeClue: value => {return {image: value} },
  }

  typeProperties["passage"] = {
    cellController: cell => {
      setClickSwitch(cell, false, [{},{color: self.colorSchema.greyColor, returnValue: "1"},{image: "cross"}], [{},{color: "#a0a0a0"},{image: "cross"}]);
    },
    cellEditController: cell => {
      cell.isClue = true;
      var chooserValues = [{},{color: self.colorSchema.clueColor, returnValue: "black"},{image: "cross", returnValue: "cross"}];
      for (var i=0; i<=10; i++) {
       chooserValues.push({color: self.colorSchema.greyColor, text: i.toString(), returnValue: i.toString()});
      }
      cell.chooserValues = chooserValues;
    },
    decodeClue: value => {
      if (value=="cross") return {image: "cross"};
      else if (value=="black") return {color: self.colorSchema.clueColor, returnValue: "1"}
      else return {color: self.colorSchema.greyColor, text: value};
    },
  }

  typeProperties["simple_loop"] = {
    needNodes: false,
    needConnectors: true,
    cellController: cell => {
      cell.dragProcessor = true;
    },
    connectorController: connector => {
      setDragSwitch(connector, false, [{},{color: self.colorSchema.textColor, returnValue: 1}]);
    },
    cellEditController: cell => {cell.isClue = true; cell.clickSwitch = [{},{color: self.colorSchema.textColor, returnValue: "black"}];},
    decodeClue: value => {
      if (value=="black") {
        return {color: self.colorSchema.textColor}
      } else {
        return {text: value}
      }
    },
  }

  typeProperties["maxi_loop"] = {
    needNodes: true,
    needConnectors: true,
    cellController: cell => {
      cell.dragProcessor = true;
    },
    connectorController: connector => {
      setDragSwitch(connector, false, [{},{color: self.colorSchema.greyColor, returnValue: 1}]);
    },
    cellEditController: cell => {cell.isClue = true; setNumberChooser(cell, 1, 99);},
    edgeEditController: edge => {
       if (edge.allCells.length > 1) {
         edge.isClue = true;
         edge.clickSwitch = [{},{color: self.colorSchema.gridColor, returnValue: "1"}];
         edge.dragSwitch = [{},{color: self.colorSchema.gridColor, returnValue: "1"}];
       }
    },
    nodeEditController: node => node.dragProcessor = true,
    collectAreas: this.editMode,
    usePlus10: this.editMode?10:0,
  }

  typeProperties["country_road"] = {
    needNodes: true,
    needConnectors: true,
    cellController: cell => {
      setClickSwitch(cell, true, [{},{image: "cross"}]);
      cell.dragProcessor = true;
    },
    connectorController: connector => {
      setDragSwitch(connector, false, [{},{color: self.colorSchema.greyColor, returnValue: 1}]);
    },
    cellEditController: cell => {cell.isClue = true; setNumberChooser(cell, 1, 99);},
    edgeEditController: edge => {
       if (edge.allCells.length > 1) {
         edge.isClue = true;
         edge.clickSwitch = [{},{color: self.colorSchema.gridColor, returnValue: "1"}];
         edge.dragSwitch = [{},{color: self.colorSchema.gridColor, returnValue: "1"}];
       }
    },
    nodeEditController: node => node.dragProcessor = true,
    collectAreas: this.editMode,
    usePlus10: this.editMode?10:0,
  }

  typeProperties["double_back"] = {
    needNodes: true,
    needConnectors: true,
    cellController: cell => {
      cell.dragProcessor = true;
    },
    connectorController: connector => {
      setDragSwitch(connector, false, [{},{color: self.colorSchema.greyColor, returnValue: 1}]);
    },
    edgeEditController: edge => {
       if (edge.allCells.length > 1) {
         edge.isClue = true;
         edge.clickSwitch = [{},{color: self.colorSchema.gridColor, returnValue: "1"}];
         edge.dragSwitch = [{},{color: self.colorSchema.gridColor, returnValue: "1"}];
       }
    },
    nodeEditController: node => node.dragProcessor = true,
    collectAreas: this.editMode,
  }

  typeProperties["four_winds"] = {
    needNodes: false,
    needConnectors: true,
    cellController: cell => {
      cell.dragProcessor = true;
      if (cell.isClue) {
        setClickSwitch(cell, true, [{},{image: "white_circle"}]);
      } else {
        setClickSwitch(cell, false, [{},{image: "white_dot"}]);
      }
    },
    connectorController: connector => {
      setDragSwitch(connector, false, [{},{color: self.colorSchema.greyColor, returnValue: 1}]);
    },
    cellEditController: cell => {cell.isClue = true; setNumberChooser(cell, 1, 99);},
    usePlus10: this.editMode?10:0,
  }

  typeProperties["snake_scope"] = {
    needNodes: true,
    cellController: cell => {
      setClickSwitch(cell, false, [{},{color: self.colorSchema.greyColor, returnValue: "1"},{image: "cross"}], [{},{color: "#a0a0a0"},{image: "cross"}]);
      if (cell.isClue && cell.data.image != "cross") {
        setClueClickSwitch(cell, [{},{color: self.colorSchema.greyColor, returnValue: "1"}], [{},{color: "#a0a0a0"}]);
      }
    },
    cellEditController: cell => {cell.isClue = true; cell.clickSwitch = [{},{image: "cross", returnValue: "cross"}];},
    nodeEditController: node => {
      node.isClue = true;
      var chooserValues = [{}];
      for (var i=0; i<=3; i++) {
        chooserValues.push({color: self.colorSchema.gridColor, text: i.toString(), textColor: "#fff", returnValue: i.toString()});
      }
      node.chooserValues = chooserValues;
    },
    decodeClue: value => {
      if (value=="cross") {
        return {image: "cross"};
      } else {
        return {color: self.colorSchema.gridColor, text: value, textColor: "#fff"};
      }
    },
  }

  typeProperties["product_latin_square"] = {
    needNodes: true,
    cellController: cell => setNumberChooser(cell, 1, self.rows),
    nodeEditController: node => {
      node.isClue = true;
      var chooserValues = [{}];
      for (var i=1; i<=99; i++) {
        chooserValues.push({color: self.colorSchema.gridColor, text: i.toString(), textColor: "#fff", returnValue: i.toString()});
      }
      node.chooserValues = chooserValues;
    },
    decodeClue: value => {
      return {color: self.colorSchema.gridColor, text: value, textColor: "#fff"};
    },
    usePlus10: this.editMode?10:0,
    cellMultiPencil: true,
  }

  typeProperties["paint_battenberg"] = {
    needNodes: true,
    needBottom: true,
    needRight: true,
    cellController: cell => {
      setClickSwitch(cell, false, [{},{color: self.colorSchema.greyColor, returnValue: "black"},{image: "cross"}], [{},{color: "#a0a0a0"},{image: "cross"}]);
    },
    cellEditController: cell => {
      if (cell.outerCell) {
        cell.isClue = true;
        var chooserValues = [{}];
        for (var i=0; i<=Math.max(self.rows, self.cols); i++) {
         chooserValues.push({text: i.toString(), returnValue: i.toString()});
        }
        cell.chooserValues = chooserValues;
      } else {
        cell.isClue = true; cell.clickSwitch = [{},{image: "cross", returnValue: "cross"}];
      }
    },
    nodeEditController: node => {
      node.isClue = true;
      node.clickSwitch = [{}, {image: "battenberg_small", returnValue: "battenberg"}];
    },
    decodeClue: value => {
      if (value=="cross") {
        return {image: "cross"};
      } else if (value=="white") {
        return {};
      } else if (value=="battenberg") {
        return {image: "battenberg_small"};
      } else {
        return {text: value};
      }
    },
  }

  typeProperties["aquarium"] = {
    needNodes: true,
    needBottom: true,
    needRight: true,
    cellController: cell => {
      if (cell.outerCell) {
        setClueClickSwitch(cell, [{},{image: "white_circle"}]);
      } else {
        setClickSwitch(cell, false, [{},{color: self.colorSchema.greyColor, returnValue: "1"},{image: "cross"}], [{},{color: "#a0a0a0"},{image: "cross"}]);
      }
    },
    edgeEditController: edge => {
       if (edge.allCells.length > 1) {
         edge.isClue = true;
         edge.clickSwitch = [{},{color: self.colorSchema.gridColor, returnValue: "1"}];
         edge.dragSwitch = [{},{color: self.colorSchema.gridColor, returnValue: "1"}];
       }
    },
    nodeEditController: node => node.dragProcessor = true,
    cellEditController: cell => {
      if (cell.outerCell) {
        cell.isClue = true;
        var chooserValues = [{}];
        for (var i=0; i<=Math.max(self.rows, self.cols); i++) {
         chooserValues.push({text: i.toString(), returnValue: i.toString()});
        }
        cell.chooserValues = chooserValues;
      } else {
        cell.clickSwitch = [{},{image: "cross", returnValue: "cross"}];
      }
    },
    decodeClue: value => {return value=="cross"?{image: "cross"}:{text: value};},
    collectAreas: this.editMode,
  }

  typeProperties["snake_simple"] = {
    needBottom: true,
    needRight: true,
    cellController: cell => {
      if (cell.outerCell) {
        setClueClickSwitch(cell, [{},{image: "white_circle"}]);
      } else {
        setClickSwitch(cell, false, [{},{color: self.colorSchema.greyColor, returnValue: "black"},{image: "cross"}], [{},{color: "#a0a0a0"},{image: "cross"}]);
      }
    },
    cellEditController: cell => {
      if (cell.outerCell) {
        cell.isClue = true;
        var chooserValues = [{}];
        for (var i=0; i<=Math.max(self.rows, self.cols); i++) {
         chooserValues.push({text: i.toString(), returnValue: i.toString()});
        }
        cell.chooserValues = chooserValues;
      } else {
        cell.clickSwitch = [{},{color: self.colorSchema.clueColor, returnValue: "black"},{image: "cross", returnValue: "cross"}];
      }
    },
    decodeClue: value => {
      if (value=="cross") {
        return {image: value};
      } else if (value=="black") {
        return {color: self.colorSchema.clueColor};
      } else if (value=="white") {
        return {};
      } else {
        return {text: value};
      };
    },
  }

  typeProperties["tetro_scope"] = {
    needNodes: true,
    cellController: cell => {
      setClickSwitch(cell, false, [{},{color: self.colorSchema.greyColor, returnValue: "1"},{image: "cross"}], [{},{color: "#a0a0a0"},{image: "cross"}]);
      if (cell.isClue && cell.data.image != "cross") {
        setClueClickSwitch(cell, [{},{color: self.colorSchema.greyColor, returnValue: "1"}], [{},{color: "#a0a0a0"}]);
      }
    },
    cellEditController: cell => {cell.isClue = true; cell.clickSwitch = [{},{image: "cross", returnValue: "cross"}];},
    nodeEditController: node => {
      node.isClue = true;
      var chooserValues = [{}];
      for (var i=0; i<=4; i++) {
        chooserValues.push({color: self.colorSchema.gridColor, text: i.toString(), textColor: "#fff", returnValue: i.toString()});
      }
      node.chooserValues = chooserValues;
    },
    decodeClue: value => {
      if (value=="cross") {
        return {image: "cross"};
      } else {
        return {color: self.colorSchema.gridColor, text: value, textColor: "#fff"};
      }
    },
  }

  typeProperties["pentomino_touch"] = {
    needNodes: true,
    cellController: cell => {
      setClickSwitch(cell, false, [{},{color: self.colorSchema.greyColor, returnValue: "1"},{image: "cross"}], [{},{color: "#a0a0a0"},{image: "cross"}]);
    },
    nodeEditController: node => {node.isClue = true; node.clickSwitch = [{},{image: "battenberg_small", returnValue: "1"}];},
    decodeClue: value => {
      if (value=="1") {
        return {image: "battenberg_small"};
      } else {
        return {text: value};
      }
    },
  }

  typeProperties["pentomino_hungarian"] = {
    needNodes: false,
    cellController: cell => {
      setClickSwitch(cell, false, [{},{color: self.colorSchema.greyColor, returnValue: "1"},{image: "cross"}], [{},{color: "#a0a0a0"},{image: "cross"}]);
    },
    cellEditController: cell => {
      cell.clickSwitch = [{},{color: self.colorSchema.clueColor, returnValue: "1"}];
    },
    decodeClue: value => {
      if (value=="1") {
        return {color: self.colorSchema.clueColor};
      }
    },
  }

  typeProperties["nurikabe"] = {
    cellController: cell => {
      setClickSwitch(cell, false, [{},{color: self.colorSchema.greyColor, returnValue: "black"},{image: "cross"}], [{},{color: "#a0a0a0"},{image: "cross"}]);
      setClueClickSwitch(cell, [{},{image: "cross"}], [{},{image: "cross"}]);
    },
    cellEditController: cell => {
      cell.isClue = true;
      var chooserValues = [{},{image: "cross", returnValue: "cross"}];
      for (var i=1; i<=99; i++) {
       chooserValues.push({text: i.toString(), returnValue: i.toString()});
      }
      cell.chooserValues = chooserValues;
    },
    usePlus10: this.editMode?11:0,
    decodeClue: value => {return value=="cross"?{image: "cross"}:{text: value};},
  }

  typeProperties["cave_classic"] = {
    cellController: cell => {
      setClickSwitch(cell, false, [{},{color: self.colorSchema.greyColor, returnValue: "black"},{image: "cross"}], [{},{color: "#a0a0a0"},{image: "cross"}]);
      setClueClickSwitch(cell, [{},{image: "cross"}], [{},{image: "cross"}]);
    },
    cellEditController: cell => {
      cell.isClue = true;
      var chooserValues = [{},{image: "cross", returnValue: "cross"},{color: self.colorSchema.clueColor, returnValue: "black"}];
      for (var i=1; i<=99; i++) {
       chooserValues.push({text: i.toString(), returnValue: i.toString()});
      }
      cell.chooserValues = chooserValues;
    },
    usePlus10: this.editMode?12:0,
    decodeClue: value => {
      if (value=="cross") {
        return {image: "cross"};
      } else if (value=="black"){
        return {color: self.colorSchema.clueColor};
      } else {
        return {text: value};
      }
    },
  }

  typeProperties["battleships_minesweeper"] = {
    needNodes: false,
    cellController: cell => {
      setClickSwitch(cell, false, [{},{color: self.colorSchema.greyColor, returnValue: "1"},{image: "wave"}], [{},{color: "#a0a0a0"},{image: "wave"}]);
    },
    cellEditController: cell => {
      cell.isClue = true;
      var chooserValues = [{},{image: "wave", returnValue: "wave"}];
      for (var i=0; i<=8; i++) {
       chooserValues.push({text: i.toString(), returnValue: i.toString()});
      }
      cell.chooserValues = chooserValues;
    },
    decodeClue: value => {return value=="wave"?{image: "wave"}:{text: value};},
  }

  typeProperties["battleships"] = {
    needNodes: false,
    needBottom: true,
    needRight: true,
    cellController: cell => {
      if (cell.outerCell) {
        setClueClickSwitch(cell, [{},{image: "white_circle"}]);
      } else {
        setClickSwitch(cell, false, [{},{color: self.colorSchema.greyColor, returnValue: "1"},{image: "wave"}], [{},{color: "#a0a0a0"},{image: "wave"}]);
      }
    },
    cellEditController: cell => {
      if (cell.outerCell) {
        cell.isClue = true;
        var chooserValues = [{}];
        for (var i=0; i<=Math.max(self.rows, self.cols); i++) {
         chooserValues.push({text: i.toString(), returnValue: i.toString()});
        }
        cell.chooserValues = chooserValues;
      } else {
        cell.clickSwitch = [{},{image: "wave", returnValue: "wave"}];
      }
    },
    decodeClue: value => {return value=="wave"?{image: "wave"}:{text: value};},
  }

  typeProperties["battleships_knight"] = {
    needNodes: false,
    cellController: cell => {
      setClickSwitch(cell, false, [{},{color: self.colorSchema.greyColor, returnValue: "1"},{image: "wave"}], [{},{color: "#a0a0a0"},{image: "wave"}]);
    },
    cellEditController: cell => {
      cell.isClue = true;
      var chooserValues = [{},{image: "wave", returnValue: "wave"}];
      for (var i=0; i<=8; i++) {
       chooserValues.push({text: i.toString(), returnValue: i.toString()});
      }
      cell.chooserValues = chooserValues;
    },
    decodeClue: value => {return value=="wave"?{image: "wave"}:{text: value};},
  }

  typeProperties["tents_classic"] = {
    needNodes: !this.editMode,
    needBottom: true,
    needRight: true,
    needConnectors: !this.editMode,
    thinConnectors: true,
    connectorController: connector => {
      setDragSwitch(connector, false, [{},{color: self.colorSchema.lineColor}]);
    },
    cellController: cell => {
      cell.dragProcessor = true;
      if (cell.outerCell) {
        setClueClickSwitch(cell, [{},{image: "white_circle"}]);
      } else {
        if (cell.isClue) {
          let image = cell.data.image + "_circle";
          setClueClickSwitch(cell, [{},{image: image}]);
        } else {
          setClickSwitch(cell, false, [{},{image: "tent", returnValue: "1"},{image: "cross"}]);
        }
      }
    },
    cellEditController: cell => {
      if (cell.outerCell) {
        cell.isClue = true;
        var chooserValues = [{}];
        for (var i=0; i<=Math.max(self.rows, self.cols); i++) {
         chooserValues.push({text: i.toString(), returnValue: i.toString()});
        }
        cell.chooserValues = chooserValues;
      } else {
        cell.chooserValues = [{},{image: "tree1", returnValue: "tree1"},{image: "tree2", returnValue: "tree2"},{image: "tree3", returnValue: "tree3"}];
      }
    },
    edgeController: edge => {
      setDragSwitch(edge, false, [{},{color: self.colorSchema.lineColor}]);
    },
    nodeController: node => node.dragProcessor = true,
    decodeClue: value => {
      if (value.startsWith("tree")) {
        return {image: value};
      } else {
        return {text: value};
      }
    },
  }

  typeProperties["pentomino"] = {
    needNodes: false,
    needBottom: true,
    needRight: true,
    cellController: cell => {
      if (cell.outerCell) {
        setClueClickSwitch(cell, [{},{image: "white_circle"}]);
      } else {
        setClickSwitch(cell, false, [{},{color: self.colorSchema.greyColor, returnValue: "1"},{image: "cross"}], [{},{color: "#a0a0a0"},{image: "cross"}]);
      }
    },
    cellEditController: cell => {
      if (cell.outerCell) {
        cell.isClue = true;
        var chooserValues = [{}];
        for (var i=0; i<=Math.max(self.rows, self.cols); i++) {
         chooserValues.push({text: i.toString(), returnValue: i.toString()});
        }
        cell.chooserValues = chooserValues;
      } else {
        cell.clickSwitch = [{},{image: "cross", returnValue: "cross"}];
      }
    },
    decodeClue: value => {return value=="cross"?{image: "cross"}:{text: value};},
  }

  typeProperties["arrow_web"] = {
    needNodes: false,
    cellController: cell => {
      setClickSwitch(cell, true, [{},{color: self.colorSchema.gridColor, returnValue: "1"},{color: "#a0a0b0"}], [{},{color: self.colorSchema.greyColor},{color: "#d0d0d0"}]);
    },
    cellEditController: cell => {
      cell.chooserValues = [{},{image: "white_arrow_u", returnValue: "arrow_u"},{image: "white_arrow_ur", returnValue: "arrow_ur"},{image: "white_arrow_r", returnValue: "arrow_r"},{image: "white_arrow_dr", returnValue: "arrow_dr"},{image: "white_arrow_d", returnValue: "arrow_d"},{image: "white_arrow_dl", returnValue: "arrow_dl"},{image: "white_arrow_l", returnValue: "arrow_l"},{image: "white_arrow_ul", returnValue: "arrow_ul"}];
    },
    decodeClue: value => {return {image: "white_" + value}; },
  }

  typeProperties["xo"] = {
    needConnectors: true,
    cellController: cell => setClickSwitch(cell, false, [{},{image: "white_circle", returnValue: "O"},{image: "cross", returnValue: "X"}]),
    connectorController: connector => {
      setDragSwitch(connector, false, [{},{color: self.colorSchema.lineColor, returnValue: 1}]);
    },
    cellEditController: cell => {cell.isClue = true; cell.clickSwitch = [{},{image: "white_circle", returnValue: "O"},{image: "cross", returnValue: "X"},{color: self.colorSchema.gridColor, returnValue: "black"}];},
    decodeClue: value => {
      if (value=="O") return {image: "white_circle"};
      if (value=="X") return {image: "cross"};
      if (value=="black") return {color: self.colorSchema.gridColor};
    },
  }

  typeProperties["shortest_segment"] = {
    needConnectors: true,
    needNodes: false,
    needBottom: true,
    needRight: true,
    cellController: cell => {
      cell.dragProcessor = true;
    },
    edgeController: edge => {
      setClickSwitch(edge, false, [{},{image: "cross"}]);
    },
    connectorController: connector => {
      setDragSwitch(connector, false, [{},{color: self.colorSchema.lineColor, returnValue: 1}]);
    },
    cellEditController: cell => {
      if (cell.outerCell) {
        cell.isClue = true;
        var chooserValues = [{}];
        for (var i=0; i<=Math.max(self.rows-1, self.cols-1); i++) {
          chooserValues.push({text: i.toString(), returnValue: i.toString()});
        }
        cell.chooserValues = chooserValues;
      }
    },
  }

  typeProperties["alternate_loop"] = {
    needConnectors: true,
    cellController: cell => {
      cell.dragProcessor = true;
    },
    connectorController: connector => {
      setDragSwitch(connector, false, [{},{color: self.colorSchema.lineColor, returnValue: 1}]);
    },
    cellEditController: cell => {cell.isClue = true; cell.clickSwitch = [{},{image: "white_circle", returnValue: "white_circle"},{image: "black_circle", returnValue: "black_circle"}];},
    decodeClue: value => {return {image: value} },
  }

  typeProperties["masyu"] = {
    needConnectors: true,
    cellController: cell => {
      cell.dragProcessor = true;
    },
    connectorController: connector => {
      setDragSwitch(connector, false, [{},{color: self.colorSchema.lineColor, returnValue: 1}]);
    },
    cellEditController: cell => {cell.isClue = true; cell.clickSwitch = [{},{image: "white_circle", returnValue: "white_circle"},{image: "black_circle", returnValue: "black_circle"}];},
    decodeClue: value => {return {image: value} },
  }

  typeProperties["russian_loop"] = {
    needConnectors: true,
    cellController: cell => {
      cell.dragProcessor = true;
    },
    connectorController: connector => {
      setDragSwitch(connector, false, [{},{color: self.colorSchema.lineColor, returnValue: 1}]);
    },
    edgeController: edge => {
      setClickSwitch(edge, false, [{},{image: "cross"}]);
    },
    edgeEditController: edge => {
      if (edge.allCells.length > 1 && edge.side%2==1) {
        edge.isClue = true;
        edge.clickSwitch = [{}, {image: "small_circle", returnValue: "dot"}];;
      }
    },
    decodeClue: value => {
      if (value=="dot") {
        return {image: "small_circle"}
      } else {
        return {text: value}
      }
    },
  }

  typeProperties["kropki"] = {
    cellController: cell => {if (!cell.isClue) {setNumberChooser(cell, 1, self.rows);}},
    cellEditController: cell => {cell.isClue = true; setNumberChooser(cell, 1, self.rows);},
    edgeEditController: edge => {
      if (edge.allCells.length > 1) {
        edge.isClue = true;
        edge.clickSwitch = [{}, {image: "white_dot", returnValue: "white"}, {image: "small_circle", returnValue: "black"}];;
      }
    },
    decodeClue: value => {
      if (value=="white") {
        return {image: "white_dot"}
      } else if (value=="black") {
        return {image: "small_circle"}
      } else {
        return {text: value}
      }
    },
    cellMultiPencil: true,
  }

  typeProperties["kuromasu"] = {
    cellController: cell => {
      setClickSwitch(cell, false, [{},{color: "#606060", returnValue: "1"},{image: "cross"}], [{},{color: "#a0a0a0"},{image: "cross"}]);
      setClueClickSwitch(cell, [{},{image: "cross"}], [{},{image: "cross"}]);
    },
    cellEditController: cell => {cell.isClue = true; setNumberChooser(cell, 1, 29);},
    usePlus10: this.editMode?10:0,
  }

  typeProperties["product_kuromasu"] = {
    needNodes: false,
    needBottom: true,
    needRight: true,
    cellController: cell => {
      if (cell.outerCell) {
        setClueClickSwitch(cell, [{},{image: "white_circle"}]);
      } else {
        if (!cell.isClue) {
          var chooserValues = [{}];
          for (var i=0; i<=9; i++) {
            chooserValues.push({text: i.toString(), returnValue: i.toString()});
          }
          chooserValues.push({image: "white_circle"}, {image: "cross"});
          cell.chooserValues = chooserValues;
        }
      }
    },
    cellEditController: cell => {
      if (cell.outerCell) {
        cell.isClue = true; setNumberChooser(cell, 1, 81);
      } else {
        cell.clickSwitch = [{},{image: "cross", returnValue: "cross"}];
      }
    },
    decodeClue: value => {return value=="cross"?{image: "cross"}:{text: value};},
    usePlus10: this.editMode?10:0,
    cellMultiPencil: true,
  }

  typeProperties["no_touch_sums"] = {
    needNodes: false,
    needBottom: true,
    needRight: true,
    cellController: cell => {
      if (cell.outerCell) {
        setClueClickSwitch(cell, [{},{image: "white_circle"}]);
      } else {
        if (!cell.isClue) {
          var chooserValues = [{}];
          for (var i=1; i<=parseInt(self.dimensionExtra); i++) {
            chooserValues.push({text: i.toString(), returnValue: i.toString()});
          }
          chooserValues.push({image: "white_circle"}, {image: "cross"});
          cell.chooserValues = chooserValues;
        }
      }
    },
    cellEditController: cell => {
      if (cell.outerCell) {
        cell.isClue = true; setNumberChooser(cell, 1, 81);
      } else {
        cell.clickSwitch = [{},{image: "cross", returnValue: "cross"}];
      }
    },
    decodeClue: value => {return value=="cross"?{image: "cross"}:{text: value};},
    usePlus10: this.editMode?10:0,
    cellMultiPencil: true,
  }

  typeProperties["top_heavy"] = {
    needNodes: false,
    cellController: cell => {if (!cell.isClue) {
      var chooserValues = [{}];
      for (var i=1; i<=parseInt(self.dimensionExtra); i++) {
        chooserValues.push({text: i.toString(), returnValue: i.toString()});
      }
      chooserValues.push({image: "white_circle"}, {image: "cross"});
      cell.chooserValues = chooserValues;
    }},
    cellEditController: cell => {cell.isClue = true; setNumberChooser(cell, 1, parseInt(self.dimensionExtra));},
    cellMultiPencil: true,
  }

  typeProperties["chat_room"] = {
    needConnectors: !this.editMode,
    cellController: cell => {
      cell.dragProcessor = true;
    },
    connectorController: connector => {
      setDragSwitch(connector, false, [{},{color: self.colorSchema.textColor, returnValue: 1}]);
    },
    cellEditController: cell => {
      cell.isClue = true;
      var chooserValues = [{}];
      chooserValues.push({image: 'phone', returnValue: 'phone'});
      chooserValues.push({image: 'big_white_circle', returnValue: 'white_circle'});
      chooserValues.push({image: 'big_black_circle', returnValue: 'black_circle'});
      for (var i=0; i<=99; i++) {
        chooserValues.push({text: i.toString(), image: 'big_white_circle', returnValue: 'white_'+i.toString()});
        chooserValues.push({text: i.toString(), image: 'big_black_circle', textColor: "#fff", returnValue: 'black_'+i.toString()});
      }
      cell.chooserValues = chooserValues;
    },
    decodeClue: value => {
      if (value=="phone") {
        return {image: "phone"}
      } else if (value=="black_circle") {
        return {image: "big_black_circle"}
      } else if (value=="white_circle") {
        return {image: "big_white_circle"}
      } else if (value.startsWith("black_")) {
        return {image: "big_black_circle", text: value.substring(6), textColor: "#fff"}
      } else if (value.startsWith("white_")) {
        return {image: "big_white_circle", text: value.substring(6)}
      } else {
        return {text: value}
      }
    },
  }

  typeProperties["slalom"] = {
    needNodes: true,
    needConnectors: false,
    cellController: cell => {
      cell.dragProcessor = null;
      setClickSwitch(cell, false, [{},{image: "slash", returnValue: "/"},{image: "backslash", returnValue: "\\"}]);
      if (cell.isClue && cell.data.image != "cross") {
        setClueClickSwitch(cell, [{},{color: self.colorSchema.greyColor, returnValue: "1"}], [{},{color: "#a0a0a0"}]);
      }
    },
    nodeEditController: node => {
      node.isClue = true;
      var chooserValues = [{}];
      for (var i=0; i<=4; i++) {
        chooserValues.push({color: self.colorSchema.gridColor, text: i.toString(), textColor: "#fff", returnValue: i.toString()});
      }
      node.chooserValues = chooserValues;
    },
    decodeClue: value => {
      return {color: self.colorSchema.gridColor, text: value, textColor: "#fff"};
    },
  }

  if (typeCode in typeProperties) {
    this.typeProperties = Object.assign({}, this.typeProperties,  typeProperties[typeCode]);
  }
  }
}

function setClickSwitch(element, withClues, clickSwitch, pencilClickSwitch) {
  if (element.isClue && !withClues) {
    return;
  }
  element.clickSwitch = clickSwitch.map(val => Object.assign({}, element.data, val))
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
  element.clickSwitch = clickSwitch.map(val => Object.assign({}, element.data, val))
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

function setNumberChooser(cell, start, end) {
  var chooserValues = [{}];
  for (var i=start; i<=end; i++) {
    chooserValues.push({text: i.toString(), returnValue: i.toString()});
  }
  cell.chooserValues = chooserValues;
}

function setDragSwitch(element, withClues, dragSwitch, pencilDragSwitch) {
  if (element.isClue && !withClues) {
    return;
  }
  element.dragSwitch = dragSwitch.map(val => Object.assign({}, element.data, val))
  if (typeof pencilDragSwitch != "undefined") {
    element.pencilDragSwitch = pencilDragSwitch;
  } else {
    element.pencilDragSwitch = dragSwitch.map(val => {var clone = Object.assign({}, val); delete clone.returnValue; return clone});
  }
}

squarePuzzleCell.prototype.chooserData = function() {
  if (this.puzzle.typeCode == "chat_room") {
    var values = this.chooserValues.slice(0, 24);
    values.push({text: "+10"});
    return values;
  } else {
    return squareGridElement.prototype.chooserData.call(this);
  }
}

squarePuzzleCell.prototype.switchOnChooser = function(index) {
  if (this.puzzle.typeCode == "chat_room" && index == 24) {
    var currentIndex = this.findCurrent(this.chooserValues);
    var newIndex = currentIndex + 20;
    if (newIndex >= this.chooserValues.length) {
      newIndex -= this.chooserValues.length;
    }
    return squareGridElement.prototype.switchOnChooser.call(this, newIndex);
  } else  {
    return squareGridElement.prototype.switchOnChooser.call(this, index);
  }
}

})
