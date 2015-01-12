angular.module('TWMSApp').run(function(
	$rootScope, $location, $route,
	authService, tableColumnDefs, TooltipDictService, currTitle, localStorageService
) {

	$rootScope.tableColumnDefs = tableColumnDefs;
	$rootScope.tooltips = TooltipDictService;

	$rootScope.currentUser = {
		id: null,
		username: null,
		isLogged: false
	};

	$rootScope.currTitle = currTitle.title;
	$rootScope.sidebarMinimized = localStorageService.get('sidebarMinimized') || 0;


	$rootScope.$on('$routeChangeSuccess', function() {
		var path = $location.path().slice(1),
			sections = path.split('/'),
			pathClass = 's-' + sections[0];

		if (sections.length > 1) {
			sections.reduce(function (a, b) {
				pathClass += ' s-' + a + '-' + b;
				return a + '-' + b;
			});
		}

		$rootScope.pathClass = pathClass;
	});

});
