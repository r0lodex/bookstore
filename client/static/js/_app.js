'use strict'
// Bookstore App
var BSA = angular.module('bookstore', [
    'ngRoute',
    'ngResource',
    'ngAnimate',
    'ui.bootstrap'
])

.constant('ENV', {
    API_EP: '/api',
    APP_TITLE: BOOKSTORE_TITLE
})

.run(function($rootScope){})

.config(function($routeProvider) {
    $routeProvider.when('/', {
        controller: 'pilihCtrl',
        templateUrl: '/templates/shop/index.html',
    });

    $routeProvider.when('/bayar/:query?', {
        controller: 'bayarCtrl',
        templateUrl: '/templates/shop/bayar.html',
    });

    $routeProvider.otherwise({ redirectTo: '/' });
})

// FACTORIES
// =======================================
.factory('Books', function($resource, ENV) {
    return $resource('/fixtures.json', {}, {
        query: { method: 'GET', isArray: false }
    })
})

// CONTROLLERS
// =======================================
.controller('pilihCtrl', function($scope, Books) {
    $scope.books = Books.query(function(r) {
        // Hiding collapse items by default
        $scope.collapse = {}
        for (var i = 0; i <= r.packages.length-1; i++) {
            $scope.collapse[i] = true
        }
    })
})