basePuzzle = function(puzzleData, controls, settings) {
  this.settings = settings;
  this.id = puzzleData.id;
  this.colorSchema = this.chooseColorSchema();
  this.typeCode = puzzleData.typeCode;
  this.dimension = puzzleData.dimension;
  this.parseDimension();
  this.createBoard();
  this.steps = [];
  this.initControls(controls);
}

basePuzzle.prototype.render = function(snap) {
  // Draw puzzle grid
  this.snap = snap;
  this.size = this.findSize();
  this.snap.node.setAttribute("height", this.size.height);
  this.snap.node.setAttribute("width", this.size.width);
  this.snap.node.setAttribute("viewBox", "0 0 " + this.size.width + " " + this.size.height);

  this.gridProperty = {
    cell: {
      "fill": this.colorSchema.bgColor,
      "fill-opacity": 1,
      "stroke": this.colorSchema.gridColor,
      "strokeWidth": 1,
    },
    pencilCell: {
      "fill": this.colorSchema.bgColor,
      "fill-opacity": 0.3,
      "stroke": this.colorSchema.gridColor,
      "strokeWidth": 1,
    },
    edge: {
      "strokeWidth": this.size.unitSize < 48 ? 6: this.size.unitSize/8,
      "stroke-linecap": "round"
    },
    pencilEdge: {
      "strokeWidth": this.size.unitSize < 48 ? 3: this.size.unitSize/16,
      "stroke-linecap": "round",
      "stroke-dasharray": "0 6"
    },
    node: {
    },
    pencilNode: {
      "fill-opacity": 0.3
    },
    font: {
      "font-family": "sans-serif",
      "font-weight": "bold",
      "lengthAdjust": "spacingAndGlyphs"
    }
  }
  this.drawBoard();
}

basePuzzle.prototype.chooseColorSchema = function() {
  if (this.settings.theme=="white") {
    return {
      textColor: "#18254d",
      lineColor: "#18254d",
      clueColor: "#294b83",
      traceColor: "#5a70a6",
      gridColor: "#000",
      bgColor: "#fff",
      errorColor: "#efa4a7",
    }
  } else if (this.settings.theme=="contrast") {
    return {
      textColor: "#101010",
      lineColor: "#008959",
      clueColor: "#404040",
      traceColor: "#66efbf",
      gridColor: "#000",
      bgColor: "#fff",
      errorColor: "#f52b14",
    }
  } else {
    return {
      textColor: "#00121d",
      lineColor: "#00121d",
      clueColor: "#073642",
      traceColor: "#777777",
      gridColor: "#000",
      bgColor: "#fff",
      errorColor: "#e72381",
    }
  }
}

basePuzzle.prototype.imageUrl = function(imageName) {
  if (imageName==null) imageName="white";
  // Url for image with the given name.
  if (typeof this.settings != 'undefined' && this.settings.local) {
    return "images/"+imageName+".png";
  } else {
    return "/images/"+imageName+".png";
  }
}

basePuzzle.prototype.initControls = function (controls) {
  var self = this;
  this.controls = {};
  this.controls.card = controls;
  this.controls.startBtn = controls + " [name=startBtn]";
  this.controls.restartModal = controls + " [name=restartModal]";
  this.controls.restartYes = this.controls.restartModal + " [name=confirmYes]";
  this.controls.restartNo = this.controls.restartModal + " [name=confirmNo]";
  this.controls.revertBtn = controls + " [name=revertBtn]";
  this.controls.saveBtn = controls + " [name=saveBtn]";
  this.controls.checkBtn = controls + " [name=checkBtn]";
  this.controls.pencilMarkCtrl = controls + " [name=pencilMarkCtrl]";
  this.controls.pencilMarkCb = controls + " [name=pencilMarkCb]";
  this.controls.timer = controls + " [name=timer]";
  this.controls.tag =  controls + " [name=tag]";
  this.controls.successText =  controls + " [name=successMessageText]";
  this.controls.successMsg =  controls + " [name=successMessage]";
  this.controls.errorText =  controls + " [name=errorMessageText]";
  this.controls.errorMsg =  controls + " [name=errorMessage]";

  $(this.controls.startBtn).click(() => self.start());
  $(this.controls.restartYes).click(() => {
    $(this.controls.restartModal).modal('hide');
    self.start();
  });
  $(this.controls.revertBtn).hide().click(() => self.revertStep());
  $(this.controls.checkBtn).prop('disabled', true).click(() => self.check());
  $(this.controls.saveBtn).click(() => self.save());
  $(this.controls.pencilMarkCtrl).hide();
  $(this.controls.pencilMarkCb).click(() => self.togglePencilMarkMode());
}

