angular.module('controllers', [])

.controller('NavCtrl', function ($scope, $state) {

  $scope.state = $state.current.name

})

.controller('HomeCtrl', function ($scope, json) {

  var data = json.data
  var width = 200
  var max = 5
  var resizeTimer

  $scope.resolution = 0

  var size = function (callback) {
    var number = Math.round($(window).width() / width)
    if (number > max) number = max
    $scope.resolution = number
    if (arguments.length == 1) callback()
  }

  $scope.getColumns = function() {
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

  size()

  $(window).on('resize', function(e) {

    clearTimeout(resizeTimer)
    resizeTimer = setTimeout(size(function () {
      $scope.$apply()
    }), 250)

  })

})
