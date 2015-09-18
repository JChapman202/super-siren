var Siren = require('../lib/Siren');
var expect = require('chai').expect;

describe('Siren', () => {
	describe('When creating a new Siren entity', () => {
		var siren;

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
		})
	});
});
