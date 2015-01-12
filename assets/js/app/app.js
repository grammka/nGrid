$.noty.defaults.layout = 'topCenter';
$.noty.defaults.timeout = 3000;

$.datepicker.setDefaults({
	closeText: 'Закрыть',
	prevText: '&#x3c;Пред',
	nextText: 'След&#x3e;',
	currentText: 'Сегодня',
	monthNames: ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'],
	monthNamesShort: ['Янв', 'Фев', 'Мар', 'Апр', 'Май', 'Июн', 'Июл', 'Авг', 'Сен', 'Окт', 'Ноя', 'Дек'],
	dayNames: ['воскресенье', 'понедельник', 'вторник', 'среда', 'четверг', 'пятница', 'суббота'],
	dayNamesShort: ['вск', 'пнд', 'втр', 'срд', 'чтв', 'птн', 'сбт'],
	dayNamesMin: ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'],
	weekHeader: 'Не',
	dateFormat: 'dd.mm.yy',
	firstDay: 1,
	isRTL: false,
	showMonthAfterYear: false,
	yearSuffix: ''
});

$('body').on('click', '#ui-datepicker-div', function(event) {
	event.preventDefault();
	event.stopPropagation();
});

$(document).on('keydown.preventF5', function(e) {
	if ((e.which || e.keyCode) == 116) {
		e.preventDefault();
	}
});


angular.module('TWMSApp', [
	'ngRoute',
	'ngGrid',
	'nGrid',
	'LocalStorageModule',
	'ui.date',
	'ui.bootstrap',
	'chieffancypants.loadingBar',
	'tc.chartjs',
	'ui.mask',
	'angucomplete-alt',
	'route-segment',
	'view-segment',
	'drahak.hotkeys',
	'ui.select2'
]);
