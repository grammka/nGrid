angular.module('nGridTWMSApp').controller('DefaultCtrl', function($scope, nGridCellTemplates, nGridEditCellTemplates) {

	$scope.gridOptions = {
		urls: {
			loadData:        'catalog/cmrqty/getlist',
			search:          'catalog/cmrqty/getlist',
			searchExample:   'catalog/cmrqty/searchexample',
			save:            'catalog/cmrqty/savelist',
			remove:          'catalog/cmrqty/delete'
		},
		columnDefs: [{
			field: 'productModelCode',
			searchField: 'productModel.code',
			displayName: 'Код модели',
			width: 254,
			editModel: nGridEditCellTemplates.modal.productModel,
			editableCellTemplate: null  // nGridCellTemplates.choosers.model
		}, {
			field: 'productModelName',
			searchField: 'productModel.name',
			displayName: 'Наименование',
			width: 300
		}, {
			field: 'lotNum',
			searchField: 'lotNum',
			displayName: '№ партии',
			editModel: nGridEditCellTemplates.input.default,
			editableCellTemplate: null,  // nGridCellTemplates.default
			width: 150,
			length: 15
		}, {
			field: 'bbd',
			displayName: 'Срок годности',
			editModel: nGridEditCellTemplates.input.default,
			editableCellTemplate: null,  // nGridCellTemplates.date
			width: 150
		}, {
			field: 'comment',
			displayName: 'Комментарий',
			editModel: nGridEditCellTemplates.input.default,
			editableCellTemplate: null,  // nGridCellTemplates.default
			width: 250
		}, {
			field: 'invoice',
			searchField: 'invoice',
			displayName: 'Invoice',
			editModel: nGridEditCellTemplates.input.default,
			editableCellTemplate: null,  // nGridCellTemplates.default
			width: 140,
			length: 50
		}, {
			field: 'cmrQtyItems',
			searchField: 'cmrQtyItems',
			displayName: 'Кол CMR. шт',
			editModel: nGridEditCellTemplates.input.default,
			editableCellTemplate: null,  // nGridCellTemplates.numeric
			width: 140,
			length: 11
		}, {
			field: 'realQtyItems',
			searchField: 'realQtyItems',
			displayName: 'Факт.кол.шт.',
			editModel: nGridEditCellTemplates.input.default,
			editableCellTemplate: null,  // nGridCellTemplates.numeric
			calculate: {
				relations: ['brutto', 'netto', 'price', 'realPackages', 'palletQtyItems']
			},
			width: 140,
			length: 11
		}, {
			field: 'unitName',
			searchField: 'unit.shortname',
			displayName: 'Ед изм',
			editModel: nGridEditCellTemplates.input.default,
			editableCellTemplate: null,  // nGridCellTemplates.choosers.unit
			width: 90
		}, {
			field: 'realPackages',
			searchField: 'realPackages',
			displayName: 'Фак.кол.упак.',
			editModel: nGridEditCellTemplates.input.default,
			editableCellTemplate: null,  // nGridCellTemplates.numeric
			calculate: {
				formula: 'Math.ceil(#realQtyItems# / #itemsInABox#)'
			},
			width: 140,
			length: 110
		}, {
			field: 'packageName',
			displayName: 'Название упаковки',
			editModel: nGridEditCellTemplates.input.default,
			editableCellTemplate: null,  // nGridCellTemplates.choosers.package
			width: 185
		}, {
			field: 'palletQtyItems',
			displayName: 'Пал. кол. шт.',
			editModel: nGridEditCellTemplates.input.default,
			editableCellTemplate: null,  // nGridCellTemplates.numeric
			calculate: {
				formula: 'Math.ceil(#realQtyItems# / #itemsPerPallet#)'
			},
			width: 140,
			length: 11
		}, {
			field: 'productCategoryName',
			searchField: 'productCategory.name',
			displayName: 'Категория',
			editModel: nGridEditCellTemplates.input.default,
			editableCellTemplate: null,  // nGridCellTemplates.selects.incomeCategory
			width: 200
		}, {
			field: 'brutto',
			searchField: 'brutto',
			displayName: 'Брутто',
			editModel: nGridEditCellTemplates.input.default,
			editableCellTemplate: null,  // nGridCellTemplates.floatInput
			calculate: {
				formula: 'parseFloat((#realQtyItems# * #bruttoPerItem#).toFixed(2))'
			},
			width: 140
		}, {
			field: 'netto',
			searchField: 'netto',
			displayName: 'Нетто',
			editModel: nGridEditCellTemplates.input.default,
			editableCellTemplate: null,  // nGridCellTemplates.floatInput
			calculate: {
				formula: 'parseFloat((#realQtyItems# * #nettoPerItem#).toFixed(2))'
			},
			width: 140
		}, {
			field: 'price',
			searchField: 'price',
			displayName: 'Цена',
			editModel: nGridEditCellTemplates.input.default,
			editableCellTemplate: null,  // nGridCellTemplates.floatInput
			calculate: {
				formula: 'parseFloat((#realQtyItems# * #pricePerItem#).toFixed(2))',
				relations: ['pricePerItem'],
				exclusions: ['pricePerItem']
			},
			width: 140
		}, {
			field: 'pricePerItem',
			searchField: 'productModel.priceForItem',
			displayName: 'Цена шт.',
			editModel: nGridEditCellTemplates.input.default,
			editableCellTemplate: null,  // nGridCellTemplates.floatInput
			calculate: {
				formula: 'parseFloat((#price# / #realQtyItems#).toFixed(2))',
				relations: ['price'],
				exclusions: ['price']
			},
			width: 140
		}, {
			displayName: 'Валюта',
			cellTemplate: nGridCellTemplates.currency,
			width: 140
		}, {
			field: 'produced',
			displayName: 'Дата производства',
			editModel: nGridEditCellTemplates.input.default,
			editableCellTemplate: null,  // nGridCellTemplates.date
			width: 190
		}, {
			field: 'unitId',
			hidden: true
		}, {
			field: 'productModelId',
			hidden: true
		}, {
			field: 'id',
			hidden: true
		}, {
			field: 'cmrId',
			hidden: true
		}, {
			field: 'packageId',
			hidden: true
		}, {
			field: 'productCategoryId',
			hidden: true
		}]
	};

});
