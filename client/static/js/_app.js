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

.run(function($rootScope){
    $rootScope.cartItems = []
    $rootScope.grandTotal = function() {
        var tot = { count: 0, total: 0 }
        if ($rootScope.cartItems.length) {
            $rootScope.cartItems.forEach(function(v) {
                if (v.items) {
                    v.items.forEach(function(bv) {
                        tot.total += bv.price * bv.qty
                        tot.count += bv.qty
                    })
                } else {
                    tot.total += v.price * v.qty
                    tot.count += v.qty
                }
            })
        }
        return tot;
    }
})

.config(function($routeProvider) {
    $routeProvider.when('/', {
        controller: 'shopCtrl',
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
.controller('shopCtrl', function($rootScope, $scope, Books) {
    $scope.books = Books.query(function(r) {
        // Hiding collapse items by default
        $scope.collapse = {}
        for (var i = 0; i <= r.packages.length-1; i++) {
            $scope.collapse[i] = true
        }
    })

    $scope.updatePackageDetail = function(books) {
        var tot = { price: 0, count: 0 }
        books.forEach(function(v,k) {
            if (v.checked) {
                tot.price += v.price * v.qty
                tot.count += v.qty
            }
        })
        return tot
    }

    $scope.addToCart = function(books) {
        var obj, add = true,
            checkdupes = function(origin, slave) {
                var dupe = true
                for (var i = origin.length - 1; i >= 0; i--) {
                    if (origin[i].id == slave.id) {
                        origin[i].qty += slave.qty
                        dupe = false
                        return false
                    }
                }
                return dupe
            }

        if ($.isArray(books)) {
            obj = []
            angular.copy(books, obj)
            obj.forEach(function(bv) {
                if (bv.checked) {
                    if ($rootScope.cartItems.length) {
                        add = checkdupes($rootScope.cartItems, bv)
                    }
                    if (add) $rootScope.cartItems.push(bv)
                }
            })
        } else {
            obj = {}
            angular.copy(books, obj)
            add = checkdupes($rootScope.cartItems, obj)
            if (add) $rootScope.cartItems.push(obj)
        }
        console.log($rootScope.cartItems)
    }
})