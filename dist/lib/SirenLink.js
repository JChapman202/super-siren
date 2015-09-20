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
//# sourceMappingURL=../lib/SirenLink.js.map