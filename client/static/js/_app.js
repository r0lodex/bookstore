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
    APP_TITLE: BOOKSTORE_TITLE,
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
            $scope.collapse[i] = false
        }
    })

    $scope.updatePackageTotal = function(books, checked) {
        var tot = 0
        books.forEach(function(v,k) {
            tot += v.price * v.qty
        })
        return tot
    }

    var cartItems = []
    $scope.addToCart = function(books) {
        var arr = []
        angular.copy(books, arr) // Make copies!
        arr.forEach(function(bv) {
            if (bv.checked) {
                var add = true
                if (cartItems.length) {
                    for (var i = cartItems.length - 1; i >= 0; i--) {
                        if (cartItems[i].id == bv.id) {
                            add = false
                            cartItems[i].qty += bv.qty
                            return false
                        }
                    }
                }
                if (add) {
                    cartItems.push(bv)
                }
            }
        })
        console.log(JSON.stringify(cartItems))
    }
})