angular.module('nGridTWMSApp').controller('listModalInstanceCtrl', function(
	$scope, $rootScope, $modalInstance, tableColumnDefs, options
) {

	if (typeof options != 'object') {
        console.error('options is required!');
        return false;
    }

    $scope.modalHeader = options.modalHeader;

    $scope.gridOptions = {
        gridOptions: {
	        section: 'list-modal-instance',
            columnDefs: tableColumnDefs[options.tableType],
            enableRowSelection: true,
            enableCellSelection: false,
            beforeSelectionChange: function(rowItem) {
                $modalInstance.close(rowItem.entity);
                return false;
            }
        },
        alwaysEditMode: true,
        loadDataOnInit: true,
        searchUrl: options.searchUrl,
        searchExampleUrl: options.searchExampleUrl,
        searchParams: options.searchParams || [],
        enabledButtons: {
            new: false,
            save: false,
            search: true,
            edit: false
        }
    };

});
