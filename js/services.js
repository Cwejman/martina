angular.module('services', [])

.directive('done', ['$parse', function($parse) {
  return {
    restrict: 'A',
    link: function(scope, element, attrs) {
      var fn = $parse(attrs.done)
      if (scope.$last){
        scope.done()
      }
    }
  }

}])

.filter('file', function () {

  return function (input) {

    return input.split(' ').join('_').toLowerCase()
  }

})

.filter('first', function () {

  return function (input) {
    var output = input.split(': ')
    return output[0]
  }

})

.filter('second', function () {

  return function (input) {
    var output = input.split(': ')
    return output[1]
  }

})

.filter('info', function () {

  return function (input) {
    return input.split(', ').join(',\ \ ')
  }

})

.factory('responsive', function () {

  var resizeTimer

  return {
    run: function (apply, init, main, input, output) {

      init(main, input, output)

      $(window).on('resize', function(e) {

        window.requestAnimationFrame(function () {
          main(input, output)
          apply()
        })

      })


    }
  }
})
