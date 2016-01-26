import Client from './Client';
import Uri from 'urijs';

/**
 * Follows the Siren model's link by the provided rel.
 *
 * @param  {String} rel how the requested link is related to the result siren we are following.
 * @return {Promise}     Promise which resolves to a superagent response
 */
function follow(rel) {
	return (res) => {
		var link = res.body.findLinkByRel(rel)
			|| res.body.linkedEntitiesByRel(rel).map(item => item.href).first()
			|| res.body.embeddedEntitiesByRel(rel).map(item => item.entity.selfLink).first();

		if (!link) {
			throw new Error('No link found for provided rel', {rel});
		}

		return typeof link === 'string' ? Siren.get(link) : link.follow();
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
	return (res) => {
		var action = res.body.findActionByName(name);

		if (!action) {
			throw new Error('No action found for the provided name', {name});
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
	var returnVal = null;

	if (url && url.length > 0) {
		var uri = new Uri(url);

		if (baseUrl) {
			uri = uri.absoluteTo(baseUrl);
		}

		returnVal = uri.toString();
	}

	return returnVal;
}

export default {
	follow,
	performAction,
	processUrl
};
