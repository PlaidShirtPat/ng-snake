angular.module('ngSnake', []).
controller('ngSnakeCtrl', [
    '$scope', '$interval',
    function(
      $scope, $interval
    ){

      /*** CONFIG ***/
      // $scope.status = "TEST";
      $scope.grid = [];
      $scope.gridSize = {x: 40, y: 40};
      // how much the snake grows when it eats 
      $scope.snakeGrowth = {value: 1};
      // the time between game steps
      $scope.stepTime = {value: 100};

      $scope.gameStatuses = {
        lost: 'lost',
        paused: 'paused',
        setup: 'setup',
        running: 'running',
      }
      $scope.gameStatus = $scope.gameStatuses.setup;


      /*** CLASSES ***/
      function SnakeCell(){
        return {
          isSnakeHead: false,
          isSnakeBody: false,
          isWall: false,
          isGoal: false,
        };
      }

      function Snake(x, y){
        return {
          head: {x: x, y:y}, 
          tail: []
        };
      };
      
      function SnakeTailSegment(x, y){
        return {x: x, y: y};
      };

      /******* MOVEMENT ********/
      $scope.snakeDirection = { north: false, east: false, south: false, west: false};
      $scope.snakeMoveFast = {value: true}
      $scope.snake = null;
      function clearDirection(){
        $scope.snakeDirection.north = false;
        $scope.snakeDirection.east = false;
        $scope.snakeDirection.south = false;
        $scope.snakeDirection.west = false;
      };

      function moveNorth(){
        clearDirection();
        $scope.snakeDirection.north = true;
      };

      function moveEast(){
        clearDirection();
        $scope.snakeDirection.east = true;
      };

      function moveSouth(){
        clearDirection();
        $scope.snakeDirection.south = true;
      };

      function moveWest(){
        clearDirection();
        $scope.snakeDirection.west = true;
      };

      function toggleMoveFast(){
        $scope.snakeMoveFast.value = !$scope.snakeMoveFast.value;
      };

      /******* DRIVER FUNCTIONS ********/
      function clearSnakeFromBoard(){
        var grid = $scope.grid;
        for(i=0; i<grid.length; i++){
          for(j=0; j<grid[i].length; j++){
            grid[i][j].isSnakeHead = false;
            grid[i][j].isSnakeBody = false;
          }
        }
      };
      function updateSnakeCoords(){
        if($scope.snakeDirection.north){
          $scope.snake.head.y -= 1;
        } else if($scope.snakeDirection.east){
          $scope.snake.head.x += 1;
        } else if($scope.snakeDirection.south){
          $scope.snake.head.y += 1;
        } else if($scope.snakeDirection.west){
          $scope.snake.head.x -= 1;
        }
      };

      function updateSnakePosition(){
        clearSnakeFromBoard();
        updateSnakeCoords();
      };

      function updateGrid(){
        $scope.grid[$scope.snake.head.y][$scope.snake.head.x].isSnakeHead = true;
      }

      function updateSnakeStatus(){
        headCoords = $scope.snake.head;
        if( headCoords.y >= $scope.gridSize.y || headCoords.x >= $scope.gridSize.x || 
            headCoords.y < 0 || headCoords.x < 0 ){
          $scope.gameStatus = $scope.gameStatuses.lost;
        }
      };

      function gameLost(){
        $scope.status = "You died";
        stopGameLoop();
      };
      
      function updateState(){
        updateSnakePosition();
        updateSnakeStatus();
        switch($scope.gameStatus){
          case $scope.gameStatuses.running:
            updateGrid();
            break;
          case $scope.gameStatuses.lost:
            gameLost();
            break;
        }
      };

      /******* EVENTS ********/
      $scope.handleKeyPress = function(event){
        console.log('key pressed' + event.which);
        switch(event.which){
          case 65:
            moveWest();
            break;
          case 68:
            moveEast();
            break;
          case 87:
            moveNorth();
            break;
          case 83:
            moveSouth();
            break;
          case 16:
            toggleMoveFast();
            break;
        }
      }
      
      /******* INIT ********/
      function initGrid(){
        for(i=0; i<$scope.gridSize.y; i++){
          var newRow = []
          for(j=0; j<$scope.gridSize.x; j++){
            newRow.push(SnakeCell());
          }
          $scope.grid.push(newRow);
        }
      }

      function initSnake(){
        $scope.snake = Snake(1, 1);
      };
      
      function stopGameLoop(){
        $interval.cancel($scope.gameLoopObject);
      };

      function startGameLoop(){
        $scope.gameStatus = $scope.gameStatuses.running;
        $scope.gameLoopObject =  $interval(function(){
          updateState();
        }, $scope.stepTime.value);
      };

      function restartGame(){
        initSnake();
        clearDirection();
        startGameLoop();
      }
      $scope.restartGame = restartGame;

      initGrid();
      restartGame();
    }
]).
//this directive just instantiates the snake controller with params
directive('ngSnake', function($compile){
  return {
    restrict: "EA",
    template: 
    '<div ng-controller="ngSnakeCtrl">' +
      '<h4> {{status}} </h4>'+
      '<h4> Points: {{snake.tail.length}} </h4>'+
      '<button ng-if="gameStatus == gameStatuses.lost" ng-click="restartGame()">Restart</button>' +
      '<div class="snake-grid" ng-snake-keybind tabindex="1">'+
        '<div class="snake-row" ng-repeat="row in grid">'+
          '<div class="snake-cell" ng-repeat="cell in row" ng-class="{\'snake-head\': cell.isSnakeHead}"></td>'+
        '</div>'+
      '</div>'+
    '</div>',
    link: function(scope, element, attrs){
      $compile(angular.element(element).contents())(scope);
    },
  };
}).
directive('ngSnakeKeybind', function($compile){
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
