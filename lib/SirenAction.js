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
	classes: new Immutable.Set(),
	type: 'application/x-www-form-urlencoded',
	fields: new Immutable.Map()
}) {
	/**
	 * Performs the action specified by this Action.
	 *
	 * @param  {Object=} data                          Query params sent as part of this action
	 * @return {superagent-promise} Superagent Promise HTTP request to perform this action
	 */
	perform(data) {
		data = data || {};

		const req = Client.action(this.method, this.href);

		if (this.type && this.type !== 'multipart/form-data') {
			//superagent needs to set it's own type for multipart/form-data content
			req.type(this.type);
		}

		const payload = {};

		this.fields.forEach(f => { if(f.value) payload[f.name] = f.value });
		Immutable.fromJS(data).forEach((value, key) => payload[key] = value);

		if (this.method.toLowerCase() === 'get') {
			req.query(payload);
		}
		else {
			if (this.type === 'multipart/form-data') {
				const formData = new FormData();

				for (let key in payload) {
					formData.append(key, payload[key]);
				}

				req.send(formData);
			}
			else {
				req.send(payload);
			}
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
			map.set('classes', new Immutable.Set(json.class || []));
			map.set('type', json.type || map.type);
			map.set('fields', new Immutable.Map(_
				.map(json.fields || [], f => ActionField.fromJson(f))
				.map(af => [af.name, af]))
			);
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

const empty = new SirenAction();

export default SirenAction;
