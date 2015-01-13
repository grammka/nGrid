(function($, window) {

	function NGrid(container, options) {
		var HOTKEYS, UTILS, TEMPLATES, DEFAULT_OPTIONS;
		var elems, gridOptions, gridModel;

		elems = {};

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
				head = document.head || document.getElementsByTagName('head')[0],
				style = gridOptions.$styleSheet || document.createElement('style');

			angular.forEach(gridOptions.columnDefs, function(col, i) {
				css += col.width ? ('#ngrid-' + gridOptions.id + ' .ngrid__col_' + i + ' { width: ' + col.width + 'px; } ') : '';
			});

			style.type = 'text/css';

			$(style).empty();

			if (style.styleSheet) {
				style.styleSheet.cssText = css;
			} else {
				style.appendChild(document.createTextNode(css));
			}

			if (!gridOptions.$styleSheet) {
				gridOptions.$styleSheet = style;
				head.appendChild(style);
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

			angular.forEach(data, function(row, index) {
				data[index] = generateGridRowData(row);
			});

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
				var column = gridOptions.columnDefs[i];

				headerHtml += '\
					<div class="ngrid__header__cell ngrid__col_' + i + '">\
						<div class="ngrid__header__cell__text">' + column.displayName + '</div>\
						<div class="ngrid__header__cell__grip js-ngrid__header__cell__grip"></div>\
					</div>\
				';
			}

			elems.$header.html(headerHtml);
		}

		function appendRowHtml(data) {
			var rowHtml = '';

			for (var i = 0; i < data.length; i++) {
				var cellsData = data[i].cells;

				rowHtml += '<tr class="ngrid__row">' + generateCellHtml(cellsData) + '</tr>';
			}

			elems.$body.append(rowHtml);
		}

		function generateCellHtml(data) {
			var cellHtml = '',
				cellIndex = 0;

			for (var i = 0; i < data.length; i++) {
				var columnDefs = gridOptions.columnDefs[i],
					cellValue = data[i].value,
					cellValueTemplate,
					editCellTemplate = '';

				/*
				 If field is hidden then no need templates to generate
				 */
				if (columnDefs && !columnDefs.hidden) {
					var cellDisabledClass = !columnDefs.editModel ? 'ngrid__cell_disabled' : '';

					cellHtml += '<td class="ngrid__cell js-ngrid__cell ' + cellDisabledClass + '">';

					if (columnDefs.editModel) {
						var tpl = columnDefs.editModel.template,
							options = columnDefs.editModel.options;

						options = options ? 'options="' + JSON.stringify(options) + '"' : '';

						editCellTemplate = '\
							<div ng-show="cell.editing" class="ngrid__cell__editor">\
								<n-grid-edit-cell-' + tpl + ' value="cell.value" ' + options + '>\
							</div>\
						';
					}

					/*
					 If cellTemplate exist in ColumnDefs then replace simple TextBlock with this template
					 */
					if (columnDefs.cellTemplate) {
						cellValueTemplate = '<ng-include src="\'' + columnDefs.cellTemplate + '\'"></ng-include>';
					} else {
						cellValueTemplate = '<div ng-hide="cell.editing" class="ngrid__cell__textvalue">' + cellValue + '</div>';
					}

					if (columnDefs.calculate) {
						cellHtml += '<span n-grid-calculate-cell></span>';
					}

					cellHtml += '\
						<div class="ngrid__cell__container ngrid__col_' + cellIndex + '">\
							' + cellValueTemplate + '\
							' + editCellTemplate + '\
						</div>\
					';

					cellHtml += '</td>';
				}

				cellIndex++;
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
					/*

					 |<--  cellInsideOffsetLeft  -->|<- cellWidth ->|
					 .						        .               .
					 ......................_____________________________ . ___           .
					 :		             |                              .    |          .
					 :		             |                              .____|__________.
					 :		             |                              |    |          |
					 :		             |                              |____|__________|
					 :		             |                                   |
					 :....................|___________________________________|
					 .					 .                                   .
					 .					 .                                   .
					 |<- gridScrollLeft ->|<- gridOptions.gridWrapperWidth  ->|

					 */
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
				gridModel.focusedCell.editing = false;
				gridModel.focusedCell.focused = false;

				$('.js-ngrid__cell.focused').removeClass('focused');
			}

			gridModel.focusedCell = gridModel.data[gridModel.currentRow].cells[gridModel.currentCol];
			gridModel.focusedCell.focused = true;

			if (!gridModel.focusedCell.$el) {
				gridModel.focusedCell.$elm = elems.$grid.find('tr').eq(gridModel.currentRow).find('td').eq(gridModel.currentCol);
			}

			gridModel.focusedCell.$elm.addClass('focused');
		}

		function focusCell() {
			var row, col;

			row = $(this).parents('tr').eq(0).index();
			col = $(this).index();

			if (gridModel.currentRow == row && gridModel.currentCol == col) {
				return;
			}

			gridModel.currentRow = row;
			gridModel.currentCol = col;

			changeCurrentCell();
		}

		function enterEditCellMode() {

		}



		//////////////////////////////////////////////////////////////////////////////////////////
		// Init

		function setEvents() {
			elems.$bodyWrapper.on('scroll', function() {
				elems.$header.css('margin-left', -this.scrollLeft);
			});

			elems.$grid.on('click', function() {
				gridModel.isGridFocused = true;
			});
			elems.$grid.on('click', '.js-ngrid__cell', focusCell);
			elems.$grid.on('dblclick', '.js-ngrid__cell', enterEditCellMode);

			$(document).on('keydown.nGrid.navigation', function(e) {
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
					gridModel.currentCol = gridOptions.visibleColumnDefs.length - 1;
					scrollOptions.last = true;
				}
				if (gridModel.currentCol == gridOptions.visibleColumnDefs.length) {
					gridModel.currentCol = 0;
					scrollOptions.first = true;
				}

				changeCurrentCell();
				scrollGrid(scrollOptions);
			});
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
				isGridDisabled: true,
				isGridFocused: false,   // grid focused status; needed for navigation and enter editing mode in cell
				focusedCell: null,      // current focused cell
				data: [],
				currentRow: null,
				currentCol: null
			};

			elems.$container = $(container);
			elems.$grid = $('<div class="ngrid" />').appendTo(elems.$container);
			elems.$grid.attr('id', 'ngrid-' + gridOptions.id);
			elems.$headerWrapper = $('<div class="ngrid__header__wrapper"></div>').appendTo(elems.$grid);
			elems.$header = $('<div class="ngrid__header"></div>').appendTo(elems.$headerWrapper);
			elems.$bodyWrapper = $('<div class="ngrid__body__wrapper"></div>').appendTo(elems.$grid);
			elems.$bodyTable = $('<table class="ngrid__body"></table>').appendTo(elems.$bodyWrapper);
			elems.$body = $('<tbody></tbody>').appendTo(elems.$bodyTable);
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
