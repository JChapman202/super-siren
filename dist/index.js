'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _libSiren = require('./lib/Siren');

var _libSiren2 = _interopRequireDefault(_libSiren);

exports['default'] = _libSiren2['default'];
module.exports = exports['default'];
'use strict';

Object.defineProperty(exports, '__esModule', {
	value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

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
'use strict';

Object.defineProperty(exports, '__esModule', {
	value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _immutable = require('immutable');

var _immutable2 = _interopRequireDefault(_immutable);

var _superagent = require('superagent');

var _superagent2 = _interopRequireDefault(_superagent);

var request = require('superagent-promise')(_superagent2['default'], Promise);

var globalHeaders = new _immutable2['default'].Map();

/**
 * HTTP client used by the Super-Siren library.  Library utilized [superaget](https://github.com/visionmedia/superagent)
 * for all requests.
 */

var Client = (function () {
	function Client() {
		_classCallCheck(this, Client);
	}

	_createClass(Client, null, [{
		key: 'get',

		/**
   * Creates a superagent HTTP get operation
   *
   * @param {String} href The URL to perform an HTTP get against.
   * @return {superagent-promise} superagent get request
   */
		value: function get(href) {
			var req = request.get(href);
			addHeaders(req);

			return req;
		}
	}, {
		key: 'put',
		value: function put(href) {
			var req = request.put(href);
			addHeaders(req);

			return req;
		}
	}, {
		key: 'post',
		value: function post(href) {
			var req = request.post(href);
			addHeaders(req);

			return req;
		}
	}, {
		key: 'del',
		value: function del(href) {
			var req = request.del(href);
			addHeaders(req);

			return req;
		}
	}, {
		key: 'action',
		value: function action(method, href) {
			method = (method || 'get').toLower();

			if (method === 'delete') {
				method = 'del';
			}

			var req = request[method](href);
			addHeaders(req);

			return req;
		}

		/**
   * Registers a content type parser with all client instances.
   *
   * @param {String} contentType     content-type which should be parsed with the provided function
   *                                 whenever a response is received with this content type.
   * @param {Function} parseFunction Function to call in order to return response body when response
   *                                 is encoded with the provided contentType.
   * @returns {undefined}
   */
	}, {
		key: 'addParser',
		value: function addParser(contentType, parseFunction) {
			_superagent2['default'].parse[contentType] = parseFunction;
		}

		/**
   * Returns a Map of current global headers that are added
   * for all clients.
   *
   * @return {Immutable.Map} Immutable map of all currently registered headers
   */
	}, {
		key: 'addHeader',

		/**
   * Registers a global header to be used by all client instances.
   *
   * @param {String} header The header attribute to set
   * @param {String} value The header value to set
   * @returns {undefined}
   */
		value: function addHeader(header, value) {
			globalHeaders = globalHeaders.set(header, value);
		}

		/**
   * Remves a previously registered global header.
   *
   * @param  {String} header The header attribute to remove
   * @returns {undefined}
   */
	}, {
		key: 'removeHeader',
		value: function removeHeader(header) {
			globalHeaders = globalHeaders['delete'](header);
		}
	}, {
		key: 'globalHeaders',
		get: function get() {
			return globalHeaders;
		}
	}]);

	return Client;
})();

function addHeaders(req) {
	globalHeaders.forEach(function (value, key) {
		req.set(key, value);
	});
}

exports['default'] = Client;
module.exports = exports['default'];
'use strict';

Object.defineProperty(exports, '__esModule', {
	value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

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
'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

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

_Client2['default'].addParser('application/vnd.siren+json', function (res) {
	return Siren.fromJson(JSON.parse(res));
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
  * @param  {String} rel The relation to this Siren entity for the requested action.
  * @return {SirenAction} SirenAction matching the requested rel.  null if none is found.
  */

	_createClass(Siren, [{
		key: 'findActionByRel',
		value: function findActionByRel(rel) {
			return this.actions.get(rel) || null;
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

module.exports = Siren;
'use strict';

Object.defineProperty(exports, '__esModule', {
	value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

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
'use strict';

Object.defineProperty(exports, '__esModule', {
	value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _immutable = require('immutable');

var _immutable2 = _interopRequireDefault(_immutable);

var _Client = require('./Client');

var _Client2 = _interopRequireDefault(_Client);

var SirenLink = (function (_Immutable$Record) {
	_inherits(SirenLink, _Immutable$Record);

	function SirenLink(rels, href) {
		_classCallCheck(this, SirenLink);

		_get(Object.getPrototypeOf(SirenLink.prototype), 'constructor', this).call(this, { rels: new _immutable2['default'].Set(rels), href: href });
	}

	/**
  * Perhaps an HTTP Get against the href represented by this Link.
  *
  * @return {superagent-promise} superagent request as a with a promise wrapper
  */

	_createClass(SirenLink, [{
		key: 'follow',
		value: function follow() {
			return _Client2['default'].get(this.href);
		}
	}]);

	return SirenLink;
})(_immutable2['default'].Record({
	rels: new _immutable2['default'].Set(),
	href: null
}));

exports['default'] = SirenLink;
module.exports = exports['default'];
//# sourceMappingURL=index.js.map