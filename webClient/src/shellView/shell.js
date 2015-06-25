'use strict';

angular.module('project')
  .controller('MachineController', ['$firebaseArray', 'rootRef', '$routeParams', function($firebaseArray, rootRef, $routeParams) {
    this.machineRef = rootRef.child('/users/' + $routeParams.uid + '/machines/');
    this.machineArray = $firebaseArray(this.machineRef);
  }])

  .controller('ShellController', ['$scope', '$firebaseArray', function($scope, $firebaseArray) {
    var numLines = 10;
    var commandArray = [];

    $scope.intialize = function(mn, machineRef) {
      var mainRef = machineRef.child(mn);

      var histRef = mainRef.child('/history/');
      $scope.commands = $firebaseArray(histRef.limitToLast(numLines));

      var commandRef = mainRef.child('/commands/');
      commandArray = $firebaseArray(commandRef);
    };

    $scope.generateOutput = function(line) {
      if (line.error) {
        return ['ERROR: code ' + line.error.code];
      }
      return line.stdout.trim().split('\n');
    };

    $scope.sendCommand = function() {
      commandArray.$add($scope.newCommand);
      $scope.newCommand = '';
      return;
    };

    var curPrevCount = 0;
    $scope.previousCommand = function() {
      var curLen = $scope.commands.length;
      if (curPrevCount < 1 || curPrevCount > curLen ||
        $scope.newCommand !== $scope.commands[curLen - curPrevCount].command) {
        curPrevCount = 0;
      }
      curPrevCount++;
      $scope.newCommand = $scope.commands[curLen - curPrevCount].command;
      return;
    };
  }])

  .directive('tabs', function() {
    return {
      restrict: 'E',
      transclude: true,
      scope: {},
      controller: function($scope, $element) {
        var panes = $scope.panes = [];
 
        $scope.select = function(pane) {
          angular.forEach(panes, function(pane) {
            pane.selected = false;
          });
          pane.selected = true;
        }
 
        this.addPane = function(pane) {
          if (panes.length == 0) $scope.select(pane);
          panes.push(pane);
        }
      },
      templateUrl: 'shellView/tabs.html',
      replace: true
    };
  })
 
  .directive('pane', function() {
    return {
      require: '^tabs',
      restrict: 'E',
      transclude: true,
      scope: { title: '@' },
      link: function(scope, element, attrs, tabsController) {
        tabsController.addPane(scope);
      },
      template:
        '<div class="tab-pane" ng-class="{active: selected}" ng-transclude>' +
        '</div>',
      replace: true
    };
  });