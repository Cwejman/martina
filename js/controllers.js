angular.module('controllers', [])

.controller('NavCtrl', function ($scope, $state) {

  $scope.state = $state.current.name
  $scope.mobile = false

})

.controller('GalleryCtrl', function ($scope, json, responsive) {

  var data = json.data
  var width = 200
  var max = 5
  var resizeTimer

  $scope.resolution = 0

  $scope.columns = function() {
    return new Array($scope.resolution)
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
    function (main, input, output) {
      $scope.$on('$viewContentLoaded', function() {
        main(input, output)
       })
    },
    function () {
    var number = Math.round($(window).width() / width)
    if (number > max) number = max
    $scope.resolution = number
  })

})

.controller('AboutCtrl', function ($scope, json, responsive) {

  var response = function () {
    var groups = json.data.slice(0)
        groups.splice(2, 2)

    var ratioImage = groups.slice().map(function (group) {
      return group.slice().map(function (image) {
        return [image.height / image.width, image.width / image.height]
      })
    })

    var ratioGroup = ratioImage.slice().map(function (group) {
      return group.slice().reduce(function (sum, ratio) {
        return [sum[0] + ratio[0], sum[1] + ratio[1]]
      }, [0, 0])
    })

    if ($(window).width() > 700) {
      // Desktop sized screen
      $scope.mobile = false
      workWidth = $('.about').width() - 40
      sum = 1/ratioGroup[0][0] + 1/ratioGroup[1][0]

      groups.forEach(function (group, i) {
        paddingMinus = (ratioImage[i].length == 1) ? 0 : ((ratioImage[i].length-1)*20) / ratioImage[i].length
        group.forEach(function (image, j) {
          $scope.height = 50
            $scope.sizes['s' + (i).toString() + (j).toString()] = [
              (1/ratioGroup[i][0]/sum) * workWidth * ratioImage[i][j][0] - paddingMinus,
              (1/ratioGroup[i][0]/sum) * workWidth
            ]
        })
      })
    } else {
      // Mobile sized screen
      $scope.mobile = true
      workWidth = $('.about').width() - 20

      groups.forEach(function (group, i) {
        paddingMinus = (ratioImage[i].length == 1) ? 0 : ((ratioImage[i].length-1)*20) / ratioImage[i].length
        group.forEach(function (image, j) {
          $scope.sizes['s' + (i).toString() + (j).toString()] = [
            workWidth / ratioGroup[i][1] - paddingMinus,
            ratioImage[i][j][1] / ratioGroup[i][1] * workWidth - paddingMinus
          ]
        })
      })
    }

    console.log($scope.sizes);
  }

  $scope.data = json.data
  $scope.mobile = false
  $scope.done = response
  $scope.sizes = []

  $scope.arrayify = function(number) {
    return new Array(number)
  }

  responsive.run(
    function () {
      $scope.$apply()
    },
    function (main) {
      $scope.$on('$viewContentLoaded', function() {
        main()
       })
    },
    response
  )

})

.controller('ContactCtrl', function ($scope) {

})
