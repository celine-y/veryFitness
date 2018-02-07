'use strict';

angular.module('webApp.addWorkout', ['ngRoute', 'firebase'])

.config(['$routeProvider', function($routeProvider){
	$routeProvider.when('/addWorkout', {
		templateUrl: 'addWorkout/addWorkout.html',
		controller: 'addWorkoutCtrl'
	});
}])

.controller('addWorkoutCtrl', ['$scope', '$firebaseArray', '$location', 'CommonProp', function($scope, $firebaseArray, $location, CommonProp){

	$scope.username = CommonProp.getUser();

	var workoutsRef = firebase.database().ref().child('Workouts');
	$scope.workouts = $firebaseArray(workoutsRef);

	if(!$scope.username){
		$location.path('/home');
	}

	$scope.createWorkout = function(){
		var workoutName = $scope.workout.titleTxt;

		$scope.workouts.$add({
			name: workoutName
		}).then(function(ref){
			$scope.success = true;
			window.setTimeout(function(){
				$scope.$apply(function(){
					$scope.success = false;
				});
			}, 2000);
			$location.path('/addWorkout/'+ref.key+'/addExercises');
		}, function(error){
			console.log(error);
		});
	};

	$scope.logout = function(){
		CommonProp.logoutUser();
	}
}]);
