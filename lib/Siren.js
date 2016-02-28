import Promise from 'bluebird';
import Immutable from 'immutable';
import LinkedSubEntity from './LinkedSubEntity';
import SirenLink from './SirenLink';
import SirenAction from './SirenAction';
import _ from 'lodash';
import Client from './Client';
import SirenHelpers from './SirenHelpers';

Client.addParser('application/vnd.siren+json', (text, requestUrl) => Siren.fromJson(JSON.parse(text), requestUrl));

Client.addHeader('Accept', 'application/vnd.siren+json');

const client = new Client();

/**
 * @class Siren
 * Immutable Siren entity.  This is the main entrypoint for all Siren operations.
 */
class Siren extends Immutable.Record({
	classes: Immutable.Set(),
	properties: Immutable.Map(),
	entities: Immutable.List(),
	actions: Immutable.Map(),
	links: Immutable.List()
}) {
	constructor(args) {
		if (!args && Siren.empty) {
			return Siren.empty;
		}
		else {
			super(args);
		}
	}

	/**
	 * Finds the @see {@link SirenAction} referenced by the provided rel.
	 *
	 * @param  {String} name The name of the action to find.
	 * @return {SirenAction} SirenAction matching the requested name.  null if none is found.
	 */
	findActionByName(name) {
		return this.actions.get(name) || null;
	}

	/**
	 * Finds the first @See {@link SirenLink} referenced by the provided rel.
	 *
	 * @param  {String} rel The relation to this Siren entity for the requested link.
	 * @return {SirenLink}     SirenLink matching the requested rel.  null if none is found.
	 */
	findLinkByRel(rel) {
		return this.links.filter(link => link.rels.contains(rel)).first() || null;
	}

	/**
	 * Finds the @See {@link EmbeddedSubEntity}|{@link LinkedSubEntity} entities referenced by the provided rel.
	 *
	 * @param  {String} rel The relation to this Siren entity for the requested sub-entity.
	 * @return {Immutable.List}  List of sub-entities matching the requested rel.
	 */
	findEntitiesByRel(rel) {
		return this.entities.filter(item => item.rels.contains(rel));
	}

	/**
	 * Returns the sub-entities on this Siren object which are embedded sub-entities.
	 *
	 * @return {Immutable.List}     List of embedded sub-entities.
	 */
	get embeddedEntities() {
		return this.entities
			.filter(item => item instanceof EmbeddedSubEntity)
			.toSet();
	}

	/**
	 * Returns the sub-entities on this Siren object which are embedded sub-entities.
	 *
	 * @param  {String} rel 	Only entities with a relation to the parent siren matching this should be returned.
	 * @return {Immutable.List}  List of embedded sub-entities which match thes provided rel.
	 */
	embeddedEntitiesByRel(rel) {
		return this.embeddedEntities
			.filter(item => item.rels.contains(rel));
	}

	/**
	 * Returns the sub-entities on the Siren object which are linked sub-entities.
	 *
	 * @return {Immutable.List}     List of linked sub-entities on this Siren object.
	 */
	get linkedEntities() {
		return this.entities
			.filter(item => item instanceof LinkedSubEntity)
			.toSet();
	}

	/**
	 * Returns the set of linked sub-entities on the Siren object which match the requested rel.
	 *
	 * @param  {String} rel     Only entities with this relation to the parent siren should be returned.
	 * @return {Immutable.List}  List of linked sub-entities which match the provided rel.
	 */
	linkedEntitiesByRel(rel) {
		return this.linkedEntities
			.filter(item => item.rels.contains(rel));
	}

	/**
	 * Returns the self link for this entity
	 *
	 * @return {SirenLink} link represented by the self rel, null if no self link is found.
	 */
	get selfLink() {
		return this.findLinkByRel('self');
	}

	//TODO: add a validate method and use it while parsing
	/**
	 * Parses a JSON representation of a Siren entity
	 * and returns the Siren representation.
	 * @param {Object} [obj] The JSON object to be parsed as Siren
	 * @param {String} [baseUrl=null] Optional base URL to use for relative URL parsing
	 * @return {Siren} Parsed Siren entity
	 */
	static fromJson(obj, baseUrl = null) {
		return Siren.empty.withMutations(map => {
			map.set('classes', map.classes.union(obj.class ? Immutable.fromJS(obj.class) : new Immutable.List()));

			for (let key in obj.properties) {
				map.set('properties', map.properties.set(key, obj.properties[key]));
			}

			map.set('links',
				new Immutable.List(
					_.map(obj.links || [], (item) => new SirenLink(item.rel, SirenHelpers.processUrl(item.href, baseUrl), item.class))
				)
			);

			map.set('actions',
				new Immutable.Map(
					_.map(obj.actions || [], (item) => SirenAction.fromJson(item, baseUrl))
					.map(action => [action.name, action])
				)
			);

			map.set('entities',
				new Immutable.List(
					_.map(obj.entities || [], (item) => item.href ? LinkedSubEntity.fromJson(item, baseUrl) : EmbeddedSubEntity.fromJson(item, baseUrl))
				)
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
		return Client.get(href);
	}
}

const emptySiren = new Siren();

/**
 * @class EmbeddedSubEntity
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
	 * @param  {Object} json           The JSON representation of a siren embedded sub entity
	 * @param  {String} [baseUrl=null] Optional base URL to use in case URLs are relative URLs
	 * @return {EmbeddedSubEntity}     The representation of the parsed JSON
	 */
	static fromJson(json, baseUrl=null) {
		if (!json.rel || !_.isArray(json.rel) || json.rel.length === 0) {
			throw new Error('A rel array is required to parse an embedded sub entity');
		}

		return EmbeddedSubEntity.empty.withMutations(map => {
			map.set('rels', new Immutable.Set(json.rel));
			map.set('entity', Siren.fromJson(json, baseUrl));
		});
	}

	/**
	 * Returns the default empty instance of an EmbeddedSubEntity.
	 *
	 * @return {EmbeddedSubEntity} default embedded sub entity
	 */
	static get empty() {
		return emptyEmbedded;
	}
}

const emptyEmbedded = new EmbeddedSubEntity();

Siren.Link = SirenLink;
Siren.Action = SirenAction;
Siren.LinkedSubEntity = LinkedSubEntity;
Siren.EmbeddedSubEntity = EmbeddedSubEntity;
Siren.Client = Client;

Siren.Helper = SirenHelpers;

export default Siren;
