angular.module('services', [])

.filter('file', function () {

  return function (input) {
    return input.split(' ').join('_').toLowerCase()
  }

})
