import Promise from 'bluebird';
import Immutable from 'immutable';
import LinkedSubEntity from './LinkedSubEntity';
import SirenLink from './SirenLink';
import SirenAction from './SirenAction';
import _ from 'lodash';
import superagent from 'superagent';
var request = require('superagent-promise')(superagent, Promise);

superagent.parse['application/vnd.siren+json'] = (res) => Siren.fromJson(JSON.parse(res));

class Siren extends Immutable.Record({
	classes: Immutable.Set(),
	properties: Immutable.Map(),
	entities: Immutable.Map(),
	actions: Immutable.Map(),
	links: Immutable.Map()
}) {
	constructor(args) {
		if (!args && Siren.empty) {
			return Siren.empty;
		}
		else {
			super(args);
		}
	}

	//TODO: add a validate method and use it while parsing
	/**
	 * Parses a JSON representation of a Siren entity
	 * and returns the Siren representation.
	 * @param {Object} [obj] The JSON object to be parsed as Siren
	 * @return {Siren} Parsed Siren entity
	 */
	static fromJson(obj) {
		return Siren.empty.withMutations(map => {
			map.set('classes', map.classes.union(obj.class ? Immutable.fromJS(obj.class) : new Immutable.List()));

			for (var key in obj.properties) {
				map.set('properties', map.properties.set(key, obj.properties[key]));
			}

			map.set('links',
				new Immutable.Map(_.flatten(
					_.map(obj.links || [], (item) => new SirenLink(item.rel, item.href))
					.map(link => _.map(link.rels.toJS(), rel => [rel, link]))
				))
			);

			map.set('actions',
				new Immutable.Map(
					_.map(obj.actions || [], (item) => SirenAction.fromJson(item))
					.map(action => [action.name, action])
				)
			);

			map.set('entities',
				new Immutable.Map(_.flatten(
					_.map(obj.entities || [], (item) => item.href ? LinkedSubEntity.fromJson(item) : EmbeddedSubEntity.fromJson(item))
					.map(e => _.map(e.rels.toJS(), rel => [rel, e]))
				))
			);
		});
	}

	/**
	 * Returns an empty siren representation.  This Siren entity
	 * contains no afforances.
	 * @return {Siren} Empty siren structure
	 */
	static get empty() {
		return emptySiren;
	}

	/**
	 * Returns a Superagent Promise instance which will perform an HTTP Get against
	 * the provided href returning the response as a SuperAgent response.
	 * If the response is Siren ('application/vnd.siren+json'),
	 * then the body should be a Siren instance.
	 *
	 * @param {String} href The URL to perform an HTTP get against
	 * @return {superagent-promise} Superagent Promise Object
	 */
	static get(href) {
		return request.get(href);
	}
}

var emptySiren = new Siren();

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
	 * @return {EmbeddedSubEntity}     The representation of the parsed JSON.
	 */
	static fromJson(json) {
		if (!json.rel || !_.isArray(json.rel) || json.rel.length === 0) {
			throw new Error('A rel array is required to parse an embedded sub entity');
		}

		return EmbeddedSubEntity.empty.withMutations(map => {
			map.set('rels', new Immutable.Set(json.rel));
			map.set('entity', Siren.fromJson(json));
		});
	}

	/**
	 * Returns the default empty instance of an EmbeddedSubEntity.
	 *
	 * @return {EmbeddedSubEntity} default dembedded sub entity.
	 */
	static get empty() {
		return emptyEmbedded;
	}
}

var emptyEmbedded = new EmbeddedSubEntity();

Siren.Link = SirenLink;
Siren.Action = SirenAction;
Siren.LinkedSubEntity = LinkedSubEntity;
Siren.EmbeddedSubEntity = EmbeddedSubEntity;

module.exports = Siren;
