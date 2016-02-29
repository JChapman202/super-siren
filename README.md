# Super-Siren #

## Description ##

[SIREN](https://github.com/kevinswiber/siren) Hypermedia client library which process SIREN HTTP responses into immutable SIREN representations utilizing [superagent](https://github.com/visionmedia/superagent) for the underlying HTTP requests. All superagent requests are wrapped with [superagent-promise](https://github.com/lightsofapollo/superagent-promise) which exposes [Bluebird](https://github.com/petkaantonov/bluebird) promises for processing http requests.

SIREN models within this library are created using [Immutable.js](https://github.com/facebook/immutable-js) Records with properties constructed using Immutable maps, sets and lists.

## Links ##

[API docs](http://jchapman202.github.io/super-siren/)

[Siren-Crawler](https://github.com/JChapman202/siren-crawler) - Siren Crawler is a generic Siren browser that utilizes super-siren for requesting and parsing all SIREN messages.  Siren Crawler is implemented as a single page javascript application utilizing [React](https://facebook.github.io/react/) and flux.

## Getting Started ##

Install `super-siren` using npm.

```shell
npm install super-siren
```

Then require super-siren from any JavaScript module:

```javascript
let Siren = require('super-siren');
```

To get started provide the SIREN billboard URL to the static get method.

```javascript
let Siren = require('super-siren');

Siren.get('http://example-siren-url/api')
	.then(res => {
		/* process http result here */
		/* Siren instance lives on res.body */
	});
```

super-siren automatically registers a SIREN parser for all http requests made through super-siren. Any HTTP response which specifies a content type of `application/vnd.siren+json`. All other content-types will fall back to the default superagent parsers.

### Setting Global Headers ###

super-siren allows you to set global headers for all requests made through super-siren. Super-siren will automatically add an Accepts header requesting `application/vnd.siren+json`, so you don't have to worry about adding that one. To add a custom header simply do the following:

```javascript
let Siren = require('super-siren');

Siren.Client.addHeader('Authentication', 'Bearer ' + bearerToken);
```

To then later remove the header you can simply:

```javascript
Siren.Client.removeHeader('Authentication');
```

### Helpers ###

super-siren provides helper functions to assist with navigating through SIREN responses. This allows for using a fluent syntax to navigate from a base SIREN URL through it's available links, entities and actions.

For example if you had a base SIREN entity at `http://example-siren/api` and wanted to follow through a link at rel `favorites` and wanted to perform an action named `add-favorite` in order to add a favorite you could write the following:

```javascript
let Siren = require('super-siren');
let follow = Siren.Helper.follow;
let performAction = Siren.Helper.performAction;

Siren.get('http://example-siren/api')
	.then(follow('favorites'))
	.then(performAction('add-favorite', { name: 'Siren' })) // the data opts are optional
	.then(res => {
		/* Process Siren action HTTP response here */
	});
```

### SIREN structure ###

```javascript
let Siren = require('super-siren');
Siren.get('http://example-siren/api')
	.then(res => {
		let siren = res.body;

		/* prints all classes as separate log entires*/

		siren.classes
			.forEach(class => console.log(class));

		/* prints all hrefs that have the rel 'example' */

		siren.links
			.filter(link => link.rels.contains('example'))
			.map(link => link.href)
			.forEach(href => console.log(href));


		/* prints the first rel of all sub-entities which have the
		'example' rel*/

		siren.entities
			.filter(entity => entity.rels.contains('example'))
			.forEach(entity => console.log(entity.rels.first()));


		/* prints the JS array of all classes for all embedded sub entities
		which have a rel of 'example' */

		siren.embeddedEntities
			.filter(entity => entity.rels.contains('example'))
			.map(entity => entity.entity)
			.forEach(entity => console.log(entity.classes.toJS()));

		/* prints all href locations for all linked sub-entities that have
		the rel of 'example' */

		siren.linkedEntities
			.filter(entity => entity.rels.contains('example'))
			.map(entity => entity.href)
			.forEach(href => console.log(href));

		/* performs the siren action named 'add-favorite' */

		siren.actions
			.first(action => action.name === 'add-favorite')
			.perform({
				name: 'Siren'
			})
			.then(res => {
				console.log('Submitted siren as my favorite!');
			})
			.catch(err => {
				console.log('Submitting siren as my favorite would never fail!');
			})
	});
```

### SIREN navigation helpers ###

```javascript
let Siren = require('super-siren');

Siren.get('http://example-siren/api')
	.then(res => {
		let siren = res.body;

		/* find the first action with the requested name. null when not found */

		siren.findActionByName('add-favorite')
			.perform({
				name: 'Siren'
			})
			.then(res => {

			});

		/* find the first link by the requested rel. null when not found */

		let href = siren.findLinkByRel('favorites').href;

		/* return all entities with the provided rel */

		siren.findEntitiesByRel('cool-stuff');

		/* same thing but only for embedded entities */

		siren.embeddedEntitiesByRel('cool-stuff');

		/* and only for linked sub-entities */

		siren.linkedEntitiesByRel('cool-stuff');
	});
```
