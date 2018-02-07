'use strict';

angular.module('webApp.welcome', ['ngRoute', 'firebase'])

.config(['$routeProvider', function($routeProvider){
	$routeProvider.when('/welcome',{
		templateUrl: 'welcome/welcome.html',
		controller: 'WelcomeCtrl'
	});
}])

.filter('range', function() {
	return function(input, min, max) {
	  min = parseInt(min); //Make string input int
	  max = parseInt(max);
	  for (var i=min; i<=max; i++)
		input.push(i);
	  return input;
	};
})

.controller('WelcomeCtrl', ['$scope', 'CommonProp', '$firebaseArray', '$firebaseObject', '$location', function($scope, CommonProp, $firebaseArray, $firebaseObject, $location){
	$scope.username = CommonProp.getUser();

	if(!$scope.username){
		$location.path('/home');
	}

	var ref = firebase.database().ref().child('Workouts').orderByChild(CommonProp.getUID()).equalTo(true);
	$scope.workouts = $firebaseArray(ref);
	

	$scope.logout = function(){
		CommonProp.logoutUser();
	};
}])