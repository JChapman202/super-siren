'use strict';

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
	value: true
});

var _Client = require('./Client');

var _Client2 = _interopRequireDefault(_Client);

/**
 * Follows the Siren model's link by the provided rel.
 *
 * @param  {String} rel how the requested link is related to the result siren we are following.
 * @return {Promise}     Promise which resolves to a superagent response
 */
function follow(rel) {
	return function (res) {
		var link = res.body.findLinkByRel(rel);

		if (!link) {
			throw new Error('No link found for provided rel', { rel: rel });
		}

		return link.follow();
	};
}

/**
 * Performs the action identified by the provided actionName using the provided data.
 *
 * @param  {String} name       The name that identifies the action to take
 * @param  {Object} data       The data to send on the action
 * @return {Promise}           Promise which resolves to a superagent response
 */
function performAction(name, data) {
	return function (res) {
		var action = res.body.findActionByName(name);

		if (!action) {
			throw new Error('No action found for the provided name', { name: name });
		}

		return action.perform(data);
	};
}

exports['default'] = {
	follow: follow,
	performAction: performAction
};
module.exports = exports['default'];
//# sourceMappingURL=../lib/SirenHelpers.js.map