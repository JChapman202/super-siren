import SirenLink from '../lib/SirenLink';
import {expect} from 'chai';

describe('SirenLink', () => {
	describe('Constructor', () => {
		describe('When constructing a SirenLink with rels/href', () => {
			var rels;
			var href;
			var link;

			beforeEach(() => {
				rels = ['a', 'b'];
				href = 'http://blah.com';

				link = new SirenLink(rels, href);
			});

			it('Should construct a new SirenLink', () => {
				expect(link).not.to.be.null;
			});

			it('Should have links which contain all provided rels', () => {
				console.log(link.rels);
				expect(link.rels.toJS()).to.contain('a');
				expect(link.rels.toJS()).to.contain('b');
			});

			it('Should contain the provided href', () => {
				expect(link.href).to.equal(href);
			});
		});
	});
});
