angular.module('martina', ['ui.router', 'controllers', 'services'])

.config(function ($stateProvider, $urlRouterProvider) {

  $stateProvider

  .state('gallery', {
    url: '/gallery',
    views: {
      'nav': {
        templateUrl: 'partials/nav.html',
        controller: 'NavCtrl'
      },
      'content': {
        templateUrl: 'partials/gallery.html',
        controller: 'GalleryCtrl',
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

  .state('performance', {
    url: '/performance',
    views: {
      'nav': {
        templateUrl: 'partials/nav.html',
        controller: 'NavCtrl'
      },
      'content': {
        templateUrl: 'partials/performance.html',
        controller: 'PerformanceCtrl'
      }
    }
  })

  .state('contact', {
    url: '/contact',
    views: {
      'nav': {
        templateUrl: 'partials/nav.html',
        controller: 'NavCtrl'
      },
      'content': {
        templateUrl: 'partials/contact.html',
        controller: 'ContactCtrl'
      }
    }
  })


  $urlRouterProvider.otherwise('/gallery')

});
