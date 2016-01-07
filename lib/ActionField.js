import Immutable from 'immutable';

/**
 * Describes a field on an Action and how this field
 * should be sent to Siren API as part of that Action.
 *
 * @param {String} options.name:  ''     [description]
 * @param {String} options.title: null   [description]
 * @param {String} options.type:  'text' [description]
 * @param {Object} options.value: null   Default value to be sent on the field
 */
class ActionField extends Immutable.Record({
	name: '',
	title: null,
	type: 'text',
	value: null
}) {
	/**
	 * Parses a JSON representation of a field.
	 *
	 * @param {Object} json The Object representation of the ActionField.
	 * @return {ActionField} parsed structure which represents a field on an action.
	 */
	static fromJson(json) {
		if (!json.name) {
			throw new Error('name is required on an action field');
		}

		return empty.withMutations(map => {
			map.set('name', json.name || map.name);
			map.set('title', json.title || map.title);
			map.set('type', json.type || map.type);
			map.set('value', json.value || map.value);
		});
	}

	/**
	 * Default empty state for a field.
	 *
	 * @return {ActionField} Default state
	 */
	static get empty() {
		return empty;
	}
}

const empty = new ActionField();

export default ActionField;
