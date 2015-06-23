'use strict';

angular.module('project', ['firebase'])
  .value('fbRoot', 'https://fb-shell.firebaseio.com/')
  .service('rootRef', function(fbRoot) {
    return new Firebase(fbRoot);
  })
  .controller('HistoryController', ['$firebaseArray', 'rootRef', function($firebaseArray, rootRef) {
    var machine = 'tester';
    var numLines = 12;

    var histRef = rootRef.child('/machines/' + machine + '/history/');
    this.commands = $firebaseArray(histRef.limitToLast(numLines));
  }]);
