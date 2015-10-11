/*
Copyright (c) 2015 Richard Z. You can use this file in accordance with
the GPL v3 license, the original file copyrighted by David Siefker can 
be used in accordance with the MIT license.


    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program.  If not, see <http://www.gnu.org/licenses/>.
*/


/* The MIT License (MIT)

Copyright (c) 2014 David Siefker

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
*/

const { classes: Cc, interfaces: Ci, utils: Cu } = Components;
Cu.import('resource://gre/modules/Services.jsm');

function loadIntoWindow(cWin) {
	if (!cWin)
		return;

	cWin.console.log("indyblue: begin loadIntoWindow()");

	// object to store persistent info
	cWin.indyblueReflow = {
		isReflowEnabled: true,
		fnClickEvent: null,
		menuId: null
	};
	fnAddReflow(cWin);

	cWin.indyblueReflow.menuId = cWin.NativeWindow.menu.add({
		name: "Text Reflow",
		icon: null,
		checkable: true,
  	        checked: true,
		callback: function() {
			fnToggleReflow(cWin);
		}
	});
}

function unloadFromWindow(cWin) {
	if (!cWin) return;
	cWin.NativeWindow.menu.remove(cWin.indyblueReflow.menuId);
	cWin.removeEventListener('click', cWin.indyblueReflow.fnClickEvent);
	cWin.indyblueReflow = null;
}

// This function toggles checkbox of the menuitem,
// and also activates/deactivates the functionality
function fnToggleReflow(cWin) {
	cWin.console.log("indyblue: toggling...");
	cWin.indyblueReflow.isReflowEnabled = 
		!cWin.indyblueReflow.isReflowEnabled;
	cWin.NativeWindow.menu.update(
		cWin.indyblueReflow.menuId, 
		{ checked: cWin.indyblueReflow.isReflowEnabled });
}

// The main routine, click event.
// Clicking any text will resize that text width to fit.
function fnAddReflow(cWin) {
	cWin.console.log("indyblue: reflow declaration start");


	//create event handler function
	cWin.indyblueReflow.fnClickEvent = function(e) {
		//cWin is chromeWindow, .content gets html window
		var win = cWin.content;

		// use chromeWindow param to enable/disable
		if(!cWin.indyblueReflow.isReflowEnabled) return;

		// how many pixels should be left as margin space
		// on either side of the text?
		var sideMargin = 10;

		// get device width in css pixels
		var winWidth=win.content.innerWidth;
		
		// get nearest non-inline parent.
		var target = e.target;
		for(var i=e.target; i!=null; i = i.parentElement) {
			var icss = win.getComputedStyle(i);
			cWin.console.log(i.tagName, icss['display']);
			target = i;
			if(icss['display']!='inline') break;
		}

		// get width/left values for target tag
		var bbox = target.getBoundingClientRect();

		cWin.console.log("indyblue: tag:", bbox.width, "win:", winWidth);
		// if box is wider than screen, reset width to make it fit
		if(bbox.width>winWidth) {
			var newWidth = winWidth - (2*sideMargin);
			cWin.console.log("indyblue: resizing tag to", newWidth);
			target.style.width = newWidth + "px";
			//win.document.documentElement.scrollLeft += bbox.left - sideMargin;
		} else 
			target.style.width = "";
	};
	// add listener to chromeWindow
	cWin.addEventListener('click', cWin.indyblueReflow.fnClickEvent);
};



/**********************************************************
**** This is all directly from the sample bootstrap.js ****
**** provided at mozilla.com                           ****
**********************************************************/
var windowListener = {
	onOpenWindow: function(aWindow) {
		// Wait for the window to finish loading
		let domWindow = aWindow.QueryInterface(Ci.nsIInterfaceRequestor)
				.getInterface(Ci.nsIDOMWindowInternal || Ci.nsIDOMWindow);
		domWindow.addEventListener("UIReady", function onLoad(e) {
			domWindow.removeEventListener(e.name, arguments.callee, false);
			loadIntoWindow(domWindow);
		}, false);
	},
 
	onCloseWindow: function(aWindow) {},
	onWindowTitleChange: function(aWindow, aTitle) {}
};

function startup(aData, aReason) {
	// Load into any existing windows
	let windows = Services.wm.getEnumerator("navigator:browser");
	while (windows.hasMoreElements()) {
		//let domWindow = windows.getNext().QueryInterface(Ci.nsIDOMWindow);
		let domWindow = windows.getNext();
		loadIntoWindow(domWindow);
	}

	// Load into any new windows
	Services.wm.addListener(windowListener);
}

function shutdown(aData, aReason) {
	// When the application is shutting down we normally don't have to clean
	// up any UI changes made
	if (aReason == APP_SHUTDOWN)
		return;

	// Stop listening for new windows
	Services.wm.removeListener(windowListener);

	// Unload from any existing windows
	let windows = Services.wm.getEnumerator("navigator:browser");
	while (windows.hasMoreElements()) {
		//let domWindow = windows.getNext().QueryInterface(Ci.nsIDOMWindow);
		let domWindow = windows.getNext();
		unloadFromWindow(domWindow);
	}
}

function install(aData, aReason) {}
function uninstall(aData, aReason) {}
