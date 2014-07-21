mac-sync-redis
====================

A [node](http://nodejs.org) module to fetch, parse, and sync entries from the IEEE's OUI database to redis. Adapted from [mac-lookup](https://github.com/ivan-loh/mac-lookup) which is sqlite based, and was [node-ieee-oui-lookup](https://github.com/mrose17/node-ieee-oui-lookup) originally.


Install
-------

```js
npm install mac-sync-redis
```



Usage
-----

```js
var mac = require('mac-sync-redis');
```

To start a sync with the [OUI source](http://standards.ieee.org/develop/regauth/oui/oui.txt), pass a connected redis client:
```js
mac.sync(redisClient, function (err, syncing) {
  if (err) throw err;
  if (syncing) console.log("re-syncing in the background");
  else console.log("data is in sync already");
});
```
