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
			for (var i in data) {
				gridOptions.defaultEntity[i] = null;
			}
		}

		function generateRowData(data) {
			var row = [],
				entity = angular.copy(data || gridOptions.defaultEntity);

			gridOptions.columnDefs.forEach(function(columnDefs) {
				row.push({
					field: columnDefs.field,
					value: entity[columnDefs.field]
				});
			});

			return row;
		}

		function generateRowsData(data) {
			generateDefaultEntity(data[0]);

			data.forEach(function(value, i) {
				data[i] = generateRowData(value);
			});

			return data;
		}

		function getVisibleColumnDefs() {
			gridOptions.visibleColumnDefs = [];

			gridOptions.columnDefs.forEach(function(columnDefs, i) {
				if (!columnDefs.hidden) {
					var columnDefs = $.extend({}, columnDefs);

					columnDefs.realColumnDefsIndex = i;
					gridOptions.visibleColumnDefs.push(columnDefs);
				}
			});
		}

		function getGridBodySizes() {
			// needed to calculate scroll amount on arrows navigate
			gridOptions.gridWrapperWidth = elems.$bodyWrapper.width();
			// getting viewport height using rows counts because can't catch when rows will be rendered to get .height()
			gridOptions.gridWrapperHeight = (gridModel.rows.length > gridOptions.visibleRowsCount ? gridOptions.visibleRowsCount : gridModel.rows.length) * gridOptions.rowHeight;
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
				var cellsData = data[i];

				rowHtml += '<div class="ngrid__row">' + generateCellHtml(cellsData) + '</div>';
			}

			elems.$body.append(rowHtml);
		}

		function generateCellHtml(data) {
			var cellHtml = '',
				cellIndex = 0;

			for (var i = 0; i < data.length; i++) {
				var columnDefs, cellIndexClass, isDisabledClass, cellValueTemplate;

				columnDefs = gridOptions.columnDefs[i];

				if (columnDefs && !columnDefs.hidden) {
					/*
					 If cellTemplate exist in ColumnDefs then replace simple TextBlock with this template
					 */
					if (columnDefs.cellTemplate) {
						cellValueTemplate = '<ng-include src="\'' + columnDefs.cellTemplate + '\'"></ng-include>';
					} else {
						cellValueTemplate = data[i].value || '';
					}

					cellIndexClass = ' ngrid__col_' + cellIndex;
					isDisabledClass = !columnDefs.editModel ? ' ngrid__cell_disabled' : '';

					cellHtml += '\
						<div class="ngrid__cell' + cellIndexClass + isDisabledClass + '">' + cellValueTemplate + '</div>\
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
				gridModel.currentRow = gridModel.rows.length - 1;
				scrollOptions.last = true;
			}
			if (gridModel.currentRow == gridModel.rows.length) {
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

			gridModel.focusedCell = gridModel.rows[gridModel.currentRow][gridModel.currentCol];
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

		// Confirm ==============================================================================

		/**
		 *
		 * @param options {accept: 'OK', decline: 'CANCEL', message: 'ARE U SURE?'}
		 * @param acceptHandler
		 * @param declineHandler
		 */
		function openConfirm(options, acceptHandler, declineHandler) {
			elems.$confirm.append('<div class="ngrid__confirm__header">' + (options.message || 'Вы уверены?') + '</div>');

			var $acceptBtn     = $('<div class="b-btn b-btn_full b-btn_m b-btn_green">' + (options.message || 'Удалить') + '</div>').appendTo(elems.$confirm),
				$declineBtn    = $('<div class="b-btn b-btn_full b-btn_m b-btn_red">' + (options.message || 'Отмена') + '</div>').appendTo(elems.$confirm);

			$acceptBtn.on('click', function() {
				if (acceptHandler) acceptHandler();
				closeConfirm();
			});

			$declineBtn.on('click', function() {
				if (declineHandler) declineHandler();
				closeConfirm();
			});

			elems.$confirmOverlay.show();
		}

		function closeConfirm() {
			elems.$confirm.empty();
			elems.$confirmOverlay.hide();
		}

		function acceptConfirm() {

		}

		function declineConfirm() {

		}

		// Remove Row ===========================================================================

		function removeRow() {
			var $row = $(this).closest(elems.row);

			setTimeout(function() {
				openConfirm({}, function() {
					gridModel.rows.splice(gridModel.currentRow, 1);
					blurCell();
					$row.remove();
				});
			}, 10);
		}

		// Add New Row ===========================================================================

		function addRow() {
			if (gridModel.isGridDisabled) {
				return;
			}

			var data = generateRowData();

			data.dirty = true;

			gridModel.rows.push(data);
			appendRowHtml([data]);

			setTimeout(function() {
				// scroll bottom
				elems.$bodyWrapper[0].scrollTop = 1000000;
			}, 10);
		}

		// Edit Mode ====================================================================

		function enterEditMode() {
			gridModel.isGridDisabled = false;

			elems.$grid.removeClass('ngrid_disabled');
		}

		function leaveEditMode() {
			gridModel.isGridDisabled = true;

			redrawRows();

			elems.$grid.addClass('ngrid_disabled');
		}

		function redrawRows() {
			gridModel.rows = gridModel.defaultRows.slice(0);

			elems.$body.empty();
			appendRowHtml(gridModel.rows);
		}



		//////////////////////////////////////////////////////////////////////////////////////////
		// Init

		function setEvents() {
			elems.$grid.on('click', focusGrid);
			elems.$grid.on('click', elems.cell, focusCell);
			elems.$grid.on('dblclick', elems.cell, enterEditCellMode);
			elems.$grid.on('click', elems.removeRowBtn, removeRow);

			elems.$bodyWrapper.on('scroll', onBodyScroll);

			elems.$editBtn.on('click', enterEditMode);
			elems.$cancelBtn.on('click', leaveEditMode);
			elems.$addRowBtn.on('click', addRow);

			$(document).on('keydown.nGrid.navigation', navigate);
		}

		function loadData() {
			var rows = generateRowsData(gridData);

			gridModel.defaultRows = rows.slice(0);
			gridModel.rows = rows.slice(0);

			getGridBodySizes();
			appendRowHtml(gridModel.rows);

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
					gridModel.rows = generateRowsData(response.items);
					gridOptions.pagination.totalServerItems = response.totalItemsCount;
					gridOptions.pagination.maxPage = Math.ceil(gridOptions.pagination.totalServerItems / gridOptions.pagination.pageSize);

					getGridBodySizes();

					gridOptions.events.onDataLoaded(gridModel.rows);
				}
			});
		}

		function init() {
			gridOptions = extendOptions(options);

			gridModel = {
				defaultRows: [],
				rows: [],
				dirtyRows: [],
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

			elems.$grid                 = $('<div class="ngrid' + (gridModel.isGridDisabled ? ' ngrid_disabled' : '') + '" id="ngrid-' + gridOptions.id + '" />');
			elems.$confirmOverlay       = $('<div class="ngrid__confirm__overlay"></div>').appendTo(elems.$grid);
            elems.$confirm              = $('<div class="ngrid__confirm"></div>').appendTo(elems.$confirmOverlay);
			elems.$headerWrapper        = $('<div class="ngrid__header__wrapper"></div>').appendTo(elems.$grid);
			elems.$header               = $('<div class="ngrid__header"></div>').appendTo(elems.$headerWrapper);
			elems.$bodyWrapper          = $('<div class="ngrid__body__wrapper"></div>').appendTo(elems.$grid);
			elems.$body                 = $('<div class="ngrid__body"></div>').appendTo(elems.$bodyWrapper);
			elems.$footer               = $('<div class="ngrid__footer" />').appendTo(elems.$grid);
			elems.$footerMenu           = $('<div class="ngrid__menu b-btns-list b-btns_s-list" />').appendTo(elems.$footer);
			elems.$addRowBtn            = $('<button class="ngrid__menu__item ngrid__menu__item_add-row b-btn b-btn_full b-btn_s b-btn_blue">добавить строку</button>').appendTo(elems.$footerMenu);
			elems.$saveBtn              = $('<button class="ngrid__menu__item ngrid__menu__item_save b-btn b-btn_full b-btn_s b-btn_green">сохранить</button>').appendTo(elems.$footerMenu);
			elems.$editBtn              = $('<button class="ngrid__menu__item ngrid__menu__item_edit b-btn b-btn_full b-btn_s b-btn_blue">редактировать</button>').appendTo(elems.$footerMenu);
			elems.$cancelBtn            = $('<button class="ngrid__menu__item ngrid__menu__item_cancel b-btn b-btn_full b-btn_s b-btn_red">отмена</button>').appendTo(elems.$footerMenu);
			elems.$footerRPart          = $('<div class="grid__footer__r-part" />').appendTo(elems.$footer);

			$(container).replaceWith(elems.$grid);

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
				//		gridModel.rows = generateRowsData(gridOptions.data);
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
