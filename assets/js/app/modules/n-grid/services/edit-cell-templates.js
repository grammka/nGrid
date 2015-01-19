angular.module('nGrid').factory('nGridEditCellTemplates', function() {
	return {
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
		},
		remove: {

		}
	};
});
