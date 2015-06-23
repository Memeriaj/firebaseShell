'use strict';

var Firebase = require('firebase');
var exec = require('child_process').exec;

var machineName = 'tester';
var machineFb = new Firebase('https://fb-shell.firebaseio.com/machines/' + machineName + '/');

var commandsFb = machineFb.child('commands');
var historyFb = machineFb.child('history');

function executeCommand(command, logFunction) {
  console.log('command: ' + command);
  exec(command, logFunction);
};

function logToFirebase(error, stdout, stderr) {
  console.log('error: ' + error);
  console.log('stdout: ' + stdout);
  console.log('stderr: ' + stderr);
  if (error){
    historyFb.push({"error": error});
  } else{
    historyFb.push({"stdout": stdout, "stderr": stderr});
  }
};

commandsFb.on('child_added', function(snapshot, prevChildKey) {
  var command = snapshot.val();
  executeCommand(command, logToFirebase);
});
