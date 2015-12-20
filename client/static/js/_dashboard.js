'use strict'
// Bookstore App
var dashboard = angular.module('dashboard', [
    'ngRoute',
    'ngResource',
    'ngAnimate',
    'ui.bootstrap',
    'ui-notification'
])

.config(function($routeProvider) {
    $routeProvider.when('/', {
        controller: 'homeCtrl',
        templateUrl: '/templates/admin/home.html',
    });

    $routeProvider.when('/order', {
        controller: 'orderCtrl',
        templateUrl: '/templates/admin/order.html',
    });

    $routeProvider.when('/inventori', {
        controller: 'inventoriCtrl',
        templateUrl: '/templates/admin/inventori.html',
    });

    $routeProvider.when('/pengguna', {
        controller: 'penggunaCtrl',
        templateUrl: '/templates/admin/pengguna.html',
    });

    $routeProvider.otherwise({ redirectTo: '/' });
})

.config(function(NotificationProvider) {
    NotificationProvider.setOptions({
        startTop: 40,
        positionX: 'right',
        positionY: 'top'
    });
})

.run(function($rootScope, $location) {
    $rootScope.$on('$routeChangeSuccess', function () {
        $rootScope.currentPath = $location.path();
    });
})

.controller('homeCtrl', function($scope) {})
.controller('orderCtrl', function($scope) {})
.controller('inventoriCtrl', function($scope) {})
.controller('penggunaCtrl', function($scope) {})