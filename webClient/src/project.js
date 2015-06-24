'use strict';

angular.module('project', ['firebase', 'ngRoute'])
  .value('fbRoot', 'https://fb-shell.firebaseio.com/')
  .value('currentUser', 'mainMe')
  .service('rootRef', function(fbRoot, currentUser) {
    return new Firebase(fbRoot + 'users/' + currentUser + '/');
  })

  .config(['$routeProvider', function($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'loginView/login.html'
      })
      .when('/user/', {
        templateUrl: 'shellView/shell.html'
      })
      .otherwise({
        redirectTo: '/'
      });
  }])

  .controller('HistoryController', ['$firebaseArray', 'rootRef', function($firebaseArray, rootRef) {
    var machine = 'tester';
    var numLines = 12;

    var histRef = rootRef.child('/machines/' + machine + '/history/');
    this.commands = $firebaseArray(histRef.limitToLast(numLines));

    this.correctNewline = function(str) {
      return str.trim().split('\n');
    };
  }])
  .controller('CommandController', ['$firebaseArray', 'rootRef', function($firebaseArray, rootRef) {
    var machine = 'tester';
    var commandRef = rootRef.child('/machines/' + machine + '/commands/');
    var commandArray = $firebaseArray(commandRef);

    this.sendCommand = function() {
      commandArray.$add(this.newCommand);
      this.newCommand = '';
    };
  }]);
