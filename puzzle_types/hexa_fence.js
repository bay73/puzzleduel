const util = require('./util');


const Checker = {
check:function(dimension, clues, data){
  // Create array
  var dim = util.parseDimension(dimension);
  var cells = [];
  var nodes = [];
  var edges = [];

  if (!data.edges){
    return {status: "There should be single loop without bifurcations"};
  }

  for (var y = 0; y < dim.rows + dim.cols - 1; y++) {
    cells[y] = new Array(2*dim.cols - 1);
    nodes[y] = new Array(2*dim.cols - 1);
    for (var x = 0; x < 2*dim.cols - 1; x++) {
      if (y - x < dim.rows && x - y < dim.cols) {
        cells[y][x] = {count: 0}
        nodes[y][x] = new Array(6);
        for (var i=0; i<6; i++){
          var node = Checker.getMainNodeName(x, y, i, dim);
          if (node.x==x && node.y==y && node.i==i) {
            nodes[y][x][i] = {edges: []}
          }
        }
      }
    }
  }

  for (const [key, value] of Object.entries(clues)) {
    var x = key.charCodeAt(0) - 'a'.charCodeAt(0);
    var y = parseInt(key.substring(1)) - 1;
    if (cells[y] && cells[y][x]) {
      cells[y][x].text = value;
    }
  }

  var startNode = null;
  for (const [key, value] of Object.entries(data.edges)) {
    var coord = key.split("-")
    var x = coord[0].charCodeAt(0) - 'a'.charCodeAt(0);
    var y = parseInt(coord[0].substring(1)) - 1;
    var s = parseInt(coord[1]);
    if (s>=0 && s<6 && x>=0 && x<2*dim.cols-1 && y>=0 && y<dim.rows+dim.cols-1 && y-x<dim.rows && x-y<dim.cols) {
      var edge = {used: false, nodes:[]};
      Checker.getEdgeCells(x,y,s,dim).forEach(cell => cells[cell.y][cell.x].count++);
      Checker.getEdgeNodes(x,y,s,dim).forEach(node => {
        startNode = nodes[node.y][node.x][node.i];
        nodes[node.y][node.x][node.i].edges.push(edge);
        edge.nodes.push(nodes[node.y][node.x][node.i]);
      });
      edges.push(edge);
    }  
  }

  var prevNode = startNode;
  var prevEdge = startNode.edges[0];
  var nextNode = null;
  while (nextNode != startNode) {
    if (prevNode.edges.length != 2) {
      return {status: "There should be single loop without bifurcations"};
    }
    var nextEdge = prevEdge == prevNode.edges[0] ? prevNode.edges[1] : prevNode.edges[0];
    nextEdge.used = true;
    nextNode = prevNode==nextEdge.nodes[0] ? nextEdge.nodes[1] : nextEdge.nodes[0];
    prevEdge = nextEdge;
    prevNode = nextNode;
  }
  
  for (var e = 0; e < edges.length; e++) {
    if (!edges[e].used) {
      return {status: "There should be single loop without bifurcations"};
    }
  }
  
  for (var y = 0; y < dim.rows + dim.cols - 1; y++) {
    for (var x = 0; x < 2*dim.cols - 1; x++) {
      if (y - x < dim.rows && x - y < dim.cols) {
        if (typeof cells[y][x].text != "undefined" && cells[y][x].count.toString() != cells[y][x].text) {
          return {status: "The clue is not correct" , errors: [util.coord(x,y)]};
        }
      }
    }
  }
  
  return {status: "OK"};
},
getMainNodeName: function(x, y, i, dim){
  if (i==0) {
    if (x>0 && y>0) return {x: x-1, y:y-1, i: 2};
    else if (x==0 && y>0) return {x: x, y:y-1, i: 4};
  } else if (i==1) {
    if (y>0 && x-y<dim.cols-1) return {x: x, y:y-1, i: 3};
  } else if (i==4) {
    if (x>0 && y-x<dim.rows-1) return {x: x-1, y:y, i: 2};
  } else if (i==5) {
    if (x>0 && y>0) return {x: x-1, y:y-1, i: 3};
    else if (x>0 && y==0) return {x: x-1, y:y, i: 1};
  }
  return {x:x, y:y, i:i};
},
getEdgeCells: function(x, y, i, dim){
  var cells = [{x:x, y:y}];
  if (i==0 && y>0 && x-y<dim.cols-1) {
    cells.push({x:x, y:y-1});
  } else if (i==1 && x<2*dim.cols-2 && x-y<dim.cols-1) {
    cells.push({x:x+1, y:y});
  } else if (i==2 && x<2*dim.cols-2 && y<dim.rows+dim.cols-2) {
    cells.push({x:x+1, y:y+1});
  } else if (i==3 && y<dim.rows+dim.cols-2 && y-x<dim.rows-1) {
    cells.push({x:x, y:y+1});
  } else if (i==4 && x>0 && y-x<dim.rows-1) {
    cells.push({x:x-1, y:y});
  } else if (i==5 && x>0 && y>0) {
    cells.push({x:x-1, y:y-1});
  }
  return cells;
},
getEdgeNodes: function(x, y, i, dim){
  return [Checker.getMainNodeName(x,y,i,dim), Checker.getMainNodeName(x,y,(i+1)%6,dim)];
}
};

module.exports = Checker;
