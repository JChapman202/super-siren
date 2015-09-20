import Immutable from 'immutable';
import Client from './Client';

class SirenLink extends Immutable.Record({
	rels: new Immutable.Set(),
	href: null
}) {
	constructor(rels, href) {
		super({rels: new Immutable.Set(rels), href: href});
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
