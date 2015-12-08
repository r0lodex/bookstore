'use strict'
// Bookstore App
var BSA = angular.module('bookstore', [
    'ngRoute',
    'ngResource'
])

.constant('ENV', {
    API_EP: '../server',
    APP_TITLE: BOOKSTORE_TITLE
})

.run(function($rootScope){})