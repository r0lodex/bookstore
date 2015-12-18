'use strict'
// Bookstore App
var BSA = angular.module('bookstore', [
    'ngRoute',
    'ngResource',
    'ngAnimate',
    'ui.bootstrap',
    'ui-notification'
])

.constant('ENV', {
    API_EP: '/api',
    APP_TITLE: BOOKSTORE_TITLE,
})

.run(function($rootScope, $location){
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

    $rootScope.qtymod = function(book, add) {
        if (add) {
            book.qty = book.qty + 1
        } else {
            book.qty = (book.qty > 1) ? book.qty - 1 : book.qty
        }
    }

    $rootScope.removeFromCart = function(item) {
        var index = $rootScope.cartItems.indexOf(item);
        $rootScope.cartItems.splice(index, 1);
    }

    $rootScope.$on('$routeChangeSuccess', function () {
        $rootScope.currentPath = $location.path();
    });
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

.config(function(NotificationProvider) {
    NotificationProvider.setOptions({
        startTop: 40,
        positionX: 'right',
        positionY: 'top'
    });
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
.controller('shopCtrl', function($rootScope, $scope, Books, Notification) {
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

    $scope.addToCart = function(books, _package) {
        var obj, add = true, msg = '',
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
            var jumlah = 0
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
            msg = _package.title + ' diambil.'
        } else {
            obj = {}
            angular.copy(books, obj)
            add = checkdupes($rootScope.cartItems, obj)
            if (add) {
                msg = obj.qty + 'x ' + obj.title + ' diambil.'
                $rootScope.cartItems.push(obj)
            } else {
                msg = 'Kuantiti untuk ' + obj.title + ' ditambah ' + obj.qty
            }
        }
        Notification(msg)
    }
})

.controller('bayarCtrl', function($scope) {})