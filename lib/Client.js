import Immutable from 'immutable';
import superagent from 'superagent';
import bluebird from 'bluebird';

var request = require('superagent-promise')(superagent, bluebird);

var globalHeaders = new Immutable.Map();

/**
 * HTTP client used by the Super-Siren library.  Library utilized [superaget](https://github.com/visionmedia/superagent)
 * for all requests.
 */
class Client {
	/**
	 * Creates a superagent HTTP get operation
	 *
	 * @param {String} href The URL to perform an HTTP get against.
	 * @return {superagent-promise} superagent get request
	 */
	static get(href) {
		var req = request.get(href);
		addHeaders(req);

		return req;
	}

	static put(href) {
		var req = request.put(href);
		addHeaders(req);

		return req;
	}

	static post(href) {
		var req = request.post(href);
		addHeaders(req);

		return req;
	}

	static del(href) {
		var req = request.del(href);
		addHeaders(req);

		return req;
	}

	static action(method, href) {
		method = (method || 'get').toLowerCase();

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
	static addParser(contentType, parseFunction) {
		superagent.parse[contentType] = (res, done) => {
			res.text = '';
			res.setEncoding('utf8');
			res.on('data', chunk => {res.text += chunk;});
			res.on('end', () => {
				var err = null;
				var body = null;

				try {
					var text = res.text && res.text.replace(/^\s*|\s*$/g, '');
					body = text && parseFunction(text);
				}
				catch(e) {
					err = e;
				}
				finally {
					done(err, body);
				}
			});
		};
	}

	/**
	 * Returns a Map of current global headers that are added
	 * for all clients.
	 *
	 * @return {Immutable.Map} Immutable map of all currently registered headers
	 */
	static get globalHeaders() {
		return globalHeaders;
	}

	/**
	 * Registers a global header to be used by all client instances.
	 *
	 * @param {String} header The header attribute to set
	 * @param {String} value The header value to set
	 * @returns {undefined}
	 */
	static addHeader(header, value) {
		globalHeaders = globalHeaders.set(header, value);
	}

	/**
	 * Remves a previously registered global header.
	 *
	 * @param  {String} header The header attribute to remove
	 * @returns {undefined}
	 */
	static removeHeader(header) {
		globalHeaders = globalHeaders.delete(header);
	}
}

function addHeaders(req) {
	globalHeaders.forEach((value, key) => {
		req.set(key, value);
	});
}

export default Client;
