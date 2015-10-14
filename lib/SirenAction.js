import _ from 'lodash';
import Immutable from 'immutable';
import ActionField from './ActionField';
import Client from './Client';
import SirenHelpers from './SirenHelpers';

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
class SirenAction extends Immutable.Record({
	name: null,
	title: null,
	method: 'GET',
	href: null,
	type: 'application/x-www-form-urlencoded',
	fields: new Immutable.Map()
}) {
	/**
	 * Performs the action specified by this Action.
	 *
	 * @param  {Object} data Data to be sent as part of this action
	 * @return {superagent-promise} superagent promise representing the HTTP request to perform this action
	 */
	perform(data) {
		var req = Client.action(this.method, this.href);

		if (this.type) {
			req.type(this.type);
		}

		var payload = { };

		this.fields.filter(f => f.value !== null).forEach(f => payload[f.name] = f.value);
		Immutable.fromJS(data).forEach((value, key) => payload[key] = value);

		if (this.method.toLowerCase() === 'get') {
			req.query(payload);
		}
		else {
			req.send(payload);
		}

		return req;
	}

	/**
	 * Creates a SirenAction instance based on the provided
	 * JSON object structure.
	 *
	 * @param  {Object} json      Object which matches the Siren JSON structure.
	 * @param  {String} [baseUrl] optional url to use as the base URL for all parsed URLs
	 * @return {SirenAction}      Result of parsing the provided JSON object.
	 */
	static fromJson(json, baseUrl) {
		if (!json.name) {
			throw new Error('"name" is requires on an action');
		}

		return empty.withMutations(map => {
			map.set('name', json.name || map.name);
			map.set('title', json.title || map.title);
			map.set('method', json.method || map.method);
			map.set('href', SirenHelpers.processUrl(json.href || map.href, baseUrl));
			map.set('type', json.type || map.type);
			map.set('fields', new Immutable.Map(_.map(json.fields || [], f => ActionField.fromJson(f)).map(af => [af.name, af])));
		});
	}

	/**
	 * Default state for a SirenAction.  This has the defaults set and nothing
	 * else.
	 *
	 * @return {SirenAction} Siren Action which is created as a result of parsing
	 *                             the provided JSON.
	 */
	static get empty() {
		return empty;
	}
}

var empty = new SirenAction();

export default SirenAction;
