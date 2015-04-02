var myTemplate = 
'<div class="snake-grid" ng-snake-keybind tabindex="1" >'+
  '<div class="snake-row" ng-repeat="row in grid"  >'+
    '<div class="snake-cell" ng-repeat="cell in row" ng-class="{\'snake-head\': cell.isSnakeSegment}"></div>'+
  '</div>'+
'</div>'

angular.module('ngSnake', []).
controller('ngSnakeCtrl', [
  '$scope', '$interval', 
  function($scope, $interval){

    var gridConfig = {
      width: 10,
      height: 10
    };

    $scope.gameStepTime = 500;

    var SnakeDirections = {
      north: 'north',
      east:  'east',
      south: 'south',
      west:  'west'
    }

    /******** CLASSES *******/
    function GridCell(){
      this.isSnakeHead = false;
      this.isSnakeTail = false;
      this.isWall = false;
    };

    function Snake(startingPosition, startingLength, startingDirection){
      this.segments = [ new SnakeSegment( startingPosition ) ];
      this.direction = startingDirection;
    }

    function SnakeSegment( position ){
      this.position = {
        x: position.x,
        y: position.y
      }
    }

    /***** ATTRIBUTES *******/
    $scope.grid = [];
    $scope.snake = null;
    $scope.gameLoopPromise = null;

    /***** FUNCTIONS *******/

    $scope.initGrid = function( gridConfig ){
      for( var i = 0; i < gridConfig.height; i++ ){
        var newRow = [];
        $scope.grid.push( newRow );
        for( var j = 0; j < gridConfig.width; j++ ){
          newRow.push( new GridCell() );
        }
      }
    };

    $scope.initSnake = function(){
      $scope.snake = new Snake( {x: 0, y: 0}, 0, SnakeDirections.east );
    }

    function stepUpDonsGame(){
      updateSnakePosition($scope.snake, false);
      //updateSnakeTail();
      //updateScore();
      updateGameState();
      updateGrid($scope.grid, $scope.snake);
    }

    function updateSnakePosition(snake, keepLast){

      var newPosition = {
        x: snake.segments[0].position.x,
        y: snake.segments[0].position.y
      }

      switch(snake.direction){
        case SnakeDirections.north:
          newPosition.y--;
          break;
        case SnakeDirections.east:
          newPosition.x++;
          break;
        case SnakeDirections.south:
          newPosition.y++;
          break;
        case SnakeDirections.west:
          newPosition.x--;
          break;
      }

      snake.segments.unshift( new SnakeSegment( newPosition ) );

      if( !keepLast )
        snake.segments.pop();
    }

    function resetGrid(grid){
      for( var i = 0; i < grid.length; i++ ){
        for( var j = 0; j < grid.length; j++ ){
          var cell = grid[i][j];
          cell.isSnakeSegment = false;
        }
      }
    }

    function updateGrid( grid, snake ){
      resetGrid(grid);
      for( var i = 0; i < grid.length; i++ ){
        for( var j = 0; j < grid.length; j++ ){
          var cell = grid[i][j];
          for( var k = 0; k < snake.segments.length; k ++){
            if( snake.segments[k].position.y == i && snake.segments[k].position.x == j )
              cell.isSnakeSegment = true;
          }
        }
      }
    }

    $scope.handleKeyPress = function(event){
      console.log('key pressed' + event.which);
      switch(event.which){
        case 65:
          $scope.snake.direction = SnakeDirections.west
          break;
        case 68:
          $scope.snake.direction = SnakeDirections.east;
          break;
        case 87:
          $scope.snake.direction = SnakeDirections.north;
          break;
        case 83:
          $scope.snake.direction = SnakeDirections.south;
          break;
        // case 16:
        //   toggleMoveFast();
        //   break;
      }
    }

    //detects if we've won, lost
    function updateGameState(){
      
    }

    $scope.startGameLoop = function(){
      
      if( $scope.gameLoopPromise != null ){
        $scope.stopGameLoop();
      }

      $scope.gameLoopPromise =  $interval(function(){
        stepUpDonsGame();
      }, $scope.gameStepTime);
    }
    
    $scope.stopGameLoop = function(){
      if( $scope.gameLoopPromise == null )
        return;
      $interval.cancel( $scope.gameLoopPromise );
      $scope.gameGameLoop = null;
    }

    /***** INIT *******/

    $scope.initGrid( gridConfig );
    $scope.initSnake();
    $scope.startGameLoop();

  }
]).
directive('ngSnake', [ function(){
  return {
      controller: 'ngSnakeCtrl',
      restrict: 'EA',
      template: myTemplate,
      link: function( scope, element, attributes ){
      },
  }
}
]).directive('ngSnakeKeybind', function($compile){
  return {
    link: function(scope, element, attrs){
      element.bind("keydown", function (event) {
        scope.handleKeyPress(event);
        event.preventDefault();
        event.stopPropagation();
      });
    }
  }
})
