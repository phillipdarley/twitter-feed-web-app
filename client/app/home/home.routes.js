var homeTemplateUrl = 'home.html';

function homeRoute($stateProvider) {
    var homeState = {
        name: 'home',
        url: '/',
        template: '<h1>hello world</h1>'
    }
    $stateProvider.state(homeState);
}
homeRoute.$inject = ['$stateProvider'];