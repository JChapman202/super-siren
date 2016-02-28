import Siren from '../lib/Siren';
import {expect} from 'chai';
import Chance from 'chance';
import sinon from 'sinon';

let EmbeddedSubEntity = Siren.EmbeddedSubEntity;

let chance = new Chance();

describe('EmbeddedSubEntity', () => {
	describe('When retrieving the empty EmbeddedSubEntity', () => {
		let empty;

		beforeEach(() => {
			empty = EmbeddedSubEntity.empty;
		});

		it('Should have an empty set of rels', () => {
			expect(empty.rels.toJS()).to.be.empty;
		});

		it('Should have an empty entity instance', () => {
			expect(empty.entity).to.equal(Siren.empty);
		});
	});

	describe('When parsing a JSON representation of an embedded sub entity', () => {
		let json;
		let subEntity;
		let parse;

		let act = () => {
			subEntity = EmbeddedSubEntity.fromJson(json);
		};

		beforeEach(() => {
			parse = Siren.fromJson;
			Siren.fromJson = sinon.spy(j => Siren.empty);

			json = {
				rel: [chance.string(), chance.string()]
			};
		});

		afterEach(() => {
			Siren.fromJson = parse;
		});

		describe('When a JSON structure does not include a rel array', () => {
			beforeEach(() => {
				delete json.rel;
			});

			it('Should throw an error while parsing', () => {
				expect(act).to.throw();
			});
		});

		describe('When parsing a JSON structure which includes a rel array', () => {
			beforeEach(() => {
				act();
			});

			it('Should contain all rels in the set of rels on the parsed instance', () => {
				expect(subEntity.rels.toJS()).to.contain(json.rel[0]);
				expect(subEntity.rels.toJS()).to.contain(json.rel[1]);
			});

			it('Should pass the sub entity JSON to the Siren parseJson to construct the entity', () => {
				sinon.assert.calledWith(Siren.fromJson, json);
			});

			it('Should have an entity equal to the result of the parseJson call', () => {
				expect(subEntity.entity).to.equal(Siren.empty);
			});
		});
	});
});
