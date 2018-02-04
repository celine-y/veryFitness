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

    console.log(workoutId);

	if(!$scope.username){
		$location.path('/home');
	}

    var exerRef = firebase.database().ref().child('Exercises');
    var workoutExRef = firebase.database().ref().child('Workout Exercises');
    $scope.exercises = $firebaseArray(exerRef);	
    $scope.workoutExs = $firebaseArray(workoutExRef);
    
    $scope.addExercise = function(){
        $scope.exercises.$add({
            name: $scope.exerTxt,
            link: $scope.linkTxt
        }).then(function(ref){
                       
            $scope.workoutExs.$add({
                exerciseId: ref.key,
                workoutIds: workoutId,
                sets: $scope.setTxt,
                reps: $scope.repTxt
            }).then(function(ref){
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
        }, function(error){
            console.log(error);
        });
    };
}])