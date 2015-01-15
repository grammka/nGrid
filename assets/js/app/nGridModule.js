angular.module('nGridModule', []);

angular.module('nGridModule').directive('nGrid', function() {
	return {
		restrict: 'E',
		scope: {
			options: '='
		},
		controller: function() {

		},
		link: function($scope, $element) {
			new NGrid($element, $scope.options);
		}
	};
});