basePuzzle.prototype.convertControls = function () {
  $(this.controls.startBtn).html(__['Restart']);
  $(this.controls.startBtn).unbind('click');
  $(this.controls.startBtn).click(() => {$(this.controls.restartModal).modal();});
  $(this.controls.revertBtn).show();
  $(this.controls.checkBtn).show();
  $(this.controls.pencilMarkCtrl).show();
  $(this.controls.pencilMarkCb).prop( "checked", false );
  this.setButtonEnabled(false);
}

basePuzzle.prototype.convertEditControls = function () {
  $(this.controls.revertBtn).show();
  $(this.controls.saveBtn).show();
  this.setButtonEnabled(false);
}

basePuzzle.prototype.setButtonEnabled = function (enabled) {
  $(this.controls.checkBtn).prop('disabled', !enabled);
  $(this.controls.saveBtn).prop('disabled', !enabled);
  $(this.controls.revertBtn).prop('disabled', !enabled);
}

basePuzzle.prototype.startTimer = function() {
  if (!this.controls.timer || this.timer) {
    return;
  }
  var self = this;
  this.startTime = new Date();
  this.showTime();
  this.timer = setInterval(() => self.showTime(),1000);
}

basePuzzle.prototype.stopTimer = function() {
  if (this.timer) {
    clearInterval(this.timer);
    this.timer = null;
  }
}

basePuzzle.prototype.showTime = function() {
  var formatNumber = function(num){
    if (num < 10) return '0' + num.toString();
    return num.toString();
  }
  var currentTime = new Date();
  var d = Math.round((currentTime.getTime() - this.startTime.getTime()) / 1000);
  var mins = Math.floor(d / 60);
  var secs = d - mins * 60;
  var hours = Math.floor(mins / 60);
  mins = mins - hours * 60;
  hours = hours > 0?formatNumber(hours)+":":"";
  mins = formatNumber(mins) + ":";
  secs = formatNumber(secs);
  $(this.controls.timer).show().text(hours + mins + secs);
}

basePuzzle.prototype.start = function() {
  // Reads puzzle data and shows the clues
  var self = this;
  this.removeMessages();
  if (typeof this.settings != 'undefined' && this.settings.local) {
    self.processClueData(this.settings.data);
    return;
  }
  // Read clues from server and start the puzzle solving.
  $.getJSON("/puzzles/" + this.id + "/start")
    .done(data => self.processClueData(data))
    .fail((jqxhr, textStatus, error) => {self.showError(jqxhr.responseText);});
}

basePuzzle.prototype.edit = function() {
  var self = this;
  this.removeMessages();
  if (typeof this.settings != 'undefined' && this.settings.local) {
    self.showForEdit(this.settings.data);
    return;
  }
  // Read clues from server and show
  $.getJSON("/puzzles/" + this.id + "/get")
    .done(data => self.showForEdit(data))
    .fail((jqxhr, textStatus, error) => {self.showError(jqxhr.responseText);});
}

basePuzzle.prototype.check = function() {
  var self = this;
  var data = this.collectData();
  this.removeMessages();
  if (typeof this.settings != 'undefined' && this.settings.local) {
    var dimension = this.dimension;
    var puzzleData = this.settings.data;
    module = {};
    requirejs(['puzzle_types/util.js','puzzle_types/' + this.typeCode + '.js'], function() {
      window.util=Util;
      response = Checker.check(dimension, puzzleData, data);
      self.showResult(response);
    });
    return;
  }
  // Read result from server and show.
  $.post("/puzzles/" + this.id + "/check", data)
    .done(response => self.showResult(response))
    .fail((jqxhr, textStatus, error) => {self.showError(jqxhr.responseText);});
}

basePuzzle.prototype.save = function() {
  var self = this;
  var data = this.collectData();
  data.tag = $(this.controls.tag).val();
  console.log(data);
  this.removeMessages();
  // Read result from server and show.
  $.post("/puzzles/" + (this.id ? this.id: "0") + "/edit", data)
    .done(response => this.showSaveResult(response))
    .fail((jqxhr, textStatus, error) => {self.showError(jqxhr.responseText);});
}

basePuzzle.prototype.showResult = function(result) {
  this.removeMessages();
  if (result.status == 'OK') {
    this.stopTimer();
    this.showSuccess(__["Congratulations! The puzzle has been solved correctly!"]);
  } else {
    this.showError(__["Sorry, there is a mistake. "] + result.status + ". " + __["Try again."]);
    this.showErrorCells(result);
  }
}

