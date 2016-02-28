import SirenAction from '../lib/SirenAction';
import ActionField from '../lib/ActionField';
import {expect} from 'chai';
import Chance from 'Chance';
import sinon from 'sinon';

let chance = new Chance();

describe('SirenAction', () => {
	describe('Empty action', () => {
		let sirenAction;

		beforeEach(() => {
			sirenAction = SirenAction.empty;
		});

		it('Should have no name', () => {
			expect(sirenAction.name).to.be.null;
		});

		it('Should have no title', () => {
			expect(sirenAction.title).to.be.null;
		});

		it('Should have no classes', () => {
			expect(sirenAction.classes.toJS()).to.be.empty;
		});

		it('Should have no href', () => {
			expect(sirenAction.href).to.be.null;
		});

		it('Should have an empty map of fields', () => {
			expect(sirenAction.fields.isEmpty()).to.be.true;
		});

		it('Should have a default method of "GET"', () => {
			expect(sirenAction.method).to.equal('GET');
		});
	});

	describe('When parsing a JSON structure', () => {
		let action;
		let json;

		let act = () => {
			action = SirenAction.fromJson(json);
		};

		beforeEach(() => {
			action = null;
			json = {
				name: chance.string()
			};
		});

		describe('When the JSON structure includes a name', () => {
			beforeEach(() => {
				json.name = chance.string();
				act();
			});

			it('Should have the requested name on the parsed SirenAction', () => {
				expect(action.name).to.equal(json.name);
			});
		});

		describe('When the JSON structure does not include a name', () => {
			beforeEach(() => {
				delete json.name;
			});

			it('Should throw an error while parsing', () => {
				expect(act).to.throw();
			});
		});

		describe('When the JSON structure includes a title', () => {
			beforeEach(() => {
				json.title = chance.string();
				act();
			});

			it('Should have the requested title on the parsed SirenAction', () => {
				expect(action.title).to.equal(json.title);
			});
		});

		describe('When the JSON structure includes a method', () => {
			beforeEach(() => {
				json.method = 'PUT';
				act();
			});

			it('Should have the requested method set on the parsed SirenAction', () => {
				expect(action.method).to.equal(json.method);
			});
		});

		describe('When the JSON structure includes a href', () => {
			beforeEach(() => {
				json.href = chance.url();
				act();
			});

			it('Should have the requested href set on the parsed SirenAction', () => {
				expect(action.href).to.equal(json.href);
			});
		});

		describe('When the JSON structure includes a type', () => {
			beforeEach(() => {
				json.type = 'application/json';
				act();
			});

			it('Should have the requested content-type set on the parsed SirenAction', () => {
				expect(action.type).to.equal(json.type);
			});
		});

		describe('When a JSON structure includes a class array', () => {
			beforeEach(() => {
				json.class = [chance.string(), chance.string()];
				act();
			});

			it('Should contain each class in set of classes on the parsed instance', () => {
				expect(action.classes.toJS()).to.contain(json.class[0]);
				expect(action.classes.toJS()).to.contain(json.class[1]);
			});
		});

		describe('When the JSON structure includes fields', () => {
			let parse;

			beforeEach(() => {
				parse = ActionField.fromJson;
				ActionField.fromJson = sinon.spy(j => new ActionField({name: j.name, type: j.type}));

				json.fields = [
					{name: chance.string(), type: 'text'},
					{name: chance.string(), type: 'text'}
				];
				act();
			});

			afterEach(() => {
				ActionField.fromJson = parse;
			});

			it('Should use the ActionField fromJson method for each field', () => {
				sinon.assert.calledWith(ActionField.fromJson, json.fields[0]);
				sinon.assert.calledWith(ActionField.fromJson, json.fields[1]);
			});

			it('Should have all fields in the map keyed by the name of the parsed ActionField field', () => {
				expect(action.fields.get(json.fields[0].name)).to.be.instanceOf(ActionField);
				expect(action.fields.get(json.fields[0].name).name).to.equal(json.fields[0].name);

				expect(action.fields.get(json.fields[1].name)).to.be.instanceOf(ActionField);
				expect(action.fields.get(json.fields[1].name).name).to.equal(json.fields[1].name);
			});
		});
	});
});
