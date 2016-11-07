(function () {
    'use strict'

    angular.module('app', ['ui.router', 'app.home'])
        .config(function ($locationProvider, $urlRouterProvider) {
            $locationProvider.html5Mode(true).hashPrefix('!');
            $urlRouterProvider.otherwise('/home');

        });

})();