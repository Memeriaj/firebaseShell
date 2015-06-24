'use strict';

var Firebase = require('firebase');
var email;
var password;
var machineName;
if (process.argv.length !== 5){
  console.log('Useage: node index.js <email> <password> <machine name>');
  return;
} else {
  email = process.argv[2];
  password = process.argv[3];
  machineName = process.argv[4];
}

var rootRef = new Firebase('https://fb-shell.firebaseio.com');
rootRef.authWithPassword({email: email, password: password}, function(error, authData) {
  if (error){
    console.log('Error authenticating:');
    console.log(error);
    process.exit(1);
  }
  var exec = require('child_process').exec;

  var username = authData.uid;
  var machineFb = rootRef.child('/users/' + username + '/machines/' + machineName + '/');

  machineFb.child('exists').once('value', function(snapshot) {
    if (!snapshot.exists()) {
      snapshot.ref().set(true);
    }
  });

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
});
