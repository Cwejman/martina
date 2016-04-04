angular.module('services', [])

.filter('file', function () {

  return function (input) {

    return input.split(' ').join('_').toLowerCase()
  }

})

.factory('responsive', function () {

  var resizeTimer

  return {
    run: function (apply, main, input, output) {

      main(input, output)

      $(window).on('resize', function(e) {

        clearTimeout(resizeTimer)
        resizeTimer = setTimeout(function () {
          main(input, output)
          apply()
        }, 100)

      })


    }
  }
})
