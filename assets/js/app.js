/**
 * @author      Stream Mobile Development Team
 * Website: www.webmons.com
 * @copyright   Stream Mobile Inc., 2016-2018
 * @license     Apache 2.0 Please read README.md file for more details of this license
 */

/**
 * This is invoke manually
 * Search for
 *  angular.bootstrap(document.getElementById('ngAppContainer'), ['WBApp']);
 *
 * @type {angular.Module}
 */
var WBApp = angular.module('WBApp', [], function($interpolateProvider) {
    $interpolateProvider.startSymbol('<%');
    $interpolateProvider.endSymbol('%>');
});

/**
 * angular configs
 */
WBApp.config(['$httpProvider', function($httpProvider) {
    $httpProvider.defaults.headers.common = {
        'X-CSRF-Token': jQ('meta[name="_token"]').attr('content'),
        'X-Requested-With': 'XMLHttpRequest'
    };
}]);

/**
 * angular file
 */
WBApp.directive('fileModel', ['$parse', function($parse) {
    return {
        restrict: 'A',
        link: function(scope, element, attrs) {
            var model = $parse(attrs.fileModel);
            var modelSetter = model.assign;

            element.bind('change', function() {
                scope.$apply(function() {
                    modelSetter(scope, element[0].files[0]);
                });
            });
        }
    };
}]);

/**
 * application services
 */
WBApp.service('AppService', function($q, $http) {
    /**
     * GET
     *
     * @param url
     * @param parameters
     */
    this.get = function(url, parameters) {
        var thisApp = this;
        var deferred = $q.defer();

        $http.get(url, {
            params: parameters
        }).then(function(response) {
            deferred.resolve(response.data);
        }, function(response) {
            deferred.reject(thisApp.errors(response));
        });

        return deferred.promise;
    };

    /**
     * POST
     *
     * @param url
     * @param parameters
     */
    this.post = function(url, parameters) {
        var thisApp = this;
        var deferred = $q.defer();

        $http.post(url, parameters).then(function(response) {
            deferred.resolve(response.data);
        }, function(response) {
            deferred.reject(thisApp.errors(response));
        });

        return deferred.promise;
    };

    /**
     * Errors
     *
     * @param response
     * @returns {{success: boolean, errors: *}}
     */
    this.errors = function(response) {
        if (response.status == 422) {
            WBErrors.toastMessage({
                title: 'Oops error occurred',
                message: response.data.errors,
                type: 'error'
            });

            return {
                success: false,
                errors: response.data.errors
            };
        }

        return {
            success: false,
            errors: response.statusText
        };
    }
});

/**
 * Directive to convert to number
 */
WBApp.directive('convertToNumber', function() {
    return {
        require: 'ngModel',
        link: function(scope, element, attrs, ngModel) {
            ngModel.$parsers.push(function(val) {
                return parseInt(val, 10);
            });

            ngModel.$formatters.push(function(val) {
                return '' + val;
            });
        }
    };
});