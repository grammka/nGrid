(function($, window) {

	function NGrid(container, options, ngMethods) {
		var HOTKEYS, UTILS, TEMPLATES, DEFAULT_OPTIONS;
		var elems, gridOptions, gridModel;

		elems = {
			row: '.ngrid__row',
			cell: '.ngrid__cell',
			removeRowBtn: '.ngrid__remove-row-btn'
		};

		HOTKEYS = {
			"UP":       38,
			"RIGHT":    39,
			"DOWN":     40,
			"LEFT":     37,
			"ESC":      27,
			"F4":       115,
			"F6":       117,
			"F8":       119
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
			for (var key in data) {
				gridOptions.defaultEntity[key] = null;
			}
		}

		function generateRowData(data) {
			var row = [],
				entity = angular.copy(data || gridOptions.defaultEntity);

			row = {
				entity: entity,
				cells: []
			};

			gridOptions.columnDefs.forEach(function(columnDefs, index) {
				row.cells.push({
					field: columnDefs.field,
					value: entity[columnDefs.field],
					index: index
				});
				row.entity[columnDefs.field] = row.cells[index];
			});

			for (var key in entity) {
				if (!row.entity[key] || typeof row.entity[key] != 'object') {
					row.entity[key] = {
						field: key,
						value: entity[key]
					};
				}
			}

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

		function calculateCells() {
			gridModel.rows.forEach(function(row, rowIndex) {
				gridOptions.columnDefs.forEach(function(columnDefs, colIndex) {
					Cell.calculate(rowIndex, colIndex);
				});
			});
		}

		function appendHeaderHtml() {
			var headerHtml = '';

			gridOptions.columnDefs.forEach(function(columnDefs, index) {
				if (!columnDefs.hidden) {
					headerHtml += '\
						<div class="ngrid__header__cell ngrid__col_' + index + '">\
							<div class="ngrid__header__cell__text">' + columnDefs.displayName + '</div>\
							<div class="ngrid__header__cell__grip js-ngrid__header__cell__grip"></div>\
						</div>\
					';
				}
			});

			elems.$header.html(headerHtml);
		}

		function appendRowHtml(data) {
			var rowHtml = '';

			for (var i = 0; i < data.length; i++) {
				var cellsData = data[i].cells;

				rowHtml += '<div class="ngrid__row">' + generateCellHtml(cellsData) + '</div>';
			}

			elems.$body.append(rowHtml);

			calculateCells();
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



		//////////////////////////////////////////////////////////////////////////////////////////
		// Methods

		// //////////////////////////////////////////////////////////////////////////////////////
		// Grid

		var Grid = {
			getColumnsCount: function() {
				var length = gridOptions.visibleColumnDefs.length;

				if (gridOptions.urls.remove) {
					length++;
				}

				return length;
			},

			onBodyScroll: function() {
				elems.$header.css('margin-left', -this.scrollLeft);
			},

			ESC: function(e) {
				if (e.keyCode == HOTKEYS.ESC && gridModel.focusedCell.editing) {
					Cell.leaveEditMode(false);
				}
			},

			blur: function() {
				if (gridModel.focusedCell) {
					Cell.blur();
				}
			},

			navigate: function(e) {
				if (!gridModel.focusedCell || gridModel.focusedCell.editing) return;
				if (!~[HOTKEYS.LEFT, HOTKEYS.UP, HOTKEYS.RIGHT, HOTKEYS.DOWN].indexOf(e.keyCode)) return;

				e.preventDefault();

				var scrollOptions = {};

				if (e.keyCode == HOTKEYS.LEFT) {
					gridModel.currentColIndex--;
					scrollOptions.horizontal = true;
				}
				if (e.keyCode == HOTKEYS.UP) {
					gridModel.currentRowIndex--;
					scrollOptions.vertical = true;
				}
				if (e.keyCode == HOTKEYS.RIGHT) {
					gridModel.currentColIndex++;
					scrollOptions.horizontal = true;
				}
				if (e.keyCode == HOTKEYS.DOWN) {
					gridModel.currentRowIndex++;
					scrollOptions.vertical = true;
				}

				if (gridModel.currentRowIndex < 0) {
					gridModel.currentRowIndex = gridModel.rows.length - 1;
					scrollOptions.last = true;
				}
				if (gridModel.currentRowIndex == gridModel.rows.length) {
					gridModel.currentRowIndex = 0;
					scrollOptions.first = true;
				}
				if (gridModel.currentColIndex < 0) {
					gridModel.currentColIndex = Grid.getColumnsCount() - 1;
					scrollOptions.last = true;
				}
				if (gridModel.currentColIndex == Grid.getColumnsCount()) {
					gridModel.currentColIndex = 0;
					scrollOptions.first = true;
				}

				if (gridModel.focusedCell) {
					Cell.blur();
				}

				Cell.changeFocused();
				Grid.scroll(scrollOptions);
			},

			scroll: function(scrollOptions) {
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
			},

			enterEditMode: function() {
				gridModel.isGridDisabled = false;

				elems.$grid.removeClass('ngrid_disabled');
			},

			leaveEditMode: function() {
				gridModel.isGridDisabled = true;

				Row.redrawAll();

				elems.$grid.addClass('ngrid_disabled');
			},

			save: function() {
				Grid.blur();

				//console.debug('SAVED DATA: ', gridModel.dirtyRows);

				if (gridModel.dirtyRows.length) {
					/*

					 $.ajax({
					 url: gridOptions.urls.save,
					 data: gridModel.dirtyRows,
					 type: 'POST',
					 success: function (response) {
					 console.debug('SAVE REQUEST RESPONSE: ', response);
					 }
					 });

					 */

					// Clean dirty status from Rows
					gridModel.dirtyRows.forEach(function(row) {
						row.dirty = false;
					});

					gridModel.dirtyRows = [];
					gridModel.defaultRows = gridModel.rows.slice(0);

					Grid.leaveEditMode();
				} else {
					Grid.leaveEditMode();
				}
			}
		};

		//////////////////////////////////////////////////////////////////////////////////////////
		// Confirm

		var Confirm = {
			/**
			 *
			 * @param options - {accept: "OK", reject: "CANCEL", message: "ARE U SURE?"}
			 * @param acceptHandler
			 * @param rejectHandler
			 */
			open: function (options, acceptHandler, rejectHandler) {
				elems.$confirm.append('<div class="ngrid__confirm__header">' + options.message + '</div>');

				var $acceptBtn     = $('<button class="b-btn b-btn_full b-btn_m b-btn_red">' + options.accept + '</button>').appendTo(elems.$confirm),
					$rejectBtn    = $('<button class="b-btn b-btn_full b-btn_m b-btn_green">' + options.reject + '</button>').appendTo(elems.$confirm);

				$acceptBtn.on('click', function() {
					if (acceptHandler) acceptHandler();
					Confirm.close();
				});

				$rejectBtn.on('click', function() {
					if (rejectHandler) rejectHandler();
					Confirm.close();
				});

				elems.$confirmOverlay.show();
			},

			close: function() {
				elems.$confirm.empty();
				elems.$confirmOverlay.hide();
			}
		};

		//////////////////////////////////////////////////////////////////////////////////////////
		// Row

		var Row = {
			get: function(rowIndex) {
				return gridModel.rows[rowIndex];
			},

			create: function() {
				if (gridModel.isGridDisabled) {
					return;
				}

				var data;

				data = generateRowData();
				data.dirty = true;

				gridModel.rows.push(data);
				gridModel.dirtyRows.push(data);

				appendRowHtml([data]);

				setTimeout(function() {
					// scroll bottom
					elems.$bodyWrapper[0].scrollTop = 1000000;
				}, 10);
			},

			remove: function() {
				if (gridModel.isGridDisabled) {
					return;
				}

				var $row = $(this).closest(elems.row);

				setTimeout(function() {
					Confirm.open({
						message: 'Удалить строку?',
						accept: 'Удалить',
						reject: 'Отмена'
					}, function() {

						/*

						 $.ajax({
							 url: gridOptions.urls.remove,
							 data: gridModel.currentRowIndex,
							 type: 'POST',
							 success: function (response) {
								 console.debug('REMOVE ROW REQUEST RESPONSE: ', response);
							 }
						 });

						 */

						gridModel.rows.splice(gridModel.currentRowIndex, 1);
						Cell.blur();
						$row.remove();
					});
				}, 10);
			},

			redrawAll: function() {
				if (gridModel.dirtyRows.length) {
					gridModel.rows = gridModel.defaultRows.slice(0);

					elems.$body.empty();
					appendRowHtml(gridModel.rows);
				}
			}
		};

		//////////////////////////////////////////////////////////////////////////////////////////
		// Cell

		var Cell = {
			get: function(rowIndex, colIndex) {
				return gridModel.rows[rowIndex].cells[colIndex];
			},

			getHtmlElement: function(cell, rowIndex, colIndex) {
				if (cell) {
					cell.$elm = elems.$grid
						.find(elems.row).eq(rowIndex)
						.find(elems.cell).eq(colIndex);
				}
			},

			changeFocused: function() {
				gridModel.focusedRow = gridModel.rows[gridModel.currentRowIndex];
				gridModel.focusedCell = gridModel.focusedRow.cells[gridModel.currentColIndex];
				gridModel.focusedCell.focused = true;

				Cell.getHtmlElement(gridModel.focusedCell, gridModel.currentRowIndex, gridModel.currentColIndex);

				gridModel.focusedCell.$elm.addClass('focused');
			},

			focus: function() {
				var rowIndex, colIndex;

				// Check if previous focused Cell equal current focused
				if ($(this).hasClass('focused')) {
					return;
				}

				if (gridModel.focusedCell) {
					Cell.blur();
				}

				rowIndex = $(this).closest(elems.row).index();
				colIndex = $(this).index();

				gridModel.currentRowIndex = rowIndex;
				gridModel.currentColIndex = colIndex;

				Cell.changeFocused();
			},

			blur: function() {
				if (gridModel.focusedCell.editing) {
					Cell.leaveEditMode(true);
				}

				gridModel.focusedCell.focused = false;
				gridModel.focusedCell.$elm.removeClass('focused');
				gridModel.focusedCell = null;
			},

			calculate: function(rowIndex, colIndex, changedField) {
				var calculate = gridOptions.columnDefs[colIndex].calculate;

				if (calculate && calculate.formula) {
					var formulaFields = calculate.formula.match(/(#[^\s\+\-\*\/]+#)/g);

					var _formula, value;

					_formula = calculate.formula;

					formulaFields.forEach(function(field) {
						var cellId  = field.replace(/#/g, ''),
							value   = Row.get(rowIndex).entity[cellId].value;

						_formula = _formula.replace(field, value || 0);
					});

					value = eval(_formula);
					value = isFinite(value) ? value : 0;

					Cell.setValue(Cell.get(rowIndex, colIndex), rowIndex, colIndex, value, changedField);
				}
			},

			setValue: function(cell, rowIndex, colIndex, value, changedField) {
				cell.value = value;

				Cell.getHtmlElement(cell, rowIndex, colIndex);
				cell.$elm.html(value);

				var calculate = gridOptions.columnDefs[colIndex].calculate;

				if (calculate && calculate.relations) {
					calculate.relations.forEach(function(fieldName) {
						var cell    = Row.get(rowIndex).entity[fieldName],
							field   = Cell.get(rowIndex, colIndex).field;

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

						if (!calculate.exclusions || !~calculate.exclusions.indexOf(changedField)) {
							Cell.calculate(rowIndex, cell.index, field);
						}
					});
				}
			},

			enterEditMode: function() {
				if (gridModel.isGridDisabled || gridModel.focusedCell.editing) {
					return;
				}

				if (!gridModel.focusedRow.dirty) {
					gridModel.dirtyRows.push(gridModel.focusedRow);
				}

				var cellValue   = gridModel.focusedCell.$elm.text(),
					columnDefs  = gridOptions.columnDefs[gridModel.focusedCell.index],
					options     = columnDefs.editModel.options,
					tpl         = columnDefs.editModel.template;

				gridModel.focusedRow.dirty = true;
				gridModel.focusedCell.editing = {
					defaultValue: cellValue
				};

				options = options ? 'options="' + JSON.stringify(options) + '"' : '';

				gridModel.focusedCell.$elm.html(ngMethods.compile('<n-grid-edit-cell-' + tpl + ' value="' + cellValue + '" ' + options + '>'));
			},

			leaveEditMode: function(saveChanges) {
				var value;

				if (saveChanges) {
					value = gridModel.focusedCell.$elm.find('input').val();
				} else {
					value = gridModel.focusedCell.editing.defaultValue;
				}

				gridModel.focusedCell.editing = false;

				Cell.setValue(gridModel.focusedCell, gridModel.currentRowIndex, gridModel.currentColIndex, value);
				Cell.calculate(gridModel.currentRowIndex, gridModel.currentColIndex);
			}
		};



		//////////////////////////////////////////////////////////////////////////////////////////
		// Init

		function setEvents() {
			elems.$grid.on('click', function(e) { e.stopPropagation(); });
			elems.$grid.on('click', elems.cell, Cell.focus);
			elems.$grid.on('dblclick', elems.cell, Cell.enterEditMode);
			elems.$grid.on('click', elems.removeRowBtn, Row.remove);

			elems.$bodyWrapper.on('scroll', Grid.onBodyScroll);

			elems.$addRowBtn.on('click', Row.create);
			elems.$saveBtn.on('click', Grid.save);
			elems.$editBtn.on('click', Grid.enterEditMode);
			elems.$cancelBtn.on('click', Grid.leaveEditMode);

			$(document).on('keydown.nGrid.navigation', Grid.navigate);
			$(document).on('keydown.nGrid.ESC', Grid.ESC);
			$(document).on('click.nGrid.blurGrid', Grid.blur);
		}

		function loadData() {
			var rows = generateRowsData(gridData);

			//console.log(rows);

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
				currentRowIndex: null,
				currentColIndex: null,
				focusedRow: null,
				focusedCell: null,
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

			generateStylesheets();
			getVisibleColumnDefs();
			appendHeaderHtml();
			initHeaderGrip();
			setEvents();

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
