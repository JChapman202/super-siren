'use strict';

var _get = require('babel-runtime/helpers/get')['default'];

var _inherits = require('babel-runtime/helpers/inherits')['default'];

var _createClass = require('babel-runtime/helpers/create-class')['default'];

var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
	value: true
});

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _immutable = require('immutable');

var _immutable2 = _interopRequireDefault(_immutable);

var _ActionField = require('./ActionField');

var _ActionField2 = _interopRequireDefault(_ActionField);

var _Client = require('./Client');

var _Client2 = _interopRequireDefault(_Client);

/**
 * Representation of a Siren action, which allows a state within a Siren Hypermedia API
 * to transition to a new state.
 *
 * @param {String} options.name:   null                                [description]
 * @param {String} options.title:  null                                [description]
 * @param {String} options.method: 'GET'                               [description]
 * @param {String} options.href:   null                                [description]
 * @param {String} options.type:   'application/x-www-form-urlencoded' [description]
 * @param {Immutable.Map} options.fields: new Immutable.Map()          [description]
 */

var SirenAction = (function (_Immutable$Record) {
	_inherits(SirenAction, _Immutable$Record);

	function SirenAction() {
		_classCallCheck(this, SirenAction);

		_get(Object.getPrototypeOf(SirenAction.prototype), 'constructor', this).apply(this, arguments);
	}

	_createClass(SirenAction, [{
		key: 'perform',

		/**
   * Performs the action specified by this Action.
   *
   * @param  {Object} data Data to be sent as part of this action
   * @return {superagent-promise} superagent promise representing the HTTP request to perform this action
   */
		value: function perform(data) {
			var req = _Client2['default'].action(this.method, this.href);
			var payload = {};

			this.fields.forEach(function (f) {
				return payload[f.name] = f.value;
			});
			_immutable2['default'].fromJS(data).forEach(function (value, key) {
				return payload[key] = value;
			});

			if (this.method === 'get') {
				req.query(data);
			} else {
				req.send(data);
			}

			return req;
		}

		/**
   * Creates a SirenAction instance based on the provided
   * JSON object structure.
   *
   * @param  {Object} json Object which matches the Siren JSON structure.
   * @return {SirenAction}      Result of parsing the provided JSON object.
   */
	}], [{
		key: 'fromJson',
		value: function fromJson(json) {
			if (!json.name) {
				throw new Error('"name" is requires on an action');
			}

			return empty.withMutations(function (map) {
				map.set('name', json.name || map.name);
				map.set('title', json.title || map.title);
				map.set('method', json.method || map.method);
				map.set('href', json.href || map.href);
				map.set('type', json.type || map.type);
				map.set('fields', new _immutable2['default'].Map(_lodash2['default'].map(json.fields || [], function (f) {
					return _ActionField2['default'].fromJson(f);
				}).map(function (af) {
					return [af.name, af];
				})));
			});
		}

		/**
   * Default state for a SirenAction.  This has the defaults set and nothing
   * else.
   *
   * @return {SirenAction} Siren Action which is created as a result of parsing
   *                             the provided JSON.
   */
	}, {
		key: 'empty',
		get: function get() {
			return empty;
		}
	}]);

	return SirenAction;
})(_immutable2['default'].Record({
	name: null,
	title: null,
	method: 'GET',
	href: null,
	type: 'application/x-www-form-urlencoded',
	fields: new _immutable2['default'].Map()
}));

var empty = new SirenAction();

exports['default'] = SirenAction;
module.exports = exports['default'];
//# sourceMappingURL=../lib/SirenAction.js.map