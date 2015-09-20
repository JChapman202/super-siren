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
   * @return {LinkedSubEntity}      Parsed representation of the linked sub-entity.
   */
		value: function fromJson(json) {
			if (!json.rel || !_lodash2['default'].isArray(json.rel) || json.rel.length === 0) {
				throw new Error('A rel array with at least one rel is required to create a linked sub entity');
			}

			if (!json.href) {
				throw new Error('a href is required for a linked sub entity');
			}

			return empty.withMutations(function (map) {
				map.set('rels', new _immutable2['default'].Set(json.rel));
				map.set('href', json.href || map.href);
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
//# sourceMappingURL=../lib/LinkedSubEntity.js.map