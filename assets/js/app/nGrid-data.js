var editCellTemplates;

cellTemplates = {
	currency: {

	},
	remove: {

	}
};

editCellTemplates = {
	input: {
		default: {
			template: 'input'
		},
		numbersOnly: {
			template: 'input',
			options: {
				type: 'numbersOnly'
			}
		},
		autoComplete: {
			template: 'input',
			options: {
				type: 'autocomplete'
			}
		}
	},
	modal: {
		withGrid: {
			template: 'modal-with-grid'
		},
		withForm: {
			template: 'modal-with-form'
		},
		productModel: {
			template: 'modal-with-grid',
			options: {

			}
		}
	}
};

var tableColumnDefs = [{
	field: 'productModelCode',
	searchField: 'productModel.code',
	displayName: 'Код модели',
	width: 254,
	editModel: editCellTemplates.modal.productModel,
	editableCellTemplate: null  // cellTemplates.choosers.model
}, {
	field: 'productModelName',
	searchField: 'productModel.name',
	displayName: 'Наименование',
	width: 300
}, {
	field: 'lotNum',
	searchField: 'lotNum',
	displayName: '№ партии',
	editModel: editCellTemplates.input.default,
	editableCellTemplate: null,  // cellTemplates.default
	width: 150,
	length: 15
}, {
	field: 'bbd',
	displayName: 'Срок годности',
	editModel: editCellTemplates.input.default,
	editableCellTemplate: null,  // cellTemplates.date
	width: 150
}, {
	field: 'comment',
	displayName: 'Комментарий',
	editModel: editCellTemplates.input.default,
	editableCellTemplate: null,  // cellTemplates.default
	width: 250
}, {
	field: 'invoice',
	searchField: 'invoice',
	displayName: 'Invoice',
	editModel: editCellTemplates.input.default,
	editableCellTemplate: null,  // cellTemplates.default
	width: 140,
	length: 50
}, {
	field: 'cmrQtyItems',
	searchField: 'cmrQtyItems',
	displayName: 'Кол CMR. шт',
	editModel: editCellTemplates.input.default,
	editableCellTemplate: null,  // cellTemplates.numeric
	width: 140,
	length: 11
}, {
	field: 'realQtyItems',
	searchField: 'realQtyItems',
	displayName: 'Факт.кол.шт.',
	editModel: editCellTemplates.input.default,
	editableCellTemplate: null,  // cellTemplates.numeric
	calculate: {
		relations: ['brutto', 'netto', 'price', 'realPackages', 'palletQtyItems']
	},
	width: 140,
	length: 11
}, {
	field: 'unitName',
	searchField: 'unit.shortname',
	displayName: 'Ед изм',
	editModel: editCellTemplates.input.default,
	editableCellTemplate: null,  // cellTemplates.choosers.unit
	width: 90
}, {
	field: 'realPackages',
	searchField: 'realPackages',
	displayName: 'Фак.кол.упак.',
	editModel: editCellTemplates.input.default,
	editableCellTemplate: null,  // cellTemplates.numeric
	calculate: {
		formula: 'Math.ceil(#realQtyItems# / #itemsInABox#)'
	},
	width: 140,
	length: 110
}, {
	field: 'packageName',
	displayName: 'Название упаковки',
	editModel: editCellTemplates.input.default,
	editableCellTemplate: null,  // cellTemplates.choosers.package
	width: 185
}, {
	field: 'palletQtyItems',
	displayName: 'Пал. кол. шт.',
	editModel: editCellTemplates.input.default,
	editableCellTemplate: null,  // cellTemplates.numeric
	calculate: {
		formula: 'Math.ceil(#realQtyItems# / #itemsPerPallet#)'
	},
	width: 140,
	length: 11
}, {
	field: 'productCategoryName',
	searchField: 'productCategory.name',
	displayName: 'Категория',
	editModel: editCellTemplates.input.default,
	editableCellTemplate: null,  // cellTemplates.selects.incomeCategory
	width: 200
}, {
	field: 'brutto',
	searchField: 'brutto',
	displayName: 'Брутто',
	editModel: editCellTemplates.input.default,
	editableCellTemplate: null,  // cellTemplates.floatInput
	calculate: {
		formula: '(#realQtyItems# * #bruttoPerItem#).toFixed(2)'
	},
	width: 140
}, {
	field: 'netto',
	searchField: 'netto',
	displayName: 'Нетто',
	editModel: editCellTemplates.input.default,
	editableCellTemplate: null,  // cellTemplates.floatInput
	calculate: {
		formula: '(#realQtyItems# * #nettoPerItem#).toFixed(2)'
	},
	width: 140
}, {
	field: 'price',
	searchField: 'price',
	displayName: 'Цена',
	editModel: editCellTemplates.input.default,
	editableCellTemplate: null,  // cellTemplates.floatInput
	calculate: {
		formula: '(#realQtyItems# * #pricePerItem#).toFixed(2)',
		relations: ['pricePerItem'],
		exclusions: ['pricePerItem']
	},
	width: 140
}, {
	field: 'pricePerItem',
	searchField: 'productModel.priceForItem',
	displayName: 'Цена шт.',
	editModel: editCellTemplates.input.default,
	editableCellTemplate: null,  // cellTemplates.floatInput
	calculate: {
		formula: '(#price# / #realQtyItems#).toFixed(2)',
		relations: ['price'],
		exclusions: ['price']
	},
	width: 140
}, {
	displayName: 'Валюта',
	cellTemplate: cellTemplates.currency,
	width: 140
}, {
	field: 'produced',
	displayName: 'Дата производства',
	editModel: editCellTemplates.input.default,
	editableCellTemplate: null,  // cellTemplates.date
	width: 190
}, {
	field: 'remove',
	displayName: '',
	cellTemplate: cellTemplates.remove,
	width: 20
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
}];

