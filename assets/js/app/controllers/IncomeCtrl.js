angular.module('TWMSApp').controller('IncomeCtrl', function(
	$rootScope, $scope, $log, $http, $modal, $timeout, $routeParams,
	Psa, Cmr,
	psaFactory, cmrFactory, productModelFactory,
	tableColumnDefs, EditableManager, buttonsAccessManager, currTitle
) {

	currTitle.set('Приход');

	$scope.psa = null;
	$scope.cmr = null;
	$scope.cmrForLoad = undefined;
	$scope.psaSumServer = {};

	$scope.newRowTemplate = null;

	$scope.psaSaveObject = {}; //used in server-side validation
	$scope.cmrSaveObject = {}; //used in server-side validation

	$scope.psaValidateOptions = {
		save_object: 'psaSaveObject',
		models_prefix: 'psa'
	};
	$scope.cmrValidateOptions = {
		save_object: 'cmrSaveObject',
		models_prefix: 'cmr'
	};

	buttonsAccessManager.setPath('income');

	$scope.gridOptions = {
		// New Options
		urls: {
			loadData:        'catalog/cmrqty/getlist',
			search:          'catalog/cmrqty/getlist',
			searchExample:   'catalog/cmrqty/searchexample',
			save:            'catalog/cmrqty/savelist',
			remove:          'catalog/cmrqty/delete'
		},
		columnDefs: tableColumnDefs['cmrQty'],


		// Old Options
		gridOptions: {
			section: 'cmrqty',
			columnDefs: tableColumnDefs['cmrQty'],
			enableCellEditOnFocus: false
		},
		watchingObjectName: 'cmr.id',
		loadDataOnInit: false,
		loadDataUrl: 'catalog/cmrqty/getlist',
		searchUrl: 'catalog/cmrqty/getlist',
		searchExampleUrl: 'catalog/cmrqty/searchexample',
		saveUrl: 'catalog/cmrqty/savelist',
		removeUrl: 'catalog/cmrqty/delete',
		dataWatcher: function(newVal, oldVal) {
			if (newVal && newVal.length > 0) {
				cmrTotalCount(newVal, oldVal);
			}
		},
		itemName: 'cmrqty',
		eventEmitter: 'cmrqty',
		itemCheckLock: Cmr.checkLock,
		gridKeyHandlers: [],
		rowKeyHandlers: [{
			key: 116,
			handler: function(gridScope, row) {
				if (parseInt(row.entity['cmrQtyItems']) > parseInt(row.entity['realQtyItems'])) {
					row.entity.hasChild = true;

					var realQtyItemsCnt = +(row.entity['cmrQtyItems'] - row.entity['realQtyItems']),
						brutto = realQtyItemsCnt * row.entity['bruttoPerItem'],
						netto = realQtyItemsCnt * row.entity['nettoPerItem'],
						price = realQtyItemsCnt * row.entity['pricePerItem'],
						palletQtyItems = realQtyItemsCnt / row.entity['itemsPerPallet'],
						realPackages = realQtyItemsCnt / row.entity['itemsInABox'];

					brutto = isNaN(brutto) ? 0 : brutto.toFixed(2);
					netto = isNaN(netto) ? 0 : netto.toFixed(2);
					price = isNaN(price) ? 0 : price.toFixed(2);
					palletQtyItems = !isFinite(palletQtyItems) ? 0 : (isNaN(palletQtyItems) ? 0 : Math.ceil(palletQtyItems));
					realPackages = !isFinite(realPackages) ? 0 : (isNaN(realPackages) ? 0 : Math.ceil(realPackages));

					gridScope.addRow({
						cmrQtyItems: 0,
						realQtyItems: realQtyItemsCnt,
						productModelId: row.entity['productModelId'],
						cmrId: row.entity['cmrId'],
						productModelName: row.entity['productModelName'],
						productModelCode: row.entity['productModelCode'],
						lotNum: row.entity['lotNum'],
						productCategoryId: 3,
						productCategoryName: 'D',
						unitName: row.entity['unitName'],
						unitId: row.entity['unitId'],
						realPackages: realPackages,
						palletQtyItems: palletQtyItems,
						brutto: brutto,
						netto: netto,
						packageName: row.entity['packageName'],
						pricePerItem: row.entity['pricePerItem'],
						price: price,
						bbd: row.entity['bbd'],
						invoice: row.entity['invoice'],
						productionDate: row.entity['productionDate']
					}, row.rowIndex);
				} else {
					gridScope.addRow({});
				}
			}
		}],

		onEntityUpdate: function(row, col, data) {
			if (col !== undefined && typeof $scope.columnUpdateHandlers[col.field] === 'function') {
				$scope.columnUpdateHandlers[col.field].apply(null, arguments);
			}
		},

		extendMethods: {
			addRow: function(row, items) {
				if (row.invoice || row.invoice === null || (typeof row.invoice != 'undefined' && !row.invoice.length)) return false;

				if (items && items.length && items[items.length - 1].entity.invoice) {
					row.invoice = items[items.length - 1].entity.invoice;
				}
			}
		}
	};

	// @FixMe: must be in grid directive.
	$scope.columnUpdateHandlers = {

		productModelCode: function(row, col, data) {
			$timeout(function() {
				productModelFactory.get(row.entity.productModelId)
					.success(function(response) {
						row.entity.productModelName = response.name;
						row.entity.unitName = response.unitName;
						row.entity.unitId = response.unitId;
						row.entity.bruttoPerItem = response.brutto;
						row.entity.nettoPerItem = response.netto;
						row.entity.pricePerItem = response.pricePerItem;
						row.entity.packageName = response.packageName;
						row.entity.packageId = response.packageId;
						row.entity.itemsInABox = response.itemsInABox;
						row.entity.itemsPerPallet = response.itemsPerPallet;

						$scope.columnUpdateHandlers.realQtyItems(row);
						$scope.columnUpdateHandlers.pricePerItem(row);

					});
			});
		},

		realQtyItems: function(row) {
			row.entity.brutto = row.entity.realQtyItems * row.entity.bruttoPerItem;
			row.entity.netto = row.entity.realQtyItems * row.entity.nettoPerItem;
			row.entity.price = row.entity.pricePerItem * row.entity.realQtyItems;

			row.entity.brutto = isNaN(row.entity.brutto) ? 0 : row.entity.brutto.toFixed(2);
			row.entity.netto = isNaN(row.entity.netto) ? 0 : row.entity.netto.toFixed(2);
			row.entity.price = isNaN(row.entity.price) ? 0 : row.entity.price.toFixed(2);

			if (row.entity.itemsInABox > 0) {
				row.entity.realPackages = row.entity.realQtyItems / row.entity.itemsInABox;
				row.entity.realPackages = isNaN(row.entity.realPackages) ? 0 : Math.ceil(row.entity.realPackages);
			}

			if (row.entity.itemsPerPallet > 0) {
				row.entity.palletQtyItems = row.entity.realQtyItems / row.entity.itemsPerPallet;
				row.entity.palletQtyItems = isNaN(row.entity.palletQtyItems) ? 0 : Math.ceil(row.entity.palletQtyItems);
			}
		},

		pricePerItem: function(row) {
			row.entity.price = row.entity.pricePerItem * row.entity.realQtyItems;
			row.entity.price = isNaN(row.entity.price) ? 0 : row.entity.price.toFixed(2);
		},

		price: function(row) {
			row.entity.pricePerItem = row.entity.price / row.entity.realQtyItems;
			row.entity.pricePerItem = !isFinite(row.entity.pricePerItem) ? 0 : row.entity.pricePerItem.toFixed(2);
		}

	};

	// set row template for new row in grid
	var setRowTemplate = function(data) {
		$scope.$broadcast('setRowTemplate', {
			cmrId: data.id,
			productCategoryId: 1,
			productCategoryName: 'А',
			bruttoPerItem: 0,
			brutto: 0,
			nettoPerItem: 0,
			netto: 0,
			pricePerItem: 0,
			price: 0
		});
	};

	$scope.navigationOptionsPsa = psaFactory.navigationOptions;
	$scope.navigationOptionsCmr = cmrFactory.navigationOptions;
	$scope.navigationPsaController = {};
	$scope.navigationCmrController = {};

	$scope.navigationOptionsPsa.getPrintItems = function() {
		if (!$scope.psa) {
			return [];
		}

		return [{
			url: 'report/reportpsa?id=' + $scope.psa.id,
			description: "Приёмо-сдаточный акт"
		}, {
			url: 'report/mx1?id=' + $scope.psa.id,
			description: "MX-1"
		}];
	};

	$scope.navigationOptionsPsa.methods = {
		onReadMode: function() {
			$scope.$broadcast($scope.gridOptions.eventEmitter, 'editActionsEnable');
			$scope.navigationCmrController.setEnabledFromParent('fully');
		},
		onEditMode: function() {
			$scope.$broadcast($scope.gridOptions.eventEmitter, 'editActionsDisable');
			$scope.navigationCmrController.setDisabledFromParent('fully');
		},
		onNewMode: function() {
			$scope.$broadcast($scope.gridOptions.eventEmitter, 'editActionsDisable');
			$scope.navigationCmrController.setDisabledFromParent();
		},
		onClosedMode: function() {
			$scope.$broadcast($scope.gridOptions.eventEmitter, 'editActionsDisable');
			$scope.navigationCmrController.setDisabledFromParent();
		},
		onDtoObjectLoaded: function(dto) {
			$scope.psa = dto;

			if ($scope.psa && $scope.psa.id) {
				$scope.navigationCmrController.setNavigationSearchParams({
					psaId: $scope.psa.id
				});
				$scope.navigationCmrController.setSearchExampleParams({
					'psa.id': {
						value: $scope.psa.id
					}
				});

				if ($scope.psa.isClosed) {
					$scope.navigationPsaController.setClosedMode();
				} else {
					$scope.navigationPsaController.setReadMode();
				}

				if ($scope.cmrForLoad) {
					$scope.navigationCmrController.loadById($scope.cmrForLoad);
					$scope.cmrForLoad = undefined;
				} else {
					$scope.navigationCmrController.load();
				}

				buttonsAccessManager.setParams({
					psaid: dto.id
				});
				buttonsAccessManager.load();

				if ($scope.psa.statusId == 2) {
					var buttons = {
						new: false,
						save: false,
						edit: false
					};
				} else if ($scope.psa.statusId == 3) {
					var buttons = {
						new: true,
						save: true,
						edit: true
					};

					noty({
						text: 'Пса был изменен, необходимо переразмещение.',
						type: 'success'
					});
				} else {
					var buttons = {
						new: true,
						save: true,
						edit: true
					};
				}

				// TODO Delete when statusId == null will be deleted
				if ($scope.psa.statusId == null) {
					var buttons = {
						new: true,
						save: true,
						edit: true
					};
				}

				$scope.$broadcast($scope.gridOptions.eventEmitter, 'changeEnabledButtons', buttons);
			} else {
				$scope.cmr = undefined;
				$scope.$broadcast($scope.gridOptions.eventEmitter, 'editActionsDisable');
				$scope.navigationOptionsCmr.searchParams = [];
			}
		},
		onServerValidation: function(obj) {
			$scope.psaSaveObject = obj;
		}
	};

	$scope.navigationOptionsCmr.methods = {
		onReadMode: function() {
			$scope.$broadcast($scope.gridOptions.eventEmitter, 'editActionsEnable');
			$scope.navigationPsaController.setEnabledFromParent('fully');
		},
		onEditMode: function() {
			$scope.$broadcast($scope.gridOptions.eventEmitter, 'editActionsDisable');
			$scope.navigationPsaController.setDisabledFromParent('fully');
		},
		onNewMode: function() {
			$scope.$broadcast($scope.gridOptions.eventEmitter, 'editActionsDisable');
		},
		onClosedMode: function() {
			$scope.$broadcast($scope.gridOptions.eventEmitter, 'editActionsDisable');
		},
		onAddCallback: function() {
			if (typeof $scope.psa.allCmrs != 'number') {
				$scope.psa.allCmrs = 1;
			} else {
				$scope.psa.allCmrs++;
			}
		},
		onRemoveCallback: function() {
			if (typeof $scope.psa.allCmrs != 'number') {
				$scope.psa.allCmrs = 0;
			} else {
				$scope.psa.allCmrs--;
			}
		},
		onDtoObjectLoaded: function(dto) {
			$scope.cmr = dto;

			if (dto) {
				setRowTemplate(dto);
				if (dto.id) {
					$scope.gridOptions.rowLoadingRequestData = {
						cmrid: dto.id
					};
					$scope.eqCmrId = dto.id;
					psaTotalCount();
				}
			}
		},
		onServerValidation: function(obj) {
			$scope.cmrSaveObject = obj;
		}
	};
	var unbindNavigationPsaControllerWatcher = $scope.$watch('navigationPsaController', function() {
		if (Object.keys($scope.navigationPsaController).length) {
			if ($routeParams.id) {
				if ($routeParams.cmrId) {
					$scope.cmrForLoad = $routeParams.cmrId;
				};
				$scope.navigationPsaController.loadById($routeParams.id);
			} else {
				$scope.navigationPsaController.load();
			}
			unbindNavigationPsaControllerWatcher();
		}
	});

	$scope.$on($scope.gridOptions.eventEmitter, function(scope, eventName, params) {
		switch (eventName) {
			case 'changeGridState':
				if (params === 'edit') {
					$scope.navigationPsaController.setDisabledMode();
					$scope.navigationCmrController.setDisabledMode();
				} else {
					$scope.navigationPsaController.setEnabledMode();
					$scope.navigationCmrController.setEnabledMode();
				}
				break;
		}
	});

	$scope.isPsaDisabled = function() {
		return EditableManager.isDisabled('psa') || EditableManager.isFullyDisabled('psa');
	};

	$scope.isPsaFullyDisabled = function() {
		return EditableManager.isFullyDisabled('psa')
	};

	$scope.isCmrDisabled = function() {
		return EditableManager.isDisabled('cmr') || EditableManager.isFullyDisabled('cmr');
	};

	$scope.isCmrFullyDisabled = function() {
		return EditableManager.isFullyDisabled('cmr')
	};

	$scope.isCmrNew = function() {
		return $scope.cmr == null;
	};

	$scope.colDefs = tableColumnDefs;

	$scope.openPsa = function() {
		return Psa.open($scope.psa.id).success(function() {
			$scope.psa.isClosed = false;
			$scope.navigationPsaController.setReadMode();
			$scope.$broadcast($scope.gridOptions.eventEmitter, 'editActionsEnable');
		});
	};

	$scope.closePsa = function() {
		return Psa.close($scope.psa.id).success(function() {
			$scope.psa.isClosed = true;
			$scope.navigationPsaController.setClosedMode();
			$scope.$broadcast($scope.gridOptions.eventEmitter, 'editActionsDisable');
		});
	};

	$scope.changeCmrState = function() {
		return Cmr.changeState($scope.cmr.id).success(function() {
			$scope.cmr.isClosed = !$scope.cmr.isClosed;

			if ($scope.cmr.isClosed) {
				$scope.navigationCmrController.setClosedMode();
				$scope.$broadcast($scope.gridOptions.eventEmitter, 'editActionsDisable');
			} else {
				$scope.navigationCmrController.setReadMode();
				$scope.$broadcast($scope.gridOptions.eventEmitter, 'editActionsEnable');
			}
		});
	};

	$scope.loadPsaNumbersList = function() {
		Psa.ids().success(function(data) {
			$scope.psaNumbersListItems = data;
		});
	};

	$scope.showCmrListForPsa = function() {
		var modalInstance = $modal.open({
			templateUrl: 'partials/modals/list.html',
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
			$log.info('Modal dismissed at: ' + new Date());
		});
	};

	$scope.goToCommertialAct = function() {
		if ($scope.psa == null || $scope.psa.id == null) {
			noty({
				text: 'PSA отсутствует',
				type: 'error'
			});
		} else {
			var tabWindowId = window.open('about:blank', '_blank');
			psaFactory.createCommercialact($scope.psa.id)
				.success(function(response) {
					if (response.id) {
						tabWindowId.location.href = 'commercialact/commercialactpsa/' + response.id;
						$scope.psa.psaCommercialActDocumentNumber = response.id;
					}
				});
		}
	};

	var cmrTotalDebounce = undefined;

	$scope.cmrSum = {
		'cmrQtyItems': 0,
		'realPackages': 0,
		'price': 0,
		'brutto': 0,
		'netto': 0
	};

	$scope.psaSum = {
		'cmrQtyItems': 0,
		'realPackages': 0,
		'price': 0,
		'brutto': 0,
		'netto': 0
	};

	var cmrTotalCount = function(newItem, oldItem) {
		$timeout.cancel(cmrTotalDebounce);

		cmrTotalDebounce = $timeout(function() {
			_cmrTotalCount(newItem, oldItem);
			updatePsaTotalCount();
		}, 500);
	};

	function _cmrTotalCount(newItem, oldItem) {
		var memo = {
			'cmrQtyItems': 0,
			'realPackages': 0,
			'price': 0,
			'brutto': 0,
			'netto': 0
		};

		if (oldItem.length == 0) oldItem = newItem;

		_.each(newItem, function(current, key) {
			if (
				oldItem[key] &&
				current['realQtyItems'] != oldItem[key]['realQtyItems'] && oldItem.hasOwnProperty(key)
			) {
				current['brutto'] = current['realQtyItems'] * current['bruttoPerItem'];
				current['netto'] = current['realQtyItems'] * current['nettoPerItem'];
				current['brutto'] = isNaN(current['brutto']) || current['netto'] == 0 ? 0 : current['brutto'];
				current['netto'] = isNaN(current['netto']) || current['netto'] == 0 ? 0 : current['netto'];
			}
			_.each(memo, function(val, key) {
				memo[key] += (parseFloat(current[key]) || 0);
			});
		});

		memo['brutto'] = parseFloat(memo['brutto'].toFixed(2));
		memo['netto'] = parseFloat(memo['netto'].toFixed(2));
		memo['price'] = parseFloat(memo['price'].toFixed(2));

		$scope.cmrSum = memo;
	}

	function psaTotalCount() {
		if ($scope.psa && $scope.psa.id && $scope.cmr && $scope.cmr.id) {
			Psa.subTotal($scope.psa.id, $scope.cmr.id).success(function(data) {
				$scope.psaSumServer = data;
				$scope.psaSum['cmrQtyItems'] = data['numOfUnits'] + $scope.cmrSum['cmrQtyItems'];
				$scope.psaSum['realPackages'] = data['numOfPackages'] + $scope.cmrSum['realPackages'];
				$scope.psaSum['price'] = data['sum'] + $scope.cmrSum['price'];
				$scope.psaSum['brutto'] = (parseFloat(data['brutto'].toFixed(1)) + $scope.cmrSum['brutto']).toFixed(1);
				$scope.psaSum['netto'] = (parseFloat(data['netto'].toFixed(1)) + $scope.cmrSum['netto']).toFixed(1);
			});
		} else {
			$scope.psaSum['cmrQtyItems'] = 0;
			$scope.psaSum['realPackages'] = 0;
			$scope.psaSum['price'] = 0;
			$scope.psaSum['brutto'] = 0;
			$scope.psaSum['netto'] = 0;
		}
	}

	function updatePsaTotalCount() {
		$scope.psaSum['cmrQtyItems'] = $scope.psaSumServer['numOfUnits'] + $scope.cmrSum['cmrQtyItems'];
		$scope.psaSum['realPackages'] = $scope.psaSumServer['numOfPackages'] + $scope.cmrSum['realPackages'];
		$scope.psaSum['price'] = $scope.psaSumServer['sum'] + $scope.cmrSum['price'];
		$scope.psaSum['brutto'] = (parseFloat($scope.psaSumServer['brutto'].toFixed(1)) + $scope.cmrSum['brutto']).toFixed(1);
		$scope.psaSum['netto'] = (parseFloat($scope.psaSumServer['netto'].toFixed(1)) + $scope.cmrSum['netto']).toFixed(1);
	}

	$scope.onModelChooserSelected = function(item, row) {
		row.entity.productModelId = item.id;
		row.entity.productModelCode = item.code;
		row.entity.productModelName = item.name;
	};
});