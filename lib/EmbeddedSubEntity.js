import Immutable from 'immutable';
import Siren from './Siren';
import _ from 'lodash';

/**
 * Entity which has been embedded within a parent Siren instance.
 *
 * @param {Array} options.rels: new Immutable.Set() array of strings to identify how this
 *                              embedded entity is related to it's parent.
 * @param {Object} options.entity: Siren.empty embedded entity instance
 */
class EmbeddedSubEntity extends Immutable.Record({
	rels: new Immutable.Set(),
	entity: Siren.empty
}) {

	/**
	 * Parses the provided JSON representation of the Siren sub entity
	 * into an instance of an EmbeddedSubEntity.
	 *
	 * @param  {Object} json           The JSON representation of a siren embedded sub entity.
	 * @return {EmbeddedSubentity}     The representation of the parsed JSON.
	 */
	static parseJson(json) {
		if (!json.rel || !_.isArray(json.rel) || json.rel.length === 0) {
			throw new Error('A rel array is required to parse an embedded sub entity');
		}

		return empty.withMutations(map => {
			map.set('rels', new Immutable.Set(json.rel));
			map.set('entity', Siren.parseJson(json));
		});
	}

	/**
	 * Returns the default empty instance of an EmbeddedSubEntity.
	 *
	 * @return {EmbeddedSubentity} default dembedded sub entity.
	 */
	static get empty() {
		return empty;
	}
}

var empty = new EmbeddedSubEntity();

export default EmbeddedSubEntity;
