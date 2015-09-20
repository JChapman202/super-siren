import Client from '../lib/Client';
import {expect} from 'chai';
import Chance from 'Chance';
var chance = new Chance();

describe('Client', () => {
	describe('When adding a global header', () => {
		var header;
		var value;

		beforeEach(() => {
			header = chance.header;
			value = chance.value;

			Client.addHeader(chance.string(), chance.string());
		});

		afterEach(() => {
			Client.removeHeader(header);
		});

		it('Should register the provided header/value in the global headers', () => {
			expect(Client.globalHeaders.get(header)).to.equal(value);
		});

		describe('When removing a global header', () => {
			beforeEach(() => {
				Client.removeHeader(header);
			});

			it('Should remove the previously registered header from the global headers', () => {
				expect(Client.globalHeaders.has(header)).to.be.false;
			});
		});
	});
});
