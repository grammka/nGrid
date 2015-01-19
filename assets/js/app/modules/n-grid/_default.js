angular.module('nGrid', []);

angular.module('nGrid').directive('nGrid', function($compile) {
	return {
		restrict: 'E',
		scope: {
			options: '='
		},
		controller: function() {

		},
		link: function($scope, $element) {

			var ngMethods = {
				compile: function(html) {
					return $compile(html)($scope);
				}
			};

			$scope.grid = new NGrid($element, $scope.options, ngMethods);
		}
	};
});
