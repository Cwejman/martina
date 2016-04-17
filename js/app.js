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
        resolve: {
          json: ["$http", function ($http) {
            return $http({url: "data/about.json"}).success(function (data) {
              return data
            })
          }]
        }
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

  .state('lightroom', {
    url: '/lightroom:image',
    views: {
      'nav': {
        templateUrl: 'partials/lightroomNav.html',
        controller: 'NavCtrl'
      },
      'content': {
        templateUrl: 'partials/lightroom.html',
        controller: 'LightroomCtrl',
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


  $urlRouterProvider.otherwise('/gallery')

});
