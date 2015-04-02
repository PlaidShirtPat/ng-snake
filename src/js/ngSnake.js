var myTemplate = 
'<div class="snake-grid" tabindex="1">'+
  '<div class="snake-row" ng-repeat="row in grid">'+
    '<div class="snake-cell" ng-repeat="cell in row" ></div>'+
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

    var gameStepTime = 50;

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
      this.headPosition = {
        x: startingPosition.x,
        y: startingPosition.y
      }

      this.segments = [ new SnakeSegment( startingPosition ) ];
      this.direction = startingDirection;
    }

    function SnakeSegment( position ){
      this.position = {
        x: 0,
        y: 0
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
      updateSnakePostion($scope.snake, false);
      //updateSnakeTail();
      //updateScore();
      updateGameState();
      updateGrid($scope.grid);
    }

    function updateSnakePosition(snake, keepLast){

      var newPosition = {
        x: snake.segements[0].x
        x: snake.segements[0].y
      }

      switch(snake.direction){
        case SnakeDirections.north:
          newPosition.position.y--;
          break;
        case SnakeDirections.east:
          newPosition.position.x--;
          break;
        case SnakeDirections.south:
          newPosition.position.y++;
          break;
        case SnakeDirections.west:
          newPosition.position.x++;
          break;
      }

      snake.segements.shift( new SnakeSegment( newPosition ); )

      if( !keepLast )
        snake.segments.pop();
    }

    function resetGrid(grid){
      for( var i = 0; i < grid.length; i++ ){
        for( var j = 0; j < grid.length; j++ ){
          var cell = grid[i][j];
          cell.isSnakeHead = false;
          cell.isSnakeTail = false;
        }
      }
    }

    function updateGrid( grid, snake ){
      resetGrid(grid);
      for( var i = 0; i < grid.length; i++ ){
        for( var j = 0; j < grid.length; j++ ){
          var cell = grid[i][j];
          if( i == snake.position.y && j == snake.position.x ){
            cell.isSnakeHead = true;
          }
          for( tailSegment in snake.tail ){
            if( tailSegment.position.y == i tailSegment.position.x == j )
              cell.isSnakeTail = true;
          }
        }
      }
    }

    //detects if we've won, lost
    function updateGameState(){
      
    }

    $scope.startGameLoop = function(){
      if( $scope.gameLoopPromise != null ){
        $interval(function(){
          stepUpDonsGame();
        }, 50);
      }
    }
    
    $scope.stopGameLoop = function(){
      if( $scope.gameLoopPromise == null )
        return;
      $interval.cancel( $scope.gameLoopPromise );
    }

    /***** INIT *******/

    $scope.initGrid( gridConfig );
    $scope.initSnake();

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
])
