import SirenLink from '../lib/SirenLink';
import {expect} from 'chai';
import Chance from 'Chance';
let chance = new Chance();

describe('SirenLink', () => {
	describe('Constructor', () => {
		describe('When constructing a SirenLink with rels/href/classes', () => {
			let rels;
			let href;
			let link;
			let classes;

			beforeEach(() => {
				rels = ['a', 'b'];
				href = 'http://blah.com';
				classes = [chance.string(), chance.string()];

				link = new SirenLink(rels, href, classes);
			});

			it('Should construct a new SirenLink', () => {
				expect(link).not.to.be.null;
			});

			it('Should have the classes assigned to the created instance', () => {
				expect(link.classes.toJS()).to.contain(classes[0]);
				expect(link.classes.toJS()).to.contain(classes[1]);
			});

			it('Should have links which contain all provided rels', () => {
				expect(link.rels.toJS()).to.contain('a');
				expect(link.rels.toJS()).to.contain('b');
			});

			it('Should contain the provided href', () => {
				expect(link.href).to.equal(href);
			});
		});
	});
});
