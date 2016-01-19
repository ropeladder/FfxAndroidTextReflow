"use strict";

var self = require("sdk/self");
var data = self.data;
var pageMod = require("sdk/page-mod");
var mod1;
var mod2;

var pservices= require("sdk/preferences/service");

var sprefs=require('sdk/simple-prefs');
var prefs=sprefs.prefs;

function createMod(w){
 return pageMod.PageMod({
   include: ["*","file://*"],
       contentScriptWhen: w,
       contentScriptFile: data.url("my-script.js"),
       contentScriptOptions: { 
         margin: prefs.margin,
	 dclick: prefs.dclick,
	 rdclch: prefs.rdclch,
	 rcldef: prefs.rcldef,
	 wholeColumn: prefs.wholeColumn,
	 debugc: prefs.debugc,
	 debugd: prefs.debugd,
	 }

   });
}

function createmods(){
    mod1=createMod("ready");
}
function destroymods()
{
  mod1.destroy();
}

function onPrefChange(prefName) {
  destroymods();
  createmods();
  sprefs.on("", onPrefChange);
  if (prefs.debugc) {
    pservices.set('extensions.'+self.id+'.sdk.console.logLevel','all');
    //pservices.set('extensions.sdk.console.logLevel','all');
    //console.log('setting extensions.sdk.'+self.id+'.console.logLevel\n');
    //dump("setting "+'extensions.sdk.'+self.id+'console.logLevel\n');
  }
}

createmods();
sprefs.on("", onPrefChange);
