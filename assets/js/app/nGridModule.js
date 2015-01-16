angular.module('nGrid', ['nGrid.directives', 'nGrid.editCellTemplates']);

nGridDirectives = angular.module('nGrid.directives', []);
nGridEditCellTemplates = angular.module('nGrid.editCellTemplates', []);


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

nGridEditCellTemplates.factory('nGridEditCellTemplates', function() {
	return {
		input: {
			default: {
				template: 'input'
			},
			numbersOnly: {
				template: 'input',
				options: {
					type: 'numbersOnly'
				}
			},
			autoComplete: {
				template: 'input',
				options: {
					type: 'autocomplete'
				}
			}
		},
		modal: {
			withGrid: {
				template: 'modal-with-grid'
			},
			withForm: {
				template: 'modal-with-form'
			},
			productModel: {
				template: 'modal-with-grid',
				options: {

				}
			}
		},
		remove: {

		}
	};
});

// Edit Cell

nGridDirectives.directive('nGridEditCell', function($document, $http, $compile) {
	return {
		restrict: 'E',
		link: function ($scope, $element) {
			var columnDefs = gridOptions.columnDefs[$scope.$index],
				tpl = '<n-grid-edit-cell-' + columnDefs.editModel.template + ' value="cell.value" ' + columnDefs.editModel.options + '>';

			$element.replaceWith($compile(tpl)($scope));
		}
	};
});

// Simple Input

nGridEditCellTemplates.directive('nGridEditCellInput', function($timeout) {
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

// Modal with Grid

nGridEditCellTemplates.directive('nGridEditCellModalWithGrid', function() {
	return {
		restrict: 'E',
		templateUrl: 'modal-with-grid.html',
		replace: true,
		scope: {
			options: '@',
			value: '@'
		},
		link: function ($scope, $element) {

			console.log($scope);

		}
	};
});

// Modal with form fields

nGridEditCellTemplates.directive('nGridEditCellModalWithForm', function() {
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