basePuzzle.prototype.showSaveResult = function(result) {
  this.removeMessages();
  if (result.status == 'OK') {
    this.stopTimer();
    this.showSuccess(__["The puzzle has been saved!"]);
  } else {
    this.showError(__["Error while saving. "] + result.status + ".");
    this.showErrorCells(result);
  }
}

basePuzzle.prototype.processClueData = function(data) {
  this.clearAll();
  this.showClues(data);
  this.initController();
  this.pencilMarkMode = false;
  this.steps = [];
  this.convertControls();
  this.startTimer();
}

basePuzzle.prototype.showForEdit = function (data) {
  this.clearAll();
  this.showClues(data);
  this.initEditController();
  this.steps = [];
  this.convertEditControls();
}

basePuzzle.prototype.togglePencilMarkMode = function() {
  this.pencilMarkMode = $(this.controls.pencilMarkCb).is(':checked');
}

basePuzzle.prototype.addStep = function(step) {
  if(typeof step == 'function') {
    this.steps.push(step);
  }
  if (this.steps.length > 0) {
    this.setButtonEnabled(true);
  }
}

basePuzzle.prototype.revertStep = function() {
  var lastStep = this.steps.pop();
  if(typeof lastStep == 'function') {
    lastStep();
  }
  if (this.steps.length == 0) {
    this.setButtonEnabled(false);
  }
}

//////////////////////////// messages ////////////////////////
basePuzzle.prototype.showError = function(message, timeout){
  this.showMessage('danger', message, timeout);
}

basePuzzle.prototype.showSuccess = function(message, timeout){
  this.showMessage('success', message, timeout);
}

basePuzzle.prototype.showMessage = function(type, message, timeout){
    this.message = $(
      '<div name="' + type + 'Message" '+
           'class="alert alert-' +  type + ' alert-dismissible fade show" ' + 
           'role="alert" '+
           'style="display: block; position: absolute; top: 0; left: 0; z-index: 100;" '+
       '> '+
       '  <span name="' + type + 'MessageText">' + message + '</span> '+
       '  <button type="button" class="close" data-dismiss="alert" aria-label="Close">'+
       '    <span aria-hidden="true">&times;</span>'+
       '  </button>'+
       '</div>');
    this.message.appendTo($(this.controls.card));
    if (timeout) {
      setTimeout(() => this.message.remove(), timeout);
    }
}

basePuzzle.prototype.removeMessages = function() {
  if (this.message) {
    this.message.remove();
    this.message = null;
  }
}

//////////////////////////// virtual mesthods ////////////////////////
basePuzzle.prototype.parseDimension = function() {
  // Parse dimension string to values.
  throw 'parseDimension is not implemented for ' + this.constructor.name + '!';
}

basePuzzle.prototype.createBoard = function() {
  // Initialize internal data structure to represent puzzle board.
  throw 'createBoard is not implemented for ' + this.constructor.name + '!';
}

basePuzzle.prototype.findSize = function() {
  // Returns the size of svg and elenetary unit. Computes basic sizes from current window size and puzzle dimension.
  // Expected return {width:, height:, unitSize: }
  throw 'findSize is not implemented for ' + this.constructor.name + '!';
}

basePuzzle.prototype.drawBoard = function() {
  // Draw puzzle biard at the svg element.
  throw 'drawBoard is not implemented for ' + this.constructor.name + '!';
}

basePuzzle.prototype.clearAll = function(data) {
  // Delete all user actions in the board
  throw 'clearAll is not implemented for ' + this.constructor.name + '!';
}

basePuzzle.prototype.showClues = function(data) {
  // Show clues in the board
  throw 'showClues is not implemented for ' + this.constructor.name + '!';
}

basePuzzle.prototype.initController = function () {
  // Attach mouse controllers to the grid
  throw 'initController is not implemented for ' + this.constructor.name + '!';
}

basePuzzle.prototype.initEditController = function () {
  // Attach mouse controllers to the grid
  throw 'initEditController is not implemented for ' + this.constructor.name + '!';
}

basePuzzle.prototype.collectData = function() {
  // Collect state of puzzle elements for check solution. 
  throw 'collectData is not implemented for ' + this.constructor.name + '!';
}

basePuzzle.prototype.showErrorCells = function(result) {
  throw 'showErrorCells is not implemented for ' + this.constructor.name + '!';
}

