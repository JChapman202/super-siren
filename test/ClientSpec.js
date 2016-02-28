import Client from '../lib/Client';
import {expect} from 'chai';
import Chance from 'Chance';
const chance = new Chance();

describe('Client', () => {
	describe('When adding a global header', () => {
		let header;
		let value;

		before(() => {
			header = chance.string();
			value = chance.string();

			Client.addHeader(header, value);
		});

		after(() => {
			Client.removeHeader(header);
		});

		it('Should register the provided header/value in the global headers', () => {
			expect(Client.globalHeaders.get(header)).to.equal(value);
		});

		describe('When removing a global header', () => {
			before(() => {
				Client.removeHeader(header);
			});

			it('Should remove the previously registered header from the global headers', () => {
				expect(Client.globalHeaders.has(header)).to.be.false;
			});
		});
	});
});
