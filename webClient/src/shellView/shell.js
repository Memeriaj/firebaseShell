'use strict';

angular.module('project')
  .controller('ShellController', ['$firebaseArray', 'rootRef', '$routeParams', function($firebaseArray, rootRef, $routeParams) {
    var userId = $routeParams.uid;
    var machine = 'desktop';
    var numLines = 12;

    var mainRef = rootRef.child('/users/' + userId + '/machines/' + machine);

    var histRef = mainRef.child('/history/');
    this.commands = $firebaseArray(histRef.limitToLast(numLines));

    var commandRef = mainRef.child('/commands/');
    var commandArray = $firebaseArray(commandRef);

    this.correctNewline = function(str) {
      return str.trim().split('\n');
    };

    this.sendCommand = function() {
      commandArray.$add(this.newCommand);
      this.newCommand = '';
    };
  }]);