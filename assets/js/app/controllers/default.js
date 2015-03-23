angular.module('nGridTWMSApp').controller('DefaultCtrl', function($scope) {

	$scope.model = {
		columnDefs: columnDefs,
		rows: gridData
	};

});
