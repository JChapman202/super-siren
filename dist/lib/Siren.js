'use strict';

var _get = require('babel-runtime/helpers/get')['default'];

var _inherits = require('babel-runtime/helpers/inherits')['default'];

var _createClass = require('babel-runtime/helpers/create-class')['default'];

var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

var _bluebird = require('bluebird');

var _bluebird2 = _interopRequireDefault(_bluebird);

var _immutable = require('immutable');

var _immutable2 = _interopRequireDefault(_immutable);

var _LinkedSubEntity = require('./LinkedSubEntity');

var _LinkedSubEntity2 = _interopRequireDefault(_LinkedSubEntity);

var _SirenLink = require('./SirenLink');

var _SirenLink2 = _interopRequireDefault(_SirenLink);

var _SirenAction = require('./SirenAction');

var _SirenAction2 = _interopRequireDefault(_SirenAction);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _Client = require('./Client');

var _Client2 = _interopRequireDefault(_Client);

var _SirenHelpers = require('./SirenHelpers');

var _SirenHelpers2 = _interopRequireDefault(_SirenHelpers);

_Client2['default'].addParser('application/vnd.siren+json', function (text) {
	return Siren.fromJson(JSON.parse(text));
});

_Client2['default'].addHeader('Cache-Control', 'no-cache,no-store,must-revalidate,max-age=-1');
_Client2['default'].addHeader('Accept', 'application/vnd.siren+json');
_Client2['default'].addHeader('Content-Type', 'application/json');

var client = new _Client2['default']();

var Siren = (function (_Immutable$Record) {
	_inherits(Siren, _Immutable$Record);

	function Siren(args) {
		_classCallCheck(this, Siren);

		if (!args && Siren.empty) {
			return Siren.empty;
		} else {
			_get(Object.getPrototypeOf(Siren.prototype), 'constructor', this).call(this, args);
		}
	}

	/**
  * Finds the @see {@link SirenAction} referenced by the provided rel.
  *
  * @param  {String} name The name of the action to find.
  * @return {SirenAction} SirenAction matching the requested name.  null if none is found.
  */

	_createClass(Siren, [{
		key: 'findActionByName',
		value: function findActionByName(name) {
			return this.actions.get(name) || null;
		}

		/**
   * Finds the @See {@link SirenLink} referenced by the provided rel.
   *
   * @param  {String} rel The relation to this Siren entity for the requested link.
   * @return {SirenLink}     SirenLink matching the requested rel.  null if none is found.
   */
	}, {
		key: 'findLinkByRel',
		value: function findLinkByRel(rel) {
			return this.links.get(rel) || null;
		}

		/**
   * Finds the @See {@link EmbeddedSubEntity}|{@link LinkedSubEntity} referenced by the provided rel.
   *
   * @param  {String} rel The relation to this Siren entity for the requested sub-entity.
   * @return {EmbeddedSubEntity|LinkedSubEntity}     The sub-entity matching the requested rel.  null if none is found.
   */
	}, {
		key: 'findEntityByRel',
		value: function findEntityByRel(rel) {
			return this.entities.get(rel) || null;
		}

		//TODO: add a validate method and use it while parsing
		/**
   * Parses a JSON representation of a Siren entity
   * and returns the Siren representation.
   * @param {Object} [obj] The JSON object to be parsed as Siren
   * @return {Siren} Parsed Siren entity
   */
	}], [{
		key: 'fromJson',
		value: function fromJson(obj) {
			return Siren.empty.withMutations(function (map) {
				map.set('classes', map.classes.union(obj['class'] ? _immutable2['default'].fromJS(obj['class']) : new _immutable2['default'].List()));

				for (var key in obj.properties) {
					map.set('properties', map.properties.set(key, obj.properties[key]));
				}

				map.set('links', new _immutable2['default'].Map(_lodash2['default'].flatten(_lodash2['default'].map(obj.links || [], function (item) {
					return new _SirenLink2['default'](item.rel, item.href);
				}).map(function (link) {
					return _lodash2['default'].map(link.rels.toJS(), function (rel) {
						return [rel, link];
					});
				}))));

				map.set('actions', new _immutable2['default'].Map(_lodash2['default'].map(obj.actions || [], function (item) {
					return _SirenAction2['default'].fromJson(item);
				}).map(function (action) {
					return [action.name, action];
				})));

				map.set('entities', new _immutable2['default'].Map(_lodash2['default'].flatten(_lodash2['default'].map(obj.entities || [], function (item) {
					return item.href ? _LinkedSubEntity2['default'].fromJson(item) : EmbeddedSubEntity.fromJson(item);
				}).map(function (e) {
					return _lodash2['default'].map(e.rels.toJS(), function (rel) {
						return [rel, e];
					});
				}))));
			});
		}

		/**
   * Returns an empty siren representation.  This Siren entity
   * contains no afforances.
   * @return {Siren} Empty siren structure
   */
	}, {
		key: 'get',

		/**
   * Returns a Superagent Promise instance which will perform an HTTP Get against
   * the provided href returning the response as a SuperAgent response.
   * If the response is Siren ('application/vnd.siren+json'),
   * then the body should be a Siren instance.
   *
   * @param {String} href The URL to perform an HTTP get against
   * @return {superagent-promise} Superagent Promise Object
   */
		value: function get(href) {
			return _Client2['default'].get(href);
		}
	}, {
		key: 'empty',
		get: function get() {
			return emptySiren;
		}
	}]);

	return Siren;
})(_immutable2['default'].Record({
	classes: _immutable2['default'].Set(),
	properties: _immutable2['default'].Map(),
	entities: _immutable2['default'].Map(),
	actions: _immutable2['default'].Map(),
	links: _immutable2['default'].Map()
}));

