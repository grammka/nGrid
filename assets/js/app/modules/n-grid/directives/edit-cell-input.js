angular.module('nGrid').directive('nGridEditCellInput', function($timeout) {
	return {
		restrict: 'E',
		templateUrl: 'input.html',
		replace: true,
		scope: {
			options: '@',
			value: '@'
		},
		link: function ($scope, $element) {
			$timeout(function () {
				$element[0].select();
			});
		}
	};
});
