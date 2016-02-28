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

var _Client = require('./Client');

var _Client2 = _interopRequireDefault(_Client);

/**
 * Siren link used to describe navigation through a siren entity graph.
 *
 * @property {Immutable.Set} rels - set of all rels which describe this link.
 * @property {String} href URL - that this link refers to.
 */

var SirenLink = (function (_Immutable$Record) {
	_inherits(SirenLink, _Immutable$Record);

	/**
  * Constructs a new SirenLink based on the provided rels and href values.
  *
  * @param  {Array.<String>} rels - array of rel values for this link
  * @param  {String} href - URL that this link refers to.
  * @param   {Array.<String>} classes - Array of optional class names
  *
  * @return {SirenLink} Constructed SirenLink instance.
  */

	function SirenLink(rels, href) {
		var classes = arguments.length <= 2 || arguments[2] === undefined ? [] : arguments[2];

		_classCallCheck(this, SirenLink);

		_get(Object.getPrototypeOf(SirenLink.prototype), 'constructor', this).call(this, { rels: new _immutable2['default'].Set(rels), href: href, classes: new _immutable2['default'].Set(classes) });
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
	/**
  * @member {Immutable.Set}
  */
	rels: new _immutable2['default'].Set(),
	classes: new _immutable2['default'].Set(),
	href: null
}));

exports['default'] = SirenLink;
module.exports = exports['default'];
//# sourceMappingURL=SirenLink.js.map
