'use strict';

angular.module('webApp.viewWorkouts', ['ngRoute', 'firebase'])

.config(['$routeProvider', function($routeProvider){
	$routeProvider.when('/view/workouts',{
		templateUrl: 'view/workouts.html',
		controller: 'viewWorkoutCtrl'
	});
}])

.controller('viewWorkoutCtrl', ['$scope', 'CommonProp', '$firebaseArray', '$firebaseObject', '$location', function($scope, CommonProp, $firebaseArray, $firebaseObject, $location){
	$scope.username = CommonProp.getUser();

	if(!$scope.username){
		$location.path('/home');
	}

	var ref = firebase.database().ref().child('Workouts').orderByChild(CommonProp.getUID()).equalTo(true);
	$scope.workouts = $firebaseArray(ref);

	$scope.editWorkout = function(id){
		var ref = firebase.database().ref().child('Workouts/' + id);
		$scope.editWorkoutData = $firebaseObject(ref);
	};

	$scope.updateWorkout = function(id){
		var ref = firebase.database().ref().child('Workouts/' + id);
		ref.update({
			name: $scope.editWorkoutData.name
		}).then(function(ref){
			$scope.$apply(function(){
				$("#editModal").modal('hide');
			});
		}, function(error){
			console.log(error);
		});
	};

	$scope.deleteCnf = function(workout){
		$scope.deleteWorkout = workout;
	};

	$scope.deletePost = function(deleteWorkout){
		$scope.workouts.$remove(deleteWorkout)
		.then(function(ref){
			
        }, function(error){
            console.log(error);
        });
		$("#deleteModal").modal('hide');
	};

	$scope.logout = function(){
		CommonProp.logoutUser();
	}
}])