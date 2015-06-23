'use strict';

var Firebase = require('firebase');
var exec = require('child_process').exec;

var machineName = 'tester';
var machineFb = new Firebase('https://fb-shell.firebaseio.com/machines/' + machineName + '/');

var commandsFb = machineFb.child('commands');
var historyFb = machineFb.child('history');

function executeCommand(command, logFunction) {
  exec(command, logFunction(command));
}

function logToFirebase(command) {
  return function(error, stdout, stderr) {
    var toSend = {'command': command};
    if (error) {
      toSend.error = error;
    } else {
      toSend.stdout = stdout;
      toSend.stderr = stderr;
    }
    historyFb.push(toSend);
  };
}

commandsFb.on('child_added', function(snapshot, prevChildKey) {
  var command = snapshot.val();
  executeCommand(command, logToFirebase);
  snapshot.ref().remove();
});
