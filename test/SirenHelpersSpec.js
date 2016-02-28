import SirenHelpers from '../lib/SirenHelpers';
import Siren from '../lib/Siren'
import {expect} from 'chai';
import sinon from 'sinon';
import nock from 'nock';
import assert from 'assert'
import bb from 'bluebird'

const rootData = `{"class":["root"],"links":[{"rel":["self"],"href":"http://example.com/pets?page=1&filter=dog"},{"rel":["next"],"href":"http://example.com/pets?page=2&filter=dog"},{"rel":["prev"],"href":"http://example.com/pets?page=0&filter=dog"}],"actions":[{"name":"find-dogs","class":["paged","animals"],"href":"http://example.com/pets","method":"GET","fields":[{"name":"page","type":"number","value":"0"},{"name":"filter","type":"text","value":"dog"}]},{"name":"find-cats","class":["paged","animals"],"href":"http://example.com/pets","method":"GET","fields":[{"name":"page","type":"number","value":"0"},{"name":"filter","type":"text","value":"cat"}]},{"name":"find-all","class":["paged","animals"],"href":"http://example.com/pets","method":"GET","fields":[{"name":"page","type":"number","value":"0"},{"name":"filter","type":"text","value":"any"}]}]}`;
const sirenData = Siren.fromJson(JSON.parse(rootData));
const respBody = { body: sirenData };

const
	domain = 'http://example.com',
	path = '/pets';

let scope;

describe('SirenHelpers', () => {
	beforeEach(() => {
		scope = nock('http://example.com')
			.filteringPath(/\?.*/g, '') // remove the query params
			.get('/pets')
			.reply(200, { pet: 'mock animal name' }, {});
	});

	describe('When performAction', () => {
		it('Should find the "find-dogs" Action name and perform it (no overwrite data)', (done) => {
			const actionName = 'find-dogs';
			const data = undefined;

			const promise = SirenHelpers.performAction(actionName, data)(respBody)
				.then(data => {
					expect(data.req.path).to.equal('/pets?page=0&filter=dog');
					expect(data.res.body.pet).to.equal('mock animal name');
					expect(scope.isDone()).to.be.true;
					done();
				});
		});

		it('should find the "find-cats" Action name and perform it (with overwrite data)', (done) => {
			const actionName = 'find-cats';
			const data = { filter: "fish" };

			const promise = SirenHelpers.performAction(actionName, data)(respBody)
				.then(data => {
					expect(data.req.path).to.equal('/pets?page=0&filter=fish');
					expect(data.res.body.pet).to.equal('mock animal name');
					expect(scope.isDone()).to.be.true;
					done();
				});
		});
	});

	describe('When follow', () => {
		it('Should find the "self" Link rel and follow it', (done) => {
			const actionName = 'self';

			const promise = SirenHelpers.follow(actionName)(respBody)
				.then(data => {
					expect(data.req.path).to.equal('/pets?page=1&filter=dog');
					expect(data.res.body.pet).to.equal('mock animal name');
					expect(scope.isDone()).to.be.true;
					done();
				});
		});

		it('should find the "next" Link rel and follow it', (done) => {
			const actionName = 'next';

			const promise = SirenHelpers.follow(actionName)(respBody)
				.then(data => {
					expect(data.req.path).to.equal('/pets?page=2&filter=dog');
					expect(data.res.body.pet).to.equal('mock animal name');
					expect(scope.isDone()).to.be.true;
					done();
				});
		});
	});
});
