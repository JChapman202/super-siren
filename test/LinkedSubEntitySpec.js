import LinkedSubEntity from '../lib/LinkedSubEntity';
import {expect} from 'chai';
import Chance from 'Chance';

let chance = new Chance();

describe('LinkedSubEntity', () => {
	describe('When getting the empty LinkedSubEntity', () => {
		let empty;

		beforeEach(() => {
			empty = LinkedSubEntity.empty;
		});

		it('Should have no rels', () => {
			expect(empty.rels.toJS()).to.be.empty;
		});

		it('Should have no classes', () => {
			expect(empty.classes.toJS()).to.be.empty;
		});

		it('Should have no href', () => {
			expect(empty.href).to.be.null;
		});
	});

	describe('When parsing a Linked Sub Entity JSON structure', () => {
		let json;
		let linkedSubEntity;

		let act = () => {
			linkedSubEntity = LinkedSubEntity.fromJson(json);
		};

		beforeEach(() => {
			json = {
				rel: [chance.string(), chance.string()],
				href: chance.url()
			};
		});

		describe('When a JSON structure does not include a rel array', () => {
			beforeEach(() => {
				delete json.rel;
			});

			it('Should throw an error while parsing', () => {
				expect(act).to.throw();
			});
		});

		describe('When a JSON structure contains an empty rel array', () => {
			beforeEach(() => {
				json.rel = [];
			});

			it('Should throw an error while parsing', () => {
				expect(act).to.throw();
			});
		});

		describe('When a JSON structure contains rels', () => {
			beforeEach(() => {
				act();
			});

			it('Should contain all rels in the Set of rels on the parsed instance', () => {
				expect(linkedSubEntity.rels.toJS()).to.contain(json.rel[0]);
				expect(linkedSubEntity.rels.toJS()).to.contain(json.rel[1]);
			});
		});

		describe('When a JSON structure contains no href', () => {
			beforeEach(() => {
				delete json.href;
			});

			it('Should throw an error while parsing', () => {
				expect(act).to.throw();
			});
		});

		describe('When a JSON structure includes an href', () => {
			beforeEach(() => {
				act();
			});

			it('Should contain the href on the parsed instance', () => {
				expect(linkedSubEntity.href).to.equal(json.href);
			});
		});

		describe('When a JSON structure includes a class array', () => {
			beforeEach(() => {
				json.class = [chance.string(), chance.string()];
				act();
			});

			it('Should contain each class in set of classes on the parsed instance', () => {
				expect(linkedSubEntity.classes.toJS()).to.contain(json.class[0]);
				expect(linkedSubEntity.classes.toJS()).to.contain(json.class[1]);
			});
		});
	});
});
