# How to Create new puzzle type #

## 1. Setup puzzle UI ##

To set up a UI, the description of the new type should be added to the corresponding js file.

There are 4 puzzle categories (and js files):

*  _General square puzzles_ - grids having square cells (`squarepuzzle.js`)
*  _Area division square puzzles_ - grids with square cells which allow to using "connectors" to determine areas while solving (`areapuzzle.js`)
*  _Classic sudoku grids_ - grids having Standard sudoku areas - 6x6, 8x8, 9x9 (`sudokupuzzle.js`) 
*  _General hexagonal grids_ - grids with hexagonal cells (`hexapuzzle.js`)

New puzzle categories also can be added, but this requires more coding.

Each of the files above contains an array of type definitions. See the corresponding section below about the fields on this definition.

## 2. Implement solution checker ##

Solution check is executed at the server side and checks that, solution data provided by the user corresponds to puzzle rules and given clues.

The checker is a separate node module located in puzzle_types directory which should export an object which has check function accepting three parameters

1. String **dimensions** - the string contains three elements
   *  number of rows
   *  number of columns separated with "x" from number of rows
   *  optional additional data separated with "-" from the number of columns. Meaning of this part depends on the puzzle type. This can be a list of allowed letters (for example "Easy as ABC" puzzle), list of allowed elements ("Pentomino" puzzle) and so on.
2. JSON object **clueData**
3. JSON object **solutionData**

And returns an object with two fields

1. String **status** "OK" if solution is correct, user visible message if it's wrong
2. Array **errorList** list of coordinate of cells which should be marked in the grid to show where the solution is incorrect

## 3. Test locally ##

To test locally files _localedit.html_ and _localrun.html_ can be used. It allows to set puzzle type, dimension, grid data and specify js file which is used for rendering.

**localedit.html** allows you to see how the author's UI is working. Save button dumps the clue data to a console.

**localrun.hrml** shows solving UI. Check button runs the corresponding checker.

## 4. Add type to the storage ##

New puzzle type should be registered in the database collection puzzletypes:

## 5. Test on server ##

After adding a new type to the storage collection it appears at the author's page. Run server with new changes in js files and test the new puzzle created correctly and can be solved. 

## 6. Add localization ##

While testing on the server it automatically adds error messages to localization files which are located in locales directory. Error messages should be translated to corresponding languages.

## 7. Create example puzzle with the answer image ##

An example puzzle has to be created for the new puzzle type. This can be done the same way as adding a regular puzzle using the author's page. Put estimated solving difficulty in seconds for the puzzle. The puzzle id should be put to the `example.puzzleId` field of the puzzle type.

The puzzle should be solved and the answer image captured (preferable without additional marks in it) and saved into `/images/answers` directory. Then the puzzle should be found in the storage collection. Field `tag` should be set to _‘example’_, field `answerImg` should be set to the path of answer image like _‘/images/answers/puzzleid.png’_

## 8. Commit everything and deploy ##

All changes in local files should be committed this includes:

*  type UI description in `js/` directory
*  type checker in `puzzle_types/` directory
*  example answer image in `images/answers/`
*  localization files in `locales/` directory

# Puzzle type UI definition #

Grids contains the next elements:

*  _Cells_
   *  _Outer cells_ - currently only bottom and right outer cells are supported
*  _Edges_
*  _Nodes_
*  _Connectors_ - lines which connect centers of the cells.

Each element can have next properties (can be used simultaneously):

*  _Color_ - background color for the cell, color of the line for edges and connectors, color of a small circle for nodes.
*  _Image_ - some picture which is shown at the element (for edges it is shown at the middle point of the edge). This is not supported for connectors.
*  _Text_ - one or two symbols (letters so digits) which are shown at the element (for edges it is shown at the middle). This is not supported for connectors.

Puzzle type UI definition contains the next properties (all are optional)

*  boolean **needNodes** (default false) - should nodes be created. Required if nodes should change property or used as a drag start point when drawing edges.
*  boolean **needConnectors** (default false) - should connectors be created
*  boolean **thickEdges** (default false) - should edges be drawin with thick lines (needed for fence puzzles)
*  boolean **outerEdges** (default true) - should outer grid edges be drawn bold
*  boolean **collectAreas** (default false) - collect list of areas which formed by thick edges
*  boolean **cellMultiPencil** (default false) - allows multiple pencil marks for a cell (as in sudokus)
*  boolean **usePlus10** (default false) - use +10 element in the value chooser
*  function **cellController** - function which creates controls for a cell in solving mode
*  function **cellEditController** - function which creates controls for a cell in editing mode
*  function **edgeController** - function which creates controls for an edge in solving mode
*  function **edgeEditController** - function which creates controls for an edge in editing mode
*  function **nodeController** - function which creates controls for a node in solving mode
*  function **nodeEditController** - function which creates controls for a node in editing mode
*  function **connectorController** - function which creates controls for a connector in solving mode
*  function **decodeClue**

# Puzzle types collection in storage #

Database contains collection puzzletypes which has the following attributes

*  _code_ - unique code for the puzzle type
*  _name_ - user visible name of the type
*  _rules_ - English text for puzzle rules (can include tags, which are replaced by puzzle dimension data - see rules tags section)
*  _gridControl_ - English text explaining which user action can be provided for the grid
*  _puzzleJs_ - name of .js file containing UI description
*  _puzzleObj_ - name of javascript object in the file which renders the type
*  _translation_ - object containing translations to different languages
   *  _language code_ - ru for Russian language
      *  _rules_ - translated text for puzzle rules
      *  _gridControl_ - translated test for grid control description
*  _example_ - object describing example puzzle for the type
   *  _puzzleId_ - code of the example puzzle
*  _properties_ - object containing additional properties describing type behavior
   *  _squared_ - the grid is squares (authors page shows only one dimension)
   *  _rows_ - number of rows is fixed (authors page hides this field)
   *  _cols_ - number of columns is fixed (authors page hides this field)
   *  _needQuantity_ - authors page should show a field to define “quantity” attribute
   *  _needLetters_ - authors page should show a field to define “letter” attribute
   *  _needPentoset_ - authors page should show a field to define used pentomino/tetromino set
   *  _needShipset_ - authors page should show a field to define used battleships set
   *  _figuresAttribute - solvers page should show the element with a figure set for the puzzle (battleships, pentomino and so on). The property can include tag which are replaced by puzzle dimension data - see rules tags section
   *  _activationDate_ - date when puzzle type becomes visible for regular users

# Rules tags #

Rules (gridControl and figureAttribute) text can contain tags which are replaced by dimension properties. Tag is surrounded by brackets “{“ and “}” and can contain a javascript expression which is evaluated for each specific puzzle. The expression can refer the next variables:

*  _dimensions_ - the string containing rows and columns numbers divided by “x” (for example, 5x7)
*  _rows_ - integer number of rows
*  _columns_ - integer number of column
*  _quantity_ - value from the quantity attribute
*  _letters_ - array of letters

Examples of valid tags:

*  `{rows-2}` - used for double block and fuzili puzzle
*  `{letters}` - list of available letters in the puzzle
*  `{quantity=="pento12"?"pento12":("pento\" set=\""+quantity)}` - used for pentomino puzzles

