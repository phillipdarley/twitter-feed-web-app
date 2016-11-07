angular.module('app.home', ['ui.router'])
    .config(homeRoute)
    .controller('homeController', homeController);

function homeController() {
    console.log('hi');
}