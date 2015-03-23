var columnDefs = [{
	field: 'productModelCode',
	searchField: 'productModel.code',
	displayName: 'Код модели',
	width: 254,
	//editModel: nGridEditCellTemplates.modal.productModel,
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
	//editModel: nGridEditCellTemplates.input.default,
	editableCellTemplate: null,  // nGridCellTemplates.default
	width: 150,
	length: 15
}, {
	field: 'bbd',
	displayName: 'Срок годности',
	//editModel: nGridEditCellTemplates.input.default,
	editableCellTemplate: null,  // nGridCellTemplates.date
	width: 150
}, {
	field: 'comment',
	displayName: 'Комментарий',
	//editModel: nGridEditCellTemplates.input.default,
	editableCellTemplate: null,  // nGridCellTemplates.default
	width: 250
}, {
	field: 'invoice',
	searchField: 'invoice',
	displayName: 'Invoice',
	//editModel: nGridEditCellTemplates.input.default,
	editableCellTemplate: null,  // nGridCellTemplates.default
	width: 140,
	length: 50
}, {
	field: 'cmrQtyItems',
	searchField: 'cmrQtyItems',
	displayName: 'Кол CMR. шт',
	//editModel: nGridEditCellTemplates.input.default,
	editableCellTemplate: null,  // nGridCellTemplates.numeric
	width: 140,
	length: 11
}, {
	field: 'realQtyItems',
	searchField: 'realQtyItems',
	displayName: 'Факт.кол.шт.',
	//editModel: nGridEditCellTemplates.input.default,
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
	//editModel: nGridEditCellTemplates.input.default,
	editableCellTemplate: null,  // nGridCellTemplates.choosers.unit
	width: 90
}, {
	field: 'realPackages',
	searchField: 'realPackages',
	displayName: 'Фак.кол.упак.',
	//editModel: nGridEditCellTemplates.input.default,
	editableCellTemplate: null,  // nGridCellTemplates.numeric
	calculate: {
		formula: 'Math.ceil(#realQtyItems# / #itemsInABox#)'
	},
	width: 140,
	length: 110
}, {
	field: 'packageName',
	displayName: 'Название упаковки',
	//editModel: nGridEditCellTemplates.input.default,
	editableCellTemplate: null,  // nGridCellTemplates.choosers.package
	width: 185
}, {
	field: 'palletQtyItems',
	displayName: 'Пал. кол. шт.',
	//editModel: nGridEditCellTemplates.input.default,
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
	//editModel: nGridEditCellTemplates.input.default,
	editableCellTemplate: null,  // nGridCellTemplates.selects.incomeCategory
	width: 200
}, {
	field: 'brutto',
	searchField: 'brutto',
	displayName: 'Брутто',
	//editModel: nGridEditCellTemplates.input.default,
	editableCellTemplate: null,  // nGridCellTemplates.floatInput
	calculate: {
		formula: 'parseFloat((#realQtyItems# * #bruttoPerItem#).toFixed(2))'
	},
	width: 140
}, {
	field: 'netto',
	searchField: 'netto',
	displayName: 'Нетто',
	//editModel: nGridEditCellTemplates.input.default,
	editableCellTemplate: null,  // nGridCellTemplates.floatInput
	calculate: {
		formula: 'parseFloat((#realQtyItems# * #nettoPerItem#).toFixed(2))'
	},
	width: 140
}, {
	field: 'price',
	searchField: 'price',
	displayName: 'Цена',
	//editModel: nGridEditCellTemplates.input.default,
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
	//editModel: nGridEditCellTemplates.input.default,
	editableCellTemplate: null,  // nGridCellTemplates.floatInput
	calculate: {
		formula: 'parseFloat((#price# / #realQtyItems#).toFixed(2))',
		relations: ['price'],
		exclusions: ['price']
	},
	width: 140
}, {
	displayName: 'Валюта',
	//cellTemplate: nGridCellTemplates.currency,
	width: 140
}, {
	field: 'produced',
	displayName: 'Дата производства',
	//editModel: nGridEditCellTemplates.input.default,
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
}];



var gridData = [];

