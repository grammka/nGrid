angular.module('nGrid').directive('nGridEditCellModalWithGrid', function($modal) {
	return {
		restrict: 'E',
		templateUrl: 'modal-with-grid.html',
		replace: true,
		scope: {
			options: '@',
			value: '@'
		},
		link: function ($scope, $element) {

			var modalInstance = $modal.open({
				templateUrl: 'list-modal-instance.html',
				controller: 'listModalInstanceCtrl',
				resolve: {
					options: function() {
						return {
							searchUrl: 'catalog/cmr/getlist',
							searchExampleUrl: 'catalog/cmr/searchexample',
							tableType: 'cmrSearch',
							modalHeader: 'Список CMR'
						}
					}
				}
			});

			modalInstance.result.then(function(selectedItem) {
				$scope.navigationPsaController.loadById(selectedItem.psaId);
				$scope.cmrForLoad = selectedItem.id;
			}, function() {
				//console.log('Modal dismissed at: ' + new Date());
			});

		}
	};
});
