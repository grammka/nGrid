angular.module('nGrid').directive('nGridEditCell', function($document, $http, $compile) {
	return {
		restrict: 'E',
		link: function ($scope, $element) {
			var columnDefs = gridOptions.columnDefs[$scope.$index],
				tpl = '<n-grid-edit-cell-' + columnDefs.editModel.template + ' value="cell.value" ' + columnDefs.editModel.options + '>';

			$element.replaceWith($compile(tpl)($scope));
		}
	};
});
