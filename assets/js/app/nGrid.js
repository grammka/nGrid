(function($, window) {

	function NGrid(container, options) {
		var HOTKEYS, UTILS, TEMPLATES, DEFAULT_OPTIONS;
		var elems, gridOptions, gridModel;

		elems = {
			row: '.ngrid__row',
			cell: '.ngrid__cell',
			removeRowBtn: '.ngrid__remove-row-btn'
		};

		HOTKEYS = {
			'up':       38,
			'right':    39,
			'down':     40,
			'left':     37,
			'f4':       115,
			'f6':       117,
			'f8':       119
		};

		UTILS = {
			getId: (function () {
				var time = +new Date();
				return function () {
					return time++;
				}
			})()
		};

		TEMPLATES = {

		};

		DEFAULT_OPTIONS = {
			urls: {
				loadData: null,
				search: null,
				searchExample: null,
				save: null,
				remove: null
			},
			pagination: {
				pageSizes: [10, 20, 50, 100, 1000, 5000, 10000],
				pageSize: 50,
				currentPage: 1,
				totalServerItems: 0,
				maxPage: 1
			},
			events: {
				onDataLoaded: function(data) {}
			},

			rowHeight: 30,
			visibleRowsCount: 15,
			columnDefs: null,
			defaultEntity: {},
			data: null,
			enablePaging: true,
			enableCellSelection: true
		};



		//////////////////////////////////////////////////////////////////////////////////////////////
		// Default

		function extendOptions(options) {
			var options = angular.extend(DEFAULT_OPTIONS, options);

			options.id = UTILS.getId();

			return options;
		}

		function generateStylesheets() {
			var css = '',
				$head = $('head'),
				$style = gridOptions.$styleSheet || $("<style type='text/css' rel='stylesheet' />");

			for (var i = 0; i < gridOptions.columnDefs.length; i++) {
				var col = gridOptions.columnDefs[i];

				css += col.width ? ('#ngrid-' + gridOptions.id + ' .ngrid__col_' + i + ' { width: ' + col.width + 'px; } ') : '';
			}

			$style.empty();

			if ($style[0].styleSheet) {
				$style[0].styleSheet.cssText = css;
			} else {
				$style[0].appendChild(document.createTextNode(css));
			}

			if (!gridOptions.$styleSheet) {
				gridOptions.$styleSheet = $style;
				$head.append($style);
			}
		}

		/*
		 Create Default row entity with empty data
		 'defaultEntity' used when new Rows creating
		 */
		function generateDefaultEntity(data) {
			angular.forEach(data, function(value, key) {
				gridOptions.defaultEntity[key] = null;
			});
		}

		function generateGridRowData(data) {
			var row,
				entity = angular.copy(data || gridOptions.defaultEntity);

			row = {
				entity: entity,
				cells: []
			};

			angular.forEach(gridOptions.columnDefs, function(options, index) {
				row.cells.push({
					field: options.field,
					value: entity[options.field],
					index: index
				});
				row.entity[options.field] = row.cells[index];
			});

			angular.forEach(entity, function(value, key) {
				if (!row.entity[key] || typeof row.entity[key] != 'object') {
					row.entity[key] = {
						field: key,
						value: value
					};
				}
			});

			return row;
		}

		/*
		 Generate MAGIC data to work with Grid Module
		 Example:

		 Data from server:

		 [
			 {id: 1, name: 'Axe', price: 1000},
			 {id: 2, name: 'Bow', price: 2000},
			 ...
		 ]

		 MAGIC data compiled: (+ after this in directives nGridRow and nGridCell $elm will be added to each row / cell

		 [
			 {
				 entity: {
					 id: {
						 field: 'id',
						 value: 1,
						 index: 0,
						 $elm: [Object object]
					 },
					 name: {
						 field: 'name',
						 value: 'Axe',
						 index: 1,
						 $elm: [Object object]
					 },
					 price: {
						 field: 'price',
						 value: 1000,
						 index: 2,
						 $elm: [Object object]
					 }
				 },
				 cells: [
					 {
						 field: 'id',
						 value: 1,
						 index: 0,
						 $elm: [Object object]
					 },
					 {
						 field: 'name',
						 value: 'Axe',
						 index: 1,
						 $elm: [Object object]
					 },
					 {
						 field: 'price',
						 value: 1000,
						 index: 2,
						 $elm: [Object object]
					 }
				 ]
			 }
		 ]
		 */
		function generateGridData(data) {
			generateDefaultEntity(data[0]);

			for (var i = 0; i < data.length; i++) {
				data[i] = generateGridRowData(data[i]);
			}

			return data;
		}

		function getVisibleColumnDefs() {
			gridOptions.visibleColumnDefs = [];

			for (var i = 0; i < gridOptions.columnDefs.length; i++) {
				var col = gridOptions.columnDefs[i];

				if (!col.hidden) {
					var col = $.extend({}, col);

					col.realColumnDefsIndex = i;
					gridOptions.visibleColumnDefs.push(col);
				}
			}
		}

		function getGridBodySizes() {
			// needed to calculate scroll amount on arrows navigate
			gridOptions.gridWrapperWidth = elems.$bodyWrapper.width();
			// getting viewport height using rows counts because can't catch when rows will be rendered to get .height()
			gridOptions.gridWrapperHeight = (gridModel.data.length > gridOptions.visibleRowsCount ? gridOptions.visibleRowsCount : gridModel.data.length) * gridOptions.rowHeight;
		}



		//////////////////////////////////////////////////////////////////////////////////////////////
		// Render Grid

		function appendHeaderHtml() {
			var headerHtml = '';

			for (var i = 0; i < gridOptions.columnDefs.length; i++) {
				var columnDefs = gridOptions.columnDefs[i];

				if (!columnDefs.hidden) {
					headerHtml += '\
						<div class="ngrid__header__cell ngrid__col_' + i + '">\
							<div class="ngrid__header__cell__text">' + columnDefs.displayName + '</div>\
							<div class="ngrid__header__cell__grip js-ngrid__header__cell__grip"></div>\
						</div>\
					';
				}
			}

			elems.$header.html(headerHtml);
		}

		function appendRowHtml(data) {
			var rowHtml = '';

			for (var i = 0; i < data.length; i++) {
				var cellsData = data[i].cells;

				rowHtml += '<div class="ngrid__row">' + generateCellHtml(cellsData) + '</div>';
			}

			elems.$body.append(rowHtml);
		}

		function generateCellHtml(data) {
			var cellHtml = '',
				cellIndex = 0;

			for (var i = 0; i < data.length; i++) {
				var columnDefs = gridOptions.columnDefs[i],
					cellValueTemplate;

				if (columnDefs && !columnDefs.hidden) {
					/*
					 If cellTemplate exist in ColumnDefs then replace simple TextBlock with this template
					 */
					if (columnDefs.cellTemplate) {
						cellValueTemplate = '<ng-include src="\'' + columnDefs.cellTemplate + '\'"></ng-include>';
					} else {
						cellValueTemplate = data[i].value || '';
					}

					cellHtml += '\
						<div class="ngrid__cell' + (' ngrid__col_' + cellIndex) + (!columnDefs.editModel ? ' ngrid__cell_disabled' : '') + '">\
							' + cellValueTemplate + '\
						</div>\
					';
				}

				cellIndex++;
			}

			/*
			 Add remove button cell if Remove Url exist
			 */
			if (gridOptions.urls.remove) {
				cellHtml += '\
					<div class="ngrid__cell">\
						<div class="ngrid__remove-row-btn">&times;</div>\
					</div>\
				';
			}

			return cellHtml;
		}

		function initHeaderGrip() {
			var gripGrabbed = false,
				columnIndex,
				offsetLeft;

			function leaveGrip() {
				gripGrabbed = false;
				offsetLeft = null;
			}

			function dragGrip(e) {
				if (gripGrabbed) {
					var width = e.clientX - offsetLeft;

					gridOptions.columnDefs[columnIndex].width = width;

					generateStylesheets();
				}
			}

			function grabGrip() {
				gripGrabbed = true;
				columnIndex = $(this).parent().index();
				offsetLeft = $(this).parent().offset().left;

				console.log(columnIndex, offsetLeft);
			}

			$('.js-ngrid__header__cell__grip').on('mousedown', grabGrip);

			$(document).on({
				'mouseup.nGrid.grip': leaveGrip,
				'mouseleave.nGrid.grip': leaveGrip,
				'mousemove.nGrid.grip': dragGrip
			});
		}



		//////////////////////////////////////////////////////////////////////////////////////////////
		// Methods

		function focusGrid() {
			gridModel.isGridFocused = true;
		}

		function onBodyScroll() {
			elems.$header.css('margin-left', -this.scrollLeft);
		}

		function getColumnsCount() {
			var length = gridOptions.visibleColumnDefs.length;

			if (gridOptions.urls.remove) {
				length++;
			}

			return length;
		}

		// Navigation ===============================================================================

		function navigate(e) {
			if (!gridModel.isGridFocused) return;
			if (!~[HOTKEYS.left, HOTKEYS.up, HOTKEYS.right, HOTKEYS.down].indexOf(e.keyCode)) return;

			e.preventDefault();

			var scrollOptions = {};

			if (e.keyCode == HOTKEYS.left) {
				gridModel.currentCol--;
				scrollOptions.horizontal = true;
			}
			if (e.keyCode == HOTKEYS.up) {
				gridModel.currentRow--;
				scrollOptions.vertical = true;
			}
			if (e.keyCode == HOTKEYS.right) {
				gridModel.currentCol++;
				scrollOptions.horizontal = true;
			}
			if (e.keyCode == HOTKEYS.down) {
				gridModel.currentRow++;
				scrollOptions.vertical = true;
			}

			if (gridModel.currentRow < 0) {
				gridModel.currentRow = gridModel.data.length - 1;
				scrollOptions.last = true;
			}
			if (gridModel.currentRow == gridModel.data.length) {
				gridModel.currentRow = 0;
				scrollOptions.first = true;
			}
			if (gridModel.currentCol < 0) {
				gridModel.currentCol = getColumnsCount() - 1;
				scrollOptions.last = true;
			}
			if (gridModel.currentCol == getColumnsCount()) {
				gridModel.currentCol = 0;
				scrollOptions.first = true;
			}

			changeCurrentCell();
			scrollGrid(scrollOptions);
		}

		function scrollGrid(scrollOptions) {
			var newPosition;

			/*
			 Horizontal and Vertical calculates are same
			 If new element is Last or First new position will be 10000 or 0 (magic)
			 */
			if (scrollOptions.horizontal) {
				var gridScrollLeft = elems.$bodyWrapper[0].scrollLeft,
					cellInsideOffsetLeft = gridModel.focusedCell.$elm[0].offsetLeft,
					cellWidth = gridModel.focusedCell.$elm.width();

				if (scrollOptions.first) {
					newPosition = 0;
				} else if (scrollOptions.last) {
					newPosition = 10000;
				} else {
					if (cellInsideOffsetLeft + cellWidth > gridScrollLeft + gridOptions.gridWrapperWidth) {
						newPosition = cellInsideOffsetLeft;
					} else if (cellInsideOffsetLeft < gridScrollLeft) {
						newPosition = cellInsideOffsetLeft - gridOptions.gridWrapperWidth + cellWidth;
					}
				}

				if (typeof newPosition != 'undefined') elems.$bodyWrapper[0].scrollLeft = newPosition;

			} else if (scrollOptions.vertical) {
				var gridScrollTop = elems.$bodyWrapper[0].scrollTop,
					cellInsideOffsetTop = gridModel.focusedCell.$elm[0].offsetTop,
					cellHeight = gridOptions.rowHeight;

				if (scrollOptions.first) {
					newPosition = 0;
				} else if (scrollOptions.last) {
					newPosition = 10000;
				} else {
					if (cellInsideOffsetTop + cellHeight > gridScrollTop + gridOptions.gridWrapperHeight) {
						newPosition = cellInsideOffsetTop;
					} else if (cellInsideOffsetTop < gridScrollTop) {
						newPosition = cellInsideOffsetTop - gridOptions.gridWrapperHeight + cellHeight;
					}
				}

				if (typeof newPosition != 'undefined') elems.$bodyWrapper[0].scrollTop = newPosition;
			}
		}

		function changeCurrentCell() {
			// Clean previous focused Cell
			if (gridModel.focusedCell) {
				//gridModel.focusedCell.editing = false;
				gridModel.focusedCell.focused = false;

				$('.ngrid__cell.focused').removeClass('focused');
			}

			gridModel.focusedCell = gridModel.data[gridModel.currentRow].cells[gridModel.currentCol];
			gridModel.focusedCell.focused = true;

			if (!gridModel.focusedCell.$elm) {
				gridModel.focusedCell.$elm =
					elems.$grid
						.find(elems.row).eq(gridModel.currentRow)
						.find(elems.cell).eq(gridModel.currentCol);
			}

			gridModel.focusedCell.$elm.addClass('focused');
		}

		function focusCell() {
			var rowIndex, colIndex;

			rowIndex = $(this).closest(elems.row).index();
			colIndex = $(this).index();

			gridModel.currentRow = rowIndex;
			gridModel.currentCol = colIndex;

			changeCurrentCell();
		}

		function blurCell() {
			gridModel.focusedCell.$elm.removeClass('focused');
			gridModel.focusedCell = null;
		}

		// Edit Mode =============================================================================

		function enterEditCellMode() {
			//gridModel.focusedCell.editing = true;
			//gridModel.editingCell.cellElement = gridModel.focusedCell.$elm;
		}

		function leaveEditCellMode() {

			calculateCell();
		}

		// Calculate Cell =======================================================================

		function calculateCell() {
			var calculate = gridOptions.columnDefs[$scope.$index].calculate;

			if (calculate.formula) {
				var formula = angular.copy(calculate.formula),
					formulaFields = formula.match(/(#[^\s\+\-\*\/]+#)/g);

				$scope.cell.__calculate = function (isInit) {
					if (isInit && $scope.cell.value) return;

					var _formula = angular.copy(formula);

					for (var i = 0; i < formulaFields.length; i++) {
						var field   = formulaFields[i],
							cellId  = field.replace(/#/g, ''),
							value   = $scope.row.entity[cellId].value;

						_formula = _formula.replace(field, value || 0);
					}

					var value = eval(_formula);
					value = isFinite(value) ? value : 0;

					$scope.cell.value = value;
				};

				$scope.cell.__calculate(true); // init calculate
			}

			if (calculate.relations) {
				$scope.$watch('cell.value', function (n, o) {
					if (n && n != o) {
						for (var i = 0; i < calculate.relations.length; i++) {
							var cellId = calculate.relations[i],
								cell = $scope.row.entity[cellId];

							/*
							 Exclusion comparing with current focused cell
							 For example:
							 - you have 3 fields: 'ItemsCount', 'PricePerItem', 'TotalPrice'
							 - you focused 'PricePerItem' field (gridModel.focusedCell.field == 'PricePerItem')
							 - you write value in focused cell
							 - 'PricePerItem' will be changed
							 - Above $scope.$watch('cell.value') will be called again coz 'PricePerItem' was changed
							 - So we have LOOP
							 - But we have 'exclusion' where exclusion field equal to our Focused cell!
							 */
							if (!calculate.exclusions || !~calculate.exclusions.indexOf(gridModel.focusedCell.field)) {
								cell.__calculate();
							}
						}
					}
				});
			}
		}

		function calculateCells() {

		}

		// Remove Row ===========================================================================

		function removeRow() {
			var $row = $(this).closest(elems.row);

			setTimeout(function() {
				gridModel.data.splice(gridModel.currentRow, 1);
				blurCell();
				$row.remove();
			}, 10);
		}

		// Add New Row ===========================================================================

		function addRow() {
			var data = generateGridRowData();

			gridModel.data.push(data);
			appendRowHtml([data]);

			setTimeout(function() {
				elems.$bodyWrapper[0].scrollTop = 10000;
			}, 10);
		}



		//////////////////////////////////////////////////////////////////////////////////////////
		// Init

		function setEvents() {
			elems.$grid.on('click', focusGrid);
			elems.$grid.on('click', elems.cell, focusCell);
			elems.$grid.on('dblclick', elems.cell, enterEditCellMode);
			elems.$grid.on('click', elems.removeRowBtn, removeRow);

			elems.$bodyWrapper.on('scroll', onBodyScroll);

			elems.$addRowBtn.on('click', addRow);

			$(document).on('keydown.nGrid.navigation', navigate);
		}

		function loadData() {
			$.getJSON('/data/js/data.json', function(response) {
				gridModel.data = generateGridData(response.items);

				getGridBodySizes();
				appendRowHtml(gridModel.data);
			});

			return;

			$.ajax({
				url: gridOptions.urls.loadData,
				data: {
					isPaginated: gridOptions.enablePaging,
					page: gridOptions.pagination.currentPage,
					countPerPage: gridOptions.pagination.pageSize,
					itemMap: {} //gridOptions.loadDataParams.SearchObject.itemMap
				},
				type: 'POST',
				success: function(response) {
					gridModel.data = generateGridData(response.items);
					gridOptions.pagination.totalServerItems = response.totalItemsCount;
					gridOptions.pagination.maxPage = Math.ceil(gridOptions.pagination.totalServerItems / gridOptions.pagination.pageSize);

					getGridBodySizes();

					gridOptions.events.onDataLoaded(gridModel.data);
				}
			});
		}

		function init() {
			gridOptions = extendOptions(options);

			gridModel = {
				data: [],
				isGridDisabled: true,
				isGridFocused: false,   // grid focused status; needed for navigation and enter editing mode in cell
				currentRow: null,
				currentCol: null,
				focusedCell: null,      // current focused cell
				editingCell: {
					cellElement: null,
					editElement: null
				}
			};

			elems.$container = $(container);
			elems.$grid = $('<div class="ngrid" />').appendTo(elems.$container);
			elems.$grid.attr('id', 'ngrid-' + gridOptions.id);
			elems.$headerWrapper = $('<div class="ngrid__header__wrapper"></div>').appendTo(elems.$grid);
			elems.$header = $('<div class="ngrid__header"></div>').appendTo(elems.$headerWrapper);
			elems.$bodyWrapper = $('<div class="ngrid__body__wrapper"></div>').appendTo(elems.$grid);
			elems.$body = $('<div class="ngrid__body"></div>').appendTo(elems.$bodyWrapper);
			elems.$footer = $('<div class="ngrid__footer" />').appendTo(elems.$grid);
			elems.$footerMenu = $('<div class="ngrid__menu b-btns-list b-btns_s-list" />').appendTo(elems.$footer);
			elems.$lockBtn = $('<button class="ngrid__menu__item b-btn b-btn_full b-btn_s hint--top"><i class="icon icon-lock"></i></button>').appendTo(elems.$footerMenu);
			elems.$addRowBtn = $('<button class="ngrid__menu__item b-btn b-btn_full b-btn_s b-btn_blue">добавить строку</button>').appendTo(elems.$footerMenu);
			elems.$saveBtn = $('<button class="ngrid__menu__item b-btn b-btn_full b-btn_s b-btn_green">сохранить</button>').appendTo(elems.$footerMenu);
			elems.$footerRPart = $('<div class="grid__footer__r-part" />').appendTo(elems.$footer);

			getVisibleColumnDefs();
			setEvents();
			appendHeaderHtml();
			initHeaderGrip();
			generateStylesheets();

			if (gridOptions.urls.loadData) {
				loadData();
			} else if (gridOptions.data !== null) {
				//$scope.$watch('options.data', function(newVal, oldVal) {
				//	if (newVal && newVal != oldVal) {
				//		gridModel.data = generateGridData(gridOptions.data);
				//		getGridBodySizes();
				//	}
				//});
			} else {
				return console.error('no DATA passed to grid');
			}
		}

		init();
	}

	window.NGrid = NGrid;

})(jQuery, window);



$(function() {

	var gridOptions = {
		urls: {
			loadData:        'catalog/cmrqty/getlist',
			search:          'catalog/cmrqty/getlist',
			searchExample:   'catalog/cmrqty/searchexample',
			save:            'catalog/cmrqty/savelist',
			remove:          'catalog/cmrqty/delete'
		},
		columnDefs: tableColumnDefs
	};

	var nGrid = new NGrid('#grid', gridOptions);

});
