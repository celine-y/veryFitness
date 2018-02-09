'use strict';

// Declare app level module which depends on views, and components
angular.module('veryFitness', [
  'ngRoute',
  'veryFitness.home',
  'veryFitness.register',
  'veryFitness.welcome',
  'veryFitness.addWorkout',
  'veryFitness.addExercises',
  'veryFitness.viewWorkouts'
]).
config(['$locationProvider', '$routeProvider', function($locationProvider, $routeProvider) {

  $routeProvider.otherwise({redirectTo: '/home'});
}]);
