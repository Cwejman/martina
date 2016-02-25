angular.module('martina', ['ui.router', 'controllers', 'services'])

.config(function ($stateProvider, $urlRouterProvider) {

  $stateProvider

  .state('home', {
    url: '/home',
    views: {
      'nav': {
        templateUrl: 'partials/nav.html',
        controller: 'NavCtrl'
      },
      'content': {
        templateUrl: 'partials/content.html',
        controller: 'HomeCtrl',
        resolve: {
          json: ["$http", function ($http) {
            return $http({url: "data/data.json"}).success(function (data) {
              return data
            })
          }]
        }
      }
    }
  })

  $urlRouterProvider.otherwise('/home')

});
