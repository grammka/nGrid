angular.module('nGrid').controller('listModalInstanceCtrl', function(
	$scope, $rootScope, $modalInstance, options, nGridTableColumnDefs
) {

	if (typeof options != 'object') {
		console.error('options is required!');
		return false;
	}

	$scope.modalHeader = options.modalHeader;

	$scope.gridOptions = {
		urls: {
			loadData:        'catalog/cmrqty/getlist',
			search:          options.searchUrl,
			searchExample:   options.searchExampleUrl
		},
		columnDefs: nGridTableColumnDefs[options.tableType],



		gridOptions: {
			section: 'list-modal-instance',
			enableRowSelection: true,
			enableCellSelection: false,
			beforeSelectionChange: function(rowItem) {
				$modalInstance.close(rowItem.entity);
				return false;
			}
		},
		alwaysEditMode: true,
		loadDataOnInit: true,
		searchParams: options.searchParams || [],
		enabledButtons: {
			new: false,
			save: false,
			search: true,
			edit: false
		}
	};

});
