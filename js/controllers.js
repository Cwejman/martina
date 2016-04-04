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

.controller('AboutCtrl', function ($scope, json, responsive) {

  $scope.data = json.data

  $scope.arrayify = function(number) {
    return new Array(number)
  }

  responsive.run(
    function () {
      $scope.$apply()
    },
    function () {
      var breakPoint = 700
      var paddingImage = 20
      var paddingBig = 40
      var paddingSmall = 20

      var width = $('.about').width()
      var groups = $scope.data
      var sum, workwidth, i, j, paddingMinus

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

      function size (tag, width, height) {
        $(tag).width(width).height(height)
      }

      // Desktop sized screen
      if ($(window).width() > breakPoint) {
        workWidth = width - paddingBig
        sum = 1/ratioGroup[0][0] + 1/ratioGroup[1][0]

        for (i = 0; i < groups.length; i++) {

          for (j = 0; j < groups[i].length; j++) {

            paddingMinus = (ratioImage[i].length == 1) ? 0 : ((ratioImage[i].length-1)*paddingImage) / ratioImage[i].length

            $('#s' + (i).toString() + (j).toString()).width((1/ratioGroup[i][0]/sum) * workWidth)
              .height((1/ratioGroup[i][0]/sum) * workWidth * ratioImage[i][j][0] - paddingMinus)
          }
        }
      }

      // Mobile sized screen
      else {
        workWidth = width - paddingSmall

        for (i = 0; i < groups.length; i++) {

          paddingMinus = (ratioImage[i].length == 1) ? 0 : ((ratioImage[i].length-1)*paddingImage) / ratioImage[i].length

          for (j = 0; j < groups[i].length; j++) {
            $('#s' + (i).toString() + (j).toString()).width(ratioImage[i][j][1] / ratioGroup[i][1] * workWidth - paddingMinus)
              .height(workWidth / ratioGroup[i][1] - paddingMinus)
          }
        }
      }
    }
  )

})

.controller('ContactCtrl', function ($scope) {

})
