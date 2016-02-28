'use strict';

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
	value: true
});

var _Client = require('./Client');

var _Client2 = _interopRequireDefault(_Client);

var _urijs = require('urijs');

var _urijs2 = _interopRequireDefault(_urijs);

/**
 * Follows the Siren model's link by the provided rel.
 *
 * @param  {String} rel  how the requested link is related to the result siren we are following.
 * @return {Promise}     Promise which resolves to a superagent response
 */
function follow(rel) {
	return function (res) {
		var link = res.body.findLinkByRel(rel) || res.body.linkedEntitiesByRel(rel).map(function (item) {
			return item.href;
		}).first() || res.body.embeddedEntitiesByRel(rel).map(function (item) {
			return item.entity.selfLink;
		}).first();

		if (!link) {
			throw new Error('No link found for provided rel', { rel: rel });
		}

		return typeof link === 'string' ? Siren.get(link) : link.follow();
	};
}

/**
 * Performs the action identified by the provided actionName using the provided data.
 *
 * @param  {String} name       The name that identifies the action to take
 * @param  {Object=} data      The data to send on the action
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

/**
 * Processes the provided url and computes the absolute URL provided
 * the url and optional baseUrl.
 *
 * @param  {String} url          The URL to process
 * @param  {String} [baseUrl]    Optional base URL to compute the absolute URL relative to.
 * @return {String}              Absolute URL
 */
function processUrl(url, baseUrl) {
	if (url && url.length > 0) {
		var uri = new _urijs2['default'](url);

		if (baseUrl) {
			uri = uri.absoluteTo(baseUrl);
		}

		return uri.toString();
	}

	return null;
}

exports['default'] = {
	follow: follow,
	performAction: performAction,
	processUrl: processUrl
};
module.exports = exports['default'];
//# sourceMappingURL=SirenHelpers.js.map
