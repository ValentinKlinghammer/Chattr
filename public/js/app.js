var chattrApp = angular.module('chattrApp', ['Services']);

chattrApp.config(function($routeProvider) {
  $routeProvider.when('/', {
    templateUrl: 'partials/chat.html',
    controller: 'mainController',
  });
  $routeProvider.otherwise({redirectTo: '/'});
});

// --- mainController ---------------------------------------------------------
chattrApp.controller('mainController', function($scope, Socket) {
  $scope.messages = [];

  Socket.on('receive', function(message) {
    $scope.messages.push(message);
  });

  $scope.submit = function() {
    $scope.messages.push($scope.message);
    Socket.emit('send', $scope.message);
    $scope.message = '';
  };
});

// --- Socket Service ---------------------------------------------------------
angular.module('Services', []).factory('Socket', function($rootScope) {
    var socket = io.connect();
    return {
      on: function(eventName, callback) {
        socket.on(eventName, function() {
          var args = arguments;
          $rootScope.$apply(function() {
            callback.apply(socket, args);
          });
        });
      },
      emit: function(eventName, data, callback) {
        if(typeof data == 'function') {
          callback = data;
          data = {};
        }
        socket.emit(eventName, data, function() {
          var args = arguments;
          $rootScope.$apply(function() {
            if(callback) {
              callback.apply(socket, args);
            }
          });
        });
      },
    };
  });
