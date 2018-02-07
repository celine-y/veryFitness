'use strict';

angular.module('webApp.addExercises', ['ngRoute', 'firebase'])

.config(['$routeProvider', function($routeProvider){
	$routeProvider.when('/addWorkout/:id/addExercises',{
		templateUrl: 'addWorkout/addExercises/addExercises.html',
		controller: 'addExerCtrl'
	});
}])

.controller('addExerCtrl', ['$scope', 'CommonProp', '$firebaseArray', '$firebaseObject', '$location', '$routeParams', function($scope, CommonProp, $firebaseArray, $firebaseObject, $location, $routeParams){
	$scope.username = CommonProp.getUser();
    var workoutId = $routeParams.id;

	if(!$scope.username){
		$location.path('/home');
	}

    var exerRef = firebase.database().ref().child('Exercises').orderByChild(workoutId).equalTo(true);
    $scope.exercises = $firebaseArray(exerRef);    
    
    $scope.addExercise = function(){
        var exerciseToAdd = {};

        exerciseToAdd[workoutId] = true;
        exerciseToAdd['name'] = $scope.exerTxt;
        exerciseToAdd['link'] = $scope.linkTxt;
        exerciseToAdd['sets'] = $scope.setTxt;
        exerciseToAdd['reps'] = $scope.repTxt;

        $scope.exercises.$add(
            exerciseToAdd
        ).then(function(ref){
            $scope.success = true;
            // TODO: clear form after
            window.setTimeout(function(){
                $scope.$apply(function(){
                    $scope.success = false;
                });
            }, 2000);
        }, function(error){
            console.log(error);
        });
    };

    $scope.delExercise = function(exerciseId){
        $scope.exercises.$remove(exerciseId)
        .then(function(ref){

        }, function(error){
            console.log(error);
        });
    };
}])