import ActionField from '../lib/ActionField';
import {expect} from 'chai';
import Chance from 'Chance';

let chance = new Chance();

describe('ActionField', () => {
	describe('When getting the empty field', () => {
		let field;

		beforeEach(() => {
			field = ActionField.empty;
		});

		it('Should have an empty string name', () => {
			expect(field.name).to.equal('');
		});

		it('Should not have a title', () => {
			expect(field.title).to.be.null;
		});

		it('Should not have a value', () => {
			expect(field.value).to.be.null;
		});

		it('Should have a type of "text"', () => {
			expect(field.type).to.equal('text');
		});
	});

	describe('When parsing a JSON structure', () => {
		let json;
		let field;

		let act = () => {
			field = ActionField.fromJson(json);
		};

		beforeEach(() => {
			field = null;
			json = {
				name: chance.string()
			};
		});

		describe('When the JSON structure does not include a name', () => {
			beforeEach(() => {
				delete json.name;
			});

			it('Should throw an error when parsed', () => {
				expect(act).to.throw();
			});
		});

		describe('When the JSON structure includes a name', () => {
			beforeEach(() => {
				act();
			});

			it('Should have the name set on the parsed ActionField', () => {
				expect(field.name).to.equal(json.name);
			});
		});

		describe('When the JSON structure includes a title', () => {
			beforeEach(() => {
				json.title = chance.string();
				act();
			});

			it('Should have the title set on the parsed ActionField', () => {
				expect(field.title).to.equal(json.title);
			});
		});

		describe('When the JSON structure includes a type', () => {
			beforeEach(() => {
				json.type = 'number';
				act();
			});

			it('Should have the type set on the parsed ActionField', () => {
				expect(field.type).to.equal(json.type);
			});
		});

		describe('When the JSON structure includes a value', () => {
			beforeEach(() => {
				json.value = chance.string();
				act();
			});

			it('Should have the value set on the parsed ActionField', () => {
				expect(field.value).to.equal(json.value);
			});
		});
	});
});
