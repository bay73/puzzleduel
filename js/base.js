basePuzzle = function(puzzleData, controls, settings) {
  this.settings = settings;
  this.typeProperties = {
    needEdges: true,
    thickEdges: false,
    outerEdges: true,
    needNodes: false,
    needConnectors: false,
    thinConnectors: false,
  };
  this.editMode = false;
  this.id = puzzleData.id;
  this.colorSchema = this.chooseColorSchema();
  this.typeCode = puzzleData.typeCode;
  this.dimension = puzzleData.dimension;
  this.parseDimension(puzzleData.dimension);
  this.setTypeProperties(puzzleData.typeCode);
  this.createBoard();
  this.steps = [];
  this.log = [];
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
    outerCell: {
      "fill-opacity": 0,
      "stroke": this.colorSchema.gridColor,
      "strokeWidth": 1,
    },
    pencilCell: {
      "fill": this.colorSchema.bgColor,
      "fill-opacity": 1,
      "stroke": this.colorSchema.gridColor,
      "strokeWidth": 1,
    },
    edge: {
      "strokeWidth": this.typeProperties.thickEdges ? this.size.baseThickness * 1.5 : this.size.baseThickness,
      "stroke-linecap": "round"
    },
    pencilEdge: {
      "strokeWidth": this.typeProperties.thickEdges ? this.size.baseThickness * 0.7 : this.size.baseThickness,
      "stroke-linecap": "round",
      "stroke-dasharray": "0 " + this.size.baseThickness * 1.2
    },
    node: {
    },
    pencilNode: {
      "fill-opacity": 1
    },
    connector: {
      "strokeWidth": this.typeProperties.thinConnectors ? 1 : this.size.baseThickness * 1.5,
      "stroke-opacity": 0.5,
      "stroke-linecap": "round"
    },
    pencilConnector: {
      "strokeWidth": this.typeProperties.thinConnectors ? 1 : this.size.baseThickness,
      "stroke-opacity": 0.4,
      "stroke-linecap": "round",
      "stroke-dasharray": "0 " + this.size.baseThickness * 1.2
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
      textColor: "#10153d",
      lineColor: "#18254d",
      clueColor: "#074083",
      greyColor: "#4060b6",
      lightGreyColor: "#90b0e2",
      traceColor: "#007bff",
      gridColor: "#000",
      bgColor: "#fff",
      brightColor: "#38e",
      errorColor: "#efa4a7",
      outerClueColor: "#06d",
      outerClueSecondColor: "#014",
      outerClueFilter: "<feColorMatrix type='matrix' values='0 0 0 0 0 0 0.5 0 0 0.1 0 0 1 0 0.5 0 0 0 1 0'/>",
    }
  } else if (this.settings.theme=="contrast") {
    return {
      textColor: "#101010",
      lineColor: "#008959",
      clueColor: "#075a8f",
      greyColor: "#707070",
      lightGreyColor: "#b0b0b0",
      traceColor: "#66efbf",
      gridColor: "#000",
      bgColor: "#fff",
      brightColor: "#5577bb",
      errorColor: "#f52b14",
      outerClueColor: "#bcf",
      outerClueSecondColor: "#003",
      outerClueFilter: "<feColorMatrix type='matrix' values='1 0 0 0 1 0 1 0 0 1 0 0 1 0 1 0 0 0 1 0'/>"
    }
  } else {
    return {
      textColor: "#00121d",
      lineColor: "#002436",
      clueColor: "#075466",
      greyColor: "#38585c",
      lightGreyColor: "#a0c0c5",
      traceColor: "#777777",
      gridColor: "#000",
      bgColor: "#fff",
      brightColor: "#2aa198",
      errorColor: "#e72381",
      outerClueColor: "#8db",
      outerClueSecondColor: "#001",
      outerClueFilter: "<feColorMatrix type='matrix' values='0 0 0 0 0.2 0 0 0 0 0.6 0 0 0 0 0.6 0 0 0 1 0'/>"
    }
  }
}

