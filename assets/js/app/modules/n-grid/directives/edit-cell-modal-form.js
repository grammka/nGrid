angular.module('nGrid').directive('nGridEditCellModalWithForm', function() {
	return {
		restrict: 'E',
		templateUrl: 'modal-with-form.html',
		replace: true,
		scope: {
			options: '@',
			value: '@'
		},
		link: function ($scope, $element) {

		}
	};
});
