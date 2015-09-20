import Immutable from 'immutable';
import _ from 'lodash';

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
	 * @return {LinkedSubEntity}      Parsed representation of the linked sub-entity.
	 */
	static parseJson(json) {
		if (!json.rel || !_.isArray(json.rel) || json.rel.length === 0) {
			throw new Error('A rel array with at least one rel is required to create a linked sub entity');
		}

		if (!json.href) {
			throw new Error('a href is required for a linked sub entity');
		}

		return empty.withMutations(map => {
			map.set('rels', new Immutable.Set(json.rel));
			map.set('href', json.href || map.href);
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

var empty = new LinkedSubEntity();

export default LinkedSubEntity;
