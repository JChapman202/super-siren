import Immutable from 'immutable';
import LinkedSubEntity from '../lib/LinkedSubEntity';
import Siren from '../lib/Siren';
import SirenAction from '../lib/SirenAction';
import SirenLink from '../lib/SirenLink';
import {expect} from 'chai';
import Chance from 'Chance';
import sinon from 'sinon';

let EmbeddedSubEntity = Siren.EmbeddedSubEntity;
let chance = new Chance();

describe('Siren', () => {
	describe('When creating a new Siren entity', () => {
		let siren;

		beforeEach(() => {
			siren = new Siren();
		});

		it('Should have no properties', () => {
			expect(siren.properties.isEmpty()).to.be.true;
		});

		it('Should not have a class', () => {
			expect(siren.classes.isEmpty()).to.be.true;
		});

		it('Should have no links', () => {
			expect(siren.links.isEmpty()).to.be.true;
		});

		it('Should have no entities', () => {
			expect(siren.entities.isEmpty()).to.be.true;
		});

		describe('empty', () => {
			let empty;

			beforeEach(() => {
				empty = Siren.empty;
			});

			it('A new siren entity should be the same instance as the static empty Siren', () => {
				expect(siren).to.equal(empty);
			});
		});

		describe('selfLink', () => {
			describe('When a link with a self rel exists', () => {
				let link;

				beforeEach(() => {
					link = new SirenLink(['self'], chance.url());
					siren = new Siren({links: new Immutable.Set().add(link)});
				});

				it('selfLink should return that link', () => {
					expect(siren.selfLink).to.equal(link);
				});
			});

			describe('When no link with a self rel exists', () => {
				let link;

				beforeEach(() => {
					link = new SirenLink('not-self', chance.url());
					siren = new Siren({links: new Immutable.Map().set('not-self', link)});
				});

				it('selfLink should return null', () => {
					expect(siren.selfLink).to.be.null;
				});
			});
		});

		describe('When parsing a JSON Siren representation', () => {
			let json;

			let act = () => {
				siren = Siren.fromJson(json);
			};

			beforeEach(() => {
				siren = null;
				json = {};
			});

			describe('When the JSON contains class items', () => {
				beforeEach(() => {
					json.class = ['test1', 'test2'];
					act();
				});

				it('Should have the class names as part of the Siren entity', () => {
					expect(siren.classes.toJS()).to.contain('test1');
					expect(siren.classes.toJS()).to.contain('test2');
				});
			});

			describe('When the JSON contains properties', () => {
				beforeEach(() => {
					json.properties = {
						name: chance.first(),
						age: chance.age()
					};

					act();
				});

				it('Should have a map of properties which contains each JSON object property', () => {
					expect(siren.properties.has('name')).to.be.true;
					expect(siren.properties.has('age')).to.be.true;
				});

				it('Should have the property values assigned', () => {
					expect(siren.properties.get('name')).to.equal(json.properties.name);
					expect(siren.properties.get('age')).to.equal(json.properties.age);
				});
			});

			describe('When the JSON contains a complex object', () => {
				beforeEach(() => {
					json.properties = {
						person: {
							name: chance.first(),
							age: chance.age()
						}
					};
					act();
				});

				it('Should contain a property of the root object name in the properties map', () => {
					expect(siren.properties.has('person')).to.be.true;
				});

				it('Should not convert the complex object into an Immutable type', () => {
					expect(Immutable.Map.isMap(siren.properties.get('person'))).to.be.false;
				});

				it('Should contain a property which equals the complex object', () => {
					expect(siren.properties.get('person')).to.equal(json.properties.person);
				});
			});

			describe('When the JSON contains links', () => {
				describe('When a link has a single rel', () => {
					beforeEach(() => {
						json.links = [
							{ rel: ['a'], class: ['x', 'y'], href: 'http://this.com' }
						];

						act();
					});

					it('Should construct a SirenLink instance for the provided link', () => {
						expect(siren.links.filter(link => link.rels.contains('a')).first()).not.to.be.null;
					});

					it('Should construct a SirenLink containing the classes of the link JSON', () => {
						expect(siren.links.filter(link => link.rels.contains('a')).first().classes.toJS()).to.contain('x');
					});

					it('Should allow for retrieval of the SirenLink by rel', () => {
						expect(siren.findLinkByRel('a')).not.to.be.null;
					});
				});

				describe('When a link has multiple rels', () => {
					beforeEach(() => {
						json.links = [
							{ rel: ['a', 'b'], href: 'http://that.com' }
						];

						act();
					});

					it('Should construct a SirenLink instance for the provided link', () => {
						expect(siren.links.filter(link => link.rels.contains('a')).first()).not.to.be.null;
						expect(siren.links.filter(link => link.rels.contains('b')).first()).not.to.be.null;
					});

					it('Should allow for retrieval of the SirenLink by rel', () => {
						expect(siren.findLinkByRel('a')).not.to.be.null;
						expect(siren.findLinkByRel('b')).not.to.be.null;
					});

					it('Should use the same SirenLink instance for all rels', () => {
						expect(siren.findLinkByRel('a')).to.equal(siren.findLinkByRel('b'));
					});
				});
			});

			describe('When the JSON contains actions', () => {
				let parse;

				beforeEach(() => {
					parse = SirenAction.fromJson;
					SirenAction.fromJson = sinon.spy(j => new SirenAction({name: j.name}));

					json.actions = [
						{name: chance.string()},
						{name: chance.string()}
					];

					act();
				});

				afterEach(() => {
					SirenAction.fromJson = parse;
				});

				it('Should call SirenAction.fromJson for each action structure', () => {
					sinon.assert.calledWith(SirenAction.fromJson, json.actions[0]);
					sinon.assert.calledWith(SirenAction.fromJson, json.actions[1]);
				});

				it('Should create an entry in the actions map for each parsed Action, each keyed by name', () => {
					expect(siren.actions.get(json.actions[0].name)).to.be.instanceOf(SirenAction);
					expect(siren.actions.get(json.actions[0].name).name).to.equal(json.actions[0].name);

					expect(siren.actions.get(json.actions[1].name)).to.be.instanceOf(SirenAction);
					expect(siren.actions.get(json.actions[1].name).name).to.equal(json.actions[1].name);
				});
			});

			describe('When the JSON contains a linked sub-entity', () => {
				let parse;

				beforeEach(() => {
					parse = LinkedSubEntity.fromJson;
					LinkedSubEntity.fromJson = sinon.spy(j => new LinkedSubEntity({rels: new Immutable.Set(j.rel), classes: new Immutable.Set(j.class), href: j.href}));

					json.entities = [
						{class: [chance.string()], rel: [chance.string(), chance.string()], href: chance.url()}
					];

					act();
				});

				afterEach(() => {
					LinkedSubEntity.fromJson = parse;
				});

				it('Should use the LinkedSubEntity fromJson to create linked sub entities for each sub entity with an href', () => {
					sinon.assert.calledWith(LinkedSubEntity.fromJson, json.entities[0]);
				});

				it('Should create an entity in the entities set with matching rels', () => {
					expect(siren.entities.filter(item => item.rels.contains(json.entities[0].rel[0])).first()).to.not.be.null;
					expect(siren.entities.filter(item => item.rels.contains(json.entities[0].rel[1])).first()).to.not.be.null;
				});

				it('Should allow for retrieval of the linked sub-entity by each rel', () => {
					expect(siren.linkedEntitiesByRel(json.entities[0].rel[0]).first()).not.to.be.null;
					expect(siren.linkedEntitiesByRel(json.entities[0].rel[1]).first()).not.to.be.null;
				});

				it('Should have all entities refer to the same linked sub entity for matching rels', () => {
					expect(siren.linkedEntitiesByRel(json.entities[0].rel[0]).first()).to.be.equal(siren.linkedEntitiesByRel(json.entities[0].rel[1]).first());
				});
			});

			describe('When the JSON contains an embedded sub-entity', () => {
				let parse;

				beforeEach(() => {
					parse = EmbeddedSubEntity.fromJson;
					EmbeddedSubEntity.fromJson = sinon.spy(j => new EmbeddedSubEntity({rels: new Immutable.Set(j.rel), entity: new Siren()}));

					json.entities = [
						{rel: [chance.string(), chance.string()], class: [chance.string()], properties: [{a: chance.string()}]}
					];

					act();
				});

				afterEach(() => {
					EmbeddedSubEntity.fromJson = parse;
				});

				it('Should use the EmbeddedSubEntity fromJson to create embedded sub entities for each sub entity without an href', () => {
					sinon.assert.calledWith(EmbeddedSubEntity.fromJson, json.entities[0]);
				});

				it('Should create an entity in the entities map for each of the rels on the parsed embedded entity', () => {
					expect(siren.entities.filter(item => item.rels.contains(json.entities[0].rel[0])).first()).not.to.be.null;
					expect(siren.entities.filter(item => item.rels.contains(json.entities[0].rel[1])).first()).not.to.be.null;
				});

				it('Should allow for retrieval of the embedded sub-entity by each rel', () => {
					expect(siren.embeddedEntitiesByRel(json.entities[0].rel[0]).first()).not.to.be.null;
					expect(siren.embeddedEntitiesByRel(json.entities[0].rel[1]).first()).not.to.be.null;
				});

				it('Should have all entities refer to the same embedded sub entity for matching rels', () => {
					expect(siren.embeddedEntitiesByRel(json.entities[0].rel[0]).first()).to.be.equal(siren.embeddedEntitiesByRel(json.entities[0].rel[1]).first());
				});
			});
		});
	});
});
