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
            return $http({url: "data/gallery.json"}).success(function (data) {
              return data
            })
          }]
        }
      }
    }
  })

  .state('about', {
    url: '/about',
    views: {
      'nav': {
        templateUrl: 'partials/nav.html',
        controller: 'NavCtrl'
      },
      'content': {
        templateUrl: 'partials/about.html',
        controller: 'AboutCtrl',
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
