angular.module('nGrid').factory('nGridTableColumnDefs', function (nGridCellTemplates, nGridEditCellTemplates) {
	return {
		cmrQty: [{
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
		}],


		storageCmrQty: [{
			displayName: '',
			width: 30,
			cellTemplate: null // nGridCellTemplates.helpers.allocationStatus
		}, {
			field: 'productModelCode',
			searchField: 'productModel.code',
			displayName: 'Код модели',
			editableCellTemplate: null,  // nGridCellTemplates.default
			width: 200
		}, {
			field: 'productModelName',
			displayName: 'Наименование',
			editableCellTemplate: null,  // nGridCellTemplates.default
			width: 150,
			minWidth: 120,
			maxWidth: 200
		}, {
			field: 'lotNum',
			searchField: 'lotNum',
			displayName: 'N партии',
			editableCellTemplate: null,  // nGridCellTemplates.default
			width: 100
		}, {
			field: 'bbd',
			displayName: 'Срок годности',
			editableCellTemplate: null,  // nGridCellTemplates.default
			width: 150
		}, {
			field: 'invoice',
			displayName: 'Invoice',
			editableCellTemplate: null,  // nGridCellTemplates.default
			width: 140
		}, {
			field: 'cmrQtyItems',
			displayName: 'Кол CMR. шт',
			editableCellTemplate: null,  // nGridCellTemplates.default
			width: 140
		}, {
			field: 'realQtyItems',
			displayName: 'Факт.кол.шт.',
			editableCellTemplate: null,  // nGridCellTemplates.default
			width: 140
		}, {
			field: 'unitName',
			displayName: 'Ед изм',
			editableCellTemplate: null,  // nGridCellTemplates.default
			width: 90
		}, {
			field: 'realPackages',
			displayName: 'Фак. упак',
			editableCellTemplate: null,  // nGridCellTemplates.default
			width: 140
		}, {
			field: 'packageName',
			displayName: 'Название упаковки',
			editableCellTemplate: null,  // nGridCellTemplates.default
			width: 185
		}, {
			field: 'palletQtyItems',
			displayName: 'Кол-во палет',
			editableCellTemplate: null,  // nGridCellTemplates.default
			width: 140
		}, {
			field: 'productCategoryName',
			displayName: 'Категория',
			editableCellTemplate: null,  // nGridCellTemplates.default
			width: 120
		}, {
			field: 'brutto',
			displayName: 'Брутто',
			editableCellTemplate: null,  // nGridCellTemplates.default
			width: 140
		}, {
			field: 'netto',
			displayName: 'Нетто',
			editableCellTemplate: null,  // nGridCellTemplates.default
			width: 140
		}, {
			field: 'pricePerItem',
			displayName: 'Цена шт.',
			editableCellTemplate: null,  // nGridCellTemplates.default
			width: 140
		}, {
			field: 'price',
			displayName: 'Цена',
			editableCellTemplate: null,  // nGridCellTemplates.default
			width: 140
		}, {
			displayName: 'Валюта',
			editableCellTemplate: null,  // nGridCellTemplates.default
			//cellTemplate: nGridEditCellTemplates.currency,
			width: 140
		}, {
			field: 'produced',
			displayName: 'Дата производства',
			editableCellTemplate: null,  // nGridCellTemplates.default
			width: 180
		}, {
			field: 'remove',
			displayName: '',
			//cellTemplate: nGridEditCellTemplates.remove,
			width: 20
		}, {
			field: 'unitId',
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
		}],


		storageItems: [{
			displayName: 'Наименование',
			width: 180,
			//cellTemplate: nGridEditCellTemplates.helpers.productModelName
		}, {
			field: 'cmrQtyId',
			width: 120,
			hidden: true
		}, {
			field: 'quantityAllocated',
			displayName: 'Размещено, шт.',
			width: 180,
			editableCellTemplate: null  // nGridCellTemplates.numeric
		}, {
			displayName: 'Категория',
			width: 140,
			//cellTemplate: nGridEditCellTemplates.helpers.productCategoryName
		}, {
			field: 'pallet.warehouseName',
			displayName: 'Склад',
			width: 150,
			editableCellTemplate: null  // nGridCellTemplates.selects.warehouse
		}, {
			field: 'pallet.row',
			displayName: 'Ряд',
			width: 100,
			editableCellTemplate: null  // nGridCellTemplates.numeric
		}, {
			field: 'pallet.section',
			displayName: 'Секция',
			width: 100,
			editableCellTemplate: null  // nGridCellTemplates.numeric
		}, {
			field: 'pallet.num',
			displayName: 'Ячейка',
			width: 100,
			editableCellTemplate: null  // nGridCellTemplates.numeric
		}, {
			field: 'pallet.palletNum',
			displayName: 'Палета',
			width: 150,
			//cellTemplate: nGridEditCellTemplates.pallet,
			editableCellTemplate: null  // nGridCellTemplates.selects.pallet
		}, {
			field: 'remove',
			displayName: '',
			width: 20,
			//cellTemplate: nGridEditCellTemplates.remove
		}],


		waybillItems: [{
			field: 'customerName',
			displayName: 'Арендатор',
			editableCellTemplate: null,  // nGridCellTemplates.default
			width: 100
		}, {
			field: 'invoiceId',
			displayName: 'Заказ',
			editableCellTemplate: null,  // nGridCellTemplates.default
			width: 100
		}, {
			field: 'invoice',
			displayName: 'Шифр заказа',
			width: 100,
			editableCellTemplate: null  // nGridCellTemplates.default
		}, {
			field: 'creationDate',
			displayName: 'Дата',
			width: 100,
			editableCellTemplate: null  // nGridCellTemplates.default
		}, {
			field: 'recipient',
			displayName: 'Получатель',
			width: 100,
			editableCellTemplate: null  // nGridCellTemplates.default
		}, {
			field: 'sender',
			displayName: 'Владелец',
			width: 100,
			editableCellTemplate: null  // nGridCellTemplates.default
		}, {
			field: 'dateOfOut',
			displayName: 'Дата закрытия',
			width: 100,
			editableCellTemplate: null  // nGridCellTemplates.default
		}],


		cellItems: [{
			field: 'code',
			displayName: 'Код модели',
			width: 100
		}],


		cmrSearch: [{
			field: 'psaDocumentNumber',
			displayName: 'Номер PSA',
			width: 150
		}, {
			field: 'num',
			displayName: 'Номер CMR',
			width: 150
		}, {
			field: 'date',
			displayName: 'Дата',
			width: 95
		}, {
			field: 'ownerName',
			searchField: 'owner.name',
			displayName: 'Владелец',
			width: 150
		}, {
			field: 'senderName',
			displayName: 'Отправитель',
			width: 150
		}, {
			field: 'totalRealQtyItems',
			displayName: 'Кол-во штук',
			width: 150
		}, {
			field: 'totalRealPackages',
			displayName: 'Кол-во упаковок',
			width: 150
		}],


		secondCmrList: [{
			field: 'cmrId',
			displayName: 'Номер CMR',
			width: 100
		}, {
			field: 'sumRealQtyItems',
			displayName: 'Кол.факт',
			width: 100
		}, {
			field: 'sumRealPackages',
			displayName: 'Упаковок',
			width: 100
		}, {
			field: 'sumBrutto',
			displayName: 'Вес',
			width: 100
		}, {
			field: 'sumPrice',
			displayName: 'Стоимость',
			width: 100
		}, {
			field: 'ownerName',
			displayName: 'Владелец',
			width: 150
		}, {
			field: 'recipientName',
			displayName: 'Получатель',
			width: 150
		}, {
			field: 'senderName',
			displayName: 'Отправитель',
			width: 150
		}],


		shortPsaList: [{
			field: 'leaseholderName',
			displayName: 'Арендатор',
			width: 762
		}, {
			field: 'id',
			displayName: 'Номер PSA',
			width: 100
		}, {
			field: 'date',
			displayName: 'Дата',
			width: 95
		}],


		psaSearch: [{
			field: 'documentNumber',
			searchField: 'documentNumber',
			displayName: 'Номер PSA',
			width: 956
		}],


		invoiceQty: [{
			field: 'productModelCode',
			displayName: 'Код модели',
			width: 200,
			editableCellTemplate: null  // nGridCellTemplates.choosers.model
		}, {
			field: 'modelCodeName',
			displayName: 'Наименование',
			width: 300,
			editableCellTemplate: null  // nGridCellTemplates.default
		}, {
			field: 'lotNum',
			displayName: 'N партии',
			width: 100,
			editableCellTemplate: null  // nGridCellTemplates.default
		}, {
			field: 'qtyByInvoice',
			displayName: 'Количество в заказе',
			width: 200,
			editableCellTemplate: null  // nGridCellTemplates.numeric
		}, {
			field: 'realPackages',
			displayName: 'Кол-во упаковок',
			width: 200,
			editableCellTemplate: null  // nGridCellTemplates.numeric
		}, {
			field: 'categoryName',
			displayName: 'Категория',
			width: 100,
			editableCellTemplate: null  // nGridCellTemplates.selects.invoiceqtyCategory
		}, {
			field: 'qtyToReservation',
			displayName: 'К резервации',
			width: 150,
			editableCellTemplate: null  // nGridCellTemplates.numeric
		}, {
			field: 'qtyReserved',
			displayName: 'Зарезервировано',
			width: 180,
			editableCellTemplate: null  // nGridCellTemplates.default
		}, {
			field: 'qtyPicked',
			displayName: 'Забрано',
			width: 100,
			editableCellTemplate: null  // nGridCellTemplates.numeric
		}, {
			field: 'remove',
			displayName: '',
			width: 20,
			//cellTemplate: nGridEditCellTemplates.remove
		}, {
			field: 'categoryId',
			hidden: true
		}, {
			field: 'invoiceId',
			hidden: true
		}],


		invoiceSearch: [{
			field: 'leaseholder',
			displayName: 'Арендатор',
			width: 200
		}, {
			field: 'recipient',
			displayName: 'Получатель',
			width: 200
		}, {
			field: 'owner',
			displayName: 'Владелец',
			width: 200
		}, {
			field: 'num',
			displayName: 'Номер',
			width: 100
		}, {
			field: 'dateOut',
			displayName: 'Дата выписки',
			width: 100
		}],


		reservationQty: [{
			field: 'modelCode',
			displayName: 'Код модели',
			width: 150,
			editableCellTemplate: null  // nGridCellTemplates.default
		}, {
			field: 'productModelName',
			displayName: 'Наименование модели',
			width: 215,
			editableCellTemplate: null  // nGridCellTemplates.default
		}, {
			field: 'productCategoryName',
			displayName: 'Категория',
			width: 150,
			editableCellTemplate: null  // nGridCellTemplates.default
		}, {
			field: 'psaId',
			displayName: 'Номер ПСА',
			width: 150,
			editableCellTemplate: null  // nGridCellTemplates.default
		}, {
			field: 'wayBillNum',
			displayName: 'ТТН',
			width: 100,
			editableCellTemplate: null  // nGridCellTemplates.default
		}, {
			field: 'amountReserved',
			displayName: 'Зрз. шт',
			width: 100,
			editableCellTemplate: null  // nGridCellTemplates.default
		}, {
			field: 'unit',
			displayName: 'Ед изм',
			width: 100,
			editableCellTemplate: null  // nGridCellTemplates.default
		}, {
			field: 'amountPicked',
			displayName: 'Забрано шт',
			width: 150,
			editableCellTemplate: null  // nGridCellTemplates.default
		}, {
			field: 'price',
			displayName: 'Цена шт',
			width: 100,
			editableCellTemplate: null  // nGridCellTemplates.default
		}, {
			field: 'lotNum',
			displayName: 'N партии',
			width: 150,
			editableCellTemplate: null  // nGridCellTemplates.default
		}, {
			field: 'invoiceQtyId',
			displayName: 'Invoice',
			width: 100,
			editableCellTemplate: null  // nGridCellTemplates.default
		}, {
			field: 'remove',
			displayName: '',
			width: 20,
			//cellTemplate: nGridEditCellTemplates.remove
		}],


		reservationQtyAddresses: [{
			field: 'productCategoryName',
			displayName: 'Категория',
			width: 100
		}, {
			field: 'amountReserved',
			displayName: 'Зарезервировано штук',
			width: 190
		}, {
			field: 'warehouseName',
			displayName: 'Склад',
			width: 100
		}, {
			field: 'palletNum',
			displayName: 'Палета',
			width: 100
		}, {
			field: 'invoiceQtyLotNum',
			displayName: 'Номер партии',
			width: 140
		}, {
			field: 'invoice',
			displayName: 'Invoice',
			width: 100
		}, {
			field: 'isPicked',
			displayName: 'Статус',
			//cellTemplate: nGridEditCellTemplates.status,
			width: 120
		}, {
			field: 'row',
			displayName: 'Ряд',
			width: 100
		}, {
			field: 'section',
			displayName: 'Секция',
			width: 100
		}, {
			field: 'cell',
			displayName: 'Ячейка',
			width: 100
		}],


		waybillsList: [{
			field: 'leaseholderName',
			displayName: 'Арендатор',
			width: 150
		}, {
			field: 'invoiceId',
			displayName: 'Номер закаа',
			width: 100
		}, {
			field: 'invoiceNum',
			displayName: 'Шифр заказа',
			width: 100
		}, {
			field: 'reference',
			displayName: 'Справка',
			width: 150
		}, {
			field: 'date',
			displayName: 'Дата',
			width: 100
		}, {
			field: 'recipient',
			displayName: 'Получатель',
			width: 150
		}, {
			field: 'owner',
			displayName: 'Владелец',
			width: 150
		}, {
			field: 'waybillId',
			displayName: 'Номер ТТН',
			width: 78
		}, {
			field: 'closingDate',
			displayName: 'Дата закрытия',
			width: 100
		}, {
			field: 'qtyByInvoice',
			displayName: 'Количество по закрытию',
			width: 162
		}, {
			field: 'qtyReserved',
			displayName: 'Зарезервировано',
			width: 117
		}, {
			field: 'boxesOut',
			displayName: 'Вывезено упаковок',
			width: 128
		}, {
			field: 'itemsOut',
			displayName: 'Вывезено штук',
			width: 105
		}, {
			field: 'weightOut',
			displayName: 'Вывезено вес',
			width: 100
		}],


		waybillsCell: [{
			field: 'psaId',
			displayName: 'ПСА',
			width: 80
		}, {
			field: 'modelCode',
			displayName: 'Модель',
			width: 100
		}, {
			field: 'modelName',
			displayName: 'Наименование',
			width: 150
		}, {
			field: 'lotNum',
			displayName: 'Лот №',
			width: 100
		}, {
			field: 'allocated',
			displayName: 'Размещ. шт.',
			width: 130
		}, {
			field: 'amountReserved',
			displayName: 'Зарез. шт.',
			width: 130
		}, {
			field: 'category',
			displayName: 'Категория',
			width: 130
		}, {
			field: 'palletId',
			displayName: 'Номер палеты',
			width: 150
		}],


		wbQty: [{
			field: 'reservationQtyId',
			displayName: 'reservationQty',
			editableCellTemplate: null,  // nGridCellTemplates.choosers.reservationQtyChooser
			hidden: true,
			width: 150
		}, {
			field: 'productModelCode',
			displayName: 'Код модели',
			editableCellTemplate: null,  // nGridCellTemplates.default
			width: 200
		}, {
			field: 'productModelName',
			displayName: 'Наименование',
			editableCellTemplate: null,  // nGridCellTemplates.default
			width: 150,
			minWidth: 120,
			maxWidth: 200
		}, {
			field: 'categoryName',
			displayName: 'Категория',
			editableCellTemplate: null,  // nGridCellTemplates.default
			width: 150
		}, {
			field: 'numOfItems',
			displayName: 'Кол. по ТТН',
			editableCellTemplate: null,  // nGridCellTemplates.default
			width: 150
		}, {
			field: 'numOfPackages',
			displayName: 'Кол.уп.',
			editableCellTemplate: null,  // nGridCellTemplates.default
			width: 100
		}, {
			field: 'numOfBoxes',
			displayName: 'Кол.короб.',
			editableCellTemplate: null,  // nGridCellTemplates.default
			width: 150
		}, {
			field: 'volume',
			displayName: 'Объем',
			editableCellTemplate: null,  // nGridCellTemplates.default
			width: 100
		}, {
			field: 'brutto',
			displayName: 'Вес',
			editableCellTemplate: null,  // nGridCellTemplates.default
			width: 100
		}, {
			field: 'lotNum',
			displayName: 'Номер партии',
			editableCellTemplate: null,  // nGridCellTemplates.default
			width: 150
		}, {
			field: 'comment',
			displayName: 'Комментарий',
			width: 150
		}, {
			field: 'dateofExpiry',
			displayName: 'Срок годности',
			width: 150
		}],


		unit: [{
			field: 'id',
			hidden: true,
			width: 100
		}, {
			field: 'name',
			displayName: 'Наименование',
			width: 479
		}, {
			field: 'shortname',
			displayName: 'Ед.изм.',
			width: 479
		}],


		clientType: [{
			field: 'id',
			hidden: true,
			width: 100
		}, {
			field: 'name',
			displayName: 'Наименование',
			width: 479
		}],


		client: [{
			field: 'id',
			hidden: true,
			width: 100
		}, {
			field: 'name',
			displayName: 'Название компании',
			width: 479
		}],


		reserver: [{
			field: 'id',
			hidden: true,
			width: 100
		}, {
			field: 'name',
			displayName: 'Инженер по приемке груза'
		}],


		// Наименование Единица измерения Масса брутто Масса нетто Объем шт Цена шт.
		productModels: [{
			field: 'code',
			displayName: 'Код',
			width: 120
		}, {
			field: 'name',
			displayName: 'Наименование',
			width: 230
		}, {
			field: 'unitName',
			displayName: 'Ед изм',
			width: 100
		}, {
			field: 'brutto',
			displayName: 'Масса брутто',
			width: 180
		}, {
			field: 'netto',
			displayName: 'Масса нетто',
			width: 130
		}, {
			field: 'pricePerItem',
			displayName: 'Цена шт.',
			width: 240
		}],


		productmodelclassifier: [{
			field: 'id',
			hidden: true
		}, {
			field: 'groupName',
			displayName: 'Имя группы',
			width: 120
		}, {
			field: 'groupDescription',
			displayName: 'Описание',
			width: 120
		}],


		warehouse: [{
			field: 'id',
			hidden: true
		}, {
			field: 'name',
			displayName: 'Склад',
			width: 120
		}],


		category: [{
			field: 'id',
			hidden: true
		}, {
			field: 'name',
			displayName: 'Категория',
			width: 120
		}],


		commercialactQtySearch: [{
			field: 'productModelCode',
			searchField: 'cmrQty.productModel.code',
			displayName: 'Код модели',
			width: 150
		}, {
			field: 'productModelName',
			searchField: 'cmrQty.productModel.name',
			displayName: 'Наименование',
			width: 150
		}, {
			field: 'lotNum',
			displayName: '№ партии',
			width: 100
		}, {
			field: 'invoice',
			searchField: 'cmrQty.invoice',
			displayName: 'Инвойс',
			width: 150
		}, {
			field: 'cmrQtyBbd',
			displayName: 'Срок годности',
			width: 126
		}, {
			field: 'cmrQtyComment',
			displayName: 'Комментарий',
			width: 300
		}],


		commercialactwhere: [{
			field: 'id',
			hidden: true
		}, {
			field: 'descriptionRu',
			displayName: 'Описание',
			width: 956
		}],


		waybillchooser: [{
			field: 'id',
			displayName: 'Номер'
		}],


		cmrchooser: [{
			field: 'id',
			hidden: true
		}, {
			field: 'documentNumber',
			displayName: 'Порядковый номер',
			width: 200
		}, {
			field: 'num',
			displayName: 'Номер по документам',
			width: 300
		}],


		replacement: [{
			field: 'id',
			hidden: true
		}, {
			field: 'cmrQtyLotNum',
			displayName: 'Партия',
			hidden: true,
			width: 100
		}, {
			field: 'warehouseName',
			displayName: 'Склад',
			width: 100
		}, {
			field: 'row',
			displayName: 'Ряд',
			width: 100
		}, {
			field: 'section',
			displayName: 'Секция',
			width: 100
		}, {
			field: 'cell',
			displayName: 'Ячейка',
			width: 100
		}, {
			field: 'palletNum',
			displayName: 'Палета',
			width: 230
		}, {
			field: 'amountReserved',
			displayName: 'Зарезервировано',
			width: 230
		}],


		catalogCells: [{
			field: 'warehouseId',
			hidden: true
		}, {
			field: 'warehouseName',
			displayName: 'Склад',
			width: 152,
			editableCellTemplate: null  // nGridCellTemplates.choosers.warehouse
		}, {
			field: 'row',
			displayName: 'Ряд',
			width: 152,
			editableCellTemplate: null  // nGridCellTemplates.numeric
		}, {
			field: 'section',
			displayName: 'Секция',
			width: 152,
			editableCellTemplate: null  // nGridCellTemplates.numeric
		}, {
			field: 'num',
			displayName: 'Ячейка',
			width: 152,
			editableCellTemplate: null  // nGridCellTemplates.numeric
		}, {
			field: 'cellCapacity',
			displayName: 'Вместимость в европалетах',
			width: 265,
			editableCellTemplate: null  // nGridCellTemplates.numeric
		}, {
			field: 'remove',
			displayName: '',
			width: 20,
			//cellTemplate: nGridEditCellTemplates.remove
		}],

		catalogClients: [{
			field: 'clientTypeIdList',
			displayName: 'Тип',
			width: 120,
			fieldText: 'Тип',
			//cellTemplate: nGridEditCellTemplates.text,
			editableCellTemplate: null  // nGridCellTemplates.choosers.clientType
		}, {
			field: 'name',
			searchField: 'name',
			displayName: 'Наименование компании',
			editableCellTemplate: null,  // nGridCellTemplates.default
			width: 400
		}, {
			field: 'address',
			displayName: 'Адрес',
			editableCellTemplate: null,  // nGridCellTemplates.default
			width: 600
		}, {
			field: 'clientTypeId',
			hidden: true,
			width: 200
		}, {
			field: 'remove',
			displayName: '',
			width: 20,
			//cellTemplate: nGridEditCellTemplates.remove
		}],

		commercialactCmrSearch: [{
			field: 'cmrNum',
			displayName: 'Номер',
			width: 100,
			editableCellTemplate: null  // nGridCellTemplates.default
		}, {
			field: 'sender',
			displayName: 'Отправитель',
			editableCellTemplate: null  // nGridCellTemplates.default
		}, {
			field: 'driver',
			displayName: 'Водитель',
			editableCellTemplate: null  // nGridCellTemplates.default
		}, {
			field: 'reserver',
			displayName: 'Приёмщик',
			editableCellTemplate: null  // nGridCellTemplates.default
		}],

		catalogCommercialActWhere: [{
			field: 'descriptionRu',
			displayName: 'Момент установки факта',
			editableCellTemplate: null  // nGridCellTemplates.default
		}, {
			field: 'descriptionEn',
			displayName: 'The fact was declared',
			editableCellTemplate: null  // nGridCellTemplates.default
		}, {
			field: 'remove',
			displayName: '',
			width: 20,
			//cellTemplate: nGridEditCellTemplates.remove
		}],

		catalogCommercialActWhy: [{
			field: 'descriptionRu',
			displayName: 'Предмет составления акта',
			editableCellTemplate: null  // nGridCellTemplates.default
		}, {
			field: 'descriptionEn',
			displayName: 'Reason for damage report',
			editableCellTemplate: null  // nGridCellTemplates.default
		}, {
			field: 'remove',
			displayName: '',
			width: 20,
			//cellTemplate: nGridEditCellTemplates.remove
		}],

		catalogLeaseHolders: [{
			field: 'name',
			searchField: 'name',
			displayName: 'Наименование компании',
			editableCellTemplate: null,  // nGridCellTemplates.default
			width: 400
		}, {
			field: 'address',
			displayName: 'Адрес',
			editableCellTemplate: null  // nGridCellTemplates.default
		}, {
			field: 'contractNum',
			displayName: 'Номер договора',
			editableCellTemplate: null,  // nGridCellTemplates.default
			width: 200
		}, {
			field: 'remove',
			displayName: '',
			width: 20,
			//cellTemplate: nGridEditCellTemplates.remove
		}],

		catalogProductModelClassifier: [{
			field: 'clientId',
			hidden: true,
			width: 200
		}, {
			field: 'clientName',
			displayName: 'Клиент',
			width: 200,
			editableCellTemplate: null  // nGridCellTemplates.client
		}, {
			field: 'groupName',
			displayName: 'Группа',
			editableCellTemplate: null,  // nGridCellTemplates.default
			width: 200
		}, {
			field: 'groupDescription',
			displayName: 'Описание группы',
			editableCellTemplate: null,  // nGridCellTemplates.default
			width: 200
		}, {
			field: 'remove',
			displayName: '',
			width: 20,
			//cellTemplate: nGridEditCellTemplates.remove
		}],

		catalogProductModels: [{
			field: 'id',
			hidden: true
		}, {
			field: 'code',
			searchField: 'code',
			displayName: 'Код модели',
			editableCellTemplate: null,  // nGridCellTemplates.default
			width: 300
		}, {
			field: 'name',
			searchField: 'name',
			displayName: 'Наименование',
			editableCellTemplate: null,  // nGridCellTemplates.default
			width: 400
		}, {
			field: 'modelDescription',
			searchField: 'modelDescription',
			displayName: 'Описание',
			editableCellTemplate: null,  // nGridCellTemplates.default
			width: 400
		}, {
			field: 'unitName',
			displayName: 'Ед.изм.',
			width: 80,
			editableCellTemplate: null  // nGridCellTemplates.choosers.unit
		}, {
			field: 'packageName',
			displayName: 'Упаковка',
			width: 100,
			editableCellTemplate: null  // nGridCellTemplates.choosers.package
		}, {
			field: 'itemsInABox',
			displayName: 'Вместимость в упаковку',
			width: 300,
			editableCellTemplate: null  // nGridCellTemplates.numeric
		}, {
			field: 'pricePerItem',
			displayName: 'Цена за шт.',
			width: 152,
			editableCellTemplate: null  // nGridCellTemplates.floatInput
		}, {
			field: 'brutto',
			displayName: 'Брутто за ед.',
			width: 152,
			editableCellTemplate: null  // nGridCellTemplates.floatInput
		}, {
			field: 'netto',
			displayName: 'Нетто за ед.',
			width: 152,
			editableCellTemplate: null  // nGridCellTemplates.floatInput
		}, {
			field: 'productModelClassifierId',
			hidden: true
		}, {
			field: 'productModelClassifierGroupName',
			displayName: 'Группа товаров',
			width: 152,
			editableCellTemplate: null  // nGridCellTemplates.choosers.productModelClassifier
		}, {
			field: 'length',
			displayName: 'Длина',
			width: 152,
			editableCellTemplate: null  // nGridCellTemplates.floatInput
		}, {
			field: 'height',
			displayName: 'Высота',
			width: 152,
			editableCellTemplate: null  // nGridCellTemplates.floatInput
		}, {
			field: 'width',
			displayName: 'Ширина',
			width: 152,
			editableCellTemplate: null  // nGridCellTemplates.floatInput
		}, {
			field: 'volume',
			displayName: 'Объем',
			width: 152
		}, {
			field: 'itemsPerPallet',
			displayName: 'Вместимость единиц на палету',
			editableCellTemplate: null,  // nGridCellTemplates.default
			width: 300
		}, {
			field: 'boxPerPallet',
			displayName: 'Вместимость упаковок на палету',
			editableCellTemplate: null,  // nGridCellTemplates.default
			width: 300
		}, {
			field: 'remove',
			displayName: '',
			width: 20,
			//cellTemplate: nGridEditCellTemplates.remove
		}],

		catalogReservers: [{
			field: 'name',
			displayName: 'Ф.И.О.',
			editableCellTemplate: null  // nGridCellTemplates.default
		}, {
			field: 'position',
			displayName: 'Должность',
			editableCellTemplate: null  // nGridCellTemplates.default
		}, {
			field: 'remove',
			displayName: '',
			width: 20,
			//cellTemplate: nGridEditCellTemplates.remove
		}],

		catalogUnits: [{
			field: 'name',
			displayName: 'Наименование',
			editableCellTemplate: null  // nGridCellTemplates.default
		}, {
			field: 'shortname',
			displayName: 'Краткое наименование',
			editableCellTemplate: null  // nGridCellTemplates.default
		}, {
			field: 'remove',
			displayName: '',
			width: 20,
			//cellTemplate: nGridEditCellTemplates.remove
		}],

		catalogUsers: [{
			field: 'id',
			displayName: 'Номер',
			width: 152
		}, {
			field: 'realname',
			displayName: 'ФИО',
			editableCellTemplate: null,  // nGridCellTemplates.default
			width: 225
		}, {
			field: 'username',
			displayName: 'Логин',
			editableCellTemplate: null,  // nGridCellTemplates.default
			width: 225
		}, {
			field: 'password',
			displayName: 'Пароль',
			editableCellTemplate: null,  // nGridCellTemplates.default
			width: 200
		}, {
			field: 'userRoles',
			displayName: 'Роли',
			width: 200,
			fieldText: 'Роли',
			//cellTemplate: nGridEditCellTemplates.text,
			editableCellTemplate: null  // nGridCellTemplates.choosers.role
		}, {
			field: 'remove',
			displayName: '',
			width: 20,
			//cellTemplate: nGridEditCellTemplates.remove
		}],

		catalogWarehouse: [{
			field: 'id',
			displayName: 'Порядковый номер',
			hidden: true,
			width: 100
		}, {
			field: 'name',
			displayName: 'Название склада',
			editableCellTemplate: null  // nGridCellTemplates.default
		}]
	};
});
