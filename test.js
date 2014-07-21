var mac = require("./index.js");
var redis = require("redis").createClient();


mac.sync(redis,function(err,syncing){
  console.log("sync returned",err,syncing);
  setTimeout(function(){
    mac.lookup(redis,"000000",function(err,name){
      console.log("lookup returned",err,name);
    })
  },1000);
})