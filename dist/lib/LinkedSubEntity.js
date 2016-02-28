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

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _SirenHelpers = require('./SirenHelpers');

var _SirenHelpers2 = _interopRequireDefault(_SirenHelpers);

/**
 * Represents an sub-entity of an entity which is represented
 * as a URL to the actual entity instance.
 */

var LinkedSubEntity = (function (_Immutable$Record) {
	_inherits(LinkedSubEntity, _Immutable$Record);

	function LinkedSubEntity() {
		_classCallCheck(this, LinkedSubEntity);

		_get(Object.getPrototypeOf(LinkedSubEntity.prototype), 'constructor', this).apply(this, arguments);
	}

	_createClass(LinkedSubEntity, null, [{
		key: 'fromJson',

		/**
   * Parses the provided json instance and returns
   * the LinkedSubEntity representation of that json
   *
   * @param  {Object} json Object representation of the linked sub-entity
   * @param  {String} [baseUrl=null] Optional baseUrl to use if the href is a relative URL
   * @return {LinkedSubEntity}      Parsed representation of the linked sub-entity.
   */
		value: function fromJson(json) {
			var baseUrl = arguments.length <= 1 || arguments[1] === undefined ? null : arguments[1];

			if (!json.rel || !_lodash2['default'].isArray(json.rel) || json.rel.length === 0) {
				throw new Error('A rel array with at least one rel is required to create a linked sub entity');
			}

			if (!json.href) {
				throw new Error('a href is required for a linked sub entity');
			}

			return empty.withMutations(function (map) {
				map.set('rels', new _immutable2['default'].Set(json.rel));
				map.set('href', _SirenHelpers2['default'].processUrl(json.href || map.href, baseUrl));
				map.set('classes', new _immutable2['default'].Set(json['class'] || []));
			});
		}

		/**
   * Default empty instance of a LinkedSubEntity
   * @return {LinkedSubEntity} Default empty state
   */
	}, {
		key: 'empty',
		get: function get() {
			return empty;
		}
	}]);

	return LinkedSubEntity;
})(_immutable2['default'].Record({
	rels: new _immutable2['default'].Set(),
	classes: new _immutable2['default'].Set(),
	href: null
}));

var empty = new LinkedSubEntity();

exports['default'] = LinkedSubEntity;
module.exports = exports['default'];
//# sourceMappingURL=LinkedSubEntity.js.map
