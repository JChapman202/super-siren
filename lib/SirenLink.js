import Immutable from 'immutable';

class SirenLink extends Immutable.Record({
	rels: new Immutable.Set(),
	href: null
}) {
	constructor(rels, href) {
		super({rels: new Immutable.Set(rels), href: href});
	}
}

export default SirenLink;
