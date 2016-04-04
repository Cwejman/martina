angular.module('controllers', [])

.controller('NavCtrl', function ($scope, $state) {

  $scope.state = $state.current.name

})

.controller('GalleryCtrl', function ($scope, json, responsive) {

  var data = json.data
  var width = 200
  var max = 5
  var resizeTimer

  $scope.resolution = 0

  $scope.columns = function () {
    console.log($scope.resolution);
    return new Array($scope.resolution);
  }

  $scope.chunk = function (column, resolution) {
    var round = -1
    return data.slice(0).filter(function (x, i, a) {
      round++
      if (round >= resolution) round = 0
      if (round == column) return true
    })
  }

  responsive.run(
    function () {
      $scope.$apply()
    },
    function (resolution) {
      var number = Math.round($(window).width() / width)
      if (number > max) number = max
      $scope.resolution = number
    }
  )

})


  })

})

.controller('PerformanceCtrl', function ($scope) {

})

.controller('ContactCtrl', function ($scope) {

})
