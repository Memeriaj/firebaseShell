'use strict';

angular.module('project')
  .controller('LoginController', ['$scope', 'rootRef', '$location', function($scope, rootRef, $location) {
    $scope.signUp = false;

    $scope.attemptLogin = function() {
      var authCreds = {email: $scope.email, password: $scope.password};
      console.log(authCreds);
      if ($scope.signUp) {
        rootRef.createUser(authCreds, function(error, userData) {
          if (!error) {
            $scope.signUp = false;
          }
          $scope.email = '';
          $scope.password = '';
        });
      } else {
        rootRef.authWithPassword(authCreds, function(error, authData) {
          if (error) {
            $scope.password = '';
          } else {
            $location.path('/user/' + authData.uid).replace();
            $scope.$apply();
          }
        });
      }
    };
  }]);