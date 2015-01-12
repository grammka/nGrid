angular.module('TWMSApp').config([
	'$httpProvider',
	'$compileProvider',
	'$locationProvider',
	'$routeSegmentProvider',
	'$routeProvider',
	'localStorageServiceProvider',
	function(
		$httpProvider,
		$compileProvider,
		$locationProvider,
		$routeSegmentProvider,
		$routeProvider,
		localStorageServiceProvider
	) {

		$locationProvider.html5Mode({
			enabled: true,
			requireBase: false
		});

		localStorageServiceProvider.setPrefix('TWMSApp');

		$httpProvider.interceptors.push('HttpExceptionInterceptor');
		$httpProvider.defaults.withCredentials = true;
		$httpProvider.defaults.headers.common["Content-Type"] = "application/x-www-form-urlencoded; charset=utf-8";

		$routeSegmentProvider
			.when('/warehouseforpdf', 		                    											'warehouse_for_pdf')

			.when('/login',                                     											'login')
			.when('/',                          	            											'in.income')
			.when('/income',               					    											'in.income')
			.when('/income/psa/:psaId',               														'in.income')
			.when('/income/psa/:psaId/cmr/:cmrId',															'in.income')
			.when('/income_old',              					    										'in.income_old')
			.when('/storage',              					    											'in.storage')
			.when('/storage/psa/:psaId',              														'in.storage')
			.when('/commercialact',        					    											'in.commercialact')
			.when('/commercialact/commercialactpsa/:id',													'in.commercialact')
			.when('/commercialact/commercialactpsa/:id/commercialactcmr/:cmrId',							'in.commercialact')
			.when('/commercialact/commercialactpsa/:id/commercialactcmr/:cmrId/commercialactqty/:qtyId',	'in.commercialact')
			.when('/expenditure',          					    											'in.expenditure')
			.when('/expenditure/invoice/:id',          		    											'in.expenditure')
			.when('/waybill', 					                											'in.waybill')
			.when('/waybill/invoice/:invoiceId',															'in.waybill')
			.when('/waybill/invoice/:invoiceId/waybill/:id',    											'in.waybill')
			.when('/reservation/invoice/:id', 																'in.reservation')

			.when('/catalog/cells',                        	    											'in.catalog_cells')
			.when('/catalog/clients',                      	    											'in.catalog_clients')
			.when('/catalog/commercialactwhere',           	    											'in.catalog_commercialactwhere')
			.when('/catalog/commercialactwhy',             	    											'in.catalog_commercialactwhy')
			.when('/catalog/leaseholders',                 	    											'in.catalog_leaseholders')
			.when('/catalog/productmodelclassifier',       	    											'in.catalog_productmodelclassifier')
			.when('/catalog/productmodels',                	    											'in.catalog_productmodels')
			.when('/catalog/reservers',                    	    											'in.catalog_reservers')
			.when('/catalog/units',                        	    											'in.catalog_units')
			.when('/catalog/users',                        	    											'in.catalog_users')

			.when('/guides/catalogs',                      	    											'in.guides_catalogs')
			.when('/guides/commercialact',                 	    											'in.guides_commercialact')
			.when('/guides/common',                        	    											'in.guides_common')
			.when('/guides/expenditure',                   	    											'in.guides_expenditure')
			.when('/guides/hotkeys',                       	    											'in.guides_hotkeys')
			.when('/guides/income',                        	    											'in.guides_income')
			.when('/guides/storage',                       	    											'in.guides_storage')
			.when('/guides/reports',                       	    											'in.guides_reports')



			.segment('warehouse_for_pdf', {
				controller: 'WarehouseForPDFCtrl',
				templateUrl: 'warehouse-for-pdf.html'
			})

			.segment('login', {
				controller: 'LoginCtrl',
				templateUrl: 'login.html'
			})

			.segment('in', {
				templateUrl: 'layouts/inside.html',
				resolve: {
					checkAuth: function(authService) {
					    return authService.checkAuth(true);
					}
				},
				resolveFailed: angular.noop
			})
			.within()
				.segment('commercialact', {
					controller: 'CommercialActCtrl',
					templateUrl: 'commercialact.html',
					dependencies: ['cmrid']
				})
				.segment('expenditure', {
					controller: 'ExpenditureCtrl',
					templateUrl: 'expenditure.html',
					dependencies: ['invoiceid']
				})
				.segment('income', {
					controller: 'IncomeCtrl',
					templateUrl: 'income.html',
					dependencies: ['psaId', 'cmrId']
				})
				.segment('income_old', {
					controller: 'IncomeOldCtrl',
					templateUrl: 'income_old.html'
				})
				.segment('storage', {
					controller: 'StorageCtrl',
					templateUrl: 'storage.html',
					dependencies: ['psaId']
				})
				.segment('waybill', {
					controller: 'WaybillCtrl',
					templateUrl: 'waybill.html',
					dependencies: ['invoiceId', 'id']
				})
				.segment('reservation', {
					controller: 'ReservationCtrl',
					templateUrl: 'reservation.html',
					dependencies: ['invoice_id']
				})

				.segment('guides_catalogs', {
					controller: 'GuidesCatalogsCtrl',
					templateUrl: 'guides/catalogs.html'
				})
				.segment('guides_commercialact', {
					controller: 'GuidesCommercialActCtrl',
					templateUrl: 'guides/commercialact.html'
				})
				.segment('guides_common', {
					controller: 'GuidesCommonCtrl',
					templateUrl: 'guides/common.html'
				})
				.segment('guides_expenditure', {
					controller: 'GuidesExpenditureCtrl',
					templateUrl: 'guides/expenditure.html'
				})
				.segment('guides_hotkeys', {
					controller: 'GuidesHotkeysCtrl',
					templateUrl: 'guides/hotkeys.html'
				})
				.segment('guides_income', {
					controller: 'GuidesIncomeCtrl',
					templateUrl: 'guides/income.html'
				})
				.segment('guides_storage', {
					controller: 'GuidesStorageCtrl',
					templateUrl: 'guides/storage.html'
				})
				.segment('guides_reports', {
					templateUrl: 'guides/reports.html'
				})

				.segment('catalog_cells', {
					controller: 'CatalogCellsCtrl',
					templateUrl: 'catalog/cells.html'
				})
				.segment('catalog_clients', {
					controller: 'CatalogClientsCtrl',
					templateUrl: 'catalog/clients.html'
				})
				.segment('catalog_commercialactwhere', {
					controller: 'CatalogCommercialActWhereCtrl',
					templateUrl: 'catalog/commercialactwhere.html'
				})
				.segment('catalog_commercialactwhy', {
					controller: 'CatalogCommercialActWhyCtrl',
					templateUrl: 'catalog/commercialactwhy.html'
				})
				.segment('catalog_leaseholders', {
					controller: 'CatalogLeaseHoldersCtrl',
					templateUrl: 'catalog/leaseholders.html'
				})
				.segment('catalog_productmodelclassifier', {
					controller: 'CatalogProductModelClassifierCtrl',
					templateUrl: 'catalog/productmodelclassifier.html'
				})
				.segment('catalog_productmodels', {
					controller: 'CatalogProductModelsCtrl',
					templateUrl: 'catalog/productmodels.html'
				})
				.segment('catalog_reservers', {
					controller: 'CatalogReserversCtrl',
					templateUrl: 'catalog/reservers.html'
				})
				.segment('catalog_units', {
					controller: 'CatalogUnitsCtrl',
					templateUrl: 'catalog/units.html'
				})
				.segment('catalog_users', {
					controller: 'CatalogUsersCtrl',
					templateUrl: 'catalog/users.html'
				});

		$routeProvider.otherwise({ redirectTo: '/income' });
 
	}
]);
