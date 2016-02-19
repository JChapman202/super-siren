import Immutable from 'immutable';
import Client from './Client';

/**
 * Siren link used to describe navigation through a siren entity graph.
 *
 * @property {Immutable.Set} rels - set of all rels which describe this link.
 * @property {String} href URL - that this link refers to.
 */
class SirenLink extends Immutable.Record({
	/**
	 * @member {Immutable.Set}
	 */
	rels: new Immutable.Set(),
	classes: new Immutable.Set(),
	href: null
}) {
	/**
	 * Constructs a new SirenLink based on the provided rels and href values.
	 *
	 * @param  {Array.<String>} rels - array of rel values for this link
	 * @param  {String} href - URL that this link refers to.
	 * @param   {Array.<String>} classes - Array of optional class names
	 *
	 * @return {SirenLink} Constructed SirenLink instance.
	 */
	constructor(rels, href, classes = []) {
		super({rels: new Immutable.Set(rels), href: href, classes: new Immutable.Set(classes)});
	}

	/**
	 * Perhaps an HTTP Get against the href represented by this Link.
	 *
	 * @return {superagent-promise} superagent request as a with a promise wrapper
	 */
	follow() {
		return Client.get(this.href);
	}
}

export default SirenLink;
