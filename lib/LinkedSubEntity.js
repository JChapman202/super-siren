import Immutable from 'immutable';
import _ from 'lodash';
import SirenHelpers from './SirenHelpers';

/**
 * Represents an sub-entity of an entity which is represented
 * as a URL to the actual entity instance.
 */
class LinkedSubEntity extends Immutable.Record({
	rels: new Immutable.Set(),
	classes: new Immutable.Set(),
	href: null
}) {

	/**
	 * Parses the provided json instance and returns
	 * the LinkedSubEntity representation of that json
	 *
	 * @param  {Object} json Object representation of the linked sub-entity
	 * @param  {String} [baseUrl=null] Optional baseUrl to use if the href is a relative URL
	 * @return {LinkedSubEntity}      Parsed representation of the linked sub-entity.
	 */
	static fromJson(json, baseUrl=null) {
		if (!json.rel || !_.isArray(json.rel) || json.rel.length === 0) {
			throw new Error('A rel array with at least one rel is required to create a linked sub entity');
		}

		if (!json.href) {
			throw new Error('a href is required for a linked sub entity');
		}

		return empty.withMutations(map => {
			map.set('rels', new Immutable.Set(json.rel));
			map.set('href', SirenHelpers.processUrl(json.href || map.href, baseUrl));
			map.set('classes', new Immutable.Set(json.class || []));
		});
	}

	/**
	 * Default empty instance of a LinkedSubEntity
	 * @return {LinkedSubEntity} Default empty state
	 */
	static get empty() {
		return empty;
	}
}

const empty = new LinkedSubEntity();

export default LinkedSubEntity;
