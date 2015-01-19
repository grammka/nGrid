angular.module('nGridTWMSApp').controller('DefaultCtrl', function($scope, nGridTableColumnDefs) {

	$scope.gridOptions = {
		urls: {
			loadData:        'catalog/cmrqty/getlist',
			search:          'catalog/cmrqty/getlist',
			searchExample:   'catalog/cmrqty/searchexample',
			save:            'catalog/cmrqty/savelist',
			remove:          'catalog/cmrqty/delete'
		},
		columnDefs: nGridTableColumnDefs.cmrQty
	};

});
