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

.filter('colon', function () {

  return function (input, number) {
    var output = input.split(': ')
    return output[number]
  }

})

.filter('comma', function () {

  return function (input, number) {
    var output = input.split(', ')
    return output[number]
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