for (var i = 0; i < 3; i++) {

	gridData.push({
		"id": 1,
		"lotNum": null,
		"bbd": "12.01.2015",
		"produced": null,
		"invoice": "б/н",
		"cmrQtyItems": 175,
		"realQtyItems": 175,
		"palletQtyItems": 0,
		"realPackages": 7,
		"price": 0,
		"brutto": 175,
		"netto": 175,
		"volume": null,
		"characteristics": null,
		"pricePerItem": null,
		"comment": null,
		"type": 1,
		"quantityAllocated": 0,
		"hasChild": false,
		"productCategoryId": 1,
		"cmrId": 1,
		"itemsPerPallet": 0,
		"productModelCode": "01996/1 WEISS 107/09",
		"productModelName": "ПВХ-компаунд",
		"productCategoryName": "A",
		"cmrNum": "3",
		"unitId": 23,
		"unitName": "КГ",
		"packageId": 72,
		"productModelId": 1,
		"itemsInABox": 25,
		"bruttoPerItem": 0,
		"nettoPerItem": 0,
		"volumePerItem": 0
	});

	gridData.push({
		"id": 2,
		"lotNum": null,
		"bbd": "12.01.2015",
		"produced": null,
		"invoice": "б/н",
		"cmrQtyItems": 50,
		"realQtyItems": 50,
		"palletQtyItems": 0,
		"realPackages": 2,
		"price": 0,
		"brutto": 50,
		"netto": 50,
		"volume": null,
		"characteristics": null,
		"pricePerItem": null,
		"comment": null,
		"type": 1,
		"quantityAllocated": 0,
		"hasChild": false,
		"productCategoryId": 1,
		"cmrId": 1,
		"itemsPerPallet": 0,
		"productModelCode": "02001 GRAU 128/09",
		"productModelName": "ПВХ-компаунд",
		"productCategoryName": "A",
		"cmrNum": "3",
		"unitId": 23,
		"unitName": "КГ",
		"packageId": 72,
		"productModelId": 33,
		"itemsInABox": 25,
		"bruttoPerItem": 0,
		"nettoPerItem": 0,
		"volumePerItem": 0
	});

	gridData.push({
		"id": 3,
		"lotNum": null,
		"bbd": "12.01.2015",
		"produced": null,
		"invoice": "б/н",
		"cmrQtyItems": 175,
		"realQtyItems": 175,
		"palletQtyItems": 0,
		"realPackages": 7,
		"price": 0,
		"brutto": 175,
		"netto": 175,
		"volume": null,
		"characteristics": null,
		"pricePerItem": null,
		"comment": null,
		"type": 1,
		"quantityAllocated": 0,
		"hasChild": false,
		"packageName": "",
		"productCategoryId": 1,
		"cmrId": 1,
		"itemsPerPallet": 0,
		"productModelCode": "0954A-1111 WEISS",
		"productModelName": "ПВХ-компаунд",
		"productCategoryName": "A",
		"cmrNum": "3",
		"unitId": 23,
		"unitName": "КГ",
		"packageId": 70,
		"productModelId": 3,
		"itemsInABox": 25,
		"bruttoPerItem": 0,
		"nettoPerItem": 0,
		"volumePerItem": 0
	});

	gridData.push({
		"id": 4,
		"lotNum": "вм.10кг",
		"bbd": "12.01.2015",
		"produced": null,
		"invoice": "б/н",
		"cmrQtyItems": 10,
		"realQtyItems": 10,
		"palletQtyItems": 0,
		"realPackages": 1,
		"price": 0,
		"brutto": 10,
		"netto": 10,
		"volume": null,
		"characteristics": null,
		"pricePerItem": null,
		"comment": null,
		"type": 1,
		"quantityAllocated": 0,
		"hasChild": false,
		"packageName": "",
		"productCategoryId": 1,
		"cmrId": 1,
		"itemsPerPallet": 0,
		"productModelCode": "0954A-1111 WEISS",
		"productModelName": "ПВХ-компаунд",
		"productCategoryName": "A",
		"cmrNum": "3",
		"unitId": 23,
		"unitName": "КГ",
		"packageId": 70,
		"productModelId": 3,
		"itemsInABox": 25,
		"bruttoPerItem": 0,
		"nettoPerItem": 0,
		"volumePerItem": 0
	});

	gridData.push({
		"id": 5,
		"lotNum": null,
		"bbd": "12.01.2015",
		"produced": null,
		"invoice": "б/н",
		"cmrQtyItems": 25,
		"realQtyItems": 25,
		"palletQtyItems": 0,
		"realPackages": 1,
		"price": 0,
		"brutto": 25,
		"netto": 25,
		"volume": null,
		"characteristics": null,
		"pricePerItem": null,
		"comment": null,
		"type": 1,
		"quantityAllocated": 0,
		"hasChild": false,
		"packageName": "",
		"productCategoryId": 1,
		"cmrId": 1,
		"itemsPerPallet": 0,
		"productModelCode": "2340/11 NATUR",
		"productModelName": "ПВХ-компаунд",
		"productCategoryName": "A",
		"cmrNum": "3",
		"unitId": 23,
		"unitName": "КГ",
		"packageId": 70,
		"productModelId": 8,
		"itemsInABox": 25,
		"bruttoPerItem": 0,
		"nettoPerItem": 0,
		"volumePerItem": 0
	});

	gridData.push({
		"id": 6,
		"lotNum": null,
		"bbd": "12.01.2015",
		"produced": null,
		"invoice": "б/н",
		"cmrQtyItems": 25,
		"realQtyItems": 25,
		"palletQtyItems": 0,
		"realPackages": 1,
		"price": 0,
		"brutto": 25,
		"netto": 25,
		"volume": null,
		"characteristics": null,
		"pricePerItem": null,
		"comment": null,
		"type": 1,
		"quantityAllocated": 0,
		"hasChild": false,
		"productCategoryId": 1,
		"cmrId": 1,
		"itemsPerPallet": 0,
		"productModelCode": "01138-3001 natur",
		"productModelName": "ПВХ-компаунд",
		"productCategoryName": "A",
		"cmrNum": "3",
		"unitId": 23,
		"unitName": "КГ",
		"packageId": 72,
		"productModelId": 44,
		"itemsInABox": 25,
		"bruttoPerItem": 0,
		"nettoPerItem": 0,
		"volumePerItem": 0
	});

	gridData.push({
		"id": 7,
		"lotNum": null,
		"bbd": "12.01.2015",
		"produced": null,
		"invoice": "",
		"cmrQtyItems": 1158,
		"realQtyItems": 1158,
		"palletQtyItems": 0,
		"realPackages": 20,
		"price": 0,
		"brutto": 0,
		"netto": 0,
		"volume": null,
		"characteristics": null,
		"pricePerItem": null,
		"comment": null,
		"type": 1,
		"quantityAllocated": 0,
		"hasChild": false,
		"packageName": "",
		"productCategoryId": 1,
		"cmrId": 2,
		"itemsPerPallet": 0,
		"productModelCode": "954938R",
		"productModelName": "Арбат кассеты тушь-помада 30 см",
		"productCategoryName": "A",
		"cmrNum": "6",
		"unitId": 28,
		"unitName": "ШТ",
		"packageId": 70,
		"productModelId": 60,
		"itemsInABox": 0,
		"bruttoPerItem": 0,
		"nettoPerItem": 0,
		"volumePerItem": 0
	});

	gridData.push({
		"id": 8,
		"lotNum": null,
		"bbd": "12.01.2015",
		"produced": null,
		"invoice": "",
		"cmrQtyItems": 2,
		"realQtyItems": 2,
		"palletQtyItems": 0,
		"realPackages": 1,
		"price": 0,
		"brutto": 0,
		"netto": 0,
		"volume": null,
		"characteristics": null,
		"pricePerItem": null,
		"comment": null,
		"type": 1,
		"quantityAllocated": 0,
		"hasChild": false,
		"packageName": "",
		"productCategoryId": 1,
		"cmrId": 2,
		"itemsPerPallet": 0,
		"productModelCode": "956254R",
		"productModelName": "Дисплей металлич. ГРН АМБР Солер",
		"productCategoryName": "A",
		"cmrNum": "6",
		"unitId": 28,
		"unitName": "ШТ",
		"packageId": 70,
		"productModelId": 62,
		"itemsInABox": 0,
		"bruttoPerItem": 0,
		"nettoPerItem": 0,
		"volumePerItem": 0
	});

	gridData.push({
		"id": 9,
		"lotNum": "DED1130571",
		"bbd": "12.01.2015",
		"produced": null,
		"invoice": "",
		"cmrQtyItems": 1,
		"realQtyItems": 1,
		"palletQtyItems": 0,
		"realPackages": 1,
		"price": 0,
		"brutto": 0,
		"netto": 0,
		"volume": null,
		"characteristics": null,
		"pricePerItem": null,
		"comment": null,
		"type": 1,
		"quantityAllocated": 0,
		"hasChild": false,
		"packageName": "",
		"productCategoryId": 1,
		"cmrId": 2,
		"itemsPerPallet": 0,
		"productModelCode": "956424R",
		"productModelName": "Components for Tester Stands",
		"productCategoryName": "A",
		"cmrNum": "6",
		"unitId": 28,
		"unitName": "ШТ",
		"packageId": 70,
		"productModelId": 65,
		"itemsInABox": 0,
		"bruttoPerItem": 0,
		"nettoPerItem": 0,
		"volumePerItem": 0
	});

}

function generateRowData(entity) {
	var row = {
		entity: $.extend({}, entity),
		cells: []
	};

	columnDefs.forEach(function(columnDefs, index) {
		if (!columnDefs.hidden) {
			var value;

			value = row.entity[columnDefs.field];
			value = typeof value != 'undefined' ? value : null;

			row.cells.push({
				field:          columnDefs.field,
				index:          index,
				_entity:        row.entity,
				_columnDefs:    columnDefs[index]
			});
		}
	});
	
	//if (gridOptions.urls.remove) {
	//	row.cells.push({});
	//}

	return row;
}

function generateRowsData(data) {
	var rows = [];

	data.forEach(function(entity) {
		rows.push(generateRowData(entity));
	});

	return rows;
}

gridData = generateRowsData(gridData);