var emptySiren = new Siren();

/**
 * Entity which has been embedded within a parent Siren instance.
 *
 * @param {Array} options.rels: new Immutable.Set() array of strings to identify how this
 *                              embedded entity is related to it's parent.
 * @param {Object} options.entity: Siren.empty embedded entity instance
 */

var EmbeddedSubEntity = (function (_Immutable$Record2) {
	_inherits(EmbeddedSubEntity, _Immutable$Record2);

	function EmbeddedSubEntity() {
		_classCallCheck(this, EmbeddedSubEntity);

		_get(Object.getPrototypeOf(EmbeddedSubEntity.prototype), 'constructor', this).apply(this, arguments);
	}

	_createClass(EmbeddedSubEntity, null, [{
		key: 'fromJson',

		/**
   * Parses the provided JSON representation of the Siren sub entity
   * into an instance of an EmbeddedSubEntity.
   *
   * @param  {Object} json           The JSON representation of a siren embedded sub entity.
   * @return {EmbeddedSubEntity}     The representation of the parsed JSON.
   */
		value: function fromJson(json) {
			if (!json.rel || !_lodash2['default'].isArray(json.rel) || json.rel.length === 0) {
				throw new Error('A rel array is required to parse an embedded sub entity');
			}

			return EmbeddedSubEntity.empty.withMutations(function (map) {
				map.set('rels', new _immutable2['default'].Set(json.rel));
				map.set('entity', Siren.fromJson(json));
			});
		}

		/**
   * Returns the default empty instance of an EmbeddedSubEntity.
   *
   * @return {EmbeddedSubEntity} default dembedded sub entity.
   */
	}, {
		key: 'empty',
		get: function get() {
			return emptyEmbedded;
		}
	}]);

	return EmbeddedSubEntity;
})(_immutable2['default'].Record({
	rels: new _immutable2['default'].Set(),
	entity: Siren.empty
}));

var emptyEmbedded = new EmbeddedSubEntity();

Siren.Link = _SirenLink2['default'];
Siren.Action = _SirenAction2['default'];
Siren.LinkedSubEntity = _LinkedSubEntity2['default'];
Siren.EmbeddedSubEntity = EmbeddedSubEntity;
Siren.Client = _Client2['default'];

Siren.Helper = _SirenHelpers2['default'];

module.exports = Siren;
//# sourceMappingURL=../lib/Siren.js.map