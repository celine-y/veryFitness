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

	if(!$scope.username){
		$location.path('/home');
	}

	var ref = firebase.database().ref().child('Workout');
	$scope.workouts = $firebaseArray(ref);

	$scope.createWorkout = function(){
		var workoutName = $scope.workout.exercise.titleTxt;
		var exerName = $scope.workout.exercise.exerTxt;
		var set = $scope.workout.exercise.setTxt;
		var rep = $scope.workout.exercise.repTxt;
		var link = $scope.workout.exercise.linkTxt;
		

		$scope.workouts.$add({
			workoutName: workoutName,
			exercise: {
				name: exerName,
				set: set,
				rep: rep,
				link: link
			}
		}).then(function(ref){
			console.log(ref);
			$scope.success = true;
			window.setTimeout(function() {
				$scope.$apply(function(){
					$scope.success = false;
				});
			}, 2000);
		}, function(error){
			console.log(error);
		});
	};

	$scope.exercises=[{id: 'exercise1'}];

	$scope.addExer = function (){
		console.log("addExer clicked");
		var newExerNum = $scope.exercises.length+1;
		$sccope.exercises.push({'id':'choice'+newExerNum});
	};

}]);
