'use strict';

var _get = require('babel-runtime/helpers/get')['default'];

var _inherits = require('babel-runtime/helpers/inherits')['default'];

var _createClass = require('babel-runtime/helpers/create-class')['default'];

var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
	value: true
});

var _immutable = require('immutable');

var _immutable2 = _interopRequireDefault(_immutable);

/**
 * Describes a field on an Action and how this field
 * should be sent to Siren API as part of that Action.
 *
 * @param {String} options.name:  ''     [description]
 * @param {String} options.title: null   [description]
 * @param {String} options.type:  'text' [description]
 * @param {Object} options.value: null   Default value to be sent on the field
 */

var ActionField = (function (_Immutable$Record) {
	_inherits(ActionField, _Immutable$Record);

	function ActionField() {
		_classCallCheck(this, ActionField);

		_get(Object.getPrototypeOf(ActionField.prototype), 'constructor', this).apply(this, arguments);
	}

	_createClass(ActionField, null, [{
		key: 'fromJson',

		/**
   * Parses a JSON representation of a field.
   *
   * @param {Object} json The Object representation of the ActionField.
   * @return {ActionField} parsed structure which represents a field on an action.
   */
		value: function fromJson(json) {
			if (!json.name) {
				throw new Error('name is required on an action field');
			}

			return empty.withMutations(function (map) {
				map.set('name', json.name || map.name);
				map.set('title', json.title || map.title);
				map.set('type', json.type || map.type);
				map.set('value', json.value || map.value);
			});
		}

		/**
   * Default empty state for a field.
   *
   * @return {ActionField} Default state
   */
	}, {
		key: 'empty',
		get: function get() {
			return empty;
		}
	}]);

	return ActionField;
})(_immutable2['default'].Record({
	name: '',
	title: null,
	type: 'text',
	value: null
}));

var empty = new ActionField();

exports['default'] = ActionField;
module.exports = exports['default'];
//# sourceMappingURL=ActionField.js.map
