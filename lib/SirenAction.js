import Immutable from 'immutable';
import ActionField from './ActionField';
import _ from 'lodash';

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

	//TODO: add a validate method and use it while parsing

	/**
	 * Creates a SirenAction instance based on the provided
	 * JSON object structure.
	 *
	 * @param  {Object} json Object which matches the Siren JSON structure.
	 * @return {SirenAction}      Result of parsing the provided JSON object.
	 */
	static parseJson(json) {
		if (!json.name) {
			throw new Error('"name" is requires on an action');
		}

		return empty.withMutations(map => {
			map.set('name', json.name || map.name);
			map.set('title', json.title || map.title);
			map.set('method', json.method || map.method);
			map.set('href', json.href || map.href);
			map.set('type', json.type || map.type);
			map.set('fields', new Immutable.Map(_.map(json.fields || [], f => ActionField.parseJson(f)).map(af => [af.name, af])));
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