basePuzzle.prototype.decodeColor = function(color) {
  switch (color) {
    case "#10153d": return this.colorSchema.textColor;
    case "#101010": return this.colorSchema.textColor;
    case "#00121d": return this.colorSchema.textColor;
    case "#18254d": return this.colorSchema.lineColor;
    case "#008959": return this.colorSchema.lineColor;
    case "#002436": return this.colorSchema.lineColor;
    case "#203063": return this.colorSchema.clueColor;
    case "#404040": return this.colorSchema.clueColor;
    case "#042632": return this.colorSchema.clueColor;
    case "#4060b6": return this.colorSchema.greyColor;
    case "#707070": return this.colorSchema.greyColor;
    case "#38585c": return this.colorSchema.greyColor;
    case "#90b0e2": return this.colorSchema.lightGreyColor;
    case "#b0b0b0": return this.colorSchema.lightGreyColor;
    case "#a0c0c5": return this.colorSchema.lightGreyColor;
    case "#007bff": return this.colorSchema.traceColor;
    case "#66efbf": return this.colorSchema.traceColor;
    case "#777777": return this.colorSchema.traceColor;
    case "#000": return this.colorSchema.gridColor;
    case "#fff": return this.colorSchema.bgColor;
    case "#38e": return this.colorSchema.brightColor;
    case "#5577bb": return this.colorSchema.brightColor;
    case "#2aa198": return this.colorSchema.brightColor;
    case "#efa4a7": return this.colorSchema.errorColor;
    case "#f52b14": return this.colorSchema.errorColor;
    case "#e72381": return this.colorSchema.errorColor;
    case "#06d": return this.colorSchema.outerClueColor;
    case "#bcf": return this.colorSchema.outerClueColor;
    case "#8db": return this.colorSchema.outerClueColor;
    case "#014": return this.colorSchema.outerClueSecondColor;
    case "#003": return this.colorSchema.outerClueSecondColor;
    case "#001": return this.colorSchema.outerClueSecondColor;
    default: return color;
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
  this.controls.voteModal = controls + " [name=voteModal]";
  this.controls.voteSave = this.controls.voteModal + " [name=voteSave]";
  this.controls.voteClose = this.controls.voteModal + " [name=voteClose]";
  this.controls.voteRating = this.controls.voteModal + " [name=voteRating]";
  this.controls.voteComment = this.controls.voteModal + " [name=voteComment]";
  this.controls.revertBtn = controls + " [name=revertBtn]";
  this.controls.savepointGrp = controls + " [name=savepointGrp]";
  this.controls.savepointBtn = controls + " [name=savepointBtn]";
  this.controls.savepointMenu = controls + " [name=savepointMenu]";
  this.controls.resetSavepointBtn = controls + " [name=resetSavepointBtn]";
  this.controls.removeSavepointBtn = controls + " [name=removeSavepointBtn]";
  this.controls.rollbackModal = controls + " [name=rollbackModal]";
  this.controls.rollbackYes = this.controls.rollbackModal + " [name=confirmYes]";
  this.controls.rollbackNo = this.controls.rollbackModal + " [name=confirmNo]";
  this.controls.saveBtn = controls + " [name=saveBtn]";
  this.controls.checkBtn = controls + " [name=checkBtn]";
  this.controls.pencilMarkCtrl = controls + " [name=pencilMarkCtrl]";
  this.controls.pencilMarkCb = controls + " [name=pencilMarkCb]";
  this.controls.timer = controls + " [name=timer]";
  this.controls.tag =  controls + " [name=tag]";
  this.controls.difficulty =  controls + " [name=difficulty]";
  this.controls.successText =  controls + " [name=successMessageText]";
  this.controls.successMsg =  controls + " [name=successMessage]";
  this.controls.errorText =  controls + " [name=errorMessageText]";
  this.controls.errorMsg =  controls + " [name=errorMessage]";

  $(this.controls.startBtn).click(() => self.start());
  $(this.controls.restartYes).click(() => {
    $(this.controls.restartModal).modal('hide');
    self.start();
  });
  $(this.controls.rollbackYes).click(() => {
    $(this.controls.rollbackModal).modal('hide');
    self.rollbackToSavepoint();
  });
  $(this.controls.voteSave).click(() => {
    $(this.controls.voteModal).modal('hide');
    var commentData = {
      rating: $(this.controls.voteRating).rateit('value'),
      comment: $(this.controls.voteComment).val()
    }
    $.post("/puzzles/" + this.id + "/comment", commentData);
  });
  $(this.controls.revertBtn).hide().click(() => self.revertStep());
  $(this.controls.checkBtn).prop('disabled', true).click(() => self.check());
  $(this.controls.saveBtn).click(() => self.save());
  $(this.controls.tag).change(() => $(self.controls.saveBtn).prop('disabled', false));
  $(this.controls.difficulty).change(() => {self.changeDifficulty = true; $(self.controls.saveBtn).prop('disabled', false);});
  $(this.controls.pencilMarkCtrl).hide();
  $(this.controls.pencilMarkCb).click(() => self.togglePencilMarkMode());
  $(this.controls.savepointBtn).click(() => self.toggleSavepoint());
  $(this.controls.resetSavepointBtn).click(() => self.setSavepoint());
  $(this.controls.removeSavepointBtn).click(() => self.removeSavepoint());
}

basePuzzle.prototype.convertControls = function () {
  $(this.controls.startBtn).html(__['Restart']);
  $(this.controls.startBtn).unbind('click');
  $(this.controls.startBtn).click(() => {$(this.controls.restartModal).modal();});
  $(this.controls.revertBtn).show();
  $(this.controls.savepointGrp).show();
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

basePuzzle.prototype.convertReplayControls = function () {
  $(this.controls.startBtn).hide();
  $(this.controls.checkBtn).hide();
  this.setButtonEnabled(false);
}

basePuzzle.prototype.setButtonEnabled = function (enabled) {
  $(this.controls.checkBtn).prop('disabled', !enabled);
  $(this.controls.saveBtn).prop('disabled', !enabled);
  $(this.controls.revertBtn).prop('disabled', !enabled);
  if (enabled && this.timer) {
    window.onbeforeunload =  function () {
      return "Refreshing or leaving this page will cause you to lose data!"
    };
  } else {
    window.onbeforeunload = null;
  }
}

basePuzzle.prototype.startTimer = function() {
  if (!this.controls.timer || this.timer) {
    return;
  }
  this.startTime = new Date();
  this.showTime();
  this.runTimer();
}

basePuzzle.prototype.runTimer = function() {
  if (!this.controls.timer || this.timer) {
    return;
  }
  var self = this;
  this.timer = setInterval(() => self.showTime(),1000);
}

basePuzzle.prototype.stopTimer = function() {
  if (this.timer) {
    clearInterval(this.timer);
    this.timer = null;
    window.onbeforeunload = null;
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
  this.logStep('', 'check');
  var data = this.collectData();
  data.time = new Date() - this.startTime;
  data.log = this.log;
  let typeCode = this.typeCode;
  this.removeMessages();
  if (typeof this.settings != 'undefined' && this.settings.local) {
    var dimension = this.dimension;
    var puzzleData = this.settings.data;
    module = {};
    requirejs(['puzzle_types/util.js'], function() {
      window.util=Util;
      requirejs(['puzzle_types/sudoku_util.js','puzzle_types/pentomino_util.js'], function() {
        window.sudoku_util=SudokuUtil;
        window.pentomino_util=PentominoUtil;
        requirejs(['puzzle_types/' + typeCode + '.js'], function() {
          response = Checker.check(dimension, puzzleData, data);
          self.showResult(response);
        });
      });
    });
    return;
  }
  // Read result from server and show.
  $.post("/puzzles/" + this.id + "/check", data)
    .done(response => self.showResult(response))
    .fail((jqxhr, textStatus, error) => {self.showError(jqxhr.responseText);});
  this.log = [];
}

basePuzzle.prototype.save = function() {
  var self = this;
  var data = this.collectData();
  data.tag = $(this.controls.tag).val();
  if (this.changeDifficulty) {
    data.difficulty = $(this.controls.difficulty).val()*1000;
  }
  this.removeMessages();
  console.log(data);
  // Read result from server and show.
  $.post("/puzzles/" + (this.id ? this.id: "0") + "/edit", data)
    .done(response => this.showSaveResult(response))
    .fail((jqxhr, textStatus, error) => {self.showError(jqxhr.responseText);});
}

basePuzzle.prototype.showResult = function(result) {
  this.removeMessages();
  if (result.status == 'OK') {
    this.stopTimer();
    $(this.controls.voteRating).rateit('value', result.rating);
    $(this.controls.voteComment).val(result.comment);
    $(this.controls.voteModal).modal();
  } else {
    this.logStep('', {error: result});
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
  if (this.figures) {
    puzzleFigures.init($(this.figures));
  }
  this.startTimer();
  this.logStep('', 'start');
}

basePuzzle.prototype.showForEdit = function (data) {
  this.editMode = true;
  this.setTypeProperties(this.typeCode);
  this.clearAll();
  this.showClues(data);
  this.initEditController();
  this.steps = [];
  this.convertEditControls();
}

basePuzzle.prototype.togglePencilMarkMode = function() {
  this.pencilMarkMode = $(this.controls.pencilMarkCb).is(':checked');
}

basePuzzle.prototype.logStep = function(cell, data ) {
  let logItem = {t: new Date() - this.startTime, d: data};
  if (cell) {
    logItem.c = cell;
  }
  this.log.push(logItem);
  if (this.log.length > 300) {
    let self = this;
    let postData = {log: this.log};
    $.post("/puzzles/" + this.id + "/log", postData)
      .done(response => {})
      .fail((jqxhr, textStatus, error) => {self.logStep('', 'failed to save log');});
    this.log = [];
  }
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
  this.savepointButtonState();
  if (this.steps.length == 0) {
    this.setButtonEnabled(false);
  }
}

basePuzzle.prototype.toggleSavepoint = function() {
  if (this.savepoint != null) {
    if (this.steps.length > this.savepoint) {
      $(this.controls.rollbackModal).modal();
    }
  } else {
    this.setSavepoint();
  }
}

basePuzzle.prototype.removeSavepoint = function() {
  this.savepoint = null;
  this.savepointButtonState();
}

basePuzzle.prototype.rollbackToSavepoint = function() {
  if (this.savepoint != null) {
    while (this.steps.length > this.savepoint) {
      this.revertStep();
    }
  }
  this.savepointButtonState();
}

basePuzzle.prototype.setSavepoint = function() {
  this.savepoint = this.steps.length;
  this.savepointButtonState();
}

basePuzzle.prototype.savepointButtonState = function() {
  if (this.savepoint != null && this.steps.length >= this.savepoint) {
    $(this.controls.savepointBtn).html(__['To Savepoint']);
    $(this.controls.savepointMenu).show();
  } else {
    this.savepoint = null;
    $(this.controls.savepointBtn).html(__['Set Savepoint']);
    $(this.controls.savepointMenu).hide();
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

basePuzzle.prototype.decodeClue = function(value) {
  if (typeof this.typeProperties.upgradeClue =="function") {
    value = this.typeProperties.upgradeClue(value);
  }
  // Convert clue value to data for element.
  if (typeof this.typeProperties.decodeClue =="function") {
    return this.typeProperties.decodeClue(value, this);
  } else {
    return {text: value};
  }
}

basePuzzle.prototype.replay = function(log) {
  var self = this;
  this.removeMessages();
  if (typeof this.settings != 'undefined' && this.settings.local) {
    self.startReplay(this.settings.data, log);
    return;
  }
  // Read clues from server and show
  $.getJSON("/puzzles/" + this.id + "/start")
    .done(data => self.startReplay(data, log))
    .fail((jqxhr, textStatus, error) => {self.showError(jqxhr.responseText);});
}

basePuzzle.prototype.startReplay = function (data, log) {
  this.replayMode = true;
  this.setTypeProperties(this.typeCode);
  this.clearAll();
  this.showClues(data);
  this.initController();
  this.steps = [];
  this.convertReplayControls();
  this.startTime = new Date();
  var self = this;
  this.replay = {
    available: log.length >= 3,
    clueData: data,
    log: log,
    step: 0,
    revertStep: 0
  }
  if (!this.replay.available) {
    this.showError("Sorry replay is not available!");
    return;
  }
  this.replay.log[0].revertStep = 0;
}

basePuzzle.prototype.replayPause = function () {
  if (!this.replay.available) {
    this.showError("Sorry replay is not available!");
    return;
  }
  clearTimeout(this.replay.timeout);
  this.stopTimer()
}

basePuzzle.prototype.replayContinue = function () {
  if (!this.replay.available) {
    this.showError("Sorry replay is not available!");
    return;
  }
  this.runTimer()
  this.replayStep(true)
}

basePuzzle.prototype.replayStepForward = function () {
  if (!this.replay.available) {
    this.showError("Sorry replay is not available!");
    return;
  }
  if (this.replay.step + 1 >= this.replay.log.length) {
    return false;
  }
  this.replayStep(false);
  return true;
}

basePuzzle.prototype.replayStepBackward = function () {
  if (!this.replay.available) {
    this.showError("Sorry replay is not available!");
    return;
  }
  if (this.replay.step <= 0) {
    return false;
  }
  this.replay.step--;
  let revertStep = this.replay.log[this.replay.step].revertStep;
  if (typeof revertStep != 'undefined') {
    while (revertStep < this.steps.length) {
      this.revertStep();
    }
  }
  this.startTime.setTime(new Date().getTime() - this.replay.log[this.replay.step].t);
  this.showTime();
  return true;
}

basePuzzle.prototype.replayStep = function (autoContinue) {
  let self = this;
  let mergeWithNext = function() {
    let step = self.replay.log[self.replay.step]
    if (self.replay.step + 1 < self.replay.log.length) {
      let nextStep = self.replay.log[self.replay.step + 1];
      if (step.c == nextStep.c && nextStep.t - step.t < 200) {
        return true;
      }
    }
    return false;
  }

  let step = this.replay.log[this.replay.step];
  if (!isNaN(step.t)) {
    this.startTime.setTime(new Date().getTime() - step.t);
    this.showTime();
  }
  let revertStep = step.revertStep;
  if (typeof revertStep != 'undefined') {
    while (revertStep < this.steps.length) {
      this.revertStep();
    }
  }
  if (typeof step.c != 'undefined') {
    if (!mergeWithNext()) {
      let element = this.getElementByCoordinate(step.c);
      if (element) {
        element.applyLogData(step.d);
        step.revertStep = this.steps.length;
      }
    }
  } else if (step.d == 'start') {
    this.clearAll();
    this.showClues(this.replay.clueData);
  } else if (step.d == 'solved') {
    var greenCircle = this.snap.circle(this.size.width/2, this.size.height/2, 0);
    greenCircle.attr({fill: "#009900", opacity: 0.5});
    var radius = Math.min(this.size.width/2, this.size.height/2);
    // Blinking animation
    var greenInterval = setInterval(() => {
        greenCircle.attr({r: 0});
        greenCircle.animate({r: radius}, 800);
      }, 800);
    // Remove animation after 5 sec.
    setTimeout(() => {greenCircle.remove(); clearInterval(greenInterval);}, 4000);
  } else if (typeof step.d.error != 'undefined') {
    if (Array.isArray(step.d.error.errors)) {
      this.showErrorCells(step.d.error);
    } else {
      var redCircle = this.snap.circle(this.size.width/2, this.size.height/2, 0);
      redCircle.attr({fill: "#990000", opacity: 0.5});
      var radius = Math.min(this.size.width/2, this.size.height/2);
      // Blinking animation
      var redInterval = setInterval(() => {
          redCircle.attr({r: 0});
          redCircle.animate({r: radius}, 800);
        }, 800);
      // Remove animation after 5 sec.
      setTimeout(() => {redCircle.remove(); clearInterval(redInterval);}, 4000);
    }
  }
  let nextStepNumber = this.replay.step + 1;
  if (nextStepNumber < this.replay.log.length) {
    this.replay.step = nextStepNumber;
    if (autoContinue) {
      this.replay.timeout = setTimeout(()=>self.replayStep(true), this.replay.log[nextStepNumber].t - step.t);
    }
  } else {
    this.stopTimer();
  }
}


//////////////////////////// virtual methods ////////////////////////
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
  // Expected return {width:, height:, unitSize:, baseThickness:}
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

basePuzzle.prototype.setTypeProperties = function(typeCode) {
  throw 'setTypeProperties is not implemented for ' + this.constructor.name + '!';
}

basePuzzle.prototype.getElementByCoordinate = function(coordinate) {
  throw 'getElementByCoordinate is not implemented for ' + this.constructor.name + '!';
}
