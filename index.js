var http = require('http');
var byline = require('byline');
var options = require('url').parse('http://standards.ieee.org/develop/regauth/oui/oui.txt');
options.agent = false;

exports.lookup = function(redis, oui, cb)
{
  if(!redis || !redis.hget) return cb("invalid args, needs a redis client");
  oui = oui.split('-').join('').split(':').join('').toUpperCase();
  if (oui.length != 6) return cb("invalid OUI, must be '******', '**-**-**', or '**:**:**'");

  redis.hget("oui",oui,function(err,name){
    if(err) return cb(err);
    if(!name) return cb("no name found");
    cb(null, name);
  })
}

exports.sync = function(redis, cb) {
  if(!redis || !redis.hget || !redis.hset) return cb("invalid args, needs a redis client");

  // get any cached etag from redis
  redis.hget("oui","etag",function(err,etag){
    if(err) return cb(err);

    // fetch the current etag
    options.method = "HEAD";
    http.request(options, function(res){
      if(res.headers.etag == etag) return cb(null, false);

      // try to fetch it now
      etag = res.headers.etag;
      options.method = "GET";
      http.request(options, function(res){

        // syncing began
        cb(null,true);
        redis.hset("oui","etag",etag);
        
        // stream of lines
        byline(res).on("data",function(line){
          line = line.toString().trimLeft().trimRight();

          // parse each line to validate a mapping
          if (line.length <= 15) return;
          var oui = line.substr(0,8).split('-').join('');
          if(oui.length != 6) return;
          line = line.substr(9).trimLeft();
          if(line.substr(0,5) != '(hex)') return;
          var name = line.substr(6).trimLeft();
          if(!name.length) return;
          
          // save/sync it
          redis.hset("oui",oui,name);

        });
      }).on("error",cb).end();
    }).on("error",cb).end();
    
  });
};
