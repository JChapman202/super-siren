var Immutable = require('immutable');

class Siren extends Immutable.Record({
	classes: Immutable.List(),
	properties: Immutable.Map(),
	entities: Immutable.Map(),
	actions: Immutable.Map(),
	links: Immutable.Map()
}) {

}

module.exports = Siren;
